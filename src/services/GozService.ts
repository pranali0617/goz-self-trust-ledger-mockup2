const INITIAL_MESSAGE =
  "I am **Goz**. I help you build **Evidence-based self-belief**.\n\nConfidence isn't a feeling; it's a **Ledger of Wins**. Choose a pathway to start logging yours:\n\n* **A) Life Audit:** Find where your energy is leaking.\n* **B) Hidden Payoff:** Break the cycle of self-sabotage.\n* **C) Neural Simulator:** Practice 'scary' moments in a safe space.\n* **D) Trigger Tracer:** Trace current stress to its old source.\n* **E) Personal Code:** Extract your unique rules for winning.\n\nWhich pathway shall we open?";

export interface Message {
  role: "user" | "model";
  text: string;
  options?: string[];
}

interface ChatApiSuccess {
  text: string;
}

interface ChatApiError {
  error: string;
}

export class GozService {
  private history: Message[];

  constructor() {
    this.history = [];
  }

  async sendMessage(message: string): Promise<Message> {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: this.history,
          message,
        }),
      });

      const payload = (await response.json()) as ChatApiSuccess | ChatApiError;

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : `Request failed with status ${response.status}`);
      }

      const modelMessage: Message = {
        role: "model",
        text: payload.text || "I'm processing that pattern...",
        options: this.extractOptions(payload.text),
      };

      this.history.push({ role: "user", text: message });
      this.history.push({ role: "model", text: modelMessage.text });

      return modelMessage;
    } catch (error) {
      console.error("Goz Error:", error);
      return {
        role: "model",
        text: "I couldn't reach Groq right now. Please check that the Vercel server environment variables are set correctly, then try again.",
      };
    }
  }

  getInitialMessage(): Message {
    return {
      role: "model",
      text: INITIAL_MESSAGE,
      options: ["The Life Audit", "The Hidden Payoff", "The Neural Simulator", "The Trigger Tracer", "The Personal Code"],
    };
  }

  private extractOptions(text: string): string[] | undefined {
    const lowerText = text.toLowerCase();

    if (lowerText.includes("life audit")) {
      return ["Begin the Audit", "How does this help?"];
    }
    if (lowerText.includes("hidden payoff")) {
      return ["Find my Hidden Payoff", "Why do I sabotage?"];
    }
    if (lowerText.includes("neural simulator")) {
      return ["Start Simulation", "Give me an example"];
    }
    if (lowerText.includes("trigger tracer")) {
      return ["Trace a Trigger", "How does this work?"];
    }
    if (lowerText.includes("personal code")) {
      return ["Extract my Code", "Review my wins"];
    }
    if (lowerText.includes("micro-action")) {
      return ["I'm ready", "Give me a different one"];
    }
    if (lowerText.includes("ready to move on") || lowerText.includes("next step")) {
      return ["Next Step", "Tell me more"];
    }

    return undefined;
  }
}
