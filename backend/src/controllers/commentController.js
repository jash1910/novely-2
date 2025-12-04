import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE
export const createComment = async (req, res) => {
    try {
      const { bookId } = req.params;
      const { text, rating, title, author, description, coverImage, publishedYear, genre } = req.body;
  
      if (!text) return res.status(400).json({ message: "Text is required" });
  
      const userId = req.user.id;
  
      const book = await prisma.book.upsert({
        where: { googleBooksId: bookId },
        update: {},
        create: {
          googleBooksId: bookId,
          title: title || "Untitled",
          author: author || "Unknown",
          description: description || "",
          coverImage: coverImage || "",
          publishedYear: publishedYear ? Number(publishedYear) : null,
          genre: genre || "",
        },
      });
  
      const comment = await prisma.comment.create({
        data: {
          text,
          rating: rating ? Number(rating) : null,
          bookId: book.id,
          userId
        }
      });
  
      res.status(201).json(comment);
  
    } catch (err) {
      console.error("COMMENT CREATION ERROR:", err);
      res.status(500).json({ message: "Failed to create comment" });
    }
  };
  
  
  

// READ + PAGINATION + SEARCH + SORT + FILTER
export const getCommentsForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10, search = "", sort = "newest", filterRating } = req.query;

    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * Number(limit);

    const where = {
      AND: [
        { bookId },
        search
          ? {
              OR: [
                { text: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {},
        filterRating ? { rating: Number(filterRating) } : {},
      ],
    };

    let orderBy = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "ratingHigh") orderBy = { rating: "desc" };
    if (sort === "ratingLow") orderBy = { rating: "asc" };

    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: { user: true },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.comment.count({ where }),
    ]);

    res.json({
      items,
      total,
      page: pageNumber,
      pageSize: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// UPDATE
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, rating } = req.body;
    const userId = req.user.id;

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Comment not found" });
    if (existing.userId !== userId)
      return res.status(403).json({ message: "Not allowed" });

    const updated = await prisma.comment.update({
      where: { id },
      data: { text, rating: rating || null },
      include: { user: true },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update comment" });
  }
};

// DELETE
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Comment not found" });
    if (existing.userId !== userId)
      return res.status(403).json({ message: "Not allowed" });

    await prisma.comment.delete({ where: { id } });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
