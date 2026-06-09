// ══════════════════════════════════════════════════
// GOOGLE APPS SCRIPT — Feuille BILAN HEBDO
// ══════════════════════════════════════════════════
// À coller dans : Extensions > Apps Script de la feuille "Bilan Hebdo"
// Puis : 1) Exécuter setupSheet() une fois, 2) Déployer en Web App

// Fonction à exécuter UNE SEULE FOIS pour créer les en-têtes
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // Renommer l'onglet
  sheet.setName("Bilans Hebdo");
  
  var headers = [
    "Date de Réception", "Athlète", "Semaine N°", "Catégories", "Fédérations",
    "Niveau Posing", "Morphologie", "Accompagnement", "Travail Effectué (Tags)", 
    "Détails Travail", "Difficultés (Tags)", "Détails Difficultés", "Zones Mobilité",
    "Détails Mobilité", "Progression Présentation", "Progression Routine", 
    "Objectif Semaine Prochaine", "Points Forts Physique", "Points Forts Posing", "Points Faibles"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
       .setFontWeight("bold")
       .setBackground("#E0F7FA")
       .setFontColor("#006064");
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

// Réception automatique des données envoyées par le site
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Bilans Hebdo") || ss.getActiveSheet();
    var now = new Date();
    
    sheet.appendRow([
      now,
      data.fullname || "",
      data.weekNumber || "",
      (data.categories || []).join(", "),
      (data.federations || []).join(", "),
      data.level || "",
      data.morphology || "",
      data.isAccompagnement ? "Oui" : "Non",
      (data.workDone || []).join(", "),
      data.workDoneDetails || "",
      (data.difficulties || []).join(", "),
      data.difficultiesDetails || "",
      (data.mobilityZones || []).join(", "),
      data.mobilityDetails || "",
      data.presentationProgress || "",
      data.routineProgress || "",
      data.nextWeekGoal || "",
      data.pointsFortsPhysiqueCustom || "",
      data.pointsFortsPosingCustom || "",
      data.pointsFaiblesCustom || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
