let currentUser = { dni: "", name: "" };
let activeLang = "CA";
let tickerInterval = null;
let currentProposalIndex = 0;

// ==========================================
// 🔴 DADES DE DEMOSTRACIÓ (15 PROPOSTES COMPLETES I TRADUÏDES)
// ==========================================
const demoData = [
    {
        id: 1736520007,
        name: "Jordi Soler",
        headline: "RODALIES DIGNE I PUNTUAL",
        headline_es: "RODALIES DIGNO Y PUNTUAL",
        headline_en: "RELIABLE COMMUTER TRAINS",
        text: "Estic fart de demanar perdó al meu cap per arribar tard. Cada dia agafo el tren per anar a treballar i cada dia hi ha una incidència, un retard o un tren que no passa. Els vagons són vells i estem amuntegats. Demano inversió real ja, no promeses. Vull un servei públic fiable que em permeti arribar a casa a una hora decent i no perdre la meva feina.",
        text_es: "Estoy harto de pedir perdón a mi jefe por llegar tarde. Cada día cojo el tren y cada día hay una incidencia. Los vagones son viejos. Pido inversión real ya, no promesas. Quiero un servicio público fiable que me permita llegar a casa a una hora decente.",
        text_en: "I'm sick of apologizing to my boss for being late. Every day I take the train and every day there is an incident. The cars are old. I ask for real investment now, not promises. I want a reliable public service that allows me to get home at a decent time.",
        govResponse: "Conscients del dèficit històric en infraestructures, L'Equip Administratiu activa el 'Pla de Xoc Ferroviari'. L'Equip Administratiu proposa la compra immediata de nous combois per renovar la flota obsoleta i la contractació de personal de manteniment per torns de 24 hores. Així mateix, L'Equip Administratiu establirà un sistema de devolució automàtica de l'import del bitllet per retards superiors a 15 minuts.",
        gov_es: "Conscientes del déficit histórico, se activa el 'Plan de Choque Ferroviario'. Se propone la compra inmediata de nuevos convoyes y la contratación de personal de mantenimiento 24 horas. Asimismo, se establecerá un sistema de devolución automática del importe del billete por retrasos superiores a 15 minutos.",
        gov_en: "Aware of the historical infrastructure deficit, the 'Railway Shock Plan' is activated. It is proposed to immediately purchase new trains to renew the obsolete fleet and hire maintenance staff for 24-hour shifts. Likewise, an automatic ticket refund system for delays over 15 minutes will be established.",
        votes: { for: 90, against: 5, abstain: 5 },
        status: "pending", date: "08/02/2026", time: "08:15h"
    },
    {
        id: 1736520016,
        name: "Manuel Ortiz",
        headline: "JUBILACIÓ DIGNE FEINES DURES",
        headline_es: "JUBILACIÓN DIGNA TRABAJOS DUROS",
        headline_en: "DECENT RETIREMENT HARD LABOR",
        text: "Tinc 61 anys i porto des dels 18 treballant a la construcció. Tinc l'esquena destrossada i els genolls no m'aguanten, però em diuen que he de treballar fins als 67. Això és una condemna a mort. Demano que les professions amb gran desgast físic tinguin coeficients reductors per jubilar-nos abans sense perdre pensió. No som màquines, el cos té un límit.",
        text_es: "Tengo 61 años y llevo desde los 18 en la construcción. Tengo la espalda destrozada. Pido que las profesiones con gran desgaste físico tengan coeficientes reductores para jubilarnos antes sin perder pensión.",
        text_en: "I am 61 and have been in construction since 18. My back is destroyed. I demand that physically demanding professions have reduction coefficients to retire earlier without losing pension.",
        govResponse: "L'Equip Administratiu reformarà el sistema de pensions per reconèixer la penositat laboral. Proposa aplicar coeficients reductors a nous sectors amb elevat índex de sinistralitat i permetre la jubilació anticipada als 60 anys amb el 100% de la base per a treballadors amb més de 25 anys en oficis d'alt desgast.",
        gov_es: "El Equipo Administrativo reformará el sistema de pensiones para reconocer la penosidad. Propone aplicar coeficientes reductores a nuevos sectores y permitir la jubilación anticipada a los 60 años con el 100% de la base para trabajadores con más de 25 años en oficios de alto desgaste.",
        gov_en: "The Administration will reform the pension system to recognize labor hardship. It proposes applying reduction coefficients to new sectors and allowing early retirement at 60 with 100% benefits for workers with over 25 years in high-wear trades.",
        votes: { for: 85, against: 10, abstain: 5 },
        status: "pending", date: "05/02/2026", time: "08:50h"
    },
    {
        id: 1736520011,
        name: "Carme Riera",
        headline: "AJUDA DEPENDÈNCIA URGENT",
        headline_es: "AYUDA DEPENDENCIA URGENTE",
        headline_en: "URGENT DEPENDENCY AID",
        text: "La meva mare té Alzheimer avançat i fa 18 mesos que tenim reconegut el Grau III, però l'ajuda econòmica no arriba. Estic pagant una cuidadora amb els estalvis que s'acaben. És inhumà que els nostres grans morin esperant un paper. Demano que el pagament sigui automàtic des del moment del diagnòstic i que s'elimini la burocràcia que ens ofega en el pitjor moment de la vida.",
        text_es: "Mi madre tiene Alzheimer avanzado y hace 18 meses que esperamos la ayuda. Es inhumano. Pido que el pago sea automático desde el momento del diagnóstico y que se elimine la burocracia que nos ahoga.",
        text_en: "My mother has advanced Alzheimer's and we have been waiting for aid for 18 months. It is inhumane. I ask that payment be automatic from the moment of diagnosis and that the bureaucracy that drowns us be eliminated.",
        govResponse: "Per dignificar l'atenció als nostres majors, L'Equip Administratiu posa en marxa el 'Pla de Xoc de la Dependència'. L'Equip Administratiu proposa simplificar el tràmit a una única gestió per garantir que la prestació es cobri en un màxim de 30 dies des de la sol·licitud. A més, L'Equip Administratiu augmentarà les quanties de les prestacions econòmiques per cures a l'entorn familiar.",
        gov_es: "Para dignificar la atención a nuestros mayores, se pone en marcha el 'Plan de Choque de la Dependencia'. Se propone simplificar el trámite para garantizar el cobro en un máximo de 30 días. Además, se aumentarán las cuantías de las prestaciones económicas.",
        gov_en: "To dignify care for our elders, the 'Dependency Shock Plan' is launched. It is proposed to simplify the process to a single step to guarantee payment within 30 days. In addition, the amounts of economic benefits for family care will be increased.",
        votes: { for: 96, against: 2, abstain: 2 },
        status: "pending", date: "03/02/2026", time: "10:30h"
    },
    {
        id: 1736520013,
        name: "Montserrat Puig",
        headline: "TRAVES A L'AUTOCONSUM",
        headline_es: "TRABAS AL AUTOCONSUMO",
        headline_en: "OBSTACLES TO SELF-CONSUMPTION",
        text: "Vaig instal·lar plaques solars fa 8 mesos per ser més sostenible i estalviar, però la companyia elèctrica i l'administració es passen la pilota i encara no tinc la instal·lació legalitzada ni puc abocar l'excedent a la xarxa. Prou de posar bastons a les rodes. Demano que la legalització sigui automàtica i que es castigui les elèctriques que bloquegen l'autoconsum.",
        text_es: "Instalé placas solares hace 8 meses pero la compañía eléctrica y la administración se pasan la pelota. Basta de poner palos en las ruedas. Pido que la legalización sea automática y que se castigue a las eléctricas que bloquean el autoconsumo.",
        text_en: "I installed solar panels 8 months ago but the electric company and the administration keep passing the buck. Enough obstacles. I ask that legalization be automatic and that electric companies blocking self-consumption be punished.",
        govResponse: "Per accelerar la transició energètica, L'Equip Administratiu aprova el reglament de 'Simplificació de l'Autoconsum'. L'Equip Administratiu proposa establir el silenci administratiu positiu: si en 15 dies no hi ha resposta, la instal·lació es considera legalitzada. A més, L'Equip Administratiu sancionarà amb multes diàries a les distribuïdores que retardin injustificadament l'activació de l'abocament d'excedents.",
        gov_es: "Para acelerar la transición energética, se aprueba el reglamento de 'Simplificación del Autoconsumo'. Se propone establecer el silencio administrativo positivo en 15 días. Además, se sancionará con multas diarias a las distribuidoras que retrasen la activación.",
        gov_en: "To accelerate the energy transition, the 'Self-Consumption Simplification' regulation is approved. It is proposed to establish positive administrative silence: if there is no response in 15 days, the installation is considered legalized. In addition, distributors delaying activation will be fined daily.",
        votes: { for: 80, against: 10, abstain: 10 },
        status: "pending", date: "25/01/2026", time: "13:15h"
    },
    {
        id: 1736520020,
        name: "Jaume Bosch",
        headline: "BOSCOS NETS A L'HIVERN",
        headline_es: "BOSQUES LIMPIOS EN INVIERNO",
        headline_en: "CLEAN FORESTS IN WINTER",
        text: "Cada estiu plorem quan es crema el bosc, però a l'hivern ningú fa res. Els boscos estan bruts, plens de sotabosc que és gasolina pura. Demano que es contractin les brigades forestals tot l'any, no només a l'estiu per apagar focs. Necessitem gestió forestal preventiva i aprofitar aquesta biomassa per fer energia, generant feina a les zones rurals.",
        text_es: "Cada verano lloramos cuando se quema el bosque, pero en invierno nadie hace nada. Pido que se contraten las brigadas forestales todo el año. Necesitamos gestión forestal preventiva y aprovechar esta biomasa para hacer energía.",
        text_en: "Every summer we cry when the forest burns, but in winter nobody does anything. I demand that forest brigades be hired all year round. We need preventive forest management and to use this biomass for energy.",
        govResponse: "L'Equip Administratiu canvia el model d'extinció pel de gestió preventiva. Proposa la creació del 'Fons de Gestió Forestal Sostenible', que subvencionarà la neteja de boscos durant l'hivern i fomentarà les plantes de biomassa locals.",
        gov_es: "El Equipo Administrativo cambia el modelo de extinción por el de gestión preventiva. Propone la creación del 'Fondo de Gestión Forestal Sostenible' para subvencionar la limpieza de bosques en invierno.",
        gov_en: "The Administration shifts from extinction to preventive management. It proposes creating the 'Sustainable Forest Management Fund' to subsidize forest cleaning during winter.",
        votes: { for: 88, against: 5, abstain: 7 },
        status: "pending", date: "20/01/2026", time: "16:15h"
    },
    {
        id: 1736520008,
        name: "Carlos Ruiz",
        headline: "QUOTA D'AUTÒNOMS JUSTA",
        headline_es: "CUOTA DE AUTÓNOMOS JUSTA",
        headline_en: "FAIR FREELANCE FEES",
        text: "Sóc dissenyador gràfic freelance i hi ha mesos que no facturo gairebé res, però la quota d'autònoms me la cobren igual. Si em poso malalt, el meu negoci s'atura i no tinc protecció real. Demano que la quota sigui realment proporcional als meus ingressos nets del mes i que, si no guanyo res, no pagui res. Vull tenir els mateixos drets a l'atur i a la baixa que un assalariat.",
        text_es: "Soy diseñador gráfico freelance y hay meses que no facturo casi nada, pero la cuota de autónomos me la cobran igual. Pido que la cuota sea realmente proporcional a mis ingresos netos y que, si no gano nada, no pague nada. Quiero tener los mismos derechos que un asalariado.",
        text_en: "I am a freelance graphic designer and some months I earn almost nothing, but I am charged the freelance fee anyway. I ask that the fee be truly proportional to my net monthly income and that, if I earn nothing, I pay nothing. I want the same rights as an employee.",
        govResponse: "L'Equip Administratiu vol protegir el teixit emprenedor amb la nova reforma del RETA. L'Equip Administratiu proposa un sistema de 'Quota Zero' per als mesos on els ingressos no superin el Salari Mínim. A més, L'Equip Administratiu equipararà les prestacions per cessament d'activitat (atur dels autònoms) amb les dels treballadors per compte d'altri, eliminant burocràcia per al seu cobrament.",
        gov_es: "El Equipo Administrativo quiere proteger el tejido emprendedor con la reforma del RETA. Propone un sistema de 'Cuota Cero' para meses con ingresos inferiores al Salario Mínimo. Además, equiparará las prestaciones por cese de actividad con las de los trabajadores por cuenta ajena.",
        gov_en: "The Administrative Team wants to protect the entrepreneurial fabric with the new RETA reform. It proposes a 'Zero Fee' system for months where income does not exceed the Minimum Wage. In addition, it will equate cessation of activity benefits (freelance unemployment) with those of employees.",
        votes: { for: 75, against: 15, abstain: 10 },
        status: "pending", date: "22/01/2026", time: "16:30h"
    },
    {
        id: 1736520021,
        name: "Jorge Ramírez",
        headline: "HOMOLOGACIÓ DE TÍTOLS ÀGIL",
        headline_es: "HOMOLOGACIÓN DE TÍTULOS ÁGIL",
        headline_en: "AGILE DEGREE RECOGNITION",
        text: "Sóc metge especialista amb 15 anys d'experiència al meu país, i porto 3 anys esperant que el Ministeri m'homologui el títol per poder exercir. Mentrestant, falten metges als hospitals i jo estic conduint un taxi. És un malbaratament de recursos. Demano un procés ràpid i transparent, màxim 6 mesos, per poder ajudar a descongestionar la sanitat pública.",
        text_es: "Soy médico especialista con 15 años de experiencia y llevo 3 años esperando la homologación. Faltan médicos y yo conduzco un taxi. Pido un proceso rápido, máximo 6 meses, para ayudar en la sanidad pública.",
        text_en: "I am a specialist doctor with 15 years of experience, waiting 3 years for degree recognition. Doctors are needed, yet I drive a taxi. I demand a fast process, max 6 months, to help public health.",
        govResponse: "Davant la necessitat de professionals sanitaris, L'Equip Administratiu digitalitza i accelera el procés d'homologacions. Proposa un pla de xoc per resoldre els expedients pendents en menys de 3 mesos mitjançant IA i permetre l'exercici provisional sota supervisió.",
        gov_es: "Ante la necesidad de sanitarios, se digitaliza el proceso de homologaciones. Se propone un plan de choque para resolver expedientes en menos de 3 meses mediante IA y permitir el ejercicio provisional supervisado.",
        gov_en: "Addressing the need for health professionals, the process is digitized. A shock plan is proposed to resolve pending files in under 3 months using AI and allowing provisional supervised practice.",
        votes: { for: 94, against: 2, abstain: 4 },
        status: "pending", date: "14/01/2026", time: "11:45h"
    },
    {
        id: 1736520010,
        name: "Elena Martínez",
        headline: "CONCILIACIÓ FAMILIAR REAL",
        headline_es: "CONCILIACIÓN FAMILIAR REAL",
        headline_en: "REAL FAMILY RECONCILIATION",
        text: "És impossible criar els meus fills si surto de treballar a les 19:00h i l'escola acaba a les 16:30h. No vull haver de triar entre la meva carrera professional i ser mare. Exigeixo horaris laborals racionals, jornada intensiva i que l'administració garanteixi activitats extraescolars públiques i gratuïtes per cobrir la franja de la tarda. Estem esgotades.",
        text_es: "Es imposible criar a mis hijos si salgo de trabajar a las 19:00h. No quiero tener que elegir entre mi carrera y ser madre. Exijo horarios racionales, jornada intensiva y que la administración garantice actividades extraescolares públicas y gratuitas.",
        text_en: "It is impossible to raise my children if I leave work at 7:00 PM. I don't want to have to choose between my career and being a mother. I demand rational working hours, intensive workdays, and that the administration guarantees free public extracurricular activities.",
        govResponse: "Per garantir el dret a les cures i al treball, L'Equip Administratiu impulsa la 'Llei de Temps corresponsables'. L'Equip Administratiu proposa la reducció de la jornada laboral a 37,5 hores setmanals sense reducció de sou i incentius fiscals per a les empreses que apliquin jornada contínua. A més, L'Equip Administratiu finançarà una xarxa pública d'activitats de tarda als col·legis per cobrir l'horari fins a les 19:00h.",
        gov_es: "Para garantizar el derecho a los cuidados, se impulsa la 'Ley de Tiempos corresponsables'. Se propone la reducción de la jornada a 37,5 horas semanales sin reducción de sueldo e incentivos fiscales para la jornada continua. Además, se financiará una red pública de actividades de tarde.",
        gov_en: "To guarantee the right to care and work, the 'Co-responsible Time Law' is promoted. It is proposed to reduce the working week to 37.5 hours without pay cuts and fiscal incentives for companies applying continuous workdays. In addition, a public network of afternoon activities will be funded.",
        votes: { for: 91, against: 4, abstain: 5 },
        status: "pending", date: "14/01/2026", time: "19:45h"
    },
    {
        id: 1736520006,
        name: "Lucía Fernández",
        headline: "BECARIS PAGATS JA",
        headline_es: "BECARIOS PAGADOS YA",
        headline_en: "PAID INTERNS NOW",
        text: "He acabat la carrera i el màster, però porto dos anys encadenant pràctiques 'formatives' on faig la feina d'un empleat sense cobrar ni un euro. No puc independitzar-me ni viure dignament. Exigeixo que es prohibeixin les pràctiques extracurriculars gratuïtes i que s'obligui a les empreses a pagar-nos un sou digne des del primer dia. No som mà d'obra barata, som el futur.",
        text_es: "He acabado la carrera y el máster, pero llevo dos años encadenando prácticas 'formativas' sin cobrar. Exijo que se prohíban las prácticas extracurriculares gratuitas y que se obligue a las empresas a pagarnos un sueldo digno desde el primer día. No somos mano de obra barata.",
        text_en: "I finished my degree and master's, but I've been chaining unpaid internships for two years. I demand that free extracurricular internships be banned and that companies be forced to pay us a decent wage from day one. We are not cheap labor.",
        govResponse: "Per acabar amb la precarietat juvenil, L'Equip Administratiu aprovarà de manera urgent l''Estatut del Becari'. L'Equip Administratiu proposa obligar a remunerar totes les pràctiques no laborals amb almenys el Salari Mínim Interprofessional proporcional i cotitzar a la Seguretat Social. A més, L'Equip Administratiu sancionarà les empreses que utilitzin estudiants per cobrir llocs estructurals.",
        gov_es: "Para acabar con la precariedad juvenil, se aprobará el 'Estatuto del Becario'. Se propone obligar a remunerar todas las prácticas no laborales con al menos el Salario Mínimo proporcional y cotizar a la Seguridad Social. Además, se sancionará a las empresas que utilicen estudiantes para cubrir puestos estructurales.",
        gov_en: "To end youth precariousness, the 'Intern Statute' will be urgently approved. It is proposed to mandate remuneration for all non-labor internships with at least the proportional Minimum Wage and Social Security contributions. In addition, companies using students to cover structural positions will be sanctioned.",
        votes: { for: 95, against: 2, abstain: 3 },
        status: "pending", date: "12/01/2026", time: "09:00h"
    },
    {
        id: 1736520022,
        name: "Andreu Vidal",
        headline: "PUNTS DE CÀRREGA QUE FUNCIONIN",
        headline_es: "PUNTOS DE CARGA QUE FUNCIONEN",
        headline_en: "WORKING CHARGING POINTS",
        text: "M'he comprat un cotxe elèctric fent cas al govern, però viatjar és un malson. La meitat dels carregadors públics no funcionen o necessites 20 aplicacions diferents per pagar. Demano una xarxa de càrrega ràpida fiable obligatòria a totes les benzineres i un sistema de pagament únic amb targeta de crèdit, sense apps.",
        text_es: "Me he comprado un coche eléctrico, pero viajar es una pesadilla. La mitad de cargadores no funcionan. Pido una red de carga rápida fiable obligatoria en gasolineras y pago único con tarjeta de crédito, sin apps.",
        text_en: "I bought an electric car but traveling is a nightmare. Half the chargers don't work. I demand a mandatory reliable fast charging network at all gas stations and a single credit card payment system, no apps.",
        govResponse: "L'Equip Administratiu aprova el reglament d'infraestructura de càrrega. Proposa sancionar les estacions de servei sense punts de recàrrega ràpida operatius i obligar per llei a que tots els nous punts permetin el pagament directe amb targeta bancària (contactless).",
        gov_es: "Se aprueba el reglamento de infraestructura de carga. Se sancionará a estaciones de servicio sin carga rápida operativa y se obligará al pago directo con tarjeta bancaria (contactless).",
        gov_en: "Charging infrastructure regulation approved. Service stations without operational fast charging will be sanctioned, and direct contactless card payment will be mandatory.",
        votes: { for: 82, against: 8, abstain: 10 },
        status: "pending", date: "11/01/2026", time: "08:30h"
    },
    {
        id: 1736520023,
        name: "Laia Miralles",
        headline: "MENYS ALUMNES PER AULA",
        headline_es: "MENOS ALUMNOS POR AULA",
        headline_en: "FEWER STUDENTS PER CLASS",
        text: "Sóc mare i mestra. A la classe del meu fill són 28 nens. És impossible atendre la diversitat, els nens amb necessitats especials queden aparcats i el professor només fa de policia. Demano una baixada de ràtios real per llei: màxim 20 alumnes per classe a primària i 25 a secundària.",
        text_es: "Soy madre y maestra. En clase de mi hijo son 28 niños. Es imposible atender la diversidad. Pido una bajada de ratios real por ley: máximo 20 alumnos en primaria y 25 en secundaria.",
        text_en: "I am a mother and teacher. My son's class has 28 kids. It's impossible to attend to diversity. I demand a real ratio reduction by law: max 20 students in primary and 25 in secondary.",
        govResponse: "L'Equip Administratiu aprova el decret de 'Qualitat i Ràtios'. Proposa la reducció progressiva de la ràtio a 20 alumnes a l'educació infantil i primària en 2 anys. A més, garantirà per llei la codocència en grups amb més de 3 alumnes amb necessitats especials.",
        gov_es: "Se aprueba el decreto de 'Calidad y Ratios'. Propone reducir la ratio a 20 alumnos en infantil y primaria en 2 años. Además, garantizará la codocencia en grupos con necesidades especiales.",
        gov_en: "'Quality and Ratios' decree approved. Proposes reducing ratio to 20 students in early/primary education in 2 years. Also guarantees co-teaching in groups with special needs.",
        votes: { for: 97, against: 1, abstain: 2 },
        status: "pending", date: "09/01/2026", time: "09:45h"
    },
    {
        id: 1736520005,
        name: "Vicente Ferrer",
        headline: "ATENCIÓ PRESENCIAL MAJORS",
        headline_es: "ATENCIÓN PRESENCIAL MAYORES",
        headline_en: "IN-PERSON SENIOR CARE",
        text: "Tinc 78 anys i em sento inútil quan vaig al banc o a Hisenda i em diuen que m'he de baixar una aplicació. No entenc de mòbils i no vull dependre dels meus fills. Exigeixo una llei que m'asseguri que una persona m'atendrà cara a cara. Vull poder treure els meus diners o fer tràmits parlant amb algú, no amb una màquina que no m'entén.",
        text_es: "Tengo 78 años y me siento inútil cuando voy al banco o a Hacienda y me dicen que me tengo que bajar una aplicación. No entiendo de móviles. Exijo una ley que me asegure que una persona me atenderá cara a cara. Quiero poder sacar mi dinero o hacer trámites hablando con alguien, no con una máquina.",
        text_en: "I'm 78 years old and I feel useless when I go to the bank or the tax office and they tell me I have to download an app. I don't understand mobiles. I demand a law that assures me that a person will attend to me face to face. I want to be able to withdraw my money or do paperwork talking to someone, not a machine.",
        govResponse: "Per garantir la inclusió financera i administrativa, L'Equip Administratiu aprova la 'Llei d'Atenció al Major'. L'Equip Administratiu proposa obligar per llei a totes les entitats i oficines públiques a mantenir finestretes d'atenció presencial prioritària per a majors de 65 anys. Així mateix, L'Equip Administratiu prohibirà l'exclusivitat digital per a tràmits essencials, assegurant sempre un canal telefònic humà.",
        gov_es: "Para garantizar la inclusión financiera y administrativa, se aprueba la 'Ley de Atención al Mayor'. Se propone obligar por ley a todas las entidades y oficinas públicas a mantener ventanillas de atención presencial prioritaria para mayores de 65 años. Asimismo, se prohibirá la exclusividad digital para trámites esenciales.",
        gov_en: "To guarantee financial and administrative inclusion, the 'Senior Care Law' is approved. It is proposed to require by law all entities and public offices to maintain priority in-person service counters for those over 65. Likewise, digital exclusivity for essential procedures will be prohibited.",
        votes: { for: 88, against: 5, abstain: 7 },
        status: "pending", date: "05/01/2026", time: "11:45h"
    },
    {
        id: 1736520015,
        name: "Sofía Vargas",
        headline: "CIUTATS SENSE BARRERES",
        headline_es: "CIUDADES SIN BARRERAS",
        headline_en: "CITIES WITHOUT BARRIERS",
        text: "Vaig en cadira de rodes i sortir al carrer és una odissea. Voreres estretes sense rebaixar, ascensors del metro espatllats setmana rere setmana i botigues amb graons a l'entrada. Em sento presonera a la meva pròpia ciutat. Exigeixo que es compleixi la llei d'accessibilitat universal d'una vegada i que l'Ajuntament arregli els carrers abans de fer obres faraòniques innecessàries.",
        text_es: "Voy en silla de ruedas y salir a la calle es una odisea. Aceras estrechas, ascensores averiados... Me siento prisionera. Exijo que se cumpla la ley de accesibilidad universal de una vez y que el Ayuntamiento arregle las calles antes de hacer obras faraónicas innecesarias.",
        text_en: "I use a wheelchair and going out is an ordeal. Narrow sidewalks, broken elevators... I feel like a prisoner. I demand compliance with the universal accessibility law once and for all and that the City Council fixes the streets before doing unnecessary pharaonic works.",
        govResponse: "Per garantir la lliure mobilitat de tots els ciutadans, L'Equip Administratiu llança el 'Fons Estatal d'Accessibilitat Universal'. L'Equip Administratiu proposa finançar al 100% les obres d'eliminació de barreres arquitectòniques en via pública i transport. Així mateix, L'Equip Administratiu endurirà les sancions als ajuntaments i empreses de transport que no garanteixin itineraris accessibles en tots els seus serveis.",
        gov_es: "Para garantizar la libre movilidad, se lanza el 'Fondo Estatal de Accesibilidad Universal'. Se propone financiar al 100% las obras de eliminación de barreras arquitectónicas. Asimismo, se endurecerán las sanciones a los ayuntamientos y empresas de transporte que no garanticen itinerarios accesibles.",
        gov_en: "To guarantee free mobility, the 'State Universal Accessibility Fund' is launched. It is proposed to finance 100% of the works to eliminate architectural barriers. Likewise, sanctions will be toughened for city councils and transport companies that do not guarantee accessible itineraries.",
        votes: { for: 93, against: 2, abstain: 5 },
        status: "pending", date: "04/01/2026", time: "11:20h"
    },
    {
        id: 1736520001,
        name: "Marc Vila",
        headline: "LLOGUER DIGNE A BARCELONA",
        headline_es: "ALQUILER DIGNO EN BARCELONA",
        headline_en: "DECENT RENT IN BARCELONA",
        text: "Estic desesperat. Destino el 60% del meu sou de professor a pagar el lloguer i ara el propietari em vol fer fora per posar el pis com a lloguer de temporada. Exigeixo que l'Ajuntament i la Generalitat actuïn d'una vegada: vull que es prohibeixi aquest frau de llei dels lloguers temporals que ens expulsa dels nostres barris i demano que es limitin els preus de veritat. No vull haver de marxar de la meva ciutat perquè no puc pagar un sostre.",
        text_es: "Estoy desesperado. Destino el 60% de mi sueldo de profesor a pagar el alquiler y ahora el propietario me quiere echar para poner el piso como alquiler de temporada. Exijo que el Ayuntamiento y la Generalitat actúen de una vez: quiero que se prohíba este fraude de ley de los alquileres temporales y pido que se limiten los precios de verdad. No quiero tener que irme de mi ciudad porque no puedo pagar un techo.",
        text_en: "I am desperate. I spend 60% of my teacher's salary on rent and now the landlord wants to kick me out to turn the flat into a seasonal rental. I demand that the City Council and the Government act at once: I want this legal fraud of seasonal rentals to be banned and I ask for real price limits. I don't want to have to leave my city because I can't afford a roof.",
        govResponse: "L'Equip Administratiu, conscient de l'emergència habitacional, proposa una solució immediata basada en tres eixos. En primer lloc, L'Equip Administratiu aprovarà un decret llei que equipara el lloguer de temporada al d'habitatge habitual en zones tensionades. En segon lloc, L'Equip Administratiu mobilitzarà sòl públic per a la construcció industrialitzada d'habitatges de lloguer social. Finalment, s'implementarà un règim sancionador sever per als qui incompleixin l'índex de preus.",
        gov_es: "El Equipo Administrativo, consciente de la emergencia habitacional, propone una solución inmediata basada en tres ejes. Primero, se aprobará un decreto ley que equipara el alquiler de temporada al de vivienda habitual en zonas tensionadas. Segundo, se movilizará suelo público para la construcción industrializada de viviendas de alquiler social. Finalmente, se implementará un régimen sancionador severo para quienes incumplan el índice de precios.",
        gov_en: "The Administrative Team, aware of the housing emergency, proposes an immediate solution based on three axes. First, a decree law will be approved equating seasonal rentals to habitual residence rentals in stressed areas. Second, public land will be mobilized for the industrialized construction of social rental housing. Finally, a severe sanctioning regime will be implemented for those who violate the price index.",
        votes: { for: 85, against: 10, abstain: 5 },
        status: "pending", date: "02/01/2026", time: "09:30h"
    },
    {
        id: 1736520002,
        name: "María Pilar Gómez",
        headline: "IGUALTAT PER L'ESPANYA BUIDA",
        headline_es: "IGUALDAD ESPAÑA VACÍA",
        headline_en: "EQUALITY FOR EMPTY SPAIN",
        text: "Visc a un poble de 80 habitants i em sento ciutadana de segona. Han tancat l'últim caixer automàtic i només tinc un autobús al dia per anar al metge, que passa a hores impossibles. Demano, per dignitat, que se'ns garanteixi transport a demanda i serveis bàsics a menys de 30 minuts de casa meva. Pago els mateixos impostos que algú de Madrid, vull els mateixos drets.",
        text_es: "Vivo en un pueblo de 80 habitantes y me siento ciudadana de segunda. Han cerrado el último cajero automático y solo tengo un autobús al día para ir al médico. Pido, por dignidad, que se nos garantice transporte a demanda y servicios básicos a menos de 30 minutos de mi casa. Pago los mismos impuestos que alguien de Madrid, quiero los mismos derechos.",
        text_en: "I live in a village of 80 inhabitants and feel like a second-class citizen. They closed the last ATM and I only have one bus a day to go to the doctor. I ask, for dignity, that we be guaranteed on-demand transport and basic services within 30 minutes of my home. I pay the same taxes as someone in Madrid, I want the same rights.",
        govResponse: "Per abordar el repte demogràfic, L'Equip Administratiu llança el 'Pla de Cohesió Territorial 2026'. L'Equip Administratiu proposa instaurar un sistema de transport a demanda que connectarà qualsevol llogaret amb la capital de comarca en menys de 45 minuts. Així mateix, L'Equip Administratiu garantirà per llei la presència d'oficines mòbils multiservei amb freqüència setmanal a tots els municipis de menys de 500 habitants.",
        gov_es: "Para abordar el reto demográfico, el Equipo Administrativo lanza el 'Plan de Cohesión Territorial 2026'. Se propone instaurar un sistema de transporte a demanda que conectará cualquier aldea con la capital de comarca en menos de 45 minutos. Asimismo, se garantizará por ley la presencia de oficinas móviles multiservicio con frecuencia semanal en todos los municipios de menos de 500 habitantes.",
        gov_en: "To address the demographic challenge, the Administrative Team launches the 'Territorial Cohesion Plan 2026'. It is proposed to establish an on-demand transport system connecting any hamlet with the county capital in less than 45 minutes. Likewise, the presence of multi-service mobile offices weekly in all municipalities with fewer than 500 inhabitants will be guaranteed by law.",
        votes: { for: 92, against: 3, abstain: 5 },
        status: "pending", date: "15/12/2025", time: "10:15h"
    }
];

