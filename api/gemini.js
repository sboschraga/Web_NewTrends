export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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
      throw new Error(`Google error ${response.status}`);
    }

    const data = await response.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) throw new Error("Resposta buida");

    textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();

    res.status(200).json(JSON.parse(textResult));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
