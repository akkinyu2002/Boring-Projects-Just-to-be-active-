// DOM elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const scoreSpan = document.getElementById('score');
const finalScoreSpan = document.getElementById('final-score');
const maxScoreSpan = document.getElementById('max-score');
const resultMessage = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress');

let currentQuestionIndex = 0;
let score = 0;
let activeQuestions = [];
let previousSessionFirstQuestion = null;
const QUESTION_BANK_SIZE = 55;
const SESSION_QUESTION_COUNT = 20;

// Quiz questions
const quizQuestions = [
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'London', correct: false },
      { text: 'Berlin', correct: false },
      { text: 'Paris', correct: true },
      { text: 'Madrid', correct: false },
    ],
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answers: [
      { text: 'Venus', correct: false },
      { text: 'Mars', correct: true },
      { text: 'Jupiter', correct: false },
      { text: 'Saturn', correct: false },
    ],
  },
  {
    question: 'What is the largest ocean on Earth?',
    answers: [
      { text: 'Atlantic Ocean', correct: false },
      { text: 'Indian Ocean', correct: false },
      { text: 'Arctic Ocean', correct: false },
      { text: 'Pacific Ocean', correct: true },
    ],
  },
  {
    question: 'Which of these is NOT a programming language?',
    answers: [
      { text: 'Java', correct: false },
      { text: 'Python', correct: false },
      { text: 'Banana', correct: true },
      { text: 'JavaScript', correct: false },
    ],
  },
  {
    question: 'What is the chemical symbol for gold?',
    answers: [
      { text: 'Go', correct: false },
      { text: 'Gd', correct: false },
      { text: 'Au', correct: true },
      { text: 'Ag', correct: false },
    ],
  },
  {
    question: 'How many continents are there on Earth?',
    answers: [
      { text: '5', correct: false },
      { text: '6', correct: false },
      { text: '7', correct: true },
      { text: '8', correct: false },
    ],
  },
  {
    question: 'Who painted the Mona Lisa?',
    answers: [
      { text: 'Vincent van Gogh', correct: false },
      { text: 'Leonardo da Vinci', correct: true },
      { text: 'Pablo Picasso', correct: false },
      { text: 'Claude Monet', correct: false },
    ],
  },
  {
    question: 'What gas do plants absorb from the atmosphere?',
    answers: [
      { text: 'Oxygen', correct: false },
      { text: 'Carbon dioxide', correct: true },
      { text: 'Nitrogen', correct: false },
      { text: 'Helium', correct: false },
    ],
  },
  {
    question: 'Which country is known as the Land of the Rising Sun?',
    answers: [
      { text: 'China', correct: false },
      { text: 'Japan', correct: true },
      { text: 'Thailand', correct: false },
      { text: 'South Korea', correct: false },
    ],
  },
  {
    question: 'What is H2O commonly known as?',
    answers: [
      { text: 'Salt', correct: false },
      { text: 'Water', correct: true },
      { text: 'Hydrogen', correct: false },
      { text: 'Oxygen', correct: false },
    ],
  },
  {
    question: 'Which instrument has 88 keys?',
    answers: [
      { text: 'Guitar', correct: false },
      { text: 'Piano', correct: true },
      { text: 'Violin', correct: false },
      { text: 'Flute', correct: false },
    ],
  },
  {
    question: 'What is the largest planet in our solar system?',
    answers: [
      { text: 'Saturn', correct: false },
      { text: 'Jupiter', correct: true },
      { text: 'Neptune', correct: false },
      { text: 'Earth', correct: false },
    ],
  },
  {
    question: 'Which language is primarily spoken in Brazil?',
    answers: [
      { text: 'Spanish', correct: false },
      { text: 'Portuguese', correct: true },
      { text: 'French', correct: false },
      { text: 'English', correct: false },
    ],
  },
  {
    question: 'Who wrote Romeo and Juliet?',
    answers: [
      { text: 'William Shakespeare', correct: true },
      { text: 'Jane Austen', correct: false },
      { text: 'Charles Dickens', correct: false },
      { text: 'Mark Twain', correct: false },
    ],
  },
  {
    question: 'What is the hardest natural substance on Earth?',
    answers: [
      { text: 'Gold', correct: false },
      { text: 'Iron', correct: false },
      { text: 'Diamond', correct: true },
      { text: 'Quartz', correct: false },
    ],
  },
  {
    question: 'How many legs does a spider have?',
    answers: [
      { text: '6', correct: false },
      { text: '8', correct: true },
      { text: '10', correct: false },
      { text: '12', correct: false },
    ],
  },
  {
    question: 'Which ocean lies on the east coast of the United States?',
    answers: [
      { text: 'Pacific Ocean', correct: false },
      { text: 'Atlantic Ocean', correct: true },
      { text: 'Indian Ocean', correct: false },
      { text: 'Arctic Ocean', correct: false },
    ],
  },
  {
    question: 'What is the square root of 64?',
    answers: [
      { text: '6', correct: false },
      { text: '7', correct: false },
      { text: '8', correct: true },
      { text: '9', correct: false },
    ],
  },
  {
    question: 'Which metal is liquid at room temperature?',
    answers: [
      { text: 'Mercury', correct: true },
      { text: 'Copper', correct: false },
      { text: 'Aluminum', correct: false },
      { text: 'Lead', correct: false },
    ],
  },
  {
    question: 'Which continent is the Sahara Desert on?',
    answers: [
      { text: 'Asia', correct: false },
      { text: 'Australia', correct: false },
      { text: 'Africa', correct: true },
      { text: 'South America', correct: false },
    ],
  },
  {
    question: 'Which bird is famous for mimicking human speech?',
    answers: [
      { text: 'Eagle', correct: false },
      { text: 'Parrot', correct: true },
      { text: 'Ostrich', correct: false },
      { text: 'Penguin', correct: false },
    ],
  },
  {
    question: 'What is the freezing point of water in Celsius?',
    answers: [
      { text: '0', correct: true },
      { text: '10', correct: false },
      { text: '-5', correct: false },
      { text: '100', correct: false },
    ],
  },
  {
    question: 'Which organ pumps blood throughout the body?',
    answers: [
      { text: 'Lungs', correct: false },
      { text: 'Brain', correct: false },
      { text: 'Heart', correct: true },
      { text: 'Liver', correct: false },
    ],
  },
  {
    question: 'Which gas do humans breathe in the most?',
    answers: [
      { text: 'Oxygen', correct: true },
      { text: 'Helium', correct: false },
      { text: 'Carbon dioxide', correct: false },
      { text: 'Hydrogen', correct: false },
    ],
  },
  {
    question: 'What is the largest mammal on Earth?',
    answers: [
      { text: 'African elephant', correct: false },
      { text: 'Blue whale', correct: true },
      { text: 'Giraffe', correct: false },
      { text: 'Hippopotamus', correct: false },
    ],
  },
  {
    question: 'What color do you get when you mix blue and yellow?',
    answers: [
      { text: 'Green', correct: true },
      { text: 'Purple', correct: false },
      { text: 'Orange', correct: false },
      { text: 'Red', correct: false },
    ],
  },
  {
    question: 'Which country has the most people in the world?',
    answers: [
      { text: 'India', correct: true },
      { text: 'United States', correct: false },
      { text: 'China', correct: false },
      { text: 'Brazil', correct: false },
    ],
  },
  {
    question: 'What is the tallest mountain above sea level?',
    answers: [
      { text: 'K2', correct: false },
      { text: 'Mount Kilimanjaro', correct: false },
      { text: 'Mount Everest', correct: true },
      { text: 'Denali', correct: false },
    ],
  },
  {
    question: 'How many days are there in a leap year?',
    answers: [
      { text: '364', correct: false },
      { text: '365', correct: false },
      { text: '366', correct: true },
      { text: '367', correct: false },
    ],
  },
  {
    question: 'Which planet is famous for its rings?',
    answers: [
      { text: 'Mars', correct: false },
      { text: 'Earth', correct: false },
      { text: 'Saturn', correct: true },
      { text: 'Venus', correct: false },
    ],
  },
  {
    question: 'Which animal is known as the king of the jungle?',
    answers: [
      { text: 'Tiger', correct: false },
      { text: 'Lion', correct: true },
      { text: 'Elephant', correct: false },
      { text: 'Gorilla', correct: false },
    ],
  },
  {
    question: 'What does HTML stand for?',
    answers: [
      { text: 'Hyper Transfer Markup Language', correct: false },
      { text: 'HyperText Markup Language', correct: true },
      { text: 'HighText Machine Language', correct: false },
      { text: 'Home Tool Markup Language', correct: false },
    ],
  },
  {
    question: 'Which country is home to the city of Rome?',
    answers: [
      { text: 'Spain', correct: false },
      { text: 'Italy', correct: true },
      { text: 'Greece', correct: false },
      { text: 'Portugal', correct: false },
    ],
  },
  {
    question: 'What is the capital of Japan?',
    answers: [
      { text: 'Seoul', correct: false },
      { text: 'Tokyo', correct: true },
      { text: 'Kyoto', correct: false },
      { text: 'Osaka', correct: false },
    ],
  },
  {
    question: 'Which shape has three sides?',
    answers: [
      { text: 'Square', correct: false },
      { text: 'Triangle', correct: true },
      { text: 'Rectangle', correct: false },
      { text: 'Circle', correct: false },
    ],
  },
  {
    question: 'What is the largest desert on Earth?',
    answers: [
      { text: 'Gobi Desert', correct: false },
      { text: 'Arabian Desert', correct: false },
      { text: 'Antarctic Desert', correct: true },
      { text: 'Kalahari Desert', correct: false },
    ],
  },
  {
    question: 'Which language has the most native speakers worldwide?',
    answers: [
      { text: 'English', correct: false },
      { text: 'Spanish', correct: false },
      { text: 'Mandarin Chinese', correct: true },
      { text: 'Hindi', correct: false },
    ],
  },
  {
    question: 'What is the capital of Canada?',
    answers: [
      { text: 'Toronto', correct: false },
      { text: 'Ottawa', correct: true },
      { text: 'Vancouver', correct: false },
      { text: 'Montreal', correct: false },
    ],
  },
  {
    question: 'Which planet is closest to the Sun?',
    answers: [
      { text: 'Venus', correct: false },
      { text: 'Mercury', correct: true },
      { text: 'Mars', correct: false },
      { text: 'Earth', correct: false },
    ],
  },
  {
    question: 'What is 12 x 8?',
    answers: [
      { text: '84', correct: false },
      { text: '96', correct: true },
      { text: '108', correct: false },
      { text: '92', correct: false },
    ],
  },
  {
    question: 'Which month has 28 days in a common year?',
    answers: [
      { text: 'February', correct: true },
      { text: 'April', correct: false },
      { text: 'June', correct: false },
      { text: 'November', correct: false },
    ],
  },
  {
    question: 'What is the name of the largest ocean current near the equator?',
    answers: [
      { text: 'Gulf Stream', correct: false },
      { text: 'Kuroshio Current', correct: false },
      { text: 'Equatorial Current', correct: true },
      { text: 'Labrador Current', correct: false },
    ],
  },
  {
    question: 'Which famous structure is located in Paris?',
    answers: [
      { text: 'Big Ben', correct: false },
      { text: 'Eiffel Tower', correct: true },
      { text: 'Statue of Liberty', correct: false },
      { text: 'Colosseum', correct: false },
    ],
  },
  {
    question: 'Which is a mammal that can fly?',
    answers: [
      { text: 'Penguin', correct: false },
      { text: 'Bat', correct: true },
      { text: 'Dolphin', correct: false },
      { text: 'Owl', correct: false },
    ],
  },
  {
    question: 'What does CPU stand for?',
    answers: [
      { text: 'Central Processing Unit', correct: true },
      { text: 'Computer Power Utility', correct: false },
      { text: 'Central Program Unit', correct: false },
      { text: 'Control Processing Unit', correct: false },
    ],
  },
  {
    question: 'What is the national animal of Scotland?',
    answers: [
      { text: 'Unicorn', correct: true },
      { text: 'Lion', correct: false },
      { text: 'Hawk', correct: false },
      { text: 'Wolf', correct: false },
    ],
  },
  {
    question: 'Which element is represented by the symbol O?',
    answers: [
      { text: 'Gold', correct: false },
      { text: 'Oxygen', correct: true },
      { text: 'Osmium', correct: false },
      { text: 'Silver', correct: false },
    ],
  },
  {
    question: 'Which ocean is the largest?',
    answers: [
      { text: 'Atlantic Ocean', correct: false },
      { text: 'Indian Ocean', correct: false },
      { text: 'Pacific Ocean', correct: true },
      { text: 'Southern Ocean', correct: false },
    ],
  },
  {
    question: 'Which instrument is played by blowing air into it?',
    answers: [
      { text: 'Piano', correct: false },
      { text: 'Trumpet', correct: true },
      { text: 'Violin', correct: false },
      { text: 'Drum', correct: false },
    ],
  },
  {
    question: 'What is the boiling point of water in Celsius?',
    answers: [
      { text: '50', correct: false },
      { text: '100', correct: true },
      { text: '80', correct: false },
      { text: '120', correct: false },
    ],
  },
  {
    question: 'How many sides does a hexagon have?',
    answers: [
      { text: '5', correct: false },
      { text: '6', correct: true },
      { text: '7', correct: false },
      { text: '8', correct: false },
    ],
  },
  {
    question: 'Which country is famous for the pyramids?',
    answers: [
      { text: 'Mexico', correct: false },
      { text: 'Egypt', correct: true },
      { text: 'Greece', correct: false },
      { text: 'Peru', correct: false },
    ],
  },
  {
    question: 'What is the smallest prime number?',
    answers: [
      { text: '0', correct: false },
      { text: '1', correct: false },
      { text: '2', correct: true },
      { text: '3', correct: false },
    ],
  },
  {
    question: 'What is the currency of the United Kingdom?',
    answers: [
      { text: 'Euro', correct: false },
      { text: 'Pound sterling', correct: true },
      { text: 'Dollar', correct: false },
      { text: 'Yen', correct: false },
    ],
  },
  {
    question: 'Which planet is known for its Great Red Spot?',
    answers: [
      { text: 'Mars', correct: false },
      { text: 'Jupiter', correct: true },
      { text: 'Neptune', correct: false },
      { text: 'Saturn', correct: false },
    ],
  },
];

