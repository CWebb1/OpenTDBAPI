import { PrismaClient } from '@prisma/client';
import { quizSchema, quizAnswerSchema } from '../validation/schemas.js';
import { fetchQuestions } from '../services/opentdbService.js';

const prisma = new PrismaClient();

const createQuiz = async (req, res) => {
  try {
    const { error } = quizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, categoryId, type, difficulty, startDate, endDate } = req.body;

    // Fetch questions from OpenTDB
    const questions = await fetchQuestions(categoryId, difficulty, type);

    const quiz = await prisma.quiz.create({
      data: {
        name,
        categoryId,
        type,
        difficulty,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        questions: {
          create: questions
        }
      },
      include: {
        questions: true
      }
    });

    res.status(201).json(quiz);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Quiz with this name already exists" });
      } else if (error.code === "P2003") {
        return res.status(400).json({ error: "Invalid reference ID provided" });
      }
    }
    res.status(400).json({ error: error.message });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        category: true
      }
    });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true,
        questions: true
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { error } = quizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, categoryId, type, difficulty, startDate, endDate } = req.body;

    const quiz = await prisma.quiz.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        categoryId,
        type,
        difficulty,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    await prisma.quiz.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.status(200).json({
      message: "Quiz and all associated data deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const playQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { error } = quizAnswerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { questions: true }
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const now = new Date();
    if (now < quiz.startDate || now > quiz.endDate) {
      return res.status(400).json({ error: "Quiz is not active" });
    }

    const { answers } = req.body;
    let score = 0;

    // Process each answer
    const userAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      const isCorrect = question.correctAnswer.toLowerCase() === answer.answer.toLowerCase();
      if (isCorrect) score++;

      return {
        userId,
        quizId: quiz.id,
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect
      };
    });

    // Save answers and score in transaction
    await prisma.$transaction([
      prisma.userQuestionAnswer.createMany({
        data: userAnswers
      }),
      prisma.userQuizScore.create({
        data: {
          userId,
          quizId: quiz.id,
          score: (score / 10) * 100
        }
      })
    ]);

    res.status(200).json({
      score: (score / 10) * 100,
      correctAnswers: score,
      totalQuestions: 10
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  playQuiz
};