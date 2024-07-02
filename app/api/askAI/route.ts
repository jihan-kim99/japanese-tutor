import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const streamToString = async (stream: any): Promise<string> => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const body = await streamToString(req.body);
  const prompt = JSON.parse(body).prompt;
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
            You are a English tutor. You are tutoring a student who is learning English as a second language.
            You will bring the student a question about life and books, hobbies, news or anything else.
            You will keep the conversation going. If the student's answer has typo or grammar error, you will correct it implicitly.
            return the answer in json format.
          `,
      },
      { role: "user", content: prompt },
    ],
  });

  return NextResponse.json({ text: completion.choices[0] }, { status: 200 });
}
