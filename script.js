let currentUser = { dni: "", name: "" };
let activeLang = "CA";
let tickerInterval = null;
let currentProposalIndex = 0;

// ==========================================
// 🔴 DADES DE DEMOSTRACIÓ (ESCRIU AQUÍ EL TEU GUIÓ)
// ==========================================
const demoData = [
    {
        name: "Marc Vila",
        headline: "LLOGUER DIGNE A BARCELONA",
        text: "Estic desesperat. Destino el 60% del meu sou de professor a pagar el lloguer i ara el propietari em vol fer fora per posar el pis com a lloguer de temporada. Exigeixo que l'Ajuntament i la Generalitat actuïn d'una vegada: vull que es prohibeixi aquest frau de llei dels lloguers temporals que ens expulsa dels nostres barris i demano que es limitin els preus de veritat. No vull haver de marxar de la meva ciutat perquè no puc pagar un sostre.",
        govResponse: "L'Equip Administratiu, conscient de l'emergència habitacional, proposa una solució immediata basada en tres eixos. En primer lloc, L'Equip Administratiu aprovarà un decret llei que equipara el lloguer de temporada al d'habitatge habitual en zones tensionades. En segon lloc, L'Equip Administratiu mobilitzarà sòl públic per a la construcció industrialitzada d'habitatges de lloguer social. Finalment, s'implementarà un règim sancionador sever per als qui incompleixin l'índex de preus.",
        status: "pending",
        date: "02/01/2026",
        time: "09:30h"
    },
    {
        name: "María Pilar Gómez",
        headline: "IGUALTAT PER L'ESPANYA BUIDA",
        text: "Visc a un poble de 80 habitants i em sento ciutadana de segona. Han tancat l'últim caixer automàtic i només tinc un autobús al dia per anar al metge, que passa a hores impossibles. Demano, per dignitat, que se'ns garanteixi transport a demanda i serveis bàsics a menys de 30 minuts de casa meva. Pago els mateixos impostos que algú de Madrid, vull els mateixos drets.",
        govResponse: "Per abordar el repte demogràfic, L'Equip Administratiu llança el 'Pla de Cohesió Territorial 2026'. L'Equip Administratiu proposa instaurar un sistema de transport a demanda que connectarà qualsevol llogaret amb la capital de comarca en menys de 45 minuts. Així mateix, L'Equip Administratiu garantirà per llei la presència d'oficines mòbils multiservei amb freqüència setmanal a tots els municipis de menys de 500 habitants.",
        status: "pending",
        date: "15/12/2025",
        time: "10:15h"
    },
    {
        name: "Laura Sánchez",
        headline: "SALUT MENTAL PÚBLICA JA",
        text: "No puc més amb la meva ansietat i la Seguretat Social m'ha donat hora amb el psicòleg per d'aquí a 6 mesos. Això és una burla. Demano que es contractin més psicòlegs a la sanitat pública urgentment. No tinc diners per pagar-me una consulta privada cada setmana i necessito ajuda ara, no quan ja sigui massa tard. La salut mental hauria de ser una prioritat, no un luxe.",
        govResponse: "L'Equip Administratiu reconeix la saturació del sistema i anuncia un xoc d'inversió. L'Equip Administratiu proposa la incorporació immediata de 2.000 places de psicòlegs clínics als Centres d'Atenció Primària, amb l'objectiu de reduir l'espera a un màxim de 15 dies. Addicionalment, L'Equip Administratiu crearà unitats d'intervenció ràpida en crisis per a joves, accessibles sense necessitat de derivació prèvia.",
        status: "pending",
        date: "10/11/2025",
        time: "11:00h"
    },
    {
        name: "Antonio Heredia",
        headline: "AIGUA PER A L'AGRICULTURA",
        text: "Se'm trenca l'ànima veient com se m'assequen els arbres mentre els hotels de la costa tenen les piscines plenes i els camps de golf verds. Demano justícia en el repartiment de l'aigua. Necessito que es facin les obres hidràuliques que porten anys prometent i que es talli l'aigua al turisme abans que a l'agricultura, perquè sense nosaltres no hi ha menjar.",
        govResponse: "Davant la sequera estructural, L'Equip Administratiu acorda un pla d'emergència hídrica. L'Equip Administratiu proposa la instal·lació urgent de dessaladores portàtils per abastir el consum humà i turístic, alliberant recursos per a l'ús agrícola. A més, L'Equip Administratiu decreta l'obligatorietat de l'ús d'aigües regenerades per al reg de camps de golf, sancionant l'ús d'aigua potable per a fins no essencials.",
        status: "pending",
        date: "20/08/2025",
        time: "14:00h"
    },
    {
        name: "Vicente Ferrer",
        headline: "ATENCIÓ PRESENCIAL MAJORS",
        text: "Tinc 78 anys i em sento inútil quan vaig al banc o a Hisenda i em diuen que m'he de baixar una aplicació. No entenc de mòbils i no vull dependre dels meus fills. Exigeixo una llei que m'asseguri que una persona m'atendrà cara a cara. Vull poder treure els meus diners o fer tràmits parlant amb algú, no amb una màquina que no m'entén.",
        govResponse: "Per garantir la inclusió financera i administrativa, L'Equip Administratiu aprova la 'Llei d'Atenció al Major'. L'Equip Administratiu proposa obligar per llei a totes les entitats i oficines públiques a mantenir finestretes d'atenció presencial prioritària per a majors de 65 anys. Així mateix, L'Equip Administratiu prohibirà l'exclusivitat digital per a tràmits essencials, assegurant sempre un canal telefònic humà.",
        status: "pending",
        date: "05/01/2026",
        time: "11:45h"
    },
{
        name: "Lucía Fernández",
        headline: "BECARIS PAGATS JA",
        text: "He acabat la carrera i el màster, però porto dos anys encadenant pràctiques 'formatives' on faig la feina d'un empleat sense cobrar ni un euro. No puc independitzar-me ni viure dignament. Exigeixo que es prohibeixin les pràctiques extracurriculars gratuïtes i que s'obligui a les empreses a pagar-nos un sou digne des del primer dia. No som mà d'obra barata, som el futur.",
        govResponse: "Per acabar amb la precarietat juvenil, L'Equip Administratiu aprovarà de manera urgent l''Estatut del Becari'. L'Equip Administratiu proposa obligar a remunerar totes les pràctiques no laborals amb almenys el Salari Mínim Interprofessional proporcional i cotitzar a la Seguretat Social. A més, L'Equip Administratiu sancionarà les empreses que utilitzin estudiants per cobrir llocs estructurals.",
        status: "pending",
        date: "12/01/2026",
        time: "09:00h"
    },
    {
        name: "Jordi Soler",
        headline: "RODALIES DIGNE I PUNTUAL",
        text: "Estic fart de demanar perdó al meu cap per arribar tard. Cada dia agafo el tren per anar a treballar i cada dia hi ha una incidència, un retard o un tren que no passa. Els vagons són vells i estem amuntegats. Demano inversió real ja, no promeses. Vull un servei públic fiable que em permeti arribar a casa a una hora decent i no perdre la meva feina.",
        govResponse: "Conscients del dèficit històric en infraestructures, L'Equip Administratiu activa el 'Pla de Xoc Ferroviari'. L'Equip Administratiu proposa la compra immediata de nous combois per renovar la flota obsoleta i la contractació de personal de manteniment per torns de 24 hores. Així mateix, L'Equip Administratiu establirà un sistema de devolució automàtica de l'import del bitllet per retards superiors a 15 minuts.",
        status: "pending",
        date: "08/02/2026",
        time: "08:15h"
    },
    {
        name: "Carlos Ruiz",
        headline: "QUOTA D'AUTÒNOMS JUSTA",
        text: "Sóc dissenyador gràfic freelance i hi ha mesos que no facturo gairebé res, però la quota d'autònoms me la cobren igual. Si em poso malalt, el meu negoci s'atura i no tinc protecció real. Demano que la quota sigui realment proporcional als meus ingressos nets del mes i que, si no guanyo res, no pagui res. Vull tenir els mateixos drets a l'atur i a la baixa que un assalariat.",
        govResponse: "L'Equip Administratiu vol protegir el teixit emprenedor amb la nova reforma del RETA. L'Equip Administratiu proposa un sistema de 'Quota Zero' per als mesos on els ingressos no superin el Salari Mínim. A més, L'Equip Administratiu equipararà les prestacions per cessament d'activitat (atur dels autònoms) amb les dels treballadors per compte d'altri, eliminant burocràcia per al seu cobrament.",
        status: "pending",
        date: "22/01/2026",
        time: "16:30h"
    },
    {
        name: "Maite Otxoa",
        headline: "RENOVABLES SÍ, AIXÍ NO",
        text: "Estan projectant un macro-parc eòlic just davant del meu poble, destrossant el paisatge i l'ecosistema del que vivim pel turisme rural. Volem energia verda, però no a costa de sacrificar el món rural per al benefici de les grans elèctriques. Demano que els veïns tinguem veu i vot en la ubicació d'aquests projectes i que es protegeixin les zones d'alt valor natural.",
        govResponse: "L'Equip Administratiu aposta per una transició energètica justa i democràtica. L'Equip Administratiu proposa una moratòria en l'autorització de macro-projectes per revisar l'ordenació territorial. L'Equip Administratiu obligarà a que els projectes renovables tinguin participació local comunitària, assegurant que un percentatge dels beneficis de l'energia generada es quedi directament al municipi afectat.",
        status: "pending",
        date: "30/11/2025",
        time: "12:00h"
    },
    {
        name: "Elena Martínez",
        headline: "CONCILIACIÓ FAMILIAR REAL",
        text: "És impossible criar els meus fills si surto de treballar a les 19:00h i l'escola acaba a les 16:30h. No vull haver de triar entre la meva carrera professional i ser mare. Exigeixo horaris laborals racionals, jornada intensiva i que l'administració garanteixi activitats extraescolars públiques i gratuïtes per cobrir la franja de la tarda. Estem esgotades.",
        govResponse: "Per garantir el dret a les cures i al treball, L'Equip Administratiu impulsa la 'Llei de Temps corresponsables'. L'Equip Administratiu proposa la reducció de la jornada laboral a 37,5 hores setmanals sense reducció de sou i incentius fiscals per a les empreses que apliquin jornada contínua. A més, L'Equip Administratiu finançarà una xarxa pública d'activitats de tarda als col·legis per cobrir l'horari fins a les 19:00h.",
        status: "pending",
        date: "14/01/2026",
        time: "19:45h"
    },
    {
        name: "Carme Riera",
        headline: "AJUDA DEPENDÈNCIA URGENT",
        text: "La meva mare té Alzheimer avançat i fa 18 mesos que tenim reconegut el Grau III, però l'ajuda econòmica no arriba. Estic pagant una cuidadora amb els estalvis que s'acaben. És inhumà que els nostres grans morin esperant un paper. Demano que el pagament sigui automàtic des del moment del diagnòstic i que s'elimini la burocràcia que ens ofega en el pitjor moment de la vida.",
        govResponse: "Per dignificar l'atenció als nostres majors, L'Equip Administratiu posa en marxa el 'Pla de Xoc de la Dependència'. L'Equip Administratiu proposa simplificar el tràmit a una única gestió per garantir que la prestació es cobri en un màxim de 30 dies des de la sol·licitud. A més, L'Equip Administratiu augmentarà les quanties de les prestacions econòmiques per cures a l'entorn familiar.",
        status: "pending",
        date: "03/02/2026",
        time: "10:30h"
    },
    {
        name: "Alejandro Mola",
        headline: "PLACES PÚBLIQUES FP",
        text: "Vull estudiar Informàtica i m'he quedat sense plaça a l'institut públic tot i tenir bona nota. Érem 300 persones per a 30 places. L'única opció que em donen és anar a un centre privat que costa 400 euros al mes, i els meus pares no s'ho poden permetre. Demano que si falten informàtics al mercat, l'Estat garanteixi places públiques d'FP per a tothom.",
        govResponse: "Davant l'alta demanda de formació tècnica, L'Equip Administratiu anuncia l'ampliació històrica de l'oferta d'FP. L'Equip Administratiu proposa la creació immediata de 50.000 noves places públiques en els cicles amb major ocupabilitat per al proper curs. Així mateix, L'Equip Administratiu establirà convenis amb empreses tecnològiques per utilitzar les seves instal·lacions com a centres formatius duals.",
        status: "pending",
        date: "10/09/2025",
        time: "17:00h"
    },
    {
        name: "Montserrat Puig",
        headline: "TRAVES A L'AUTOCONSUM",
        text: "Vaig instal·lar plaques solars fa 8 mesos per ser més sostenible i estalviar, però la companyia elèctrica i l'administració es passen la pilota i encara no tinc la instal·lació legalitzada ni puc abocar l'excedent a la xarxa. Prou de posar bastons a les rodes. Demano que la legalització sigui automàtica i que es castigui les elèctriques que bloquegen l'autoconsum.",
        govResponse: "Per accelerar la transició energètica, L'Equip Administratiu aprova el reglament de 'Simplificació de l'Autoconsum'. L'Equip Administratiu proposa establir el silenci administratiu positiu: si en 15 dies no hi ha resposta, la instal·lació es considera legalitzada. A més, L'Equip Administratiu sancionarà amb multes diàries a les distribuïdores que retardin injustificadament l'activació de l'abocament d'excedents.",
        status: "pending",
        date: "25/01/2026",
        time: "13:15h"
    },
    {
        name: "David Serrano",
        headline: "STOP ASSETJAMENT ESCOLAR",
        text: "El meu fill té por d'anar a l'escola. Fa mesos que pateix insults i empentes, i el centre només em diu que 'són coses de nens' i que no poden fer-hi res. Necessitem protecció real. Demano que hi hagi una figura externa a l'escola que intervingui immediatament i que els protocols anti-assetjament siguin d'obligat compliment, amb conseqüències per als centres que miren cap a una altra banda.",
        govResponse: "Amb l'objectiu de tolerància zero a les aules, L'Equip Administratiu implanta la figura del 'Coordinador de Benestar i Protecció' independent. L'Equip Administratiu proposa que aquest professional, extern al claustre de professors, tingui potestat per activar protocols d'urgència. A més, L'Equip Administratiu crearà una aplicació anònima nacional perquè alumnes i famílies puguin denunciar casos directament a inspecció educativa.",
        status: "pending",
        date: "15/11/2025",
        time: "09:45h"
    },
    {
        name: "Sofía Vargas",
        headline: "CIUTATS SENSE BARRERES",
        text: "Vaig en cadira de rodes i sortir al carrer és una odissea. Voreres estretes sense rebaixar, ascensors del metro espatllats setmana rere setmana i botigues amb graons a l'entrada. Em sento presonera a la meva pròpia ciutat. Exigeixo que es compleixi la llei d'accessibilitat universal d'una vegada i que l'Ajuntament arregli els carrers abans de fer obres faraòniques innecessàries.",
        govResponse: "Per garantir la lliure mobilitat de tots els ciutadans, L'Equip Administratiu llança el 'Fons Estatal d'Accessibilitat Universal'. L'Equip Administratiu proposa finançar al 100% les obres d'eliminació de barreres arquitectòniques en via pública i transport. Així mateix, L'Equip Administratiu endurirà les sancions als ajuntaments i empreses de transport que no garanteixin itineraris accessibles en tots els seus serveis.",
        status: "pending",
        date: "04/01/2026",
        time: "11:20h"
    }
];

