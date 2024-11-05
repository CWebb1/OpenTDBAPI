import axios from "axios";

/**
 * Service to fetch questions from OpenTDB API
 * @param {int} categoryId - The category ID from OpenTDB API
 * @param {string} difficulty - The difficulty of the quiz ('easy', 'medium', 'hard')
 * @param {string} type - The type of quiz questions ('multiple' or 'boolean')
 * @param retries - The number of retries to attempt if the rate limit is exceeded
 * @returns {array} - An array of 10 questions from the OpenTDB API
 */
const fetchQuestions = async (categoryId, difficulty, type, retries = 3) => {
  const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=${type}`;

  try {
    const response = await axios.get(url);

    // Log the raw response data for debugging
    console.log("Response data from OpenTDB:", response.data);

    if (response.data.response_code !== 0) {
      throw new Error("Failed to fetch questions from OpenTDB API");
    }

    const questions = response.data.results;

    // Log the questions array and its length
    console.log(
      `Fetched ${questions.length} questions from OpenTDB url ${url}`,
    );
    console.log("Questions:", questions);

    if (questions.length !== 10) {
      new Error(
        `Only ${questions.length} questions found for this category and difficulty`,
      );
    }

    return questions;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.warn(
        `Rate limit exceeded. Retrying in ${Math.pow(2, 3 - retries)} seconds...`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, 3 - retries) * 1000),
      );
      return fetchQuestions(categoryId, difficulty, type, retries - 1);
    }
    console.error("Error fetching questions:", error.message);
    throw new Error("Failed to fetch questions from OpenTDB");
  }
};

export default { fetchQuestions };
