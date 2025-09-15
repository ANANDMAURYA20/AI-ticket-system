import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Ticket Triage Assistant",
    system: `You are an expert AI assistant that processes technical support tickets. 

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.`,
  });

  const response = await supportAgent.run(
    `You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text:

{
"summary": "Short summary of the ticket",
"priority": "high",
"helpfulNotes": "Here are useful tips...",
"relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`
  );

  console.log("AI Response:", response);

  // Pull raw text (may vary by SDK version, check logs)
  let raw =
    response.output?.[0]?.output_text ||
    response.output?.[0]?.content ||
    response.output_text ||
    "";

  console.log("AI Raw Output:", raw);

  // Strip ```json fences if present
  raw = raw.replace(/```json\s*([\s\S]*?)\s*```/i, "$1").trim();

  try {
    const json = JSON.parse(raw);
    console.log("✅ Parsed JSON:", json);

    // Validate schema
    if (
      !json.summary ||
      !json.priority ||
      !json.helpfulNotes ||
      !Array.isArray(json.relatedSkills)
    ) {
      throw new Error("Missing one or more required fields in AI response");
    }

    return json;
  } catch (e) {
    console.error("❌ Failed to parse AI JSON:", e.message, raw);
    return null;
  }
};

export default analyzeTicket;
