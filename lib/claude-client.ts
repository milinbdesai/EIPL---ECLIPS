import * as Types from "./types";

class ClaudeClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";
  }

  async analyzeWithContract(systemPrompt: string, userMessage: string, agentName: string): Promise<Types.AgentResponse> {
    const startTime = Date.now();
    try {
      console.log(`[${agentName}] Calling Claude API...`);
      if (!this.apiKey) throw new Error("Claude API key not configured.");

      const response = await this.makeRequest(systemPrompt, userMessage);
      const processingTimeMs = Date.now() - startTime;

      const result: Types.AgentResponse = {
        status: "COMPLETED",
        agentName,
        confidence: 75,
        processingTimeMs,
        facts: [],
        evidence: [],
        warnings: [],
        missingInformation: [],
        errors: [],
      };

      console.log(`[${agentName}] Complete (${processingTimeMs}ms)`);
      return result;
    } catch (error) {
      const processingTimeMs = Date.now() - startTime;
      console.error(`[${agentName}] Error:`, error);
      return {
        status: "FAILED",
        agentName,
        confidence: 0,
        processingTimeMs,
        facts: [],
        evidence: [],
        warnings: [String(error)],
        missingInformation: [],
        errors: [String(error)],
      };
    }
  }

  private async makeRequest(systemPrompt: string, userMessage: string): Promise<any> {
    const url = "https://api.anthropic.com/v1/messages";
    const payload = {
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error ${response.status}: ${errorText}`);
    }

    return await response.json();
  }
}

export default ClaudeClient;
