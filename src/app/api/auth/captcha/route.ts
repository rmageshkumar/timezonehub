import { NextResponse } from "next/server";
import crypto from "crypto";

function generateMathCaptcha(): { question: string; answer: number } {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * 15) + 6;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case "×":
      a = Math.floor(Math.random() * 9) + 1;
      b = Math.floor(Math.random() * 9) + 1;
      answer = a * b;
      break;
    default:
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
  }

  return {
    question: `What is ${a} ${op} ${b}?`,
    answer,
  };
}

export async function GET() {
  const secret = process.env.AUTH_SECRET || "fallback-secret";
  const { question, answer } = generateMathCaptcha();

  // Create token: "question|answer|timestamp" signed with HMAC
  const timestamp = Date.now();
  const payload = `${question}|${answer}|${timestamp}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const token = Buffer.from(`${payload}|${signature}`).toString("base64url");

  return NextResponse.json({ question, token });
}
