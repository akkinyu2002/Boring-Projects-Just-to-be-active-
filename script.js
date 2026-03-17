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


// Quiz questions
const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
  {
    question: "How many continents are there on Earth?",
    answers: [
      { text: "5", correct: false },
      { text: "6", correct: false },
      { text: "7", correct: true },
      { text: "8", correct: false },
    ],
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      { text: "Vincent van Gogh", correct: false },
      { text: "Leonardo da Vinci", correct: true },
      { text: "Pablo Picasso", correct: false },
      { text: "Claude Monet", correct: false },
    ],
  },
  {
    question: "What gas do plants absorb from the atmosphere?",
    answers: [
      { text: "Oxygen", correct: false },
      { text: "Carbon dioxide", correct: true },
      { text: "Nitrogen", correct: false },
      { text: "Helium", correct: false },
    ],
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    answers: [
      { text: "China", correct: false },
      { text: "Japan", correct: true },
      { text: "Thailand", correct: false },
      { text: "South Korea", correct: false },
    ],
  },
  {
    question: "What is H2O commonly known as?",
    answers: [
      { text: "Salt", correct: false },
      { text: "Water", correct: true },
      { text: "Hydrogen", correct: false },
      { text: "Oxygen", correct: false },
    ],
  },
  {
    question: "Which instrument has 88 keys?",
    answers: [
      { text: "Guitar", correct: false },
      { text: "Piano", correct: true },
      { text: "Violin", correct: false },
      { text: "Flute", correct: false },
    ],
  },
  {
    question: "What is the largest planet in our solar system?",
    answers: [
      { text: "Saturn", correct: false },
      { text: "Jupiter", correct: true },
      { text: "Neptune", correct: false },
      { text: "Earth", correct: false },
    ],
  },
  {
    question: "Which language is primarily spoken in Brazil?",
    answers: [
      { text: "Spanish", correct: false },
      { text: "Portuguese", correct: true },
      { text: "French", correct: false },
      { text: "English", correct: false },
    ],
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      { text: "William Shakespeare", correct: true },
      { text: "Jane Austen", correct: false },
      { text: "Charles Dickens", correct: false },
      { text: "Mark Twain", correct: false },
    ],
  },
  {
    question: "What is the hardest natural substance on Earth?",
    answers: [
      { text: "Gold", correct: false },
      { text: "Iron", correct: false },
      { text: "Diamond", correct: true },
      { text: "Quartz", correct: false },
    ],
  },
  {
    question: "How many legs does a spider have?",
    answers: [
      { text: "6", correct: false },
      { text: "8", correct: true },
      { text: "10", correct: false },
      { text: "12", correct: false },
    ],
  },
  {
    question: "Which ocean lies on the east coast of the United States?",
    answers: [
      { text: "Pacific Ocean", correct: false },
      { text: "Atlantic Ocean", correct: true },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
    ],
  },
  {
    question: "What is the square root of 64?",
    answers: [
      { text: "6", correct: false },
      { text: "7", correct: false },
      { text: "8", correct: true },
      { text: "9", correct: false },
    ],
  },
  {
    question: "Which metal is liquid at room temperature?",
    answers: [
      { text: "Mercury", correct: true },
      { text: "Copper", correct: false },
      { text: "Aluminum", correct: false },
      { text: "Lead", correct: false },
    ],
  },
  {
    question: "Which continent is the Sahara Desert on?",
    answers: [
      { text: "Asia", correct: false },
      { text: "Australia", correct: false },
      { text: "Africa", correct: true },
      { text: "South America", correct: false },
    ],
  },
];

startButton.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  totalQuestionsSpan.textContent = quizQuestions.length;
  maxScoreSpan.textContent = quizQuestions.length;
  scoreSpan.textContent = score;
  startScreen.classList.remove('active');
  resultScreen.classList.remove('active');
  quizScreen.classList.add('active');
  showQuestion();
}

function showQuestion() {
  const current = quizQuestions[currentQuestionIndex];
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
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 600);
}

function updateProgress() {
  const progress = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function showResults() {
  quizScreen.classList.remove('active');
  resultScreen.classList.add('active');
  finalScoreSpan.textContent = score;
  maxScoreSpan.textContent = quizQuestions.length;
  resultMessage.textContent = getResultMessage();
  progressBar.style.width = '100%';
}

function getResultMessage() {
  const ratio = score / quizQuestions.length;
  if (ratio === 1) return 'Perfect score! Fantastic job!';
  if (ratio >= 0.8) return 'Great work! You really know your stuff.';
  if (ratio >= 0.5) return 'Nice effort! Keep practicing.';
  return 'Keep trying—you will get there!';
}

function restartQuiz() {
  startScreen.classList.add('active');
  quizScreen.classList.remove('active');
  resultScreen.classList.remove('active');
  questionText.textContent = 'Question goes here';
  answersContainer.innerHTML = '';
  progressBar.style.width = '0%';
}