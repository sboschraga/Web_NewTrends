// =======================================================
// CONFIGURACIÓ GENERAL
// =======================================================

let languages = ["CA", "ES", "EN"];
let activeLang = 0;

// TEXTOS (Adaptat a estructura JSON/Array de JS)
const UI_TEXT = [
  [ // CA
    "PROPOSTES CIUTADANES",                   // 0
    "Pots proposar idees, projectes, millores...",    // 1
    "Identificador (DNI)",                    // 2
    "Escriu la teva proposta aquí...",                // 3
    "Enviar Proposta",                        // 4
    "ACCÉS CIUTADÀ",                          // 5
    "Introdueix les teves dades per accedir",         // 6
    "Entrar",                                 // 7
    "Error: El DNI ha de tenir 8 números i 1 lletra", // 8
    "Proposta registrada correctament.",              // 9
    "NOVA PROPOSTA",                          // 10 
    "PROPOSTES",                               // 11 
    "MARC LEGAL",                             // 12 
    "TANCAR SESSIÓ",                          // 13
    "No hi ha propostes guardades encara.",           // 14
    "Llegir document complet",                        // 15
    "Tornar a escriure",                      // 16
    "Nom i Cognoms",                          // 17
    "Usuari: "                                // 18
  ],
  [ // ES
    "PROPUESTAS CIUDADANAS",
    "Puedes proponer ideas, proyectos, mejoras...",
    "Identificador (DNI)",
    "Escribe tu propuesta aquí...",
    "Enviar Propuesta",
    "ACCESO CIUDADANO",
    "Introduce tus datos para acceder",
    "Entrar",
    "Error: El DNI debe tener 8 números y 1 letra",
    "Propuesta registrada correctamente.",
    "NUEVA PROPUESTA",
    "PROPUESTAS",
    "MARCO LEGAL",
    "CERRAR SESIÓN",
    "No hay propuestas guardadas todavía.",
    "Leer documento completo",
    "Volver a escribir",
    "Nombre y Apellidos",
    "Usuario: "
  ],
  [ // EN
    "CITIZEN PROPOSALS",
    "You can propose ideas, projects, improvements...",
    "Citizen ID",
    "Write your proposal here...",
    "Submit Proposal",
    "CITIZEN LOGIN",
    "Enter your details to access",
    "Login",
    "Error: ID must be 8 numbers and 1 letter",
    "Proposal registered successfully.",
    "NEW PROPOSAL",
    "PROPOSALS",
    "LEGAL FRAMEWORK",
    "LOGOUT",
    "No saved proposals yet.",
    "Read full document",
    "Write again",
    "Name and Surname",
    "User: "
  ]
];

// DADES DELS ENLLAÇOS
let linkTitles = [
  "FTC vs Facebook (2019)",
  "UK Parliament: Disinformation & 'Fake News'",
  "BOE: Llei Orgànica de Protecció de Dades",
  "Senate Intel. Comm: Russian Interference (Vol 2)"
];
let linkDescs = [
  "Ordre oficial sobre l'acord de privacitat de 5 mil milions de dòlars per violacions de privacitat dels consumidors.",
  "Informe del comitè sobre l'impacte de la desinformació i les notícies falses en la democràcia.",
  "Legislació espanyola (2019) sobre la garantia dels drets digitals i protecció de dades.",
  "Informe sobre l'ús de xarxes socials per part de l'IRA (Internet Research Agency) per influir en eleccions."
];
let linksURLs = [
  "https://www.ftc.gov/system/files/documents/cases/182_3109_facebook_order_filed_7-24-19.pdf",
  "https://publications.parliament.uk/pa/cm201719/cmselect/cmcumeds/1791/1791.pdf",
  "https://www.boe.es/boe/dias/2019/06/24/pdfs/BOE-A-2019-9509.pdf",
  "https://www.intelligence.senate.gov/wp-content/uploads/2024/08/sites-default-files-documents-report-volume2.pdf"
];

// ESTATS
const SCREEN_LOGIN   = 0;
const SCREEN_FORM    = 1;
const SCREEN_LIST    = 2; 
const SCREEN_LINKS   = 3; 
const SCREEN_SUCCESS = 4;

let currentScreen = SCREEN_LOGIN;

// Variables globals
let citizenID = "";
let citizenName = ""; 
let proposalText = "";
let loginErrorMessage = "";

