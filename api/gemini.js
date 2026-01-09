export default async function handler(req, res) {
    // 1. CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Falta API KEY" });
    }

    try {
        // PREGUNTEM A GOOGLE: "Quins models tens per a mi?"
        // Fixa't que la URL acaba en /models
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: "Error de Google", details: data.error });
        }

        // Retornem la llista a la teva consola
        return res.status(200).json({ 
            missatge: "Aquests són els models que pots fer servir:",
            models: data.models 
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}