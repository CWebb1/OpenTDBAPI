const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Starting database seed...");

    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.userQuestionAnswer.deleteMany({});
    await prisma.userQuizScore.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.quiz.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    // Seed categories
    console.log("Seeding categories...");
    await prisma.category.createMany({
      data: categories,
    });

    // Seed users
    console.log("Seeding users...");
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    await prisma.user.createMany({
      data: hashedUsers,
    });

    // Create some sample quizzes
    console.log("Creating sample quizzes...");
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const sampleQuizzes = [
      {
        name: "General Knowledge Quiz",
        categoryId: 9,
        type: "multiple",
        difficulty: "medium",
        startDate: now,
        endDate: oneWeekFromNow,
        questions: {
          create: [
            {
              question: "What is the capital of France?",
              correctAnswer: "Paris",
              incorrectAnswers: ["London", "Berlin", "Madrid"],
            },
            {
              question: "Who painted the Mona Lisa?",
              correctAnswer: "Leonardo da Vinci",
              incorrectAnswers: [
                "Pablo Picasso",
                "Vincent van Gogh",
                "Michelangelo",
              ],
            },
          ],
        },
      },
      {
        name: "Computer Science Basics",
        categoryId: 18,
        type: "multiple",
        difficulty: "easy",
        startDate: now,
        endDate: oneWeekFromNow,
        questions: {
          create: [
            {
              question: "What does CPU stand for?",
              correctAnswer: "Central Processing Unit",
              incorrectAnswers: [
                "Central Program Utility",
                "Computer Personal Unit",
                "Central Process Unit",
              ],
            },
            {
              question:
                'Which programming language is known as the "language of the web"?',
              correctAnswer: "JavaScript",
              incorrectAnswers: ["Python", "Java", "C++"],
            },
          ],
        },
      },
    ];

    for (const quiz of sampleQuizzes) {
      await prisma.quiz.create({
        data: quiz,
      });
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
