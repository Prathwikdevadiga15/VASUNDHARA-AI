"use client";
import { useState } from "react";
import { askAgent, askAssistant } from "@/services/ai";
import { Bot, Send, Sparkles, BookOpen, ExternalLink, Cpu, ShieldCheck } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; url: string | null; publisher?: string }[];
  tools?: string[];
  engine?: string;
}

const PRESET_QUERIES = [
  "What does the India State of Forest Report (ISFR 2023) say about Western Ghats forest cover?",
  "What are the fire risks and vulnerability window in Bandipur Tiger Reserve?",
  "Explain the ecological status and habitat of the Lion-tailed Macaque in Karnataka.",
  "What are the penalties under the Wildlife Protection Act 2022 amendments for poaching Schedule I species?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I am VASUNDHARA AI, an environmental intelligence copilot grounded strictly on verified Indian ecological publications (ISFR 2023, Wildlife Protection Act, and Western Ghats research data). How can I assist your conservation mission today?",
      citations: [
        {
          title: "India State of Forest Report (ISFR 2023)",
          url: "https://fsi.nic.in/forest-report-2023",
          publisher: "Forest Survey of India",
        },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [useAgentMode, setUseAgentMode] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (useAgentMode) {
        const agentRes = await askAgent(q, "Western Ghats, Karnataka");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `${agentRes.summary}\n\nEvidence Summary:\n${JSON.stringify(
              agentRes.evidence,
              null,
              2
            )}`,
            tools: agentRes.tools_executed,
            engine: "VASUNDHARA Multi-Tool Autonomous Agent",
          },
        ]);
      } else {
        const res = await askAssistant(q);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.answer,
            citations: res.citations,
            engine: res.engine,
          },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Encountered an issue communicating with the intelligence service. Please verify server connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald">
            <Bot className="h-4 w-4" />
            <span>Retrieval-Augmented Environmental Copilot</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-forest">
            Vasundhara AI Assistant
          </h1>
          <p className="text-xs text-forest/70">
            Grounded strictly on the Forest Survey of India (ISFR 2023), Wildlife Protection Act, and Western Ghats datasets.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-forest/15 bg-white p-1 shadow-xs">
          <button
            onClick={() => setUseAgentMode(false)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              !useAgentMode ? "bg-forest text-beige shadow-xs" : "text-forest/70 hover:text-forest"
            }`}
          >
            RAG Grounded Q&A
          </button>
          <button
            onClick={() => setUseAgentMode(true)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              useAgentMode ? "bg-forest text-beige shadow-xs" : "text-forest/70 hover:text-forest"
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-emerald" />
            <span>Agent Tool Calling</span>
          </button>
        </div>
      </div>

      {/* Suggested Queries */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PRESET_QUERIES.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(pq)}
            className="rounded-full border border-forest/15 bg-white px-3 py-1 text-[11px] font-medium text-forest/80 shadow-2xs transition hover:border-emerald hover:bg-emerald/5 hover:text-forest"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex h-[520px] flex-col rounded-2xl border border-forest/15 bg-white shadow-sm">
        {/* Messages Feed */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-forest text-beige"
                    : "border border-forest/10 bg-forest/5 text-forest"
                }`}
              >
                {/* Engine Badge */}
                {m.engine && (
                  <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald">
                    <Sparkles className="h-3 w-3" />
                    <span>{m.engine}</span>
                  </div>
                )}

                {/* Agent Dispatched Tools */}
                {m.tools && m.tools.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1 border-b border-forest/10 pb-2">
                    <span className="text-[10px] font-bold text-forest/70">Dispatched Tools:</span>
                    {m.tools.map((t, tidx) => (
                      <span key={tidx} className="rounded bg-emerald/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Citations Box */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 border-t border-forest/10 pt-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-forest/70">
                      <BookOpen className="h-3 w-3 text-gold" />
                      <span>Verified Sources & Citations</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {m.citations.map((c, cidx) => (
                        <a
                          key={cidx}
                          href={c.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded border border-forest/15 bg-white px-2 py-0.5 text-[10px] font-medium text-forest hover:text-emerald"
                        >
                          <span>{c.title}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-forest/10 bg-forest/5 p-4 text-xs text-forest/70">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent" />
                <span>Retrieving verified environmental corpus & synthesizing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2 border-t border-forest/10 bg-beige/40 p-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Western Ghats forest trends, fire risk, or wildlife protection laws..."
            className="flex-1 rounded-xl border border-forest/20 bg-white px-4 py-2.5 text-xs sm:text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-emerald"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-beige shadow transition hover:bg-forest/90 disabled:opacity-40"
          >
            <Send className="h-4 w-4 text-emerald" />
          </button>
        </form>
      </div>
    </main>
  );
}
