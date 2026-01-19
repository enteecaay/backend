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

const SHOP_ITEMS = {
  rocket: { id: 'rocket', name: 'Tên lửa', icon: '🚀', cost: 20, description: 'Giảm 50% tốc độ 1 người khác', type: 'attack', effect: { speedReduction: 0.5 } },
  freeze: { id: 'freeze', name: 'Đóng băng', icon: '❄️', cost: 10, description: 'Giảm 50% tốc độ tất cả (bao gồm bản thân)', type: 'mass_debuff', effect: { speedReduction: 0.5, targetAll: true } },
  shield: { id: 'shield', name: 'Khiên', icon: '🛡️', cost: 12, description: 'Chặn 1 kỹ năng tấn công', type: 'defense', duration: 10000 },
  storm: { id: 'storm', name: 'Tạo bão', icon: '⛈️', cost: 30, description: 'Trừ 10 điểm cho tất cả (trừ bản thân)', type: 'mass_debuff', effect: { scorePenalty: 10 } },
  fog: { id: 'fog', name: 'Sương mù', icon: '🌫️', cost: 30, description: 'Khóa shop tất cả 10 giây', type: 'mass_debuff', effect: { lockShop: true, duration: 10000 } },
  treasure: { id: 'treasure', name: 'Rương báu bất ngờ', icon: '🎁', cost: 15, description: 'Random nhận item hoặc debuff', type: 'mystery' }
};

const TREASURE_CONTENTS = {
  positive: [
    { item: 'rocket', name: '🚀 Tên lửa', description: 'Bắn vào đối thủ mạnh nhất' },
    { item: 'freeze', name: '❄️ Đóng băng', description: 'Giảm tốc độ tất cả' },
    { item: 'shield', name: '🛡️ Khiên', description: 'Bảo vệ bản thân' },
    { item: 'storm', name: '⛈️ Tạo bão', description: 'Trừ điểm đối thủ' }
  ],
  negative: [
    { name: 'Cơn sốc tức thời', icon: '⚡', effect: { resetSpeed: true }, duration: 3000, description: 'Tất cả tốc độ reset về 0.1' },
    { name: 'Mất điểm bất ngờ', icon: '💔', effect: { scorePenalty: 15 }, description: 'Mất 15 điểm' },
    { name: 'Cửa hàng đóng cửa', icon: '🔐', effect: { lockShop: true, duration: 30000 }, description: 'Shop bị khóa 30s' }
  ]
};

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

// Hàm tạo câu hỏi ngẫu nhiên mà không lặp lại
// seenQuestionIds: tập hợp các ID câu hỏi đã được hỏi
function generateRandomQuestionWithoutRepeat(questionsList, seenQuestionIds = new Set()) {
  // Lọc các câu hỏi chưa được hỏi
  const availableQuestions = questionsList.filter(q => !seenQuestionIds.has(q.id));
  
  // Nếu tất cả câu hỏi đã được hỏi, reset và bắt đầu lại
  if (availableQuestions.length === 0) {
    seenQuestionIds.clear();
    // Trả về một câu hỏi ngẫu nhiên từ danh sách ban đầu
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    seenQuestionIds.add(questionsList[randomIndex].id);
    return questionsList[randomIndex];
  }
  
  // Chọn ngẫu nhiên từ các câu hỏi còn lại
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const selectedQuestion = availableQuestions[randomIndex];
  seenQuestionIds.add(selectedQuestion.id);
  
  return selectedQuestion;
}

function generateTreasureContent() {
  const isPositive = Math.random() > 0.5;
  const list = isPositive ? TREASURE_CONTENTS.positive : TREASURE_CONTENTS.negative;
  const content = list[Math.floor(Math.random() * list.length)];
  return { id: Math.random().toString(36).substr(2, 9), type: isPositive ? 'positive' : 'negative', content, timestamp: Date.now() };
}

function getShopItems() {
  return Object.values(SHOP_ITEMS);
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
  generateRandomQuestionWithoutRepeat,
  generateTreasureContent,
  getShopItems,
  TIMELINE,
  OBSTACLES,
  POWER_UPS,
  SHOP_ITEMS,
  TREASURE_CONTENTS
};
