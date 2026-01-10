let currentUser = { dni: "", name: "" };
let activeLang = "CA";
let tickerInterval = null;
let currentProposalIndex = 0;

// URL dels documents
const linksURLs = [
    "https://www.ftc.gov/system/files/documents/cases/182_3109_facebook_order_filed_7-24-19.pdf",
    "https://publications.parliament.uk/pa/cm201719/cmselect/cmcumeds/1791/1791.pdf",
    "https://www.boe.es/boe/dias/2019/06/24/pdfs/BOE-A-2019-9509.pdf",
    "https://www.intelligence.senate.gov/wp-content/uploads/2024/08/sites-default-files-documents-report-volume2.pdf"
];

// TRADUCCIONS (UI + LEGAL)
const translations = {
    CA: {
        navNew: "Nova Proposta", navList: "Llistat", navLegal: "Marc Legal", navLive: "Directe ●",
        btnSend: "Registrar Proposta", placeholder: "Descriu la teva proposta detalladament...",
        readDoc: "Veure Document", tvConnecting: "CONNECTANT...", aiLabel: "PANELL DE CONTROL",
        statusApproved: "APROVADA", statusRejected: "REFUSADA", statusPostponed: "AJORNADA",
        loginTitle: "Accés Ciutadà", loginDesc: "Identifica't per accedir a la plataforma",
        loginName: "Nom Complet", loginId: "DNI / NIE", btnEnter: "Accedir",
        successTitle: "Proposta Registrada", successDesc: "La vostra sol·licitud ha estat emmagatzemada i traduïda correctament.",
        btnBack: "Tornar a escriure", listTitle: "Registre de Propostes", legalTitle: "Marc Legal i Normativa",
        monitorBadge: "● EN DIRECTE", monitorHeadline: "CONNECTANT AMB EL PLE...",
        labelProp: "PROPOSTA CIUTADANA", labelGov: "RESPOSTA DEL GOVERN",
        govWait: "Anàlisi en curs...", citizenWait: "Esperant dades...",

        // LEGAL
        legal1Title: "FTC vs Facebook (2019)", legal1Desc: "Ordre oficial sobre l'acord de privacitat de 5 mil milions de dòlars.",
        legal2Title: "UK Parliament: Desinformació", legal2Desc: "Informe sobre l'impacte de les notícies falses en la democràcia.",
        legal3Title: "BOE: Llei Protecció Dades", legal3Desc: "Legislació espanyola sobre drets digitals i protecció de dades.",
        legal4Title: "Senate Intel: Interferència", legal4Desc: "Informe sobre l'ús de xarxes socials per influir en eleccions."
    },
    ES: {
        navNew: "Nueva Propuesta", navList: "Listado", navLegal: "Marco Legal", navLive: "Directo ●",
        btnSend: "Registrar Propuesta", placeholder: "Describe tu propuesta detalladamente...",
        readDoc: "Ver Documento", tvConnecting: "CONECTANDO...", aiLabel: "PANEL DE CONTROL",
        statusApproved: "APROBADA", statusRejected: "RECHAZADA", statusPostponed: "APLAZADA",
        loginTitle: "Acceso Ciudadano", loginDesc: "Identifícate para acceder a la plataforma",
        loginName: "Nombre Completo", loginId: "DNI / NIE", btnEnter: "Acceder",
        successTitle: "Propuesta Registrada", successDesc: "Su solicitud ha sido almacenada y traducida correctamente.",
        btnBack: "Volver a escribir", listTitle: "Registro de Propuestas", legalTitle: "Marco Legal y Normativa",
        monitorBadge: "● EN DIRECTO", monitorHeadline: "CONECTANDO CON EL PLENO...",
        labelProp: "PROPUESTA CIUDADANA", labelGov: "RESPUESTA DEL GOBIERNO",
        govWait: "Análisis en curso...", citizenWait: "Esperando datos...",

        legal1Title: "FTC vs Facebook (2019)", legal1Desc: "Orden oficial sobre el acuerdo de privacidad de 5 mil millones.",
        legal2Title: "UK Parliament: Desinformación", legal2Desc: "Informe sobre el impacto de las noticias falsas en la democracia.",
        legal3Title: "BOE: Ley Protección Datos", legal3Desc: "Legislación española sobre derechos digitales y protección de datos.",
        legal4Title: "Senate Intel: Interferencia", legal4Desc: "Informe sobre el uso de redes sociales para influir en elecciones."
    },
    EN: {
        navNew: "New Proposal", navList: "Registry", navLegal: "Legal Framework", navLive: "Live ●",
        btnSend: "Submit Proposal", placeholder: "Describe your proposal in detail...",
        readDoc: "View Document", tvConnecting: "CONNECTING...", aiLabel: "CONTROL PANEL",
        statusApproved: "APPROVED", statusRejected: "REJECTED", statusPostponed: "POSTPONED",
        loginTitle: "Citizen Access", loginDesc: "Identify yourself to access the platform",
        loginName: "Full Name", loginId: "DNI / NIE", btnEnter: "Enter",
        successTitle: "Proposal Registered", successDesc: "Your request has been stored and translated successfully.",
        btnBack: "Write another", listTitle: "Proposal Registry", legalTitle: "Legal Framework",
        monitorBadge: "● LIVE", monitorHeadline: "CONNECTING TO SESSION...",
        labelProp: "CITIZEN PROPOSAL", labelGov: "GOVERNMENT RESPONSE",
        govWait: "Analysis in progress...", citizenWait: "Waiting for data...",

        legal1Title: "FTC vs Facebook (2019)", legal1Desc: "Official order regarding the $5 billion privacy settlement.",
        legal2Title: "UK Parliament: Disinformation", legal2Desc: "Report on the impact of fake news on democracy.",
        legal3Title: "BOE: Data Protection Law", legal3Desc: "Spanish legislation regarding digital rights and data protection.",
        legal4Title: "Senate Intel: Interference", legal4Desc: "Report on the use of social media to influence elections."
    }
};

