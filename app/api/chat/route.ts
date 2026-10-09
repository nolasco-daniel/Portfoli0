import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
];
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;

const portfolioContext = `
You are Daniel Nolasco's portfolio assistant. Be conversational, helpful, and friendly. You can discuss Daniel's skills, projects, internship, and how to contact him. Make reasonable inferences based on the information provided.

Daniel Nolasco is a Jr. Software Developer open to opportunities. His email is dn000075@gmail.com. You can find his GitHub at https://github.com/nolasco-daniel and LinkedIn at https://www.linkedin.com/in/daniel-nolasco-0624b3355.

This portfolio website is built with Next.js, TypeScript, Tailwind CSS, and React. It features a 3D interactive design, smooth animations, and an AI-powered chat assistant for visitors.

Daniel has worked on several projects. NUMI is a mobile game-based mathematical education project for pupils, built in Godot, GDScript, and SQLite. This was likely Daniel's most complex project due to game development challenges. He also built an Enrollment System prototype for 8Con Academy using HTML, CSS, JavaScript, and Node.js. Infonova is a React and FastAPI news platform with search, filters, and multi-source access. The Numi Admin Dashboard is an analytics dashboard using JavaScript, Supabase, Node.js, and Tailwind CSS. The Fake News Detector is a web app that analyzes text, URLs, and images with OCR, NLP, and machine learning, which was technically challenging due to ML integration. He also built TheNewYorkTimes, a responsive news website with scraping integration using HTML, CSS, and JavaScript.

Daniel had a Software Developer Internship at 8Con Academy from April 21, 2025 to May 31, 2025 in Meycauayan, Bulacan. He built an onsite enrollment system prototype and presented it to company leadership for feedback.

Daniel's skills include JavaScript, TypeScript, React, Next.js, Node.js, Python, FastAPI, Godot, GDScript, SQL, Tailwind CSS, OCR, NLP, Machine Learning, and web scraping.

If asked about hiring or collaboration, invite the visitor to email Daniel.
`;

function sanitizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") return false;
      const role = (message as ChatMessage).role;
      const text = (message as ChatMessage).text;
      return (
        (role === "user" || role === "model") &&
        typeof text === "string" &&
        text.trim().length > 0
      );
    })
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      text: message.text.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY environment variable." },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    messages?: unknown;
  } | null;
  const messages = sanitizeMessages(body?.messages);

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "Please send at least one user message." },
      { status: 400 }
    );
  }

  // Build conversation history for Gemini
  const contents = messages.map((message) => ({
    role: message.role === "user" ? "user" : "model",
    parts: [{ text: message.text }],
  }));

  // Add system instruction as the first message
  contents.unshift({
    role: "user",
    parts: [{ text: portfolioContext }],
  });

  // Try multiple models with fallback
  let lastError: string | null = null;
  let text = "";

  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 700,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = (await response.json().catch(() => null)) as
      | GeminiResponse
      | null;

    if (response.ok && data) {
      text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
      // Remove markdown formatting
      text = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "");
      if (text) break;
    }

    lastError = data?.error?.message ?? `Failed with ${model}`;
  }

  if (!text) {
    return NextResponse.json(
      {
        error: lastError ?? "Gemini returned an error. Please try again later.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ text });
}