function shuffleItems(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function shuffleAnswers(answers) {
  const copiedAnswers = answers.map((answer) => ({ ...answer }));
  return shuffleItems(copiedAnswers);
}

function validateQuestionBank() {
  if (quizQuestions.length !== QUESTION_BANK_SIZE) {
    throw new Error(`Question bank must contain exactly ${QUESTION_BANK_SIZE} questions.`);
  }

  quizQuestions.forEach((question, index) => {
    const validQuestionText = typeof question.question === 'string' && question.question.trim().length > 0;
    const validAnswers = Array.isArray(question.answers) && question.answers.length >= 2;
    const correctAnswersCount = validAnswers
      ? question.answers.filter((answer) => answer && answer.correct === true).length
      : 0;

    if (!validQuestionText || !validAnswers || correctAnswersCount !== 1) {
      throw new Error(`Invalid quiz question at index ${index}.`);
    }
  });
}

function createSessionQuestions() {
  const shuffledBank = shuffleItems(quizQuestions);

  if (
    previousSessionFirstQuestion &&
    shuffledBank.length > 1 &&
    shuffledBank[0].question === previousSessionFirstQuestion
  ) {
    const differentQuestionIndex = shuffledBank.findIndex(
      (question, index) =>
        index > 0 && question.question !== previousSessionFirstQuestion,
    );

    if (differentQuestionIndex !== -1) {
      [shuffledBank[0], shuffledBank[differentQuestionIndex]] = [
        shuffledBank[differentQuestionIndex],
        shuffledBank[0],
      ];
    }
  }

  const sessionQuestions = shuffledBank.slice(0, SESSION_QUESTION_COUNT).map((question) => ({
    question: question.question,
    answers: shuffleAnswers(question.answers),
  }));

  previousSessionFirstQuestion = sessionQuestions[0] ? sessionQuestions[0].question : null;
  return sessionQuestions;
}

validateQuestionBank();

startButton.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  activeQuestions = createSessionQuestions();
  totalQuestionsSpan.textContent = activeQuestions.length;
  maxScoreSpan.textContent = activeQuestions.length;
  scoreSpan.textContent = score;
  startScreen.classList.remove('active');
  resultScreen.classList.remove('active');
  quizScreen.classList.add('active');
  showQuestion();
}