// FUNCIÓ PER GENERAR EL GRÀFIC DE VOTS
function generateVoteHTML(votes) {
    if (!votes) votes = { for: 50, against: 30, abstain: 20 };
    const total = votes.for + votes.against + votes.abstain;
    const pFor = (votes.for / total) * 100;
    const pAg = (votes.against / total) * 100;
    const pAbs = (votes.abstain / total) * 100;

    return `
        <div class="vote-stats">
            <div class="vote-bar-container">
                <div class="vote-segment seg-for" style="width: ${pFor}%"></div>
                <div class="vote-segment seg-against" style="width: ${pAg}%"></div>
                <div class="vote-segment seg-abstain" style="width: ${pAbs}%"></div>
            </div>
            <div class="vote-legend">
                <div class="vote-item"><span class="dot-for"></span> A FAVOR (${votes.for}%)</div>
                <div class="vote-item"><span class="dot-against"></span> EN CONTRA (${votes.against}%)</div>
                <div class="vote-item"><span class="dot-abstain"></span> ABST. (${votes.abstain}%)</div>
            </div>
        </div>
    `;
}

// INICIALITZAR DADES AMB ETIQUETA "DEMO"
function initDemoData() {
    localStorage.removeItem('propostes_db'); 
    
    const labeledData = demoData.map(p => ({ ...p, isDemo: true }));
    
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    if (db.length === 0) {
        localStorage.setItem('propostes_db', JSON.stringify(labeledData));
    }
}
initDemoData();