let typingID = false;
let typingName = false; 
let typingProposal = false;

// SCROLL VARIABLES
let scrollOffset = 0;      
let listScrollOffset = 0; 
let isDraggingScroll = false; 

// Llista de propostes carregades
let loadedProposals = []; 

// Colors
let blueGov, darkBlue, bgColor, borderGray, errorRed, successGreen;

// =======================================================
// SETUP
// =======================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Definim colors aquí perquè p5.js s'hagi inicialitzat
  blueGov = color(20, 70, 140);
  darkBlue = color(10, 35, 70);
  bgColor = color(245);
  borderGray = color(180);
  errorRed = color(200, 50, 50);
  successGreen = color(40, 160, 80);
  
  typingID = true; 

  // Carregar propostes inicials (simulat amb localStorage)
  loadProposals();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// =======================================================
// DRAW
// =======================================================

function draw() {
  background(bgColor);
  
  if (currentScreen == SCREEN_LOGIN) {
    drawLoginScreen();
    drawLanguageSelector(width - 160, 40, false);
  } 
  else {
    drawNavBar();
    
    push();
    translate(0, 60); 
    
    if (currentScreen == SCREEN_FORM)    drawFormScreen();
    if (currentScreen == SCREEN_LIST)    drawListScreen();
    if (currentScreen == SCREEN_LINKS)   drawLinksScreen();
    if (currentScreen == SCREEN_SUCCESS) drawSuccessScreen();
    
    pop();
  }
}

// =======================================================
// BARRA DE NAVEGACIÓ
// =======================================================

function drawNavBar() {
  noStroke();
  fill(blueGov);
  rect(0, 0, width, 60);
  
  let currentX = 0;
  
  // Tabs dinàmiques
  currentX = drawDynamicTab(0, UI_TEXT[activeLang][10], currentScreen == SCREEN_FORM || currentScreen == SCREEN_SUCCESS, currentX);
  currentX = drawDynamicTab(1, UI_TEXT[activeLang][11], currentScreen == SCREEN_LIST, currentX);
  currentX = drawDynamicTab(2, UI_TEXT[activeLang][12], currentScreen == SCREEN_LINKS, currentX);
  
  // Logout i Usuari
  let logoutText = UI_TEXT[activeLang][13];
  textSize(20); textStyle(NORMAL);
  let logoutW = textWidth(logoutText) + 40;
  let logoutX = width - logoutW;
  
  fill(darkBlue);
  rect(logoutX, 0, logoutW, 60);
  fill(255);
  textAlign(CENTER, CENTER);
  text(logoutText, logoutX + logoutW/2, 30);
  
  drawLanguageSelector(int(logoutX - 170), 15, true);

  textAlign(RIGHT, CENTER);
  textSize(16);
  fill(220);
  text(UI_TEXT[activeLang][18] + citizenName, logoutX - 180, 30);
}

function drawDynamicTab(index, label, isActive, startX) {
  textSize(20);
  let w = textWidth(label) + 60; 
  
  if (isActive) fill(bgColor); 
  else fill(blueGov);            
  
  stroke(255, 50);
  rect(startX, 0, w, 60);
  noStroke();
  
  if (isActive) fill(blueGov);
  else fill(200);
  
  textAlign(CENTER, CENTER);
  text(label, startX + w/2, 30);
  
  return startX + w; 
}

// =======================================================
// PANTALLA LOGIN
// =======================================================