// API TRADUCCIÓ
async function translateText(text, targetLang) {
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ca|${targetLang}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.responseData && data.responseData.translatedText) return data.responseData.translatedText;
        return text;
    } catch (e) { return text; }
}

function setLang(lang) {
    activeLang = lang;
    const t = translations[lang];

    document.getElementById('nav-new').innerText = t.navNew;
    document.getElementById('nav-list').innerText = t.navList;
    document.getElementById('nav-legal').innerText = t.navLegal;
    document.getElementById('nav-live').innerText = t.navLive;
    
    if(document.querySelector('#screen-login h1')) document.querySelector('#screen-login h1').innerText = t.loginTitle;
    if(document.querySelector('#screen-login p')) document.querySelector('#screen-login p').innerText = t.loginDesc;
    if(document.querySelector('.input-group label')) {
         document.querySelectorAll('.input-group label')[0].innerText = t.loginName;
         document.querySelectorAll('.input-group label')[1].innerText = t.loginId;
    }
    if(document.querySelector('#screen-login .primary-btn')) document.querySelector('#screen-login .primary-btn').innerText = t.btnEnter;

    if(document.querySelector('#screen-form h2')) document.querySelector('#screen-form h2').innerText = t.navNew;
    if(document.getElementById('proposalText')) document.getElementById('proposalText').placeholder = t.placeholder;
    if(document.querySelector('#screen-form .primary-btn')) document.querySelector('#screen-form .primary-btn').innerText = t.btnSend;

    if(document.querySelector('#screen-success h2')) document.querySelector('#screen-success h2').innerText = t.successTitle;
    if(document.querySelector('#screen-success p')) document.querySelector('#screen-success p').innerText = t.successDesc;
    if(document.getElementById('btn-back')) document.getElementById('btn-back').innerText = t.btnBack;

    if(document.querySelector('#screen-list h2')) document.querySelector('#screen-list h2').innerText = t.listTitle;
    if(document.querySelector('#links-title')) document.querySelector('#links-title').innerText = t.legalTitle;

    if(document.querySelector('.on-air-badge')) document.querySelector('.on-air-badge').innerText = t.monitorBadge;
    if(document.querySelector('.panel-header')) document.querySelector('.panel-header').innerText = t.aiLabel;
    
    if(document.getElementById('lbl-citizen')) document.getElementById('lbl-citizen').innerText = t.labelProp;
    if(document.getElementById('lbl-gov')) document.getElementById('lbl-gov').innerText = t.labelGov;

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('lang-' + lang.toLowerCase()).classList.add('active');

    if (!document.getElementById('screen-list').classList.contains('hidden')) loadProposalsList();
    if (!document.getElementById('screen-links').classList.contains('hidden')) loadLinks();
    
    // Refresh Live if no data
    if (!document.getElementById('screen-live').classList.contains('hidden')) {
         let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
         if (db.length === 0) {
             document.getElementById('tv-headline-text').innerText = t.monitorHeadline;
             document.getElementById('tv-proposal-text').innerText = t.citizenWait;
             document.getElementById('tv-gov-text').innerText = t.govWait;
         } else {
             // Force refresh to update labels
             startLiveMode();
         }
    }
}

function navTo(screenName) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    document.getElementById('screen-' + screenName).classList.remove('hidden');
    if (screenName !== 'login') document.getElementById('navbar').classList.remove('hidden');
    
    if(screenName === 'live') startLiveMode();
    else clearInterval(tickerInterval);
    if(screenName === 'list') loadProposalsList();
    if(screenName === 'links') loadLinks();
}

function tryLogin() {
    const name = document.getElementById('nameInput').value;
    if(name) { currentUser.name = name; currentUser.dni = document.getElementById('dniInput').value; navTo('form'); }
}

function logout() { navTo('login'); }