const linksURLs = [
    "https://www.ftc.gov/system/files/documents/cases/182_3109_facebook_order_filed_7-24-19.pdf",
    "https://publications.parliament.uk/pa/cm201719/cmselect/cmcumeds/1791/1791.pdf",
    "https://www.boe.es/boe/dias/2019/06/24/pdfs/BOE-A-2019-9509.pdf",
    "https://www.intelligence.senate.gov/wp-content/uploads/2024/08/sites-default-files-documents-report-volume2.pdf"
];

// TRADUCCIONS (INCLOUEN BOTONS)
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
        
        // BOTONS VOTACIÓ
        btnApprove: "Aprovar", btnPostpone: "Ajornar", btnReject: "Refusar",

        legal1Title: "FTC vs Facebook (2019)", legal1Desc: "Ordre oficial sobre l'acord de privacitat...",
        legal2Title: "UK Parliament: Desinformació", legal2Desc: "Informe sobre l'impacte de les notícies falses...",
        legal3Title: "BOE: Llei Protecció Dades", legal3Desc: "Legislació espanyola sobre drets digitals...",
        legal4Title: "Senate Intel: Interferència", legal4Desc: "Informe sobre l'ús de xarxes socials..."
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

        // BOTONS VOTACIÓ
        btnApprove: "Aprobar", btnPostpone: "Aplazar", btnReject: "Rechazar",

        legal1Title: "FTC vs Facebook (2019)", legal1Desc: "Orden oficial sobre el acuerdo de privacidad...",
        legal2Title: "UK Parliament: Desinformación", legal2Desc: "Informe sobre el impacto de las noticias falsas...",
        legal3Title: "BOE: Ley Protección Datos", legal3Desc: "Legislación española sobre derechos digitales...",
        legal4Title: "Senate Intel: Interferencia", legal4Desc: "Informe sobre el uso de redes sociales..."
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

        // BOTONS VOTACIÓ
        btnApprove: "Approve", btnPostpone: "Postpone", btnReject: "Reject",

        legal1Title: "FTC vs Facebook (2019)", legal1Desc: "Official order regarding privacy...",
        legal2Title: "UK Parliament: Disinformation", legal2Desc: "Report on fake news...",
        legal3Title: "BOE: Data Protection Law", legal3Desc: "Spanish digital rights legislation...",
        legal4Title: "Senate Intel: Interference", legal4Desc: "Report on social media use..."
    }
};

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
    const userDisplay = document.getElementById('user-display');
    if (currentUser.name) userDisplay.innerText = currentUser.name; 
    else userDisplay.innerText = t.defaultUser; 
    document.querySelector('.logout-btn').innerText = t.btnLogout;

    // ACTUALITZAR TEXT BOTONS VOTACIÓ
    if(document.querySelector('.btn-approve')) document.querySelector('.btn-approve').innerText = t.btnApprove;
    if(document.querySelector('.btn-postpone')) document.querySelector('.btn-postpone').innerText = t.btnPostpone;
    if(document.querySelector('.btn-reject')) document.querySelector('.btn-reject').innerText = t.btnReject;

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('lang-' + lang.toLowerCase()).classList.add('active');
    if (!document.getElementById('screen-list').classList.contains('hidden')) loadProposalsList();
    if (!document.getElementById('screen-links').classList.contains('hidden')) loadLinks();
    if (!document.getElementById('screen-live').classList.contains('hidden')) startLiveMode();
}

