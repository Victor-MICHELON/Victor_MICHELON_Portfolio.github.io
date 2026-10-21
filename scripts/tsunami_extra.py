"""Extra comparisons for the Tsunami case study (projects/tsunami.html, "What each choice is worth").

Replicates the final model of the notebook in Tsunami_Risk_Prediction_Model, then measures:
the same model trained with the leak, without the distance to the plate boundary, tuned for
overall accuracy, and with a decision threshold chosen on out-of-fold predictions.

Usage: pip install pandas numpy scikit-learn geopandas shapely pyproj
       python scripts/tsunami_extra.py <path to Tsunami_Risk_Prediction_Model/Data>
"""
import json
import sys
import warnings

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import Point
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, recall_score, roc_auc_score
from sklearn.model_selection import (GridSearchCV, RepeatedStratifiedKFold, StratifiedKFold, cross_val_predict,
                                     cross_validate, train_test_split)
from sklearn.pipeline import make_pipeline

warnings.filterwarnings("ignore")
data = sys.argv[1]
raw = pd.read_csv(f"{data}/earthquake_data_tsunami.csv")
faults = gpd.read_file(f"{data}/PB2002_boundaries.json")


def add_features(df):
    df = df.copy()
    pts = gpd.GeoDataFrame(df, geometry=[Point(xy) for xy in zip(df.longitude, df.latitude)], crs="EPSG:4326")
    lines = faults.to_crs("EPSG:4326").to_crs("EPSG:3857").geometry.union_all()
    df["distance_to_fault_km"] = pts.to_crs("EPSG:3857").geometry.apply(lines.distance) / 1000.0
    df["mag_depth_ratio"] = df.magnitude / (df.depth + 1)
    df["is_shallow"] = (df.depth <= 70).astype(int)
    df["pacific_region"] = ((df.longitude >= 120) | (df.longitude <= -60)).astype(int)
    return df


def split(df, drop=()):
    X = df.drop(columns=["tsunami", *drop], errors="ignore").select_dtypes(include=[np.number])
    return train_test_split(X, df.tsunami, test_size=0.2, random_state=42, stratify=df.tsunami)


def gb():
    return make_pipeline(GradientBoostingClassifier(n_estimators=300, learning_rate=0.1, max_depth=3, random_state=42))


cv = RepeatedStratifiedKFold(n_splits=10, n_repeats=3, random_state=42)


def evaluate(name, df, drop=(), model=None):
    Xtr, Xte, ytr, yte = split(df, drop)
    m = model or gb()
    s = cross_validate(m, Xtr, ytr, cv=cv, scoring=["f1", "recall", "accuracy"], n_jobs=-1)
    m.fit(Xtr, ytr)
    p = m.predict(Xte)
    tn, fp, fn, tp = confusion_matrix(yte, p).ravel()
    out = {
        "name": name, "n": len(df), "features": Xtr.shape[1],
        "cv_f1": round(s["test_f1"].mean(), 3), "cv_recall": round(s["test_recall"].mean(), 3),
        "cv_acc": round(s["test_accuracy"].mean(), 3),
        "test_f1": round(f1_score(yte, p), 3), "test_recall": round(recall_score(yte, p), 3),
        "test_acc": round(accuracy_score(yte, p), 3), "test_auc": round(roc_auc_score(yte, m.predict_proba(Xte)[:, 1]), 3),
        "missed": int(fn), "false_alarms": int(fp), "tsunamis": int(tp + fn), "no_tsunami": int(tn + fp),
    }
    print(json.dumps(out))
    return m, Xte, yte


clean = add_features(raw[raw.Year >= 2012].drop(columns=["Year", "Month"]))
leaky = add_features(raw)

# 0. the notebook's final model: should give 58 detected, 3 missed, 10 false alarms
final, Xte, yte = evaluate("final (notebook)", clean)

# 1. same model trained with the leak: all years, Year and Month kept
evaluate("with the leak", leaky)

# 2. without the physical feature
evaluate("without distance_to_fault_km", clean, drop=["distance_to_fault_km"])

# 3. a model tuned for overall accuracy instead of tsunami F1
Xtr, _, ytr, _ = split(clean)
grid = {
    "gradientboostingclassifier__n_estimators": [100, 200, 300],
    "gradientboostingclassifier__learning_rate": [0.01, 0.1],
    "gradientboostingclassifier__max_depth": [3, 5, 7],
}
acc = GridSearchCV(make_pipeline(GradientBoostingClassifier(random_state=42)), grid, cv=cv, scoring="accuracy", n_jobs=-1).fit(Xtr, ytr)
print("accuracy-tuned params", acc.best_params_)
evaluate("tuned for accuracy", clean, model=acc.best_estimator_)

# 4. missed tsunamis and false alarms by decision threshold, final model, hold-out set
proba = final.predict_proba(Xte)[:, 1]
rows = []
for t in np.round(np.arange(0.05, 0.96, 0.05), 2):
    p = (proba >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(yte, p).ravel()
    rows.append({"t": float(t), "missed": int(fn), "false_alarms": int(fp)})
print("thresholds", json.dumps(rows))

# 5. a threshold chosen without touching the hold-out set: out-of-fold probabilities on the
#    training set, highest threshold that keeps out-of-fold recall at 98% or more
Xtr, Xte2, ytr, yte2 = split(clean)
oof = cross_val_predict(gb(), Xtr, ytr, cv=StratifiedKFold(10, shuffle=True, random_state=42), method="predict_proba")[:, 1]
cands = [t for t in np.round(np.arange(0.01, 0.51, 0.01), 2) if recall_score(ytr, oof >= t) >= 0.98]
t_star = max(cands)
p = (final.predict_proba(Xte2)[:, 1] >= t_star).astype(int)
tn, fp, fn, tp = confusion_matrix(yte2, p).ravel()
print("cv threshold", json.dumps({"t": float(t_star), "oof_recall": round(recall_score(ytr, oof >= t_star), 3),
      "missed": int(fn), "false_alarms": int(fp), "test_f1": round(f1_score(yte2, p), 3)}))