async function saveProposal() {
    const text = document.getElementById('proposalText').value.trim();
    if (!text) return;
    
    const btn = document.querySelector('#screen-form .primary-btn');
    const originalText = btn.innerText;
    btn.innerText = "Traduint..."; 
    btn.disabled = true;

    const textES = await translateText(text, "es");
    const textEN = await translateText(text, "en");

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + 'h';

    const newProp = { 
        id: Date.now(), 
        dni: currentUser.dni, 
        name: currentUser.name, 
        text_ca: text, text_es: textES, text_en: textEN,
        headline: currentUser.name, // Titular per defecte (pots canviar-ho manualment)
        govResponse: "Pendent de valoració tècnica...", // Resposta per defecte
        date: now.toLocaleDateString(), 
        time: timeStr,
        status: 'pending' 
    };
    
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    db.unshift(newProp);
    localStorage.setItem('propostes_db', JSON.stringify(db));
    
    document.getElementById('proposalText').value = "";
    btn.innerText = originalText;
    btn.disabled = false;
    navTo('success');
}

function loadProposalsList() {
    const container = document.getElementById('proposals-container');
    container.innerHTML = "";
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    const t = translations[activeLang];
    
    if (db.length === 0) { container.innerHTML = "<p style='text-align:center;'>Sense dades.</p>"; return; }

    db.forEach(p => {
        let statusText = "";
        if(p.status === 'approved') statusText = t.statusApproved;
        else if(p.status === 'rejected') statusText = t.statusRejected;
        else if(p.status === 'postponed') statusText = t.statusPostponed;

        let statusBadge = p.status !== 'pending' ? `<span style='color:#003F87; font-weight:bold'> ● ${statusText}</span>` : "";
        let displayText = p['text_' + activeLang.toLowerCase()] || p.text_ca || p.text;

        container.innerHTML += `
            <div class="proposal-card">
                <div class="proposal-header">
                    <span>${p.name}${statusBadge}</span>
                    <div class="meta-info">
                        <span>${p.date}</span>
                        <span style="font-weight:bold; color:#003F87;">${p.time || ''}</span>
                    </div>
                </div>
                <div class="proposal-body">${displayText}</div>
            </div>`;
    });
}

function loadLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = "";
    const t = translations[activeLang];
    const docs = [
        { t: t.legal1Title, d: t.legal1Desc, u: linksURLs[0] },
        { t: t.legal2Title, d: t.legal2Desc, u: linksURLs[1] },
        { t: t.legal3Title, d: t.legal3Desc, u: linksURLs[2] },
        { t: t.legal4Title, d: t.legal4Desc, u: linksURLs[3] }
    ];

    docs.forEach(doc => {
        container.innerHTML += `
            <div class="link-card">
                <div class="link-info"><h3>${doc.t}</h3><p>${doc.d}</p></div>
                <a href="${doc.u}" target="_blank" class="link-btn">${t.readDoc}</a>
            </div>`;
    });
}

function vote(action) {
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    if (db.length === 0) return;
    const idEnPantalla = document.getElementById('prop-id').innerText;
    const realIndex = db.findIndex(p => p.id.toString().slice(-4) === idEnPantalla);

    if (realIndex !== -1) {
        db[realIndex].status = action;
        localStorage.setItem('propostes_db', JSON.stringify(db));
        startLiveMode(true);
    }
}

function startLiveMode(forceNext = false) {
    const headElem = document.getElementById('tv-headline-text');
    const propTextElem = document.getElementById('tv-proposal-text');
    const govTextElem = document.getElementById('tv-gov-text');
    const idElem = document.getElementById('prop-id');
    const t = translations[activeLang];
    
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");

    if (db.length === 0) {
        headElem.innerText = t.monitorHeadline;
        propTextElem.innerText = t.citizenWait;
        govTextElem.innerText = t.govWait;
        return;
    }

    if (forceNext) currentProposalIndex = (currentProposalIndex + 1) % db.length;

    function renderScreen() {
        if (document.getElementById('screen-live').classList.contains('hidden')) return;
        const p = db[currentProposalIndex];
        
        idElem.innerText = p.id.toString().slice(-4);
        
        headElem.style.opacity = 0;
        propTextElem.style.opacity = 0;
        govTextElem.style.opacity = 0;

        setTimeout(() => {
            // 1. TITULAR
            headElem.innerText = (p.headline || p.name).toUpperCase();
            
            // 2. PROPOSTA (Traduïda)
            let displayText = p['text_' + activeLang.toLowerCase()] || p.text_ca || p.text;
            propTextElem.innerText = displayText;

            // 3. GOVERN (Manual o default)
            govTextElem.innerText = p.govResponse || "Pendent...";

            headElem.style.opacity = 1;
            propTextElem.style.opacity = 1;
            govTextElem.style.opacity = 1;
        }, 300);
    }

    renderScreen();
    if (tickerInterval) clearInterval(tickerInterval);
    tickerInterval = setInterval(() => {
        currentProposalIndex = (currentProposalIndex + 1) % db.length;
        renderScreen();
    }, 15000); 
}