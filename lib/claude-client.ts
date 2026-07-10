import * as Types from "./types";

class ClaudeClient {
  private apiKey: string;
  private cache: Map<string, { data: Types.AgentResponse; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60 * 60 * 1000;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";
  }

  async analyzeWithContract(systemPrompt: string, userMessage: string, agentName: string): Promise<Types.AgentResponse> {
    const startTime = Date.now();
    const cacheKey = `${agentName}-${userMessage.substring(0, 50)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[${agentName}] Using cached response`);
      return cached.data;
    }

    try {
      console.log(`[${agentName}] Calling Claude API...`);
      if (!this.apiKey) {
        throw new Error("Claude API key not configured.");
      }

      const response = await this.makeRequest(systemPrompt, userMessage);
      const processingTimeMs = Date.now() - startTime;

      let facts: string[] = [];
      let evidence: Types.Evidence[] = [];

      try {
        const responseText = response.content[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          facts = jsonData.evidence || [];
          evidence = [{
            source: agentName,
            confidence: jsonData.confidence || 50,
          }];
        }
      } catch (parseError) {
        console.warn(`[${agentName}] JSON parse warning`);
      }

      const result: Types.AgentResponse = {
        status: "COMPLETED",
        agentName,
        confidence: 75,
        processingTimeMs,
        facts,
        evidence,
        warnings: [],
        missingInformation: [],
        errors: [],
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
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
