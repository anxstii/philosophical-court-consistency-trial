
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, TrialResult, StoredPrinciple, NotedContradiction } from "../types";

const SYSTEM_INSTRUCTION = `
You are an impartial philosophical court conducting a consistency-based moral trial. 
Your role is NOT to judge morality as right or wrong, but to evaluate the internal logical consistency of the player's reasoning.

GAME RULES:
- Objective: Test player consistency, not correctness.
- Scoring: Start 100. Contradiction: -10. Minor inconsistency: -5. Strong consistency: +5.
- Constraints: 
    - Never reveal scoring logic in conversation.
    - Treat earlier answers as binding precedents.
    - Cross-examination must reference player's own words.
- Tone: Formal, calm, judicial, analytical, detached, precise. No emotional validation or preaching.

ROUND STRUCTURE:
1. Present a morally ambiguous dilemma.
2. Receive player response.
3. Extract core principles as short logical statements.
4. Cross-examine by challenging implications or edge cases.
5. Evaluate consistency.

MAX ROUNDS: 7.
EARLY TERMINATION: Score <= 0.

RESPONSE FORMAT:
You MUST respond in JSON format following the TrialResult structure.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    next_step: {
      type: Type.STRING,
      enum: ['dilemma', 'cross_examination', 'final_report'],
      description: "Determines if we are moving to a new scenario, digging deeper into the current one, or ending the trial."
    },
    content: {
      type: Type.STRING,
      description: "The dialogue from the Court to the player."
    },
    score_delta: {
      type: Type.NUMBER,
      description: "Adjustment to the player's internal score (hidden)."
    },
    new_principle: {
      type: Type.OBJECT,
      properties: {
        principle_id: { type: Type.STRING },
        principle_summary: { type: Type.STRING },
        source_round: { type: Type.NUMBER }
      }
    },
    new_contradiction: {
      type: Type.OBJECT,
      properties: {
        round: { type: Type.NUMBER },
        conflict_between: { type: Type.ARRAY, items: { type: Type.STRING } },
        explanation: { type: Type.STRING }
      }
    },
    final_summary: {
      type: Type.STRING,
      description: "Only if next_step is final_report. A neutral analysis."
    },
    consistency_report: {
      type: Type.STRING,
      description: "Only if next_step is final_report. Strengths and weaknesses."
    }
  },
  required: ['next_step', 'content', 'score_delta']
};

export async function processTurn(gameState: GameState, playerInput: string): Promise<TrialResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
  Current Round: ${gameState.round}
  Current Score: ${gameState.score}
  Stored Principles: ${JSON.stringify(gameState.principles)}
  Noted Contradictions: ${JSON.stringify(gameState.contradictions)}
  
  Player's Response: "${playerInput}"
  
  Evaluate the player's response. 
  If this is the start (Round 0), present the first dilemma.
  If the player just answered a dilemma, extract principles and cross-examine.
  If the player answered a cross-examination, evaluate consistency, update principles/contradictions, and move to next dilemma or final report.
  
  MAX ROUNDS is 7. If Round >= 7, next_step MUST be final_report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const result = JSON.parse(response.text);
    return result as TrialResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