function drawLoginScreen() {
  let totalHeight = 350;
  let startY = (height - totalHeight) / 2;
  
  textAlign(CENTER, TOP);
  fill(30); textSize(28); textStyle(BOLD); text(UI_TEXT[activeLang][5], width/2, startY);
  fill(80); textSize(20); textStyle(NORMAL); text(UI_TEXT[activeLang][6], width/2, startY + 40);
  
  let boxW = 350; let boxH = 50; 
  let formY = startY + 90;
  let gap = 85; 
  
  // DNI
  fill(0); textAlign(LEFT, BOTTOM); textSize(16);
  text(UI_TEXT[activeLang][2], width/2 - boxW/2, formY); 
  fill(255); stroke(typingID ? blueGov : borderGray); strokeWeight(2);
  rect(width/2 - boxW/2, formY + 5, boxW, boxH, 5); strokeWeight(1);
  fill(0); textAlign(LEFT, CENTER); textSize(18); noStroke();
  text(citizenID, width/2 - boxW/2 + 15, formY + 5 + boxH/2);
  drawBlinkingCursor(citizenID, width/2 - boxW/2 + 15, formY + 5 + boxH/2, typingID, true);
  
  // NOM
  fill(0); textAlign(LEFT, BOTTOM); textSize(16);
  text(UI_TEXT[activeLang][17], width/2 - boxW/2, formY + gap); 
  fill(255); stroke(typingName ? blueGov : borderGray); strokeWeight(2);
  rect(width/2 - boxW/2, formY + gap + 5, boxW, boxH, 5); strokeWeight(1);
  fill(0); textAlign(LEFT, CENTER); textSize(18); noStroke();
  text(citizenName, width/2 - boxW/2 + 15, formY + gap + 5 + boxH/2);
  drawBlinkingCursor(citizenName, width/2 - boxW/2 + 15, formY + gap + 5 + boxH/2, typingName, true);

  // BOTÓ
  let btnW = 150; let btnH = 45; let btnX = width/2 - btnW/2; let btnY = formY + gap + 80;
  fill(blueGov); noStroke(); rect(btnX, btnY, btnW, btnH, 5);
  fill(255); textAlign(CENTER, CENTER); textSize(20);
  text(UI_TEXT[activeLang][7], width/2, btnY + btnH/2);
  
  if (loginErrorMessage.length > 0) {
    fill(errorRed); text(loginErrorMessage, width/2, btnY + 70);
  }
}

// =======================================================
// PANTALLA 1: FORMULARI
// =======================================================

function drawFormScreen() {
  fill(30); textSize(28); textStyle(BOLD); textAlign(LEFT, TOP);
  text(UI_TEXT[activeLang][0], 50, 30);
  
  fill(80); textSize(20); textStyle(NORMAL);
  text(UI_TEXT[activeLang][1], 50, 70);
  
  // Caixa de text
  let x = 50; let y = 110; let w = width - 100; 
  let h = height - 300; 
  
  fill(255); stroke(typingProposal ? blueGov : borderGray); strokeWeight(typingProposal ? 2 : 1);
  rect(x, y, w, h, 6); strokeWeight(1);
  
  // En p5.js, 'clip' és complex. Farem servir text normal però amb cura.
  // Visualment simularem l'àrea amb un buffer o senzillament deixarem que el text es talli per baix si cal.
  
  textSize(18); textAlign(LEFT, TOP);
  let displayText = proposalText;
  if (typingProposal && frameCount % 60 < 30) displayText += "|"; 

  // Guardem l'estat abans de fer "clip" visual (no real en p5 sense createGraphics)
  // Per simplicitat en p5.js, dibuixem el text directament sobre el rect.
  // Si vols un scroll real dins la caixa, caldria usar createGraphics, però això complica molt el codi.
  // Aquí simplement dibuixem:
  
  if (proposalText.length == 0 && !typingProposal) {
    fill(150); noStroke();
    text(UI_TEXT[activeLang][3], x + 10, y + 10);
  } else {
    fill(20); noStroke();
    // Simulem scroll vertical
    let textY = y + 10 - scrollOffset;
    // Màscara simple: només dibuixem si està dins de l'àrea Y
    // (Això és un hack senzill, per fer-ho perfecte caldria createGraphics)
    text(displayText, x + 10, textY, w - 20); 
  }
  
  // Tapem el text que surt per dalt (header)
  fill(bgColor); noStroke(); rect(0, 0, width, 110); 
  // Redibuixem titol
  fill(30); textSize(28); textStyle(BOLD); textAlign(LEFT, TOP); text(UI_TEXT[activeLang][0], 50, 30);
  fill(80); textSize(20); textStyle(NORMAL); text(UI_TEXT[activeLang][1], 50, 70);


  // Botó Enviar 
  let bw = 200; let bh = 50; 
  let bx = width - bw - 50; 
  let by = y + h + 20; 
  
  fill(blueGov); noStroke(); rect(bx, by, bw, bh, 6);
  fill(255); textAlign(CENTER, CENTER); textSize(20);
  text(UI_TEXT[activeLang][4], bx + bw / 2, by + bh / 2);
}

// =======================================================
// PANTALLA 2: LLISTAT ADAPTATIU
// =======================================================

