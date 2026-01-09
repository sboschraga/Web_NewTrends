export default async function handler(req, res) {
  // 1. Permetre CORS (per si de cas)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 2. Comprovar que tenim la clau API al servidor
  if (!process.env.GOOGLE_API_KEY) {
    console.error("ERROR CRÍTIC: No hi ha GOOGLE_API_KEY a les variables d'entorn de Vercel.");
    return res.status(500).json({ error: "Falta configuració del servidor (API KEY)" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text buit" });
  }

  const prompt = `
    Ets un periodista expert.
    Analitza la proposta: "${text}"

    TASCA:
    1. Crea un TITULAR curt i impactant (màx 8 paraules).
    2. Crea un DESENVOLUPAMENT formal (30-40 paraules).

    IMPORTANT: Respon NOMÉS en format JSON pur.
    Format: { "titular": "...", "analisi": "..." }
  `;

  try {
    console.log("Connectant amb Google Gemini...");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error de Google:", errorData);
      throw new Error(`Google ha rebutjat la petició (${response.status})`);
    }

    const data = await response.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) throw new Error("Google ha retornat una resposta buida");

    // Neteja JSON
    textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();

    return res.status(200).json(JSON.parse(textResult));

  } catch (err) {
    console.error("ERROR AL BACKEND:", err);
    return res.status(500).json({ error: err.message, details: "Mira els logs de Vercel" });
  }
}