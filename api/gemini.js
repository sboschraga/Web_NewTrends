export default async function handler(req, res) {
    // 1. CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Mètode no permès" });

    // 2. Comprovació API Key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("❌ ERROR: No hi ha API KEY");
        return res.status(500).json({ error: "Falta configurar GOOGLE_API_KEY a Vercel" });
    }

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "El text està buit" });

    const prompt = `
        Ets un periodista expert. Analitza: "${text}"
        TASCA: 1. Titular curt (8 paraules). 2. Resum formal (30 paraules).
        RESPON JSON PUR: { "titular": "...", "analisi": "..." }
    `;

    try {
        console.log("📡 Connectant amb Google (Model PRO)...");
        
        // CORRECCIÓ: Usem el model 'gemini-pro' que és el més estable
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error de Google:", errorText);
            return res.status(500).json({ error: `Google Error ${response.status}`, details: errorText });
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content) {
            console.error("❌ Bloqueig de seguretat:", JSON.stringify(data));
            return res.status(500).json({ error: "Google ha bloquejat la resposta per seguretat." });
        }

        let textResult = data.candidates[0].content.parts[0].text;
        textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();

        console.log("✅ ÈXIT!");
        return res.status(200).json(JSON.parse(textResult));

    } catch (err) {
        console.error("❌ CRASH:", err);
        return res.status(500).json({ error: "Error intern", details: err.message });
    }
}