function drawListScreen() {
  fill(30); textSize(28); textStyle(BOLD); textAlign(LEFT, TOP);
  text(UI_TEXT[activeLang][11], 50, 30); 
  
  // --- 1. CALCULEM L'ALÇADA TOTAL DEL CONTINGUT ---
  let totalContentHeight = 0;
  let itemHeights = []; 
  
  for(let i=0; i<loadedProposals.length; i++) {
    itemHeights[i] = getProposalHeight(loadedProposals[i]);
    totalContentHeight += itemHeights[i] + 10; 
  }
  
  // --- 2. DIBUIXEM LA LLISTA ---
  let startY = 80;
  let visibleH = height - 140; 
  
  push();
  // Simulem scroll
  translate(0, -listScrollOffset);
  
  if (loadedProposals.length == 0) {
    fill(150); textSize(20); textStyle(NORMAL);
    text(UI_TEXT[activeLang][14], 50, 100 + listScrollOffset); // Ajustat perque es vegi
  }
  
  let currentY = startY; 
  
  for (let i = 0; i < loadedProposals.length; i++) {
    let itemH = itemHeights[i];
    
    // Dibuixem només si és visible (optimització simple)
    if (currentY + itemH > listScrollOffset && currentY < listScrollOffset + visibleH + 100) {
        
        fill(255); stroke(200);
        rect(50, currentY, width - 100, itemH, 5);
        
        let lines = loadedProposals[i].split('\n');
        let header = "Proposta sense dades";
        if (lines.length > 3) {
           let nameStr = lines[2].replace("Nom: ", ""); 
           let dateStr = lines[3].replace("Data: ", "");
           header = nameStr + "  |  " + dateStr;
        }
        
        let body = "";
        let contentFound = false;
        for(let l of lines) {
          if(contentFound) body += l + " ";
          if(l.startsWith("---")) contentFound = true;
        }
        
        fill(blueGov); textSize(16); textAlign(LEFT, TOP); noStroke();
        text(header, 65, currentY + 15); 
        
        fill(60); textSize(20); textLeading(24); 
        text(body, 65, currentY + 45, width - 130, itemH - 45);
    }
    
    currentY += itemH + 10; 
  }
  pop();
  
  // Tapem la part superior per fer efecte màscara
  fill(bgColor); noStroke(); rect(0, 0, width, 80);
  fill(30); textSize(28); textStyle(BOLD); textAlign(LEFT, TOP); text(UI_TEXT[activeLang][11], 50, 30); 

  
  // --- 3. BARRA DE SCROLL ---
  if (totalContentHeight > visibleH) {
     let barX = width - 25;
     let barY = 80;
     let barW = 15;
     
     fill(230); noStroke();
     rect(barX, barY, barW, visibleH, 6);
     
     let scrollRatio = visibleH / totalContentHeight;
     let thumbH = visibleH * scrollRatio;
     if (thumbH < 30) thumbH = 30; 
     
     let maxScroll = totalContentHeight - visibleH + 50; 
     let scrollPercent = listScrollOffset / maxScroll;
     scrollPercent = constrain(scrollPercent, 0, 1);
     
     let thumbY = barY + scrollPercent * (visibleH - thumbH);
     
     if(isDraggingScroll) fill(darkBlue);
     else fill(blueGov);
     
     rect(barX, thumbY, barW, thumbH, 6);
  }
}

// =======================================================
// PANTALLA 3: LINKS
// =======================================================

function drawLinksScreen() {
  fill(30); textSize(28); textStyle(BOLD); textAlign(LEFT, TOP);
  text(UI_TEXT[activeLang][12], 50, 30);
  let startY = 90;
  
  for(let i = 0; i < linkTitles.length; i++) {
    let y = startY + i * 130; 
    
    fill(255); stroke(200); rect(50, y, width - 100, 110, 5); 
    
    fill(blueGov); textSize(24); textStyle(BOLD); textAlign(LEFT, TOP); noStroke();
    text(linkTitles[i], 70, y + 15);
    
    fill(80); textSize(20); textStyle(NORMAL);
    text(linkDescs[i], 70, y + 45, width - 300, 60);
    
    // BOTÓ ALINEAT
    let btnText = UI_TEXT[activeLang][15];
    textSize(20); 
    let btnW = textWidth(btnText) + 30;
    let btnX = width - btnW - 70;
    
    let btnH = 40;
    let btnYOffset = (110 - btnH) / 2; 
    
    fill(230); noStroke(); 
    rect(btnX, y + btnYOffset, btnW, btnH, 5);
    
    fill(blueGov); textAlign(CENTER, CENTER);
    text(btnText, btnX + btnW/2, y + btnYOffset + btnH/2 - 3); 
  }
}

