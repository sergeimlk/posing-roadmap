// ══════════════════════════════════════════════════
// GOOGLE APPS SCRIPT — Feuille ONBOARDING
// ══════════════════════════════════════════════════
// À coller dans : Extensions > Apps Script de la feuille "Onboarding"
// Puis : 1) Exécuter setupSheet() une fois, 2) Déployer en Web App

// Fonction à exécuter UNE SEULE FOIS pour créer les en-têtes
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // Renommer l'onglet
  sheet.setName("Questionnaires Onboarding");
  
  var headers = [
    "Date d'inscription", "Nom Complet", "Catégories", "Catégorie Principale", 
    "Fédérations", "Fédération Principale", "Intention Scène", "A des Shorts", 
    "Niveau Posing", "Objectifs", "Difficultés Physiques", "Problématiques Détails", 
    "Temps Quotidien", "Besoins", "Morphologie", "Date de Compétition",
    "Points Forts Physique", "Points Forts Posing", "Points Faibles"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
       .setFontWeight("bold")
       .setBackground("#FFF3C4")
       .setFontColor("#5C4A10");
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
    var sheet = ss.getSheetByName("Questionnaires Onboarding") || ss.getActiveSheet();
    var now = new Date();
    
    sheet.appendRow([
      now,
      data.fullname || "",
      (data.categories || []).join(", "),
      data.primaryCategory || data.category || "",
      (data.federations || []).join(", "),
      data.primaryFederation || data.federation || "",
      data.stageIntent || "",
      data.hasShorts || "",
      data.level || "",
      data.objectives || "",
      (data.selectedProblems || []).join(", "),
      data.problems || "",
      data.time || "",
      (data.needs || []).join(", "),
      data.morphology || "",
      data.stageDate || "",
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