// FUNCIÓ DE NAVEGACIÓ PROTEGIDA
function navTo(screenName) {
    if (!currentUser.name && screenName !== 'login') {
        screenName = 'login';
    }
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    document.getElementById('screen-' + screenName).classList.remove('hidden');
    if (screenName !== 'login') {
        document.getElementById('navbar').classList.remove('hidden');
    } else {
        document.getElementById('navbar').classList.add('hidden');
    }
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
        const userDisplay = document.getElementById('user-display');
        if(userDisplay) userDisplay.innerText = name;
        navTo('form'); 
    } else {
        alert("Si us plau, introdueix un nom per accedir.");
    }
}

function logout() { 
    currentUser = { dni: "", name: "" }; 
    document.getElementById('nameInput').value = ""; 
    document.getElementById('dniInput').value = "";
    navTo('login'); 
}

async function saveProposal() {
    const text = document.getElementById('proposalText').value.trim();
    if (!text) return;
    const btn = document.querySelector('#screen-form .primary-btn');
    const originalText = btn.innerText;
    btn.innerText = "Traduint..."; 
    btn.disabled = true;
    
    // Traducció automàtica del contingut de l'usuari
    const textES = await translateText(text, "es");
    const textEN = await translateText(text, "en");
    
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + 'h';
    const newProp = { 
        id: Date.now(), dni: currentUser.dni, name: currentUser.name, 
        text_ca: text, text_es: textES, text_en: textEN,
        headline: "PROPOSTA D'ÚLTIMA HORA", // Per defecte
        headline_es: "PROPUESTA DE ÚLTIMA HORA",
        headline_en: "BREAKING PROPOSAL",
        govResponse: "Aquesta proposta està sent avaluada pels tècnics municipals en aquests moments.",
        gov_es: "Esta propuesta está siendo evaluada por los técnicos municipales en estos momentos.",
        gov_en: "This proposal is currently being evaluated by municipal technicians.",
        votes: { for: 50, against: 20, abstain: 30 },
        date: now.toLocaleDateString(), time: timeStr, status: 'pending',
        isDemo: false 
    };
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    db.unshift(newProp);
    localStorage.setItem('propostes_db', JSON.stringify(db));
    document.getElementById('proposalText').value = "";
    btn.innerText = originalText;
    btn.disabled = false;
    navTo('success');
}

