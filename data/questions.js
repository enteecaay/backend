// Quiz questions related to Chapter IV of Vietnamese Party principles
const questions = [
  {
    id: 'q1',
    chapter: 4,
    category: 'Tập trung dân chủ',
    question: 'Nguyên tắc tập trung dân chủ là gì?',
    options: [
      'Quyền tuyệt đối của một cá nhân',
      'Kết hợp giữa dân chủ và tập trung: "Dân chủ trong cuộc thảo luận, tập trung trong cuộc hành động"',
      'Chỉ dân chủ mà không tập trung',
      'Chỉ tập trung mà không dân chủ'
    ],
    correctAnswer: 1,
    explanation: 'Nguyên tắc tập trung dân chủ là cơ sở của tổ chức Đảng, kết hợp giữa tôn trọng dân chủ trong cuộc thảo luận và tuân thủ quy định trong hành động.'
  },
  {
    id: 'q2',
    chapter: 4,
    category: 'Phê bình và tự phê bình',
    question: 'Vai trò của phê bình và tự phê bình trong Đảng là gì?',
    options: [
      'Làm suy yếu sự đoàn kết của Đảng',
      'Phương tiện để kiểm tra lẫn nhau, giúp Đảng luôn trong sạch',
      'Chỉ là hình thức hành chính',
      'Không cần thiết trong tổ chức Đảng'
    ],
    correctAnswer: 1,
    explanation: 'Phê bình và tự phê bình là công cụ mạnh mẽ để giữ vệ sinh Đảng, giúp các đảng viên không bao giờ quên sứ mệnh và tránh sai lầm.'
  },
  {
    id: 'q3',
    chapter: 4,
    category: 'Bốn nguyên tắc cơ bản',
    question: 'Bốn nguyên tắc cơ bản của tổ chức Đảng là gì?',
    options: [
      'Cá nhân, cơ quan, địa phương, trung ương',
      'Tập trung dân chủ, phê bình tự phê bình, số phiếu bằng nhau, bình đẳng',
      'Lãnh đạo tập trung, tôn trọng quyền riêng tư, tự do cá nhân, dân chủ tuyệt đối',
      'Không có nguyên tắc cố định'
    ],
    correctAnswer: 1,
    explanation: 'Bốn nguyên tắc cơ bản của tổ chức Đảng là: tập trung dân chủ, phê bình và tự phê bình, số đông tôn trọng số ít, cấp dưới tuân theo cấp trên, toàn Đảng tuân theo trung ương.'
  },
  {
    id: 'q4',
    chapter: 4,
    category: 'Liêm - Kiệm - Cần',
    question: 'Ba phẩm chất "Liêm - Kiệm - Cần" của một đảng viên là?',
    options: [
      'Giàu có, hoang phí, lười biếng',
      'Sạch sẽ, tiết kiệm, vất vả',
      'Tham lam, hoang phí, thất lạc',
      'Yếu đuối, lười biếng, vô dụng'
    ],
    correctAnswer: 1,
    explanation: 'Liêm chính - Kiệm tế - Cần cù là những phẩm chất cơ bản mà mỗi đảng viên phải có để xứng đáng là một thành viên của tổ chức cách mạng.'
  },
  {
    id: 'q5',
    chapter: 4,
    category: 'Quan hệ với quần chúng',
    question: 'Mối quan hệ của Đảng với nhân dân là gì?',
    options: [
      'Đảng ở trên nhân dân, điều hành tuyệt đối',
      'Đảng không liên quan gì đến nhân dân',
      'Đảng lấy nhân dân làm gốc, phục vụ nhân dân, lắng nghe tiếng nói của nhân dân',
      'Nhân dân lấy Đảng làm toàn bộ, không có ý kiến riêng'
    ],
    correctAnswer: 2,
    explanation: 'Mối liên hệ giữa Đảng và nhân dân là chặt chẽ và không tách rời. Đảng phục vụ nhân dân, lắng nghe và hành động vì lợi ích của nhân dân.'
  },
  {
    id: 'q6',
    chapter: 4,
    category: 'Kỷ luật Đảng',
    question: 'Kỷ luật trong Đảng là như thế nào?',
    options: [
      'Tuỳ tiện, không cần áp dụng',
      'Chỉ áp dụng cho cấp dưới',
      'Công bằng, công khai, toàn Đảng tuân theo, từ lãnh đạo đến thành viên',
      'Chỉ dùng để trừng phạt'
    ],
    correctAnswer: 2,
    explanation: 'Kỷ luật Đảng phải được áp dụng công bằng, công khai và toàn Đảng tuân theo, không có ngoại lệ từ lãnh đạo đến thành viên thường.'
  },
  {
    id: 'q7',
    chapter: 4,
    category: 'Cách mạng Việt Nam',
    question: 'Con thuyền của Đảng tượng trưng cho cái gì?',
    options: [
      'Quyền lợi cá nhân của các lãnh đạo',
      'Sự phát triển kinh tế',
      'Cách mạng Việt Nam và sứ mệnh giải phóng nhân dân',
      'Sức mạnh quân sự'
    ],
    correctAnswer: 2,
    explanation: 'Con thuyền của Đảng là biểu tượng của cách mạng Việt Nam, đại diện cho sứ mệnh giải phóng các tầng lớp lao động và xây dựng một xã hội công bằng, tự do.'
  },
  {
    id: 'q8',
    chapter: 4,
    category: 'Người cầm lái',
    question: 'Ai là "người cầm lái" - người điều hành Đảng?',
    options: [
      'Các tổng bí thư một mình',
      'Một cá nhân bất kỳ',
      'Tổng thể các cơ cấu lãnh đạo của Đảng trong thống nhất và tập trung',
      'Các nhà thức thức nước ngoài'
    ],
    correctAnswer: 2,
    explanation: '"Người cầm lái" là các cơ cấu lãnh đạo tập thể của Đảng, hoạt động dưới sự thống nhất và tập trung, quyết định đường lối chính sách của Đảng.'
  },
  {
    id: 'q9',
    chapter: 4,
    category: 'Tham ô - Quan liêu',
    question: 'Tham ô và quan liêu là những chướng ngại vật gì trong cách mạng?',
    options: [
      'Những điều bình thường không đáng lo',
      'Những sai phạm làm suy yếu lòng tin của nhân dân và lực lượng cách mạng',
      'Những điều tốt cho xã hội',
      'Không ảnh hưởng gì'
    ],
    correctAnswer: 1,
    explanation: 'Tham ô, lãng phí, quan liêu là những căn bệnh thường trực có thể làm suy yếu Đảng và mối quan hệ của Đảng với nhân dân, từ đó ảnh hưởng đến cách mạng.'
  },
  {
    id: 'q10',
    chapter: 4,
    category: 'Đạo đức cách mạng',
    question: 'Đạo đức cách mạng là gì?',
    options: [
      'Tuân theo quy tắc của các nước phương Tây',
      'Tư tưởng và hành động phục vụ lợi ích của cách mạng, của nhân dân',
      'Không cần thiết trong Đảng',
      'Chỉ là những lời nói suông'
    ],
    correctAnswer: 1,
    explanation: 'Đạo đức cách mạng là những nguyên tắc hành động, những chuẩn mực hành vi của đảng viên hướng tới lợi ích chung của cách mạng và nhân dân.'
  }
];

module.exports = questions;
