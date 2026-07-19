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
      max_tokens: 2000,
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
