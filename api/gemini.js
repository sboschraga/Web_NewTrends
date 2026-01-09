export default async function handler(req, res) {
    // 1. CORS (Permisos per connectar des de la web)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Mètode no permès" });

    // 2. Comprovació de seguretat
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Falta configurar GOOGLE_API_KEY a Vercel" });
    }

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "El text està buit" });

    // 3. El Prompt per a la IA
    const prompt = `
        Ets un periodista expert. Analitza la següent proposta ciutadana: "${text}"
        
        TASCA:
        1. Crea un TITULAR curt i impactant (màxim 8 paraules).
        2. Crea un DESENVOLUPAMENT formal i resumit (màxim 30 paraules).

        IMPORTANT: Respon NOMÉS en format JSON pur.
        Estructura: { "titular": "...", "analisi": "..." }
    `;

    try {
        console.log("📡 Connectant amb Google (Model Gemini 2.5 Flash)...");
        
        // --- EL CANVI CLAU ESTÀ AQUÍ ---
        // Fem servir el model que surt a la teva llista: gemini-2.5-flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }] 
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error de Google:", errorText);
            return res.status(500).json({ error: `Google Error ${response.status}`, details: errorText });
        }

        const data = await response.json();
        
        // Comprovar seguretat
        if (!data.candidates || !data.candidates[0].content) {
            return res.status(500).json({ error: "Google ha bloquejat la resposta per seguretat." });
        }

        // 4. Netejar la resposta
        let textResult = data.candidates[0].content.parts[0].text;
        // Treiem els blocs de codi ```json ... ``` si la IA els posa
        textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();

        console.log("✅ ÈXIT! Resposta rebuda.");
        return res.status(200).json(JSON.parse(textResult));

    } catch (err) {
        console.error("❌ CRASH:", err);
        return res.status(500).json({ error: "Error intern del servidor", details: err.message });
    }
}