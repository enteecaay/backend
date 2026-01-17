const questions = require('./data/questions');

// Timeline of Vietnamese history
const TIMELINE = [
  { year: 1930, event: 'Cộng hòa xã hội chủ nghĩa Việt Nam được thành lập', icon: '🎉' },
  { year: 1954, event: 'Chiến thắng Điện Biên Phủ', icon: '🏆' },
  { year: 1975, event: 'Ngày thống nhất đất nước', icon: '🇻🇳' },
  { year: 1986, event: 'Đổi mới kinh tế - xã hội', icon: '📈' },
  { year: 2000, event: 'Hội nhập quốc tế', icon: '🌍' }
];

const OBSTACLES = [
  { type: 'corruption', name: 'Tham ô - Quan liêu', damage: 15, icon: '🌪️' },
  { type: 'disconnect', name: 'Xa rời quần chúng', damage: 12, icon: '⛈️' },
  { type: 'ideology', name: 'Sai lệch đường lối', damage: 20, icon: '❌' },
  { type: 'challenge', name: 'Thử thách cách mạng', damage: 10, icon: '❓' }
];

const POWER_UPS = [
  { name: 'Cần - Kiệm - Liêm - Chính', type: 'virtue', heal: 30, effect: '✨' },
  { name: 'Đoàn kết nhân dân', type: 'unity', heal: 25, speed: 0.3, effect: '🤝' },
  { name: 'Phê bình và tự phê bình', type: 'reflection', heal: 20, effect: '💭' }
];

function initializeTimeline() {
  return TIMELINE.map((event, index) => ({
    ...event,
    completed: false,
    position: (index / TIMELINE.length) * 100
  }));
}

function generateObstacle() {
  const randomObstacle = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: randomObstacle.type,
    name: randomObstacle.name,
    damage: randomObstacle.damage,
    icon: randomObstacle.icon,
    question: randomQuestion,
    createdAt: Date.now()
  };
}

function generatePowerUp() {
  return POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)];
}

function checkAnswer(questionId, selectedAnswer) {
  const question = questions.find(q => q.id === questionId);
  if (!question) return false;
  
  return question.correctAnswer === selectedAnswer;
}

function calculateScore(morale, speed, distance) {
  return Math.floor(morale * speed * distance);
}

function updatePlayerSpeed(currentSpeed, isCorrect, speedIncrement = 0.3, speedDecrement = 0.2) {
  const speedChange = isCorrect ? speedIncrement : -speedDecrement;
  const newSpeed = currentSpeed + speedChange;
  return Math.max(0.1, Math.min(5.0, newSpeed)); // Min 0.1, Max 5.0
}

function calculateDistance(speed, timeDelta) {
  // timeDelta in milliseconds, speed is relative
  // Calculate distance: speed * time (in seconds)
  return (speed * timeDelta) / 1000;
}

function generateRandomQuestion(questionsList) {
  const randomIndex = Math.floor(Math.random() * questionsList.length);
  return questionsList[randomIndex];
}

module.exports = {
  initializeTimeline,
  generateObstacle,
  generatePowerUp,
  checkAnswer,
  calculateScore,
  updatePlayerSpeed,
  calculateDistance,
  generateRandomQuestion,
  TIMELINE,
  OBSTACLES,
  POWER_UPS
};