// =======================================================
// PANTALLA 4: ÈXIT
// =======================================================

function drawSuccessScreen() {
  textAlign(CENTER, CENTER);
  fill(successGreen); noStroke(); ellipse(width/2, height/2 - 100, 80, 80);
  stroke(255); strokeWeight(6); noFill();
  beginShape(); vertex(width/2 - 15, height/2 - 100); vertex(width/2 - 5, height/2 - 90); vertex(width/2 + 20, height/2 - 110); endShape();
  strokeWeight(1); noStroke();
  fill(30); textSize(28); textStyle(BOLD); text(UI_TEXT[activeLang][9], width/2, height/2 - 20);
  
  let backText = UI_TEXT[activeLang][16];
  textSize(20); textStyle(NORMAL);
  let btnW = textWidth(backText) + 50;
  let btnH = 50;
  let btnX = width/2 - btnW/2;
  let btnY = height/2 + 50;
  
  fill(blueGov); noStroke(); rect(btnX, btnY, btnW, btnH, 5);
  fill(255); text(backText, width/2, btnY + btnH/2);
}

// =======================================================
// INTERACCIÓ: CLICS I ARROSSEGAR
// =======================================================

function mousePressed() {
  if (currentScreen == SCREEN_LOGIN) {
    if (mouseY > 40 && mouseY < 70 && mouseX > width-160) checkLangClick(width-160);
    
    let totalHeight = 350;
    let startY = (height - totalHeight) / 2;
    let boxW = 350; 
    let formY = startY + 90;
    let gap = 85; 
    let boxX = width/2 - boxW/2;
    
    if (mouseX > boxX && mouseX < boxX + boxW && mouseY > formY && mouseY < formY + 50) {
       typingID = true; typingName = false;
    }
    else if (mouseX > boxX && mouseX < boxX + boxW && mouseY > formY + gap && mouseY < formY + gap + 50) {
       typingID = false; typingName = true;
    }
    else {
       typingID = false; typingName = false;
    }
    
    let btnX = width/2 - 75;
    let btnY = formY + gap + 80;
    if (mouseX > btnX && mouseX < btnX + 150 && mouseY > btnY && mouseY < btnY + 45) validateAndLogin();
  } 
  else {
    // 1. BARRA SUPERIOR
    if (mouseY < 60) {
      textSize(20);
      let logoutW = textWidth(UI_TEXT[activeLang][13]) + 40;
      let logoutX = width - logoutW;
      
      let w0 = textWidth(UI_TEXT[activeLang][10]) + 60;
      let w1 = textWidth(UI_TEXT[activeLang][11]) + 60;
      let w2 = textWidth(UI_TEXT[activeLang][12]) + 60;
      
      if (mouseX < w0) currentScreen = SCREEN_FORM;
      else if (mouseX < w0 + w1) { currentScreen = SCREEN_LIST; loadProposals(); }
      else if (mouseX < w0 + w1 + w2) currentScreen = SCREEN_LINKS;
      else if (mouseX > logoutX) resetToLogin(); 
      else if (mouseX > logoutX - 170 && mouseX < logoutX - 20) checkLangClick(int(logoutX - 170));
    }
    else {
      // 2. CONTINGUT (amb offset de la navbar)
      let mY = mouseY - 60; 

      if (currentScreen == SCREEN_FORM) {
        typingProposal = (mY > 110 && mY < height - 250 && mouseX > 50 && mouseX < width - 50);
        let h = height - 300; 
        let by = 110 + h + 20; 
        
        if (mY > by && mY < by + 50 && mouseX > width - 250 && mouseX < width - 50) saveProposal();
      }
      else if (currentScreen == SCREEN_LIST) {
        if (mouseX > width - 30) {
          isDraggingScroll = true;
        }
      }
      else if (currentScreen == SCREEN_LINKS) checkLinkClicks(mY);
      else if (currentScreen == SCREEN_SUCCESS) {
         let backText = UI_TEXT[activeLang][16];
         textSize(20);
         let btnW = textWidth(backText) + 50;
         let btnX = width/2 - btnW/2;
         let btnY = height/2 + 50 - 60; // Ajustat pel translate
         if (mY > btnY && mY < btnY + 50 && mouseX > btnX && mouseX < btnX + btnW) {
           currentScreen = SCREEN_FORM; typingProposal = true;
         }
      }
    }
  }
}

function mouseDragged() {
  if (currentScreen == SCREEN_LIST && isDraggingScroll) {
    let contentH = 0;
    for(let p of loadedProposals) contentH += getProposalHeight(p) + 10;
    
    let visibleH = height - 140; 
    
    if (contentH > visibleH) {
      let scrollRatio = visibleH / contentH;
      let thumbH = visibleH * scrollRatio;
      if (thumbH < 30) thumbH = 30;
      
      let barY = 80; 
      let val = map(mouseY - 60, barY, barY + visibleH - thumbH, 0, 1);
      val = constrain(val, 0, 1);
      
      let maxScroll = contentH - visibleH + 50;
      listScrollOffset = val * maxScroll;
    }
  }
}

function mouseReleased() {
  isDraggingScroll = false;
}

function mouseWheel(event) {
  if (currentScreen == SCREEN_FORM) {
    let formH = height - 300;
    let approxLines = proposalText.split("\n").length + (proposalText.length / 70); 
    let totalTextHeight = approxLines * 25 + 50; 
    let maxScroll = max(0, totalTextHeight - formH + 50);
    scrollOffset += event.delta;
    scrollOffset = constrain(scrollOffset, 0, maxScroll);
  }
  else if (currentScreen == SCREEN_LIST) {
    let totalListHeight = 0;
    for(let p of loadedProposals) totalListHeight += getProposalHeight(p) + 10;
    
    let visibleHeight = height - 140; 
    let maxListScroll = max(0, totalListHeight - visibleHeight + 50);
    
    listScrollOffset += event.delta;
    listScrollOffset = constrain(listScrollOffset, 0, maxListScroll);
  }
}

// CORRECCIÓ CLIC LINKS
function checkLinkClicks(relativeMouseY) {
  let visualStart = 90; // Ajustat respecte al Java original (era 150 o 90 segons funcio)
  // En Java deia 90 dins de drawLinks, pero checkLinkClicks usava 150. Unifiquem a 90.
  
  textSize(20);
  let btnText = UI_TEXT[activeLang][15];
  let btnW = textWidth(btnText) + 30;
  let btnH = 40;
  
  for(let i = 0; i < linksURLs.length; i++) {
    let rowY = visualStart + i * 130;
    let btnYOffset = (110 - btnH) / 2; 
    let btnY = rowY + btnYOffset;
    
    let btnX = width - btnW - 70;
    
    if (relativeMouseY > btnY && relativeMouseY < btnY + btnH && mouseX > btnX && mouseX < btnX + btnW) {
      window.open(linksURLs[i], "_blank");
    }
  }
}

function checkLangClick(startX) {
   for (let i = 0; i < languages.length; i++) {
      if (mouseX > startX + i * 50 && mouseX < startX + 45 + i * 50) activeLang = i;
   }
}

// =======================================================
// FILES & DATA (ADAPTAT A LOCALSTORAGE)
// =======================================================

function loadProposals() {
  // En lloc de llegir fitxers, llegim del localStorage del navegador
  let storage = localStorage.getItem("propostes_db");
  if (storage) {
      loadedProposals = JSON.parse(storage);
  } else {
      loadedProposals = [];
  }
  // Ordenem per data (simulat, ja que aquí són strings, l'ideal seria objectes)
  // De moment ho deixem com entra (FIFO) o invertim
  loadedProposals.reverse();
}

function saveProposal() {
  if (proposalText.trim().length == 0) return;

  let d = new Date();
  let dateStr = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes();

  let content = 
    "Idioma: " + languages[activeLang] + "\n" +
    "Identificador: " + citizenID + "\n" +
    "Nom: " + citizenName + "\n" +
    "Data: " + dateStr + "\n" +
    "---------------------------\n" +
    proposalText;

  // 1. Recuperar existent
  let storage = localStorage.getItem("propostes_db");
  let currentArr = [];
  if (storage) currentArr = JSON.parse(storage);
  
  // 2. Afegir nou
  currentArr.push(content);
  
  // 3. Guardar
  localStorage.setItem("propostes_db", JSON.stringify(currentArr));
  
  console.log("Guardat a LocalStorage");
  proposalText = ""; 
  loadProposals();     
  
  currentScreen = SCREEN_SUCCESS; 
}

