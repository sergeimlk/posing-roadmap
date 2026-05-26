/**
 * Polishes raw user text using an AI endpoint (e.g., Gemini API, Firebase AI Logic, or a custom backend).
 * 
 * TODO: To connect this to a real AI model:
 * 1. Create a serverless function (e.g., Vercel Function or Firebase Cloud Function) to avoid exposing your API keys on the frontend.
 * 2. In that function, call the Gemini API using the Google Gen AI SDK.
 * 3. Update the URL below to point to your new endpoint.
 * 
 * @param {string} rawText The raw text entered by the athlete.
 * @param {string} fieldName The name of the field being polished (e.g. 'objectives', 'problems').
 * @returns {Promise<string>} The polished, corrected, and slightly enriched text.
 */
export async function polishTextWithAI(rawText, fieldName) {
  if (!rawText || !rawText.trim()) return '';

  try {
    // If you have a backend endpoint setup, e.g. import.meta.env.VITE_AI_ENDPOINT
    const aiEndpoint = import.meta.env.VITE_AI_ENDPOINT;
    if (aiEndpoint) {
      const response = await fetch(aiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, field: fieldName })
      });
      if (response.ok) {
        const data = await response.json();
        return data.polishedText || rawText;
      }
    }
  } catch (error) {
    console.error(`Failed to polish field '${fieldName}' with AI:`, error);
  }

  // Fallback: return original text
  return rawText;
}
