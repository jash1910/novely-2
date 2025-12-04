import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 5, genrePreference } = req.query;

    const readBooks = await prisma.readBook.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { createdAt: "desc" },
      take: 30
    });

    if (!readBooks.length) {
      return res.json({ recommendations: [], message: "Read books first!" });
    }

    const summary = readBooks
      .map((rb) => `${rb.book.title} by ${rb.book.author} (${rb.book.genre || "Unknown Genre"})`)
      .join("; ");

    const prompt = `
You are a book recommendation engine.
User previously enjoyed these books: ${summary}.
Suggest ${limit} NEW books they may like.

If genre preference exists, prioritize that genre: "${genrePreference || "None"}".

Return pure JSON array ONLY:
[
  { "title": string, "author": string, "genre": string, "reason": string }
]
Do not include books already read.
Do not include description text.
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    let parsed = [];
    try {
      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]");
      parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
    } catch (err) {
      parsed = [];
    }

    res.json({
      recommendations: parsed,
      page: Number(page),
      pageSize: Number(limit)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};
