// EN/FR switch. The HTML holds the English text; this file holds the French one, keyed by data-i18n.
//   data-i18n="key"       replaces the element's HTML
//   data-i18n-aria="key"  replaces its aria-label
// The choice is kept in localStorage; without one, a French browser gets French.
(function () {
  "use strict";

  var FR = {
    // shared chrome
    "c.skip": "Aller au contenu",
    "c.skipProjects": "Aller aux projets",
    "c.projects": "Projets",
    "c.about": "À propos",
    "c.contact": "Contact",
    "c.all": "Tous les projets",
    "c.onpage": "Sur cette page",
    "c.toc": "Sur cette page",
    "c.others": "Autres projets",
    "c.prev": "← Projet précédent",
    "c.next": "Projet suivant →",
    "c.source": "Code source de ce site",
    "c.cta": "Lire l’étude de cas",
    "c.demo": "Démo en ligne",

    // home
    "h.title": "Victor Michelon, Portfolio | IA et Data Science",
    "h.kicker": "Portfolio",
    "h.field": "Étudiant ingénieur en Data Science &amp; IA",
    "h.lede": "Étudiant ingénieur spécialisé en Data Science &amp; IA, passionné par la conception de systèmes d’IA agentiques et de modèles de Machine Learning et de Deep Learning. Des LLM construits from scratch aux pipelines multi-agents déployés sur AWS, je transforme les idées en projets concrets.",
    "h.btn1": "Voir les projets",
    "h.btn2": "Me contacter",
    "h.gh": "Profil GitHub",
    "h.projects": "Projets",
    "h.sub": "Cinq études de cas, chacune avec sa méthode, ses résultats et ses limites. Ouvrez-en une pour lire le détail.",

    "h.c1.meta": "Hackathon IBM x Probabl · 7e sur 295 · octobre 2026",
    "h.c1.h": "Prédire les scores moteurs de la maladie de Parkinson à partir de données cliniques bruitées",
    "h.c1.p": "Prédire le score moteur d’un patient, corrigé du biais de mesure, à partir de mesures ON et OFF bruitées, d’effets évaluateur et de nombreuses valeurs manquantes. Mené comme un laboratoire contrôlé de 61 expériences sous un protocole verrouillé, groupé par patient, et terminé par un mélange de boosting et de réseaux séquentiels.",
    "h.c1.cap": "d’erreur de prédiction avec notre modèle, par rapport à une moyenne constante (validation croisée par patient)",

    "h.c2.meta": "Application Streamlit · 2025 à 2026",
    "h.c2.h": "CineMatch, un recommandeur hybride explicable",
    "h.c2.p": "Huit signaux de similarité, des embeddings de synopsis aux notes du public, combinés avec des poids qui s’adaptent à chaque film. Un graphique radar montre pourquoi chaque film est suggéré, et des matrices pré-calculées répondent à une requête en environ 0,2 ms.",
    "h.c2.big": "8 signaux",
    "h.c2.cap": "combinés par film, sur un catalogue de 6 203 films",

    "h.c3.meta": "Deep learning sur IRM · décembre 2025",
    "h.c3.h": "Classification d’IRM cérébrales avec Grad-CAM",
    "h.c3.p": "Classifieur IRM à quatre classes : un CNN de référence face à un EfficientNetB0 affiné, avec Grad-CAM pour voir ce que regarde le modèle, et un pipeline reproductible qui traque les fuites par quasi-doublons entre les jeux de données.",
    "h.c3.cap": "de précision sur 1 311 examens de test, contre 92,1 % pour le CNN de référence",

    "h.c4.meta": "Classification sur données sismiques · octobre 2025",
    "h.c4.h": "Risque de tsunami à partir de données sismiques",
    "h.c4.p": "Le profil sismique d’un séisme suffit-il à signaler un risque de tsunami ? Un modèle de gradient boosting qui privilégie le rappel, une fuite temporelle supprimée, et une variable géospatiale : la distance à la limite de plaques tectoniques la plus proche.",
    "h.c4.cap": "des tsunamis détectés sur le jeu de test, F1 de 0,90",
    "h.k.tsu": "Tsunami",
    "h.k.no": "Pas de tsunami",

    "h.c5.meta": "Projet de cours avec Maël Paget · mai 2026",
    "h.c5.h": "Prédire les résultats de Ligue 1, saison 2025-2026",
    "h.c5.p": "Prédire l’issue de chaque match de Ligue 1 avant qu’il soit joué, à partir de la valeur des effectifs, de la hiérarchie des clubs, de la forme récente, des confrontations directes et des événements de jeu, dans un pipeline sans fuite de données.",
    "h.c5.cap": "de précision en validation croisée sur trois issues, contre 34,1 % pour un tirage aléatoire",
    "h.c5.home": "Domicile",
    "h.c5.draw": "Nul",
    "h.c5.away": "Extérieur",

    "h.aboutH": "À propos",
    "h.a1": "Étudiant Ingénieur-Manager à l’ESILV et à l’EMLV (Paris), spécialisé en IA &amp; Data Science, avec un parcours recherche : réseaux de neurones et deep learning, algorithmes d’IA, probabilités avancées. J’ai aussi passé un semestre d’échange à Kasetsart University, à Bangkok.",
    "h.a2": "Chez Sewan, scale-up Cloud &amp; Télécoms, j’ai conçu et industrialisé une architecture multi-agents sur AWS (LangChain, Bedrock, AgentCore, Lambda, OpenSearch) pour le support client : environ 250 tickets traités par semaine, 75 à 80 % des articles générés publiés, déployée auprès de toutes les équipes support. Au De Vinci Research Center, je cherche le meilleur niveau de quantification d’un LLM sous contrainte de ressources, en développant un modèle from scratch avec PyTorch, dans l’objectif d’une publication scientifique.",
    "h.a3": "Les projets ci-dessus montrent ma façon de travailler : une validation honnête, une baseline à battre, des échecs documentés et des modèles explicables. Je recherche un stage de 4 à 5 mois (avril à août 2027) en Data Science, AI Engineering ou conseil en IA.",
    "h.s1": "Langages",
    "h.s2": "ML &amp; Data",
    "h.s3": "Cloud &amp; MLOps",
    "h.s4": "Outils",
    "h.contactH": "Contact",
    "h.contactSub": "À la recherche d’un stage de 4 à 5 mois (avril à août 2027) en Data Science, AI Engineering ou conseil en IA.",
    "h.other": "<a href=\"https://www.linkedin.com/in/victor-michelon\">LinkedIn</a> · <a href=\"https://github.com/Victor-MICHELON\">Profil GitHub</a>",

    // Ligue 1 case study
    "l1.title": "Prédiction des matchs de Ligue 1 | Victor Michelon",
    "l1.kicker": "Projet de cours avec Maël Paget · mai 2026",
    "l1.h1": "Prédire les résultats de Ligue 1, saison 2025-2026",
    "l1.lede": "Prédire l’issue de chaque match de Ligue 1 de la saison 2025-2026 (victoire à domicile, nul ou victoire à l’extérieur) avant qu’il soit joué. J’ai construit un pipeline sans fuite de données qui transforme la valeur des effectifs, la hiérarchie des clubs, la forme récente, les confrontations directes et les événements de jeu en 23 variables, puis comparé trois modèles. Le meilleur atteint 48,0 % de précision en validation croisée, contre 34,1 % pour une baseline aléatoire.",
    "l1.k1": "de précision en validation croisée pour le gradient boosting, sur trois issues possibles",
    "l1.k2": "par rapport à une baseline qui tire au hasard selon les fréquences historiques (34,1 %)",
    "l1.k3": "matchs historiques utilisés pour l’entraînement, saisons 2012 à 2024",
    "l1.k4": "matchs de la saison 2025-2026 prédits",
    "l1.dl1": "Télécharger le notebook",
    "l1.dl2": "Prédictions (CSV)",
    "l1.t1": "Le problème",
    "l1.t2": "Les données",
    "l1.t3": "Approche",
    "l1.t4": "Résultats",
    "l1.t5": "Limites",
    "l1.t6": "Reproduire",
    "l1.p1": "Une classification à trois classes : <strong>1</strong> pour une victoire à domicile, <strong>0</strong> pour un nul, <strong>−1</strong> pour une victoire à l’extérieur. Toute la saison 2025-2026 doit être prédite d’un coup : aucun match ne peut donc utiliser l’information des matchs joués avant lui dans cette saison, seulement ce que l’on savait à la fin de l’historique.",
    "l1.p2": "La vraie difficulté est la série temporelle. Un pipeline qui laisse une statistique glissante voir le match qu’elle doit prédire aurait l’air excellent sans rien prédire, donc chaque variable est construite pour éviter toute fuite de données.",
    "l1.p3": "Matchs de championnat de 2012 à 2024, valeurs marchandes des joueurs relevées avant chaque saison, et événements de jeu (buts, passes décisives, cartons). L’analyse exploratoire a testé cinq hypothèses, et chacune a donné une variable :",
    "l1.th1": "Question",
    "l1.th2": "Ce que montrent les données",
    "l1.th3": "Décision",
    "l1.r1a": "Jouer à domicile compte-t-il ?",
    "l1.r1b": "44 % de victoires à domicile, 26 % de nuls, 30 % de victoires à l’extérieur",
    "l1.r1c": "Poids de classes équilibrés, plus de poids aux saisons récentes",
    "l1.r2a": "La valeur de l’effectif prédit-elle le résultat ?",
    "l1.r2b": "Le taux de victoire à domicile est de 63 % quand l’effectif vaut plus de 2 fois celui du visiteur, et de 24 % sous 0,5 fois",
    "l1.r2c": "Logarithme du ratio de valeur, pour amortir les valeurs extrêmes du PSG",
    "l1.r3a": "L’écart de classement compte-t-il ?",
    "l1.r3b": "Le taux de victoire à domicile passe de 8 % à 85 % selon l’écart, mais le classement en cours est inconnu pour une saison future",
    "l1.r3c": "Écart entre les positions finales moyennes historiques",
    "l1.r4a": "La forme récente compte-t-elle ?",
    "l1.r4b": "58 % de victoires à domicile après 13 à 15 points sur 5 matchs, 32 % après 3 points ou moins",
    "l1.r4c": "Forme domicile/extérieur et taux de victoire glissant sur 5 matchs",
    "l1.r5a": "Le statut du club compte-t-il ?",
    "l1.r5b": "Le PSG gagne 76 % de ses matchs à domicile, l’essentiel du championnat se situe entre 35 % et 45 %",
    "l1.r5c": "Taux de victoire cumulé (target encoding), confrontations directes",
    "l1.cl1": "Des signaux complémentaires",
    "l1.cl1p": "Le classement, les finances et la forme sont peu corrélés entre eux, et aucun ne dépasse 0,4 de corrélation avec le résultat. Il n’y a pas de variable miracle : la prédiction vient de leur combinaison, ce qui convient aux modèles d’ensemble.",
    "l1.flow": "Pipeline de modélisation",
    "l1.f1": "5 hypothèses",
    "l1.f2b": "Variables",
    "l1.f2": "23, sans fuite",
    "l1.f3b": "Poids temporels",
    "l1.f4b": "3 modèles",
    "l1.f4": "CV à 5 plis",
    "l1.f5": "233 prédictions",
    "l1.s1": "<strong>Reconstruire le contexte d’avant-match.</strong> Valeur de l’effectif (total, moyenne, ratio logarithmique), écart de position historique, taux de victoire en target encoding, forme domicile/extérieur sur les 5 derniers matchs, momentum, différence de buts en confrontations directes, et moyennes glissantes de passes décisives, cartons jaunes, penalties et têtes.",
    "l1.s2": "<strong>Décaler chaque statistique glissante.</strong> La forme, le momentum, les confrontations directes et le target encoding n’utilisent que des matchs strictement antérieurs à celui décrit.",
    "l1.s3": "<strong>Pondérer les saisons.</strong> Chaque match reçoit le poids 0,75<sup>(dernière saison − sa saison)</sup>, normalisé à une moyenne de 1, car les saisons récentes décrivent mieux la Ligue 1 actuelle.",
    "l1.s4": "<strong>Comparer trois modèles</strong> dans des pipelines scikit-learn avec imputation par la médiane : une forêt aléatoire, un gradient boosting et une régression logistique, face à une baseline aléatoire stratifiée.",
    "l1.s5": "<strong>Prédire 2025-2026</strong> à partir de l’état connu le plus récent de chaque club : dernières forme et momentum, dernière valeur d’effectif, dernier taux de victoire, dernières confrontations directes.",
    "l1.h31": "Les variables, par famille",
    "l1.fh1": "Famille",
    "l1.fh2": "Variables",
    "l1.fa1": "Structure et finances",
    "l1.fa2": "Dynamique sportive",
    "l1.fa3": "Profil de jeu",
    "l1.fb1": "<code>log_diff_squad_value</code>, <code>diff_squad_avg</code>, <code>h_squad_total</code>, <code>diff_hist_position</code>, <code>home_club_winrate_enc</code>",
    "l1.fb2": "<code>diff_form_pts</code>, <code>diff_momentum_last5</code>, <code>h2h_goal_diff</code>, <code>h2h_home_winrate</code>",
    "l1.fb3": "<code>h_roll_n_assists_5</code>, <code>diff_yellow</code>, <code>h_roll_n_penalties_5</code>, <code>h_roll_n_headers_5</code>",
    "l1.cap1": "Précision moyenne sur 5 plis avec poids temporels. Les trois modèles battent la baseline aléatoire de 12 à 14 points ; le gradient boosting et la forêt aléatoire sont à moins d’un point l’un de l’autre.",
    "l1.p4": "Le gradient boosting a été retenu : il a la meilleure moyenne et de loin le score le plus stable d’un pli à l’autre. Le graphique d’importance du notebook place les indicateurs financiers en tête, puis le statut historique du club, avec la forme récente et le profil de jeu comme variables d’ajustement : la force structurelle pèse plus que la dynamique de court terme.",
    "l1.h32": "Les prédictions 2025-2026",
    "l1.p5": "Le modèle prédit 92 victoires à domicile, 76 à l’extérieur et 65 nuls sur les 233 matchs : il ne se rabat donc pas sur l’équipe qui reçoit. Sa confiance moyenne est d’environ 51 %, avec la plupart des prédictions entre 35 % et 50 % et une longue queue jusqu’à 90 % pour les affiches très déséquilibrées, comme un cador face à un bas de tableau.",
    "l1.cl2": "Pas encore évalué",
    "l1.cl2p": "Les prédictions 2025-2026 ne sont comparées à aucun résultat réel dans le notebook. Les 48 % sont un chiffre de validation croisée sur l’historique, pas un score mesuré sur la saison prédite.",
    "l1.li1": "<strong>La validation croisée n’est pas strictement dans le sens du temps.</strong> <code>StratifiedKFold(shuffle=False)</code> garde les matchs dans l’ordre à l’intérieur des plis, mais les premiers plis sont prédits par des modèles entraînés sur des saisons plus récentes. Un découpage en marche avant serait le test honnête.",
    "l1.li2": "<strong>La position historique est une fuite légère.</strong> Le classement final moyen est calculé sur toutes les saisons, y compris celle d’un match d’entraînement.",
    "l1.li3": "<strong>Le contexte 2025-2026 est figé.</strong> La forme, le momentum et les taux de victoire sont les dernières valeurs connues et ne sont pas mis à jour au fil de la saison. Un club sans historique, comme un promu, retombe sur l’imputation par la médiane.",
    "l1.li4": "<strong>L’équilibrage des classes est incohérent.</strong> La forêt aléatoire et la régression logistique utilisent des poids de classes équilibrés, pas le gradient boosting retenu.",
    "l1.li5": "<strong>Pas de référence externe.</strong> Aucune comparaison avec les cotes des bookmakers, l’étalon habituel des prévisions de football, et les nuls restent l’issue la plus difficile à prédire.",
    "l1.p6": "Le notebook et les prédictions sont publiés ici. Les fichiers d’entrée (<code>matchs_2013_2024.csv</code>, <code>match_2025.csv</code>, <code>player_valuation_before_season.csv</code>, <code>game_events_before2025.csv</code>, <code>sample_results.csv</code>) ne sont pas inclus : le notebook ne peut donc pas être relancé à partir de ce seul site."
  };

  var LABELS = {
    en: { theme: function (n) { return "Switch to " + n + " theme"; }, light: "light", dark: "dark", lang: "Switch to French" },
    fr: { theme: function (n) { return "Passer au thème " + n; }, light: "clair", dark: "sombre", lang: "Switch to English" }
  };

  var root = document.documentElement;

  function stored() {
    try { var v = localStorage.getItem("lang"); if (v === "en" || v === "fr") return v; } catch (e) {}
    return null;
  }

  function initial() {
    var s = stored();
    if (s) return s;
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("fr") === 0 ? "fr" : "en";
  }

  function apply(lang) {
    root.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      var fr = FR[el.getAttribute("data-i18n")];
      el.innerHTML = lang === "fr" && fr !== undefined ? fr : el.dataset.en;
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-aria]"), function (el) {
      if (el.dataset.enAria === undefined) el.dataset.enAria = el.getAttribute("aria-label") || "";
      var fr = FR[el.getAttribute("data-i18n-aria")];
      el.setAttribute("aria-label", lang === "fr" && fr !== undefined ? fr : el.dataset.enAria);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".lang-toggle"), function (b) {
      b.setAttribute("aria-label", LABELS[lang].lang);
      b.title = LABELS[lang].lang;
      Array.prototype.forEach.call(b.querySelectorAll("[data-lang]"), function (s) {
        s.classList.toggle("on", s.getAttribute("data-lang") === lang);
      });
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang, labels: LABELS[lang] } }));
  }

  window.SITE_LANG = {
    get: function () { return root.lang === "fr" ? "fr" : "en"; },
    labels: function () { return LABELS[root.lang === "fr" ? "fr" : "en"]; }
  };

  Array.prototype.forEach.call(document.querySelectorAll(".lang-toggle"), function (b) {
    b.addEventListener("click", function () {
      var next = window.SITE_LANG.get() === "fr" ? "en" : "fr";
      try { localStorage.setItem("lang", next); } catch (e) {}
      apply(next);
    });
  });

  apply(initial());
})();
