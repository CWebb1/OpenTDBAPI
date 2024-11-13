import fetch from 'node-fetch';

const fetchCategories = async () => {
  const response = await fetch('https://opentdb.com/api_category.php');
  const data = await response.json();
  return data.trivia_categories;
};

const fetchQuestions = async (categoryId, difficulty, type, amount = 10) => {
  const url = new URL('https://opentdb.com/api.php');
  url.search = new URLSearchParams({
    amount: amount.toString(),
    category: categoryId.toString(),
    difficulty,
    type
  }).toString();

  const response = await fetch(url);
  const data = await response.json();

  if (data.response_code !== 0) {
    throw new Error('Failed to fetch questions from OpenTDB');
  }

  return data.results.map(question => ({
    question: question.question,
    correctAnswer: question.correct_answer,
    incorrectAnswers: question.incorrect_answers
  }));
};

export { fetchCategories, fetchQuestions }; 