// FUNCIÓ PER CARREGAR DADES SI ESTÀ BUIT
function initDemoData() {
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    if (db.length === 0) {
        // Si no hi ha dades, carreguem les de la demo
        localStorage.setItem('propostes_db', JSON.stringify(demoData));
        console.log("Dades de demo carregades!");
        // Recarreguem la pàgina per veure-ho
        location.reload();
    }
}
// EXECUTAR AL PRINCIPI
initDemoData();

// URL dels documents
const linksURLs = [
    "https://www.ftc.gov/system/files/documents/cases/182_3109_facebook_order_filed_7-24-19.pdf",
    "https://publications.parliament.uk/pa/cm201719/cmselect/cmcumeds/1791/1791.pdf",
    "https://www.boe.es/boe/dias/2019/06/24/pdfs/BOE-A-2019-9509.pdf",
    "https://www.intelligence.senate.gov/wp-content/uploads/2024/08/sites-default-files-documents-report-volume2.pdf"
];

// TRADUCCIONS
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
        defaultUser: "Usuari", btnLogout: "Tancar sessió",

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
        defaultUser: "Usuario", btnLogout: "Cerrar sesión",

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
        defaultUser: "User", btnLogout: "Log out",

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
    
    // LOGIN & FORM
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

    // ACTUALITZAR USUARI (CORRECCIÓ 2)
    const userDisplay = document.getElementById('user-display');
    if (currentUser.name) {
        userDisplay.innerText = currentUser.name; // Si està loguejat, mostra el nom
    } else {
        userDisplay.innerText = t.defaultUser; // Si no, "Usuari" en l'idioma correcte
    }
    document.querySelector('.logout-btn').innerText = t.btnLogout;

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('lang-' + lang.toLowerCase()).classList.add('active');

    if (!document.getElementById('screen-list').classList.contains('hidden')) loadProposalsList();
    if (!document.getElementById('screen-links').classList.contains('hidden')) loadLinks();
    
    if (!document.getElementById('screen-live').classList.contains('hidden')) {
         let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
         if (db.length === 0) {
             document.getElementById('tv-headline-text').innerText = t.monitorHeadline;
             document.getElementById('tv-proposal-text').innerText = t.citizenWait;
             document.getElementById('tv-gov-text').innerText = t.govWait;
         } else {
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
    if(name) { 
        currentUser.name = name; 
        currentUser.dni = document.getElementById('dniInput').value; 
        
        // CORRECCIÓ 2: Actualitzar nom al moment
        document.getElementById('user-display').innerText = name;
        
        navTo('form'); 
    }
}

function logout() { 
    currentUser = { dni: "", name: "" }; // Reset user
    navTo('login'); 
    setLang(activeLang); // Restaurar text "Usuari"
}

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
        
        // Traduccions
        text_ca: text, text_es: textES, text_en: textEN,
        
        // 🔴 AQUI EDITES EL QUE SURT AL DIRECTE QUAN ESCRIUS AL FORMULARI
        headline: "PROPOSTA D'ÚLTIMA HORA",  // Titular genèric per noves entrades
        govResponse: "Aquesta proposta està sent avaluada pels tècnics municipals en aquests moments.", // Resposta genèrica
        
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
            headElem.innerText = (p.headline || p.name).toUpperCase();
            
            let displayText = p['text_' + activeLang.toLowerCase()] || p.text_ca || p.text;
            propTextElem.innerText = displayText;

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