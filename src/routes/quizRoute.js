import express from 'express';
import { adminMiddleware } from '../middleware/auth.js';
import {
  createQuiz,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  playQuiz,
  getQuizById
} from '../controllers/quizController.js';

const router = express.Router();

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/', adminMiddleware, createQuiz);
router.put('/:id', adminMiddleware, updateQuiz);
router.delete('/:id', adminMiddleware, deleteQuiz);
router.post('/:id/play', playQuiz);

export { router as default };