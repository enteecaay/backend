// Quiz questions related to Chapter IV of Vietnamese Party principles
const questions = [
  {
    id: 'q1',
    chapter: 4,
    category: 'Tư tưởng Hồ Chí Minh',
    question: 'Theo tư tưởng Hồ Chí Minh, mục tiêu tối thượng mà cương lĩnh, đường lối và mọi hoạt động của Đảng phải luôn hướng tới là gì?',
    options: [
      'Duy trì vai trò lãnh đạo tuyệt đối của Đảng',
      'Củng cố liên minh với các lực lượng cách mạng thế giới',
      'Phát triển kinh tế thành công theo mô hình quốc tế',
      'Lợi ích của nhân dân và dân tộc'
    ],
    correctAnswer: 3
  },
  {
    id: 'q2',
    chapter: 4,
    category: 'Mối quan hệ Đảng - Quần chúng',
    question: 'Theo tư tưởng Hồ Chí Minh, luận điểm "Đảng có vững thì cách mệnh mới thành công" nhấn mạnh điều gì về mối quan hệ giữa Đảng và sức mạnh quần chúng?',
    options: [
      'Sức mạnh của quần chúng là yếu tố duy nhất quyết định thành công cách mạng',
      'Sức mạnh của Đảng hoàn toàn độc lập với niềm tin và sự ủng hộ của nhân dân',
      'Đảng có thể thành công mà không cần đến lực lượng quần chúng rộng rãi',
      'Đảng đóng vai trò chuyển hóa sức mạnh tiềm tàng của quần chúng thành thắng lợi thực tiễn'
    ],
    correctAnswer: 3
  },
  {
    id: 'q3',
    chapter: 4,
    category: 'Đảng vững mạnh',
    question: 'Trong ba phương diện chính của một "Đảng vững mạnh" theo Hồ Chí Minh, yếu tố nào được coi là nền tảng, định hướng cho mọi hoạt động của Đảng?',
    options: [
      'Vững về đạo đức và văn minh',
      'Vững về số lượng đảng viên và quy mô tổ chức',
      'Vững về tổ chức và nguyên tắc hoạt động',
      'Vững về mục tiêu và lý tưởng cách mạng'
    ],
    correctAnswer: 3
  },
  {
    id: 'q4',
    chapter: 4,
    category: 'Đạo đức và văn minh',
    question: 'Khi Hồ Chí Minh nói "Đảng ta là đạo đức, là văn minh", điều này KHÔNG bao hàm ý nghĩa nào sau đây?',
    options: [
      'Đội ngũ đảng viên phải là những người tiên phong, gương mẫu trong đời sống',
      'Đảng có quyền lực tuyệt đối, đứng trên tất cả các tổ chức khác',
      'Đảng là đại biểu cho lương tâm, trí tuệ và danh dự của dân tộc',
      'Đảng phải hoạt động trong khuôn khổ Hiến pháp và pháp luật'
    ],
    correctAnswer: 1
  },
  {
    id: 'q5',
    chapter: 4,
    category: 'Tập trung dân chủ',
    question: 'Nguyên tắc "tập trung dân chủ" được hiểu đúng theo tư tưởng Hồ Chí Minh là gì?',
    options: [
      'Phát huy dân chủ để tập hợp trí tuệ tập thể, trên cơ sở đó đi đến thống nhất và tập trung ý chí, hành động',
      'Lấy ý kiến của đa số tuyệt đối trong mọi vấn đề, không cần vai trò của người lãnh đạo',
      'Tập thể thảo luận nhưng không cần đi đến quyết định cuối cùng, để tránh mất đoàn kết',
      'Mọi quyết định đều do lãnh đạo cao nhất đưa ra, cấp dưới tuyệt đối chấp hành'
    ],
    correctAnswer: 0
  },
  {
    id: 'q6',
    chapter: 4,
    category: 'Tự chỉnh đốn',
    question: 'Theo Hồ Chí Minh, tại sao việc "tự chỉnh đốn" phải là một hoạt động thường xuyên của Đảng?',
    options: [
      'Vì Đảng cần liên tục mở rộng quy mô để gia tăng quyền lực',
      'Vì Đảng không có mục đích tự thân và không phải là tổ chức để làm quan phát tài',
      'Vì các thế lực thù địch liên tục chống phá từ bên ngoài',
      'Vì Hiến pháp và pháp luật yêu cầu các đảng phái phải tự kiểm điểm định kỳ'
    ],
    correctAnswer: 1
  },
  {
    id: 'q7',
    chapter: 4,
    category: 'Quan hệ với quần chúng',
    question: 'Mối quan hệ "máu thịt" giữa Đảng và Nhân dân được thể hiện rõ nhất qua nguyên tắc nào sau đây?',
    options: [
      'Liên hệ mật thiết với nhân dân',
      'Tập trung dân chủ',
      'Đoàn kết quốc tế',
      'Kỷ luật nghiêm minh, tự giác'
    ],
    correctAnswer: 0
  },
  {
    id: 'q8',
    chapter: 4,
    category: 'Đảng vững mạnh',
    question: 'Ý nghĩa quyết định của việc "Đảng vững" đối với sự thành công của cách mạng là gì?',
    options: [
      'Thay thế hoàn toàn vai trò của nhà nước trong quản lý xã hội',
      'Định hướng đúng, quy tụ lực lượng và giữ vững niềm tin của nhân dân',
      'Đảm bảo có đủ nguồn tài chính cho các hoạt động cách mạng',
      'Giành được sự công nhận và ủng hộ tuyệt đối từ tất cả các quốc gia'
    ],
    correctAnswer: 1
  },
  {
    id: 'q9',
    chapter: 4,
    category: 'Đoàn kết thống nhất',
    question: 'Sự đoàn kết, thống nhất trong Đảng theo tư tưởng Hồ Chí Minh phải được xây dựng dựa trên nền tảng nào?',
    options: [
      'Chủ nghĩa Mác – Lênin, cương lĩnh và đường lối chính trị của Đảng',
      'Sự tuân thủ tuyệt đối mệnh lệnh của người lãnh đạo cao nhất',
      'Sự thỏa hiệp giữa các phe phái khác nhau trong nội bộ Đảng',
      'Sự đồng thuận dựa trên lợi ích và quan hệ cá nhân của các đảng viên'
    ],
    correctAnswer: 0
  },
  {
    id: 'q10',
    chapter: 4,
    category: 'Đạo đức cách mạng',
    question: 'Trong bối cảnh hiện nay, việc Đảng đẩy mạnh phòng chống suy thoái, tiêu cực thể hiện rõ nhất giá trị của tư tưởng Hồ Chí Minh về vấn đề gì?',
    options: [
      'Sự quan trọng của nguyên tắc tập trung dân chủ trong quản lý',
      'Sự cần thiết phải đoàn kết quốc tế trong thời đại toàn cầu hóa',
      'Sự tất yếu phải có Đảng lãnh đạo trong nền kinh tế thị trường',
      'Sự sống còn của việc giữ vững đạo đức cách mạng và thường xuyên tự chỉnh đốn'
    ],
    correctAnswer: 3
  },
  {
    id: 'q11',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Quan điểm "Đảng không đứng trên dân tộc" có ý nghĩa sâu sắc là gì?',
    options: [
      'Đảng chỉ là một tổ chức xã hội bình thường như các tổ chức khác',
      'Đảng là một bộ phận của dân tộc, lợi ích của Đảng thống nhất với lợi ích của dân tộc',
      'Trong các vấn đề quốc tế, lợi ích dân tộc phải được đặt dưới lợi ích của Đảng',
      'Vai trò lãnh đạo của Đảng có thể được thay thế bởi một lực lượng khác'
    ],
    correctAnswer: 1
  },
  {
    id: 'q12',
    chapter: 4,
    category: 'Đường Kách mệnh',
    question: 'Vì sao trong tác phẩm "Đường Kách mệnh", Hồ Chí Minh lại nhấn mạnh "trước hết phải có đảng cách mệnh"?',
    options: [
      'Vì đó là điều kiện duy nhất để nhận được viện trợ quốc tế',
      'Vì thiếu một tổ chức lãnh đạo, các phong trào quần chúng sẽ chỉ dừng ở mức tự phát và dễ thất bại',
      'Vì Đảng là lực lượng trực tiếp thực hiện đấu tranh vũ trang',
      'Vì chỉ có Đảng mới có thể soạn thảo Hiến pháp và pháp luật'
    ],
    correctAnswer: 1
  },
  {
    id: 'q13',
    chapter: 4,
    category: 'Kỷ luật Đảng',
    question: 'Sức mạnh của Đảng bắt nguồn từ "kỷ luật nghiêm minh, tự giác" có nghĩa là gì?',
    options: [
      'Mọi đảng viên đều phải suy nghĩ và hành động giống hệt nhau trong mọi tình huống',
      'Kỷ luật được áp đặt một cách cứng nhắc từ trên xuống mà không cần sự đồng thuận',
      'Sự tuân thủ kỷ luật dựa trên nỗi sợ bị trừng phạt hơn là niềm tin vào lý tưởng',
      'Mỗi cá nhân tự nguyện tuân theo một quy tắc chung để tạo ra sức mạnh thống nhất'
    ],
    correctAnswer: 3
  },
  {
    id: 'q14',
    chapter: 4,
    category: 'Quan hệ với quần chúng',
    question: 'Luận điểm "mất dân là mất tất cả" phản ánh khía cạnh nào trong tư tưởng xây dựng Đảng của Hồ Chí Minh?',
    options: [
      'Sự sống còn của Đảng phụ thuộc vào mối liên hệ máu thịt và niềm tin của nhân dân',
      'Tầm quan trọng của công tác tuyên truyền, quảng bá hình ảnh của Đảng',
      'Sự cần thiết phải tăng số lượng đảng viên có xuất thân từ quần chúng',
      'Vai trò quyết định của việc Đảng kiểm soát mọi mặt đời sống xã hội'
    ],
    correctAnswer: 0
  },
  {
    id: 'q15',
    chapter: 4,
    category: 'Đoàn kết quốc tế',
    question: 'Nguyên tắc "Đoàn kết quốc tế" trong tư tưởng Hồ Chí Minh xuất phát từ cơ sở lý luận nào?',
    options: [
      'Nhu cầu nhận viện trợ kinh tế và quân sự từ các nước lớn',
      'Mong muốn xây dựng hình ảnh Việt Nam là một quốc gia yêu chuộng hòa bình',
      'Tính chất quốc tế của giai cấp công nhân và mục tiêu chung của cách mạng thế giới',
      'Sự tương đồng về văn hóa giữa Việt Nam và các dân tộc bị áp bức khác'
    ],
    correctAnswer: 2
  },
  {
    id: 'q16',
    chapter: 4,
    category: 'Phẩm chất đảng viên',
    question: 'Hành động nào của một đảng viên đi ngược lại với phẩm chất "là chiến sĩ tiên phong, gương mẫu"?',
    options: [
      'Dành thời gian học tập, nâng cao trình độ lý luận chính trị và chuyên môn',
      'Nói không đi đôi với làm, chỉ hứa hẹn trước nhân dân nhưng không thực hiện',
      'Thẳng thắn đóng góp ý kiến xây dựng trong các cuộc họp chi bộ',
      'Xung phong nhận nhiệm vụ khó khăn, gian khổ mà ít người muốn làm'
    ],
    correctAnswer: 1
  },
  {
    id: 'q17',
    chapter: 4,
    category: 'Nguyên tắc Đảng',
    question: 'Sự khác biệt cơ bản giữa nguyên tắc "tự phê bình và phê bình" và "kỷ luật nghiêm minh" là gì?',
    options: [
      '"Tự phê bình" là quá trình tự nhận thức và sửa chữa, còn "kỷ luật" là quy tắc và chế tài để đảm bảo sự thống nhất',
      '"Tự phê bình" diễn ra trong nội bộ, còn "kỷ luật" do các cơ quan nhà nước thực thi',
      '"Tự phê bình" là tự giác, còn "kỷ luật" là bắt buộc',
      '"Tự phê bình" chỉ áp dụng cho đảng viên thường, còn "kỷ luật" áp dụng cho cấp lãnh đạo'
    ],
    correctAnswer: 0
  },
  {
    id: 'q18',
    chapter: 4,
    category: 'Tập trung dân chủ',
    question: 'Theo tư tưởng Hồ Chí Minh, một Đảng cách mạng chân chính phải tránh điều gì trong nguyên tắc tập trung dân chủ?',
    options: [
      'Thiểu số phục tùng đa số, cấp dưới phục tùng cấp trên',
      'Thảo luận thẳng thắn và tranh luận để tìm ra chân lý',
      'Độc đoán chuyên quyền hoặc dựa dẫm tập thể, không dám quyết đoán',
      'Người lãnh đạo dám chịu trách nhiệm và đưa ra quyết định cuối cùng'
    ],
    correctAnswer: 2
  },
  {
    id: 'q19',
    chapter: 4,
    category: 'Hậu quả',
    question: 'Nếu Đảng bị rạn nứt nội bộ, kỷ luật lỏng lẻo và xa rời nhân dân, hậu quả tất yếu sẽ là gì?',
    options: [
      'Phong trào cách mạng sẽ tạm thời gặp khó khăn nhưng vẫn phát triển',
      'Phong trào cách mạng sẽ phải tìm một lực lượng lãnh đạo mới',
      'Phong trào cách mạng sẽ suy yếu và dẫn đến thất bại',
      'Phong trào cách mạng sẽ chuyển sang hình thức đấu tranh ôn hòa hơn'
    ],
    correctAnswer: 2
  },
  {
    id: 'q20',
    chapter: 4,
    category: 'Mục tiêu cách mạng',
    question: 'Mục tiêu cuối cùng và cao nhất trong tư tưởng Hồ Chí Minh về vai trò của Đảng là gì?',
    options: [
      'Đưa Việt Nam trở thành một cường quốc trên thế giới',
      'Giải phóng dân tộc, giai cấp, xã hội và con người',
      'Giành và giữ vững chính quyền cho Đảng',
      'Xây dựng Đảng thành một tổ chức lớn mạnh nhất'
    ],
    correctAnswer: 1
  },
  {
    id: 'q21',
    chapter: 4,
    category: 'Quan hệ quốc tế',
    question: 'Điều nào sau đây thể hiện đúng nhất bản chất của mối quan hệ quốc tế trong sáng theo tư tưởng Hồ Chí Minh?',
    options: [
      'Đoàn kết dựa trên lợi ích quốc gia thực dụng, sẵn sàng thay đổi đồng minh',
      'Vì hòa bình, hữu nghị, hợp tác và cùng phát triển với các dân tộc trên thế giới',
      'Can thiệp vào công việc nội bộ của các nước khác để thúc đẩy cách mạng',
      'Chỉ hợp tác với các nước xã hội chủ nghĩa truyền thống'
    ],
    correctAnswer: 1
  },
  {
    id: 'q22',
    chapter: 4,
    category: 'Cảnh báo suy thoái',
    question: 'Khi nói "Đảng không phải tổ chức để làm quan phát tài", Hồ Chí Minh muốn cảnh báo điều gì trong công tác xây dựng Đảng?',
    options: [
      'Đảng cần tập trung vào công tác chính trị và bỏ qua việc phát triển kinh tế đất nước',
      'Đảng viên không nên tham gia vào các hoạt động kinh tế để tránh rủi ro',
      'Chỉ những người có điều kiện kinh tế khó khăn mới nên được kết nạp vào Đảng',
      'Nguy cơ đảng viên lợi dụng chức vụ, quyền hạn để mưu lợi cá nhân, làm sai lệch bản chất của Đảng'
    ],
    correctAnswer: 3
  },
  {
    id: 'q23',
    chapter: 4,
    category: 'Xây dựng Đảng',
    question: 'Tại sao việc xây dựng đội ngũ cán bộ, đảng viên lại được coi là một nội dung quan trọng trong việc xây dựng Đảng trong sạch, vững mạnh?',
    options: [
      'Vì cán bộ, đảng viên là những người trực tiếp thực hiện và truyền bá đường lối của Đảng đến với nhân dân',
      'Vì cán bộ, đảng viên là lực lượng duy nhất làm cách mạng',
      'Vì số lượng cán bộ, đảng viên đông đảo sẽ thể hiện sức mạnh của Đảng',
      'Vì đây là cách để Đảng kiểm soát mọi hoạt động của xã hội'
    ],
    correctAnswer: 0
  },
  {
    id: 'q24',
    chapter: 4,
    category: 'Thống nhất',
    question: 'Điều gì là cốt lõi của việc "thống nhất tư tưởng và hành động" trong Đảng?',
    options: [
      'Tất cả đảng viên phải có cùng một trình độ lý luận chính trị',
      'Sau khi đã thảo luận dân chủ và có nghị quyết, tất cả phải nói và làm theo nghị quyết',
      'Cấm mọi ý kiến trái chiều trong các cuộc thảo luận của Đảng',
      'Chỉ hành động theo chỉ thị trực tiếp từ người lãnh đạo cao nhất'
    ],
    correctAnswer: 1
  },
  {
    id: 'q25',
    chapter: 4,
    category: 'Trách nhiệm lịch sử',
    question: 'Trong các biểu hiện của "Đảng là đạo đức, là văn minh", yếu tố nào thể hiện trách nhiệm cao nhất của Đảng trước lịch sử và nhân dân?',
    options: [
      'Hoạt động trong khuôn khổ Hiến pháp và pháp luật',
      'Có quan hệ quốc tế trong sáng',
      'Hoàn thành sứ mệnh lịch sử do nhân dân giao phó: giành độc lập và đem lại tự do, ấm no, hạnh phúc',
      'Đội ngũ đảng viên gương mẫu trong đời sống'
    ],
    correctAnswer: 2
  },
  {
    id: 'q26',
    chapter: 4,
    category: 'Lịch sử Đảng',
    question: 'Sự ra đời của Đảng Cộng sản Việt Nam là kết quả của sự kết hợp giữa chủ nghĩa Mác-Lênin với phong trào công nhân và phong trào yêu nước. Yếu tố "phong trào yêu nước" có ý nghĩa đặc biệt gì?',
    options: [
      'Cho thấy Đảng chỉ tập trung vào nhiệm vụ giải phóng dân tộc, xem nhẹ đấu tranh giai cấp',
      'Chứng tỏ phong trào yêu nước quan trọng hơn chủ nghĩa Mác-Lênin',
      'Khẳng định Đảng chỉ là một hình thức mới của các tổ chức yêu nước truyền thống',
      'Làm cho Đảng có cơ sở xã hội rộng rãi, mang đậm tính dân tộc, không chỉ là đảng của riêng giai cấp công nhân'
    ],
    correctAnswer: 3
  },
  {
    id: 'q27',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Theo Hồ Chí Minh, cách mạng muốn thành công trước hết phải có gì?',
    options: [
      'Vũ khí hiện đại',
      'Lực lượng đông đảo',
      'Đảng cách mệnh',
      'Sự ủng hộ quốc tế'
    ],
    correctAnswer: 2
  },
  {
    id: 'q28',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Hồ Chí Minh ví Đảng với hình ảnh nào?',
    options: [
      'Động cơ của con thuyền',
      'Người cầm lái con thuyền',
      'Dòng nước',
      'Cánh buồm'
    ],
    correctAnswer: 1
  },
  {
    id: 'q29',
    chapter: 4,
    category: 'Lực lượng cách mạng',
    question: 'Lực lượng cách mạng theo Hồ Chí Minh là ai?',
    options: [
      'Trí thức',
      'Giai cấp tư sản',
      'Giai cấp công nhân và nhân dân lao động',
      'Quân đội'
    ],
    correctAnswer: 2
  },
  {
    id: 'q30',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Giai cấp không có Đảng lãnh đạo thì sẽ như thế nào?',
    options: [
      'Phát triển chậm',
      'Không làm cách mạng được',
      'Phụ thuộc quốc tế',
      'Mất phương hướng tạm thời'
    ],
    correctAnswer: 1
  },
  {
    id: 'q31',
    chapter: 4,
    category: 'Đường Kách mệnh',
    question: 'Tác phẩm nào khẳng định vai trò tất yếu của Đảng?',
    options: [
      'Nhật ký trong tù',
      'Bản án chế độ thực dân Pháp',
      'Đường Kách mệnh',
      'Tuyên ngôn độc lập'
    ],
    correctAnswer: 2
  },
  {
    id: 'q32',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Theo Hồ Chí Minh, vai trò lãnh đạo của Đảng là:',
    options: [
      'Ngẫu nhiên',
      'Tạm thời',
      'Tất yếu lịch sử',
      'Do quốc tế quyết định'
    ],
    correctAnswer: 2
  },
  {
    id: 'q33',
    chapter: 4,
    category: 'Lịch sử Đảng',
    question: 'Đảng ra đời là kết quả của sự kết hợp giữa những yếu tố nào?',
    options: [
      'Chủ nghĩa Mác – Lênin và phong trào nông dân',
      'Chủ nghĩa Mác – Lênin và phong trào trí thức',
      'Chủ nghĩa Mác – Lênin, phong trào công nhân và phong trào yêu nước',
      'Phong trào công nhân và phong trào quốc tế'
    ],
    correctAnswer: 2
  },
  {
    id: 'q34',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Vai trò nào sau đây KHÔNG thuộc về Đảng?',
    options: [
      'Hoạch định đường lối',
      'Lãnh đạo quần chúng',
      'Thay thế vai trò của Nhà nước',
      'Đoàn kết quốc tế'
    ],
    correctAnswer: 2
  },
  {
    id: 'q35',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Đảng là chủ thể hoạch định điều gì?',
    options: [
      'Chính sách kinh tế thị trường',
      'Đường lối cách mạng',
      'Luật pháp',
      'Ngân sách nhà nước'
    ],
    correctAnswer: 1
  },
  {
    id: 'q36',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Theo Hồ Chí Minh, phong trào quần chúng muốn từ tự phát thành tự giác cần yếu tố nào?',
    options: [
      'Lực lượng đông',
      'Kinh tế mạnh',
      'Đảng lãnh đạo',
      'Truyền thông'
    ],
    correctAnswer: 2
  },
  {
    id: 'q37',
    chapter: 4,
    category: 'Đạo đức và văn minh',
    question: 'Hồ Chí Minh khẳng định: "Đảng ta là …"',
    options: [
      'Lực lượng chính trị',
      'Tổ chức lãnh đạo',
      'Đạo đức, là văn minh',
      'Quyền lực cao nhất'
    ],
    correctAnswer: 2
  },
  {
    id: 'q38',
    chapter: 4,
    category: 'Mục tiêu cách mạng',
    question: 'Mục tiêu cao nhất của Đảng là gì?',
    options: [
      'Phát triển kinh tế',
      'Giải phóng con người',
      'Xây dựng nhà nước',
      'Hội nhập quốc tế'
    ],
    correctAnswer: 1
  },
  {
    id: 'q39',
    chapter: 4,
    category: 'Hoạt động của Đảng',
    question: 'Đảng hoạt động trong khuôn khổ nào?',
    options: [
      'Điều lệ Đảng',
      'Hiến pháp và pháp luật',
      'Nghị quyết Trung ương',
      'Ý chí lãnh đạo'
    ],
    correctAnswer: 1
  },
  {
    id: 'q40',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Đảng có phải tổ chức đứng trên dân tộc không?',
    options: [
      'Có',
      'Không',
      'Tùy giai đoạn',
      'Tùy hoàn cảnh'
    ],
    correctAnswer: 1
  },
  {
    id: 'q41',
    chapter: 4,
    category: 'Tập trung dân chủ',
    question: 'Nguyên tắc tổ chức cơ bản của Đảng là gì?',
    options: [
      'Tập trung quyền lực',
      'Dân chủ tuyệt đối',
      'Tập trung dân chủ',
      'Bình đẳng tuyệt đối'
    ],
    correctAnswer: 2
  },
  {
    id: 'q42',
    chapter: 4,
    category: 'Tự phê bình và phê bình',
    question: 'Hồ Chí Minh ví tự phê bình và phê bình như việc gì?',
    options: [
      'Học tập',
      'Rửa mặt hằng ngày',
      'Khám bệnh',
      'Sửa sai'
    ],
    correctAnswer: 1
  },
  {
    id: 'q43',
    chapter: 4,
    category: 'Kỷ luật Đảng',
    question: 'Sức mạnh của Đảng bắt nguồn chủ yếu từ đâu?',
    options: [
      'Nhân sự đông',
      'Kỷ luật nghiêm minh',
      'Tài chính mạnh',
      'Quan hệ quốc tế'
    ],
    correctAnswer: 1
  },
  {
    id: 'q44',
    chapter: 4,
    category: 'Tự chỉnh đốn',
    question: 'Đảng phải thường xuyên làm gì để giữ vững vai trò lãnh đạo?',
    options: [
      'Mở rộng tổ chức',
      'Tự chỉnh đốn',
      'Tăng quyền lực',
      'Giảm kỷ luật'
    ],
    correctAnswer: 1
  },
  {
    id: 'q45',
    chapter: 4,
    category: 'Đoàn kết thống nhất',
    question: 'Đoàn kết trong Đảng phải dựa trên cơ sở nào?',
    options: [
      'Lợi ích cá nhân',
      'Tình cảm',
      'Chủ nghĩa Mác – Lênin và đường lối Đảng',
      'Quan hệ xã hội'
    ],
    correctAnswer: 2
  },
  {
    id: 'q46',
    chapter: 4,
    category: 'Mục đích của Đảng',
    question: 'Theo Hồ Chí Minh, Đảng có mục đích tự thân hay không?',
    options: [
      'Có',
      'Không',
      'Tùy thời kỳ',
      'Tùy hoàn cảnh'
    ],
    correctAnswer: 1
  },
  {
    id: 'q47',
    chapter: 4,
    category: 'Phẩm chất đảng viên',
    question: 'Cán bộ, đảng viên phải tuyệt đối trung thành với ai?',
    options: [
      'Nhà nước',
      'Nhân dân',
      'Đảng',
      'Tổ chức'
    ],
    correctAnswer: 2
  },
  {
    id: 'q48',
    chapter: 4,
    category: 'Phẩm chất đảng viên',
    question: 'Phẩm chất quan trọng hàng đầu của cán bộ, đảng viên là gì?',
    options: [
      'Trình độ',
      'Kinh nghiệm',
      'Đạo đức cách mạng',
      'Quan hệ'
    ],
    correctAnswer: 2
  },
  {
    id: 'q49',
    chapter: 4,
    category: 'Quan hệ với quần chúng',
    question: 'Đảng và nhân dân có mối quan hệ gì?',
    options: [
      'Hành chính',
      'Pháp lý',
      'Máu thịt',
      'Phụ thuộc'
    ],
    correctAnswer: 2
  },
  {
    id: 'q50',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Đảng Cộng sản Việt Nam là bộ phận của ai?',
    options: [
      'Nhà nước',
      'Giai cấp công nhân',
      'Toàn thể dân tộc Việt Nam',
      'Quốc tế cộng sản'
    ],
    correctAnswer: 2
  },
  {
    id: 'q51',
    chapter: 4,
    category: 'Đoàn kết quốc tế',
    question: 'Hồ Chí Minh coi cách mạng Việt Nam là một bộ phận của:',
    options: [
      'Cách mạng châu Á',
      'Cách mạng vô sản',
      'Cách mạng thế giới',
      'Phong trào giải phóng dân tộc'
    ],
    correctAnswer: 2
  },
  {
    id: 'q52',
    chapter: 4,
    category: 'Đoàn kết quốc tế',
    question: 'Đoàn kết quốc tế xuất phát từ tính chất nào của giai cấp công nhân?',
    options: [
      'Dân tộc',
      'Quốc tế',
      'Kinh tế',
      'Chính trị'
    ],
    correctAnswer: 1
  },
  {
    id: 'q53',
    chapter: 4,
    category: 'Đạo đức và văn minh',
    question: 'Nội dung nào thể hiện "Đảng vững về đạo đức"?',
    options: [
      'Kỷ luật nghiêm',
      'Cán bộ gương mẫu',
      'Tập trung dân chủ',
      'Đoàn kết quốc tế'
    ],
    correctAnswer: 1
  },
  {
    id: 'q54',
    chapter: 4,
    category: 'Đạo đức cách mạng',
    question: 'Phòng, chống tham nhũng hiện nay thể hiện tư tưởng nào của Hồ Chí Minh?',
    options: [
      'Đảng là đạo đức',
      'Đảng là quyền lực',
      'Đảng là tổ chức',
      'Đảng là quản lý'
    ],
    correctAnswer: 0
  },
  {
    id: 'q55',
    chapter: 4,
    category: 'Vai trò của Đảng',
    question: 'Nếu người cầm lái yếu, con thuyền cách mạng sẽ như thế nào?',
    options: [
      'Đi nhanh hơn',
      'Đổi hướng',
      'Lạc hướng hoặc thất bại',
      'Ổn định hơn'
    ],
    correctAnswer: 2
  },
  {
    id: 'q56',
    chapter: 4,
    category: 'Đảng vững mạnh',
    question: 'Thông điệp cốt lõi của câu nói: "Đảng có vững cách mệnh mới thành công"?',
    options: [
      'Đảng phải đông',
      'Đảng phải mạnh về quyền lực',
      'Đảng phải vững về tư tưởng, tổ chức, đạo đức',
      'Đảng phải hội nhập'
    ],
    correctAnswer: 2
  }
];

module.exports = questions;