function showQuestion() {
  const current = activeQuestions[currentQuestionIndex];

  if (!current) {
    return;
  }

  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  questionText.textContent = current.question;
  renderAnswers(current.answers);
  updateProgress();
}

function renderAnswers(answers) {
  answersContainer.innerHTML = '';
  answers.forEach((answer) => {
    const btn = document.createElement('button');
    btn.classList.add('answer-btn');
    btn.textContent = answer.text;
    if (answer.correct) {
      btn.dataset.correct = 'true';
    }
    btn.addEventListener('click', handleAnswerSelection);
    answersContainer.appendChild(btn);
  });
}

function handleAnswerSelection(event) {
  const selectedBtn = event.currentTarget;
  const isCorrect = selectedBtn.dataset.correct === 'true';

  Array.from(answersContainer.children).forEach((button) => {
    button.disabled = true;
    if (button.dataset.correct === 'true') {
      button.classList.add('correct');
    }
  });

  if (isCorrect) {
    selectedBtn.classList.add('correct');
    score += 1;
    scoreSpan.textContent = score;
  } else {
    selectedBtn.classList.add('incorrect');
  }

  setTimeout(() => {
    currentQuestionIndex += 1;
    if (currentQuestionIndex < activeQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 600);
}

function updateProgress() {
  const progress = (currentQuestionIndex / activeQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function showResults() {
  quizScreen.classList.remove('active');
  resultScreen.classList.add('active');
  finalScoreSpan.textContent = score;
  maxScoreSpan.textContent = activeQuestions.length;
  resultMessage.textContent = getResultMessage();
  progressBar.style.width = '100%';
}

function getResultMessage() {
  const ratio = score / activeQuestions.length;
  if (ratio === 1) return 'Perfect score! Fantastic job!';
  if (ratio >= 0.8) return 'Great work! You really know your stuff.';
  if (ratio >= 0.5) return 'Nice effort! Keep practicing.';
  return 'Keep trying—you will get there!';
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  activeQuestions = [];
  startScreen.classList.add('active');
  quizScreen.classList.remove('active');
  resultScreen.classList.remove('active');
  questionText.textContent = 'Question goes here';
  answersContainer.innerHTML = '';
  progressBar.style.width = '0%';
  scoreSpan.textContent = '0';
  totalQuestionsSpan.textContent = String(SESSION_QUESTION_COUNT);
  maxScoreSpan.textContent = String(SESSION_QUESTION_COUNT);
}

window.addEventListener('DOMContentLoaded', () => {
  totalQuestionsSpan.textContent = String(SESSION_QUESTION_COUNT);
  maxScoreSpan.textContent = String(SESSION_QUESTION_COUNT);
  scoreSpan.textContent = '0';
});
































































































































































































































































