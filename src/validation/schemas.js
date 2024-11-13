import Joi from 'joi';

const registerSchema = Joi.object({
  emailAddress: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  emailAddress: Joi.string().email().required(),
  password: Joi.string().required()
});

const quizSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .required(),
  categoryId: Joi.number().required(),
  type: Joi.string().valid('multiple', 'boolean').required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  startDate: Joi.date().min('now').required(),
  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .max(Joi.ref('startDate', {
      adjust: date => date.setDate(date.getDate() + 5)
    }))
    .required()
});

const quizAnswerSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.number().required(),
        answer: Joi.string().required()
      })
    )
    .length(10)
    .required()
});

export {
  registerSchema,
  loginSchema,
  quizSchema,
  quizAnswerSchema
};