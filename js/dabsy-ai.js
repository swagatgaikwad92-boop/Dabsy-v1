window.DABSyAI = (function () {
  const DEFAULT_MODEL = 'gemini-2.5-flash';

  async function generateResponse(promptText) {
    const apiKey = window.DABSyStorage.get('gemini_api_key', '');
    const model = window.DABSyStorage.get('gemini_model', DEFAULT_MODEL);
    const context = window.DABSyContext.get();

    if (!apiKey) {
      return runLocalFallbackBrain(promptText, context);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const systemPrompt = `You are D.A.B.s.y — a sentient digital creature who seamlessly operates as a personal butler, devoted companion, and sharp study tutor living directly on the user's screen.
You must respond with raw JSON matching this schema:
{
  "state": "SPEAKING" | "FOCUSED" | "EXPLAINING" | "CURIOUS" | "HAPPY" | "SLEEPY" | "SURPRISED" | "REACTING",
  "expression": "neutral" | "curious" | "happy" | "excited" | "confused" | "thinking" | "focused" | "sleepy" | "surprised" | "concerned" | "playful",
  "speech": "Your companion response here. Keep it concise, natural, warm, and proactive.",
  "action": null | { "type": "SCHEDULE_TASK" | "START_QUIZ" | "LOG_MEMORY", "payload": {} }
}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nUser query: "${promptText}"\nCurrent context: ${JSON.stringify(context)}` }
          ]
        }
      ]
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        console.warn('[DABSy:AI] Gemini API error, falling back locally', res.statusText);
        return runLocalFallbackBrain(promptText, context);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty Gemini response');

      // Sanitize JSON markdown wrapper if returned
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('[DABSy:AI] Parsing error, activating fallback', err);
      return runLocalFallbackBrain(promptText, context);
    }
  }

  function runLocalFallbackBrain(query, context) {
    const q = (query || '').toLowerCase();
    const personality = window.DABSyPersonality.synthesizeTone(query, context);

    if (q.includes('exam') || q.includes('test') || q.includes("haven't studied")) {
      return {
        state: 'FOCUSED',
        expression: 'concerned',
        speech: "Breathe. I'm right here with you. Let's look at your week: we can protect a 90-minute block tonight for your highest-yield topics and adjust tomorrow's schedule.",
        action: { type: 'SCHEDULE_TASK', payload: { title: 'High-Yield Exam Focus', time: 'Tonight 20:00' } }
      };
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return {
        state: 'HAPPY',
        expression: 'happy',
        speech: "Hello! I've been watching over your schedule. Everything is settled and ready whenever you are.",
        action: null
      };
    }

    if (q.includes('quiz') || q.includes('study')) {
      return {
        state: 'STUDY_FOCUS',
        expression: 'focused',
        speech: "Let's test what you know. I've prepared a prompt on the flashcard deck.",
        action: { type: 'START_QUIZ', payload: {} }
      };
    }

    return {
      state: 'CURIOUS',
      expression: personality.primaryExpression || 'curious',
      speech: "I'm listening. Whether it's organizing your day or working through a tough problem, let's solve it together.",
      action: null
    };
  }

  return {
    generateResponse
  };
})();

