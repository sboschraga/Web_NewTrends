export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Falta API KEY" });

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text buit" });

    const prompt = `
        Ets un periodista expert. Analitza: "${text}"
        TASCA: 1. Titular curt (8 paraules). 2. Resum formal (30 paraules).
        RESPON JSON PUR: { "titular": "...", "analisi": "..." }
    `;

    try {
        console.log("📡 Connectant amb Google (Model PRO LATEST)...");
        
        // --- ÚLTIM INTENT AMB EL TEU COMPTE ACTUAL ---
        // Aquest model sortia a la teva llista de disponibles.
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error Google:", errorText);
            return res.status(response.status).json({ error: `Google Error ${response.status}`, details: errorText });
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content) {
            return res.status(500).json({ error: "Bloqueig de seguretat." });
        }

        let textResult = data.candidates[0].content.parts[0].text;
        textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();

        return res.status(200).json(JSON.parse(textResult));

    } catch (err) {
        return res.status(500).json({ error: "Error intern", details: err.message });
    }
}