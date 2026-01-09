// ==========================================
// DADES GLOBALS
// ==========================================
let currentUser = { dni: "", name: "" };
let activeLang = "CA";
let tickerInterval = null;

// 1. TRADUCCIONS
const translations = {
    CA: {
        navLive: "Directe", formTitle: "Propostes", 
        tvConnecting: "CONNECTANT AMB LA IA...", 
        aiLabel: "S'ESTÀ COMENTANT:" 
    },
    ES: { navLive: "Directo", formTitle: "Propuestas", tvConnecting: "CONECTANDO...", aiLabel: "COMENTANDO:" },
    EN: { navLive: "Live", formTitle: "Proposals", tvConnecting: "CONNECTING...", aiLabel: "DISCUSSING:" }
};

function setLang(lang) {
    activeLang = lang;
    const t = translations[lang];
    document.getElementById('nav-live').innerText = t.navLive;
    document.querySelector('.ai-label').innerText = t.aiLabel;
    if (!document.getElementById('screen-list').classList.contains('hidden')) loadProposalsList();
}

// 2. NAVEGACIÓ
function navTo(screenName) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    document.getElementById('screen-' + screenName).classList.remove('hidden');
    
    if (screenName !== 'login') document.getElementById('navbar').classList.remove('hidden');
    else document.getElementById('navbar').classList.add('hidden');

    if(screenName === 'live') startLiveMode();
    else clearInterval(tickerInterval);
    
    if(screenName === 'list') loadProposalsList();
}

// 3. LOGICA BÀSICA
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
    const newProp = { id: Date.now(), dni: currentUser.dni, name: currentUser.name, text: text };
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

// ==========================================
// 4. CONNEXIÓ AL BACKEND (api/gemini.js)
// ==========================================

function startLiveMode() {
    const headElem = document.getElementById('tv-headline-text');
    const bodyElem = document.getElementById('tv-analysis-text');
    const idElem = document.getElementById('prop-id');
    const t = translations[activeLang];
    
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");

    if (db.length === 0) {
        headElem.innerText = "NO HI HA DADES";
        bodyElem.innerText = "Crea una proposta per començar.";
        return;
    }

    let index = 0;

    async function runCycle() {
        if (document.getElementById('screen-live').classList.contains('hidden')) return;

        const originalText = db[index].text;
        idElem.innerText = db[index].id.toString().slice(-4);
        
        // ESTAT: PENSANT
        headElem.innerText = t.tvConnecting;
        headElem.style.color = "#00f2ff";
        bodyElem.innerHTML = "Enviant dades al núvol...";

        try {
            // AQUI ESTÀ LA CLAU: Truquem al teu fitxer api/gemini.js
            // Això només funcionarà quan estigui pujat a Vercel
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: originalText })
            });

            if (!response.ok) throw new Error(`Error Backend: ${response.status}`);

            const aiResponse = await response.json();
            
            // MOSTRAR RESULTAT
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
            console.error(error);
            headElem.innerText = "ERROR DE CONNEXIÓ";
            headElem.style.color = "red";
            bodyElem.innerText = "Si estàs en local, assegura't d'usar 'vercel dev'. Si estàs en producció, revisa els logs.";
        }

        index = (index + 1) % db.length;
    }

    runCycle();
    if (tickerInterval) clearInterval(tickerInterval);
    tickerInterval = setInterval(runCycle, 60000);
}