// LLISTAT ORDENAT CRONOLÒGICAMENT
function loadProposalsList() {
    const container = document.getElementById('proposals-container');
    container.innerHTML = "";
    let db = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    
    // ORDENAR PER DATA (MÉS RECENT A DALT)
    // El sistema 'unshift' ja les posa al principi, però per assegurar,
    // convertim la data string a objecte Date per comparar si calgués.
    // Com que 'demoData' no té format ISO, confiem en l'ordre de l'array
    // o bé en l'ID que és un timestamp (més gran = més nou).
    db.sort((a, b) => b.id - a.id);

    const t = translations[activeLang];
    
    if (db.length === 0) { container.innerHTML = "<p style='text-align:center;'>Sense dades.</p>"; return; }

    db.forEach(p => {
        let statusText = "";
        if(p.status === 'approved') statusText = t.statusApproved;
        else if(p.status === 'rejected') statusText = t.statusRejected;
        else if(p.status === 'postponed') statusText = t.statusPostponed;

        let statusBadge = p.status !== 'pending' ? `<span style='color:#003F87; font-weight:bold'> ● ${statusText}</span>` : "";
        let displayText = "";
        if(activeLang === 'ES' && p.text_es) displayText = p.text_es;
        else if(activeLang === 'EN' && p.text_en) displayText = p.text_en;
        else displayText = p.text_ca || p.text;

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
    // Filtrar només demos per trobar l'índex correcte si estem al directe
    // Però al localStorage estan barrejades. Busquem per ID.
    const idEnPantalla = document.getElementById('prop-id').innerText;
    
    // Busquem a la base de dades real
    const realIndex = db.findIndex(p => p.id.toString().slice(-4) === idEnPantalla);

    if (realIndex !== -1) {
        const p = db[realIndex];
        p.status = action;
        localStorage.setItem('propostes_db', JSON.stringify(db));
        
        // MOSTRAR GRÀFIC AL DIRECTE
        document.getElementById('live-vote-container').innerHTML = generateVoteHTML(p.votes);
    }
}

function startLiveMode(forceNext = false) {
    const headElem = document.getElementById('tv-headline-text');
    const propTextElem = document.getElementById('tv-proposal-text');
    const authorElem = document.getElementById('tv-author-name');
    const govTextElem = document.getElementById('tv-gov-text');
    const idElem = document.getElementById('prop-id');
    const t = translations[activeLang];
    
    let allDb = JSON.parse(localStorage.getItem('propostes_db') || "[]");
    let db = allDb.filter(p => p.isDemo === true); 

    if (db.length === 0) {
        headElem.innerText = t.monitorHeadline; propTextElem.innerText = t.citizenWait; govTextElem.innerText = t.govWait; return;
    }
    if (forceNext) currentProposalIndex = (currentProposalIndex + 1) % db.length;

    function renderScreen() {
        if (document.getElementById('screen-live').classList.contains('hidden')) return;
        const p = db[currentProposalIndex];
        idElem.innerText = p.id.toString().slice(-4);
        
        document.getElementById('live-vote-container').innerHTML = "";

        headElem.style.opacity = 0; propTextElem.style.opacity = 0; govTextElem.style.opacity = 0;

        setTimeout(() => {
            // LÒGICA DE TRADUCCIÓ TITULAR
            let headline = "";
            if(activeLang === 'ES') headline = p.headline_es || p.headline;
            else if(activeLang === 'EN') headline = p.headline_en || p.headline;
            else headline = p.headline; // CA

            headElem.innerText = headline.toUpperCase();
            
            let propText = "";
            let govText = "";
            if(activeLang === 'ES') { propText = p.text_es || p.text; govText = p.gov_es || p.govResponse; }
            else if(activeLang === 'EN') { propText = p.text_en || p.text; govText = p.gov_en || p.govResponse; }
            else { propText = p.text_ca || p.text; govText = p.govResponse; }

            propTextElem.innerText = propText;
            authorElem.innerText = p.name;
            govTextElem.innerText = govText || "Pendent...";

            headElem.style.opacity = 1; propTextElem.style.opacity = 1; govTextElem.style.opacity = 1;
        }, 300);
    }
    renderScreen();
    if (tickerInterval) clearInterval(tickerInterval);
    tickerInterval = setInterval(() => {
        currentProposalIndex = (currentProposalIndex + 1) % db.length;
        renderScreen();
    }, 15000); 
}

// INICIALITZACIÓ
document.addEventListener('DOMContentLoaded', () => {
    initDemoData(); 
    setLang('CA');  
    navTo('login'); 
});