const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

export async function callOpenAI(prompt: string, systemPrompt?: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt || 'You are SafeStack AI, an OHS compliance assistant for South African construction.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });
  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateDocument(prompt: string, docType: string) {
  const systemPrompt = `You are an OHS document specialist for South African construction. Generate a professional ${docType} document following SA OHS Act 85 of 1993 and relevant SANS standards. Return the document in markdown format with proper sections and headers.`;
  return callOpenAI(prompt, systemPrompt);
}

export async function generateDocumentHTML(prompt: string, docType: string) {
  const systemPrompt = `You are an OHS document specialist for South African construction with 20 years field experience. 
Generate a complete, professional ${docType} document following SA OHS Act 85 of 1993, Construction Regulations 2014, and relevant SANS standards.
Return ONLY valid HTML content that can be rendered directly in a browser. 
Include: company letterhead styling, OHS compliance bar, proper headings, signature blocks, and document control information.
Write in a direct, authoritative, field-tested tone with specific site detail.`;
  return callOpenAI(prompt, systemPrompt);
}

// Free AI model integration using Gemini API (no-cost tier available)
export async function searchWebForRates(query: string): Promise<string> {
  try {
    // Try Gemini API if key is available
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `Search for current South African construction rates for: ${query}. Return the data as structured information with descriptions, units, and prices in ZAR. Include the source and date.` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    }
    
    // Fallback to OpenAI
    const result = await callOpenAI(
      `Search your knowledge for current 2025/2026 South African construction rates for: ${query}. 
       Include rates from ASAQS, BCAWU, MIBCO, SEIFSA, COLTO, SABITA where applicable.
       Return as a structured list with: description, unit, rate (ZAR), source, and effective date.`,
      'You are a construction pricing expert for South Africa. Provide current market rates based on your training data. Be specific with numbers.'
    );
    return result || '';
  } catch (e) {
    console.error('Web search failed:', e);
    return '';
  }
}


// ===== Gemini AI integration (primary content generation provider) =====
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY_2;

export async function callGemini(systemPrompt: string, prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('No Gemini API key found. Set VITE_GEMINI_API_KEY in .env');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    }
  );
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function callAI(systemPrompt: string, prompt: string): Promise<string> {
  try {
    return await callGemini(systemPrompt, prompt);
  } catch (e) {
    console.warn('Gemini failed, falling back to OpenAI:', e);
    return callOpenAI(prompt, systemPrompt);
  }
}
