import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllScores = async (req, res) => {
  try {
    const scores = await prisma.userQuizScore.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
          },
        },
        quiz: {
          select: {
            name: true,
            difficulty: true,
            type: true,
          },
        },
      },
    });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllScores };
