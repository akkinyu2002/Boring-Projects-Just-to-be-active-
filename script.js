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
  {
    question: "What is the smallest prime number?",
    answers: [
      { text: "0", correct: false },
      { text: "1", correct: false },
      { text: "2", correct: true },
      { text: "3", correct: false },
    ],
  },
  {
    question: "Which country gifted the Statue of Liberty to the United States?",
    answers: [
      { text: "France", correct: true },
      { text: "Italy", correct: false },
      { text: "Canada", correct: false },
      { text: "Spain", correct: false },
    ],
  },
  {
    question: "What is the largest mammal in the world?",
    answers: [
      { text: "African elephant", correct: false },
      { text: "Blue whale", correct: true },
      { text: "Giraffe", correct: false },
      { text: "Hippopotamus", correct: false },
    ],
  },
  {
    question: "In which year did humans first land on the Moon?",
    answers: [
      { text: "1965", correct: false },
      { text: "1969", correct: true },
      { text: "1972", correct: false },
      { text: "1959", correct: false },
    ],
  },
  {
    question: "Which organ pumps blood through the human body?",
    answers: [
      { text: "Liver", correct: false },
      { text: "Kidney", correct: false },
      { text: "Heart", correct: true },
      { text: "Lung", correct: false },
    ],
  },
  {
    question: "What is the freezing point of water in Celsius?",
    answers: [
      { text: "0°C", correct: true },
      { text: "32°C", correct: false },
      { text: "-10°C", correct: false },
      { text: "100°C", correct: false },
    ],
  },
  {
    question: "Which country has the largest population?",
    answers: [
      { text: "India", correct: true },
      { text: "China", correct: false },
      { text: "United States", correct: false },
      { text: "Indonesia", correct: false },
    ],
  },
  {
    question: "Who developed the theory of relativity?",
    answers: [
      { text: "Isaac Newton", correct: false },
      { text: "Albert Einstein", correct: true },
      { text: "Galileo Galilei", correct: false },
      { text: "Nikola Tesla", correct: false },
    ],
  },
  {
    question: "Which is the longest river in the world?",
    answers: [
      { text: "Amazon River", correct: false },
      { text: "Nile River", correct: true },
      { text: "Yangtze River", correct: false },
      { text: "Mississippi River", correct: false },
    ],
  },
  {
    question: "What is the capital city of Australia?",
    answers: [
      { text: "Sydney", correct: false },
      { text: "Melbourne", correct: false },
      { text: "Canberra", correct: true },
      { text: "Perth", correct: false },
    ],
  },
  {
    question: "How many players are on a soccer team on the field at one time?",
    answers: [
      { text: "9", correct: false },
      { text: "10", correct: false },
      { text: "11", correct: true },
      { text: "12", correct: false },
    ],
  },
  {
    question: "Which vitamin is mainly produced when skin is exposed to sunlight?",
    answers: [
      { text: "Vitamin A", correct: false },
      { text: "Vitamin C", correct: false },
      { text: "Vitamin D", correct: true },
      { text: "Vitamin K", correct: false },
    ],
  },
  {
    question: "Which country is famous for the pyramids of Giza?",
    answers: [
      { text: "Mexico", correct: false },
      { text: "Egypt", correct: true },
      { text: "Peru", correct: false },
      { text: "Greece", correct: false },
    ],
  },
  {
    question: "What is the boiling point of pure water at sea level?",
    answers: [
      { text: "90°C", correct: false },
      { text: "95°C", correct: false },
      { text: "100°C", correct: true },
      { text: "110°C", correct: false },
    ],
  },
  {
    question: "What is the main language spoken in Argentina?",
    answers: [
      { text: "Portuguese", correct: false },
      { text: "Italian", correct: false },
      { text: "Spanish", correct: true },
      { text: "English", correct: false },
    ],
  },
  {
    question: "Which blood type is known as the universal donor?",
    answers: [
      { text: "A+", correct: false },
      { text: "AB+", correct: false },
      { text: "O-", correct: true },
      { text: "B-", correct: false },
    ],
  },
  {
    question: "Who was the first person to travel into space?",
    answers: [
      { text: "Neil Armstrong", correct: false },
      { text: "Yuri Gagarin", correct: true },
      { text: "Buzz Aldrin", correct: false },
      { text: "John Glenn", correct: false },
    ],
  },
  {
    question: "What is the largest desert in the world?",
    answers: [
      { text: "Sahara Desert", correct: false },
      { text: "Arctic Desert", correct: false },
      { text: "Antarctic Desert", correct: true },
      { text: "Gobi Desert", correct: false },
    ],
  },
  {
    question: "How many bones are in an adult human body?",
    answers: [
      { text: "198", correct: false },
      { text: "206", correct: true },
      { text: "214", correct: false },
      { text: "220", correct: false },
    ],
  },
  {
    question: "Which mountain is the tallest above sea level?",
    answers: [
      { text: "K2", correct: false },
      { text: "Mount Kilimanjaro", correct: false },
      { text: "Mount Everest", correct: true },
      { text: "Denali", correct: false },
    ],
  },
  {
    question: "Who wrote '1984'?",
    answers: [
      { text: "George Orwell", correct: true },
      { text: "Aldous Huxley", correct: false },
      { text: "Ernest Hemingway", correct: false },
      { text: "F. Scott Fitzgerald", correct: false },
    ],
  },
  {
    question: "Which planet is closest to the Sun?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mercury", correct: true },
      { text: "Earth", correct: false },
      { text: "Mars", correct: false },
    ],
  },
  {
    question: "What is the currency of Japan?",
    answers: [
      { text: "Won", correct: false },
      { text: "Yuan", correct: false },
      { text: "Yen", correct: true },
      { text: "Ringgit", correct: false },
    ],
  },
  {
    question: "Which continent has the most countries?",
    answers: [
      { text: "Asia", correct: false },
      { text: "Europe", correct: false },
      { text: "Africa", correct: true },
      { text: "South America", correct: false },
    ],
  },
  {
    question: "What is the primary gas in Earth's atmosphere?",
    answers: [
      { text: "Oxygen", correct: false },
      { text: "Carbon dioxide", correct: false },
      { text: "Nitrogen", correct: true },
      { text: "Hydrogen", correct: false },
    ],
  },
  {
    question: "Who composed The Four Seasons?",
    answers: [
      { text: "Johann Sebastian Bach", correct: false },
      { text: "Antonio Vivaldi", correct: true },
      { text: "Wolfgang Amadeus Mozart", correct: false },
      { text: "Ludwig van Beethoven", correct: false },
    ],
  },
  {
    question: "Which country hosted the 2016 Summer Olympics?",
    answers: [
      { text: "China", correct: false },
      { text: "United Kingdom", correct: false },
      { text: "Brazil", correct: true },
      { text: "Japan", correct: false },
    ],
  },
  {
    question: "What is the largest internal organ in the human body?",
    answers: [
      { text: "Brain", correct: false },
      { text: "Lung", correct: false },
      { text: "Liver", correct: true },
      { text: "Kidney", correct: false },
    ],
  },
  {
    question: "Which ocean is between Africa and Australia?",
    answers: [
      { text: "Pacific Ocean", correct: false },
      { text: "Indian Ocean", correct: true },
      { text: "Atlantic Ocean", correct: false },
      { text: "Southern Ocean", correct: false },
    ],
  },
  {
    question: "Who discovered penicillin?",
    answers: [
      { text: "Alexander Fleming", correct: true },
      { text: "Louis Pasteur", correct: false },
      { text: "Marie Curie", correct: false },
      { text: "Gregor Mendel", correct: false },
    ],
  },
];

startButton.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  activeQuestions = shuffleQuestions(quizQuestions);
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

function shuffleQuestions(questions) {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function restartQuiz() {
  startScreen.classList.add('active');
  quizScreen.classList.remove('active');
  resultScreen.classList.remove('active');
  questionText.textContent = 'Question goes here';
  answersContainer.innerHTML = '';
  progressBar.style.width = '0%';
}