function deleteAllHistory() {
  localStorage.removeItem("propostes_db");
  loadProposals(); 
  listScrollOffset = 0;
  console.log("Historial esborrat completament.");
}

// =======================================================
// UTILITATS
// =======================================================

function validateAndLogin() {
  let regex = /^\d{8}[a-zA-Z]$/;
  if (regex.test(citizenID)) {
    if (citizenName.trim().length == 0) {
       loginErrorMessage = "Error: Introdueix el teu nom / Introduce nombre";
       return;
    }
    citizenID = citizenID.toUpperCase();
    currentScreen = SCREEN_FORM; 
    typingID = false; typingName = false;
    typingProposal = true;
    loginErrorMessage = "";
  } else {
    loginErrorMessage = UI_TEXT[activeLang][8];
  }
}

function resetToLogin() {
  proposalText = ""; citizenID = ""; citizenName = ""; loginErrorMessage = "";
  currentScreen = SCREEN_LOGIN; typingID = true; typingName = false; typingProposal = false;
}

// --- GESTIÓ DE TECLAT ---
function keyPressed() {
  // Paste (Ctrl+V) es gestiona millor amb event listener natiu a setup,
  // però aquí podem gestionar l'esborrar i tecles especials.
  
  // Esborrar historial
  if (key == 'º') {
    deleteAllHistory();
  }

  if (currentScreen == SCREEN_LOGIN) {
    if (keyCode == TAB) {
       if (typingID) { typingID = false; typingName = true; }
       else { typingID = true; typingName = false; }
    }
    else if (keyCode == ENTER) validateAndLogin();
    
    else if (typingID) {
      if (keyCode == BACKSPACE && citizenID.length > 0) citizenID = citizenID.substring(0, citizenID.length - 1);
      else if (key.length == 1 && citizenID.length < 9) citizenID += key;
    }
    else if (typingName) {
      if (keyCode == BACKSPACE && citizenName.length > 0) citizenName = citizenName.substring(0, citizenName.length - 1);
      else if (key.length == 1) citizenName += key;
    }
  }
  else if (currentScreen == SCREEN_FORM && typingProposal) {
    if (keyCode == BACKSPACE && proposalText.length > 0) proposalText = proposalText.substring(0, proposalText.length - 1);
    else if (keyCode == ENTER) proposalText += "\n";
    else if (key.length == 1) proposalText += key;
  }
}

// Suport per enganxar text (Ctrl+V) modern
// Això s'afegeix fora de p5.js pur per interceptar l'event del navegador
window.addEventListener('paste', (event) => {
    let paste = (event.clipboardData || window.clipboardData).getData('text');
    
    if (currentScreen == SCREEN_LOGIN) {
        if (typingID) {
             let safeClip = paste.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
             citizenID += safeClip;
             if (citizenID.length > 9) citizenID = citizenID.substring(0, 9);
        } else if (typingName) {
             let safeClip = paste.replace(/[\n\r]/g, " ");
             citizenName += safeClip;
        }
    } else if (currentScreen == SCREEN_FORM && typingProposal) {
        proposalText += paste;
    }
});


// --- UTILITAT: CALCULAR ALÇADA TEXT ---
function getProposalHeight(rawProp) {
  let lines = rawProp.split('\n');
  let body = "";
  let contentFound = false;
  for(let l of lines) {
    if(contentFound) body += l + " ";
    if(l.startsWith("---")) contentFound = true;
  }
  
  textSize(20); textStyle(NORMAL);
  let boxWidth = width - 130; 
  let textW = textWidth(body);
  
  // Calcular línies aproximades (simple en JS)
  let numLines = Math.ceil(textW / boxWidth);
  if (body.length > 0 && numLines == 0) numLines = 1;
  // Afegim línies extres pels salts de línia explícits
  numLines += (body.match(/\n/g) || []).length;

  return 40 + (numLines * 24) + 60; // Marge extra
}


function drawBlinkingCursor(txt, x, y, isActive, singleLine) {
  if (isActive && frameCount % 60 < 30) {
    let txtWidth = textWidth(txt);
    stroke(0); strokeWeight(2);
    if(singleLine) line(x + txtWidth + 2, y - 10, x + txtWidth + 2, y + 10); 
  }
}