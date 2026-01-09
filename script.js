// ==========================================
// DADES GLOBALS
// ==========================================
let currentUser = { dni: "", name: "" };
let activeLang = "CA";
let toxicityModel = null;
const threshold = 0.85;
let tickerInterval = null;

// 🔥 POSA LA TEVA CLAU API REAL AQUÍ
// Si aquesta clau no funciona, el sistema donarà error (no hi ha simulació).
const GOOGLE_API_KEY = ""; 

// 0. CARREGAR IA MODERACIÓ
if (typeof toxicity !== 'undefined') {
    toxicity.load(threshold).then(model => {
        toxicityModel = model;
        console.log("🤖 IA Moderació: OK");
    });
}

// 1. TRADUCCIONS
const translations = {
    CA: {
        loginTitle: "ACCÉS CIUTADÀ", loginDesc: "Dades d'accés",
        lblDni: "DNI", lblName: "Nom", btnLogin: "Entrar",
        loginErrorDni: "DNI incorrecte", loginErrorName: "Falta el nom",
        navNew: "Nova Proposta", navList: "Propostes", navLive: "Directe", navLegal: "Marc Legal", navLogout: "Sortir",
        formTitle: "Propostes Ciutadanes", formDesc: "Envia la teva idea...",
        phProposal: "Escriu aquí...", btnSubmit: "Enviar",
        listTitle: "Llistat", linksTitle: "Marc Legal", successMsg: "Enviat!", btnBack: "Tornar",
        tvConnecting: "CONTACTANT GOOGLE GEMINI...", 
        tvWait: "Esperant propostes...",
        aiLabel: "GEMINI ESTÀ ANALITZANT:"
    },
    ES: { loginTitle: "ACCESO", navLive: "Directo", tvConnecting: "CONTACTANDO GEMINI...", aiLabel: "GEMINI ANALIZANDO:" },
    EN: { loginTitle: "LOGIN", navLive: "Live", tvConnecting: "CONTACTING GEMINI...", aiLabel: "GEMINI ANALYZING:" }
};

const linksData = [
    { title: "Llei Protecció Dades", desc: "BOE", url: "https://www.boe.es" }
];

function setLang(lang) {
    activeLang = lang;
    const t = translations[lang] || translations['CA'];
    
    document.getElementById('nav-live').innerText = t.navLive;
    document.getElementById('form-title').innerText = t.formTitle;
    
    const label = document.querySelector('.ai-label');
    if(label) label.innerText = t.aiLabel;
    
    if (!document.getElementById('screen-list').classList.contains('hidden')) loadProposalsList();
}

// 2. NAVEGACIÓ
function navTo(screenName) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    let target = document.getElementById('screen-' + screenName);
    if(target) target.classList.remove('hidden');

    if (screenName !== 'login') {
        document.getElementById('navbar').classList.remove('hidden');
    } else {
        document.getElementById('navbar').classList.add('hidden');
    }

    if(screenName === 'live') {
        startGeminiLive(); // Arrenquem la connexió real
    } else {
        clearInterval(tickerInterval);
    }
}

// 3. LOGIN & SAVE
function tryLogin() {
    const name = document.getElementById('nameInput').value;
    if(name) {
        currentUser.name = name;
        currentUser.dni = document.getElementById('dniInput').value;
        document.getElementById('user-display').innerText = name;
        navTo('form');
    }
}

function logout() { navTo('login'); }

function saveProposal() {
    const text = document.getElementById('proposalText').value.trim();
    if (!text) return;

    const newProp = { id: Date.now(), dni: currentUser.dni, name: currentUser.name, text: text, lang: activeLang };
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    db.unshift(newProp);
    localStorage.setItem('propostes_db', JSON.stringify(db));
    
    document.getElementById('proposalText').value = "";
    navTo('success');
}

function loadProposalsList() {
    const container = document.getElementById('proposals-container');
    container.innerHTML = "";
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    db.forEach(p => {
        container.innerHTML += `<div class="proposal-card"><b>${p.name}:</b> <br> ${p.text}</div>`;
    });
}

function loadLinksList() { /* ... */ }


// ==========================================
// 5. CONNEXIÓ REAL AMB GOOGLE GEMINI (SENSE SIMULADORS)
// ==========================================

function startGeminiLive() {
    const headElem = document.getElementById('tv-headline-text');
    const bodyElem = document.getElementById('tv-analysis-text');
    const idElem = document.getElementById('prop-id');
    const t = translations[activeLang] || translations['CA'];

    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");

    if (db.length === 0) {
        headElem.innerText = "NO HI HA PROPOSTES";
        bodyElem.innerText = "Escriu una nova proposta per veure la IA en acció.";
        return;
    }

    let index = 0;

    async function runCycle() {
        if (document.getElementById('screen-live').classList.contains('hidden')) return;

        const originalText = db[index].text;
        
        // ESTAT: PENSANT
        headElem.innerText = t.tvConnecting; 
        headElem.style.color = "#00f2ff";
        bodyElem.innerHTML = "Enviant dades a Google Cloud...";
        idElem.innerText = db[index].id.toString().slice(-4);

        try {
            // CRIDA REAL A LA API
            const aiResponse = await callGeminiAPI(originalText);
            
            // SI ARRIBEM AQUÍ, LA IA HA RESPOST BÉ
            headElem.style.opacity = 0;
            bodyElem.style.opacity = 0;

            setTimeout(() => {
                headElem.innerText = aiResponse.titular;
                headElem.style.color = "white";
                bodyElem.innerText = aiResponse.analisi;
                
                headElem.style.opacity = 1;
                bodyElem.style.opacity = 1;
            }, 500);

        } catch (error) {
            // SI FALLA, MOSTREM L'ERROR REAL
            console.error("Error Gemini:", error);
            headElem.innerText = "ERROR DE CONNEXIÓ";
            headElem.style.color = "red";
            bodyElem.innerText = `No s'ha pogut connectar amb Google Gemini. Causa: ${error.message}. Verifica la Clau API.`;
        }

        index = (index + 1) % db.length;
    }

    runCycle();
    if (tickerInterval) clearInterval(tickerInterval);
    tickerInterval = setInterval(runCycle, 15000);
}

// FUNCIÓ QUE PARLA AMB GOOGLE
async function callGeminiAPI(userText) {
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes("ENGANXA")) {
        throw new Error("Clau API no configurada");
    }

    const prompt = `
        Ets un periodista expert.
        Analitza la proposta: "${userText}".
        
        TASCA:
        1. Crea un TITULAR curt i impactant (màx 8 paraules).
        2. Crea un DESENVOLUPAMENT formal (30-40 paraules) explicant la proposta.

        IMPORTANT: Respon NOMÉS en format JSON pur, sense blocs de codi markdown.
        Format esperat: { "titular": "...", "analisi": "..." }
    `;

    // URL DEL MODEL ESTÀNDARD (gemini-1.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!response.ok) {
        // Si Google retorna error (400, 403, 404, 500)
        throw new Error(`Error HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extreiem el text
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) throw new Error("Google no ha retornat text.");

    // Netegem el JSON
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(textResult);
}