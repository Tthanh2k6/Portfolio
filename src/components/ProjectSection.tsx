import { useEffect, useRef, useState } from "react";
import { NavBar } from "./NavBar";

// Tài khoản GitHub dùng để lấy danh sách dự án
const GITHUB_USER = "Tthanh2k6";

// Ảnh OpenGraph tự sinh của GitHub cho từng repo (card xã hội đẹp, luôn có sẵn)
const ghImage = (repo: string) =>
  `https://opengraph.githubassets.com/1/${GITHUB_USER}/${repo}`;

// Ảnh chụp màn hình thật của từng dự án (đặt trong thư mục public IMG/).
// Được ưu tiên hơn ảnh OpenGraph; nếu thiếu file, <img onError> sẽ tự rơi về ảnh GitHub.
const REPO_IMAGES: Record<string, string> = {
  DiemDanhQR: "/IMG/project-diemdanhqr.jpg",
  AI_Lab: "/IMG/project-ailab.png",
  KNN: "/IMG/project-knn.png",
  Portfolio: "/IMG/project-portfolio.png",
  // Dự án private (không công khai code) — chỉ hiển thị ảnh demo, thả file vào public/IMG/
  AutoTool: "/IMG/project-autotool.png",
  WorkFlowAI: "/IMG/project-workflowai.png",
  // CHƯA CÓ ẢNH — thả ảnh chụp màn hình vào public/IMG/ đúng tên dưới đây.
  // Thiếu file thì <img onError> tự rơi về ảnh placeholder có tên dự án, không vỡ layout.
  MadalenaApp: "/IMG/project-madalena-app.png",
  MadalenaWeb: "/IMG/project-madalena-web.png",
  LichIUH: "/IMG/project-lichiuh.png",
  NoteMod: "/IMG/project-notemod.png",
};
// Ảnh dùng cho card: ưu tiên ảnh chụp local, không có thì dùng ảnh OpenGraph của GitHub
const projectImage = (repo: string) => REPO_IMAGES[repo] || ghImage(repo);

// Ghi đè thông tin (tên, mô tả, vai trò) cho từng repo GitHub.
// Bản fetch GitHub chỉ trả về tên + mô tả thô của repo; map này dùng để hiển thị
// đúng vai trò trên từng dự án — áp cho cả danh sách tĩnh lẫn bản fetch.
// Lưu ý: key phải trùng TÊN REPO thật trên GitHub (vd AI-ML nằm ở repo "H-c-AI-ML").
//
// Mỗi dự án có HAI mức mô tả, đừng gộp làm một:
//   desc   — câu ngắn hiện trên card. Viết cho NGƯỜI KHÔNG RÀNH KỸ THUẬT: nói dự án
//            làm được gì cho người dùng, tránh tên công nghệ và từ chuyên ngành.
//            Card bị -webkit-line-clamp: 3 nên viết dài là bị cắt ngang kèm "…".
//            Giữ dưới ~130 ký tự.
//   detail  — bản đầy đủ trong modal "Xem chi tiết", viết cho NHÀ TUYỂN DỤNG: đi sâu
//            vào cách giải quyết vấn đề, quyết định kỹ thuật và kết quả đạt được.
//   tech    — danh sách công nghệ, hiện dạng chip trong modal.
const REPO_META: Record<string, any> = {
  DiemDanhQR: {
    desc: "Điểm danh bằng cách quét mã QR trên điện thoại, tên người có mặt tự chạy thẳng vào Google Sheets.",
    detail:
      "Công cụ điểm danh bằng mã QR cho một cộng đồng nhỏ. Mở trên điện thoại, bật camera quét mã của từng thành viên là tự động ghi vào Google Sheets qua Google Apps Script — không dựng máy chủ, không cài app từ store.\n\nCó hai chế độ quét: liên tục (không cần xác nhận) và từng người (chờ xác nhận). Quét xong phát âm thanh và đọc tên tiếng Việt để người cầm máy biết đã nhận, kèm lịch sử quét ngay trên màn hình. Chọn được ống kính cụ thể (góc rộng, camera trước/sau) vì camera mặc định trên nhiều máy lấy nét kém ở cự ly gần.\n\nCài lên màn hình chính như app thường nhờ PWA, có chế độ sáng/tối.",
    tech: ["JavaScript", "PWA", "Google Apps Script", "Google Sheets"],
    role: "JavaScript Developer",
    client: "Dự án cá nhân",
  },
  AI_Lab: {
    desc: "8 trò chơi để xem máy tính tự học chơi từ con số 0 — từ Flappy Bird tới cờ caro và đá bóng 3D.",
    detail:
      "AI Game Arena — ứng dụng desktop (Electron) trực quan hoá cách các giải thuật AI từ cổ điển tới hiện đại học hỏi và ra quyết định. Người dùng tự chỉnh tham số huấn luyện, cấu trúc mạng nơ-ron hoặc hàm heuristic rồi xem AI tự học từ con số 0, hoặc cho hai AI đấu nhau.\n\nTám môi trường, mỗi cái một họ giải thuật khác nhau:\n• Flappy Bird và Đua xe — mạng nơ-ron kết hợp tiến hoá di truyền, xe dùng cảm biến raycast; có sẵn trình tự vẽ đường đua.\n• Mê cung — Q-Learning, hiển thị bản đồ nhiệt của Q-Table sáng dần theo thời gian học.\n• 2048 — tìm kiếm Expectimax với heuristic độ mượt, tính đơn điệu, ô lớn ở góc.\n• Connect Four và Cờ Caro 20×20 — Minimax kèm cắt tỉa Alpha-Beta, bảng chuyển vị mã hoá Zobrist, và một bản MCTS/UCT để so sánh hiệu năng trực tiếp.\n• Bóng đá 3D và Đuổi bắt 3D — tiến hoá song song đối kháng, vật lý nảy sân và raycast 8 hướng.",
    tech: ["TypeScript", "Electron", "Three.js", "Minimax", "MCTS", "Q-Learning"],
    role: "TypeScript Developer",
    client: "Dự án cá nhân",
  },
  KNN: {
    category: "MACHINE LEARNING",
    shortName: "KNN ELBOW",
    title: "KNN | Elbow Method",
    desc: "Bài tập nhóm về cách máy tự chia dữ liệu thành từng nhóm. Tôi làm nhóm trưởng, quản lý code cho 9 người.",
    detail:
      "Bài tập nhóm môn Trí tuệ Nhân tạo: phân tích ảnh hưởng của số cụm K tới thuật toán phân cụm và triển khai phương pháp Elbow để tìm K tối ưu.\n\nVai trò của tôi là Project Manager: chia 9 đầu việc cho 9 thành viên, quản lý toàn bộ source code trên GitHub, và trực tiếp lập trình thuật toán K-Means cùng phần kiểm tra biến động của điểm gãy Elbow.\n\nNội dung gồm tiền xử lý và chuẩn hoá dữ liệu, tính WCSS/Inertia cho từng giá trị K, vẽ biểu đồ tìm điểm khuỷu tay, và đối chiếu chéo với Silhouette Score để xác nhận kết luận.",
    tech: ["Python", "scikit-learn", "pandas", "Matplotlib", "Jupyter"],
    role: "Project Manager",
    client: "Dự án học thuật (nhóm 9 người)",
    yearRole: "2026 • Project Manager",
  },
  Portfolio: {
    desc: "Chính là trang web bạn đang xem: hiệu ứng 3D, bàn phím tương tác và các trang giới thiệu bản thân.",
    detail:
      "Trang portfolio cá nhân, cũng chính là website bạn đang xem.\n\nTrang chủ là lưới neon isometric dựng bằng Three.js (WebGL + UnrealBloom), con trỏ chuột tuỳ biến kiểu giọt nước. Trang Skills có bàn phím cơ 3D tương tác: rê chuột lên từng phím thì biểu đồ tròn kỹ năng bật lát tương ứng ra ngoài. Trang Project là băng phim cuộn vô hạn, tự chạy, bấm vào xem chi tiết.\n\nDựng trên TanStack Start (SSR) + React 19 + TailwindCSS v4, deploy lên Vercel. Nội dung động (danh sách dự án, kỹ năng, màu sắc 3D) chỉnh được qua trang admin phía client mà không cần build lại.",
    tech: ["React 19", "TypeScript", "TanStack Start", "Three.js", "TailwindCSS", "Vercel"],
    role: "Frontend Developer",
    client: "Dự án cá nhân",
  },
  // AI-ML nằm ở repo GitHub tên "H-c-AI-ML".
  "H-c-AI-ML": {
    category: "MACHINE LEARNING",
    shortName: "AI / ML",
    title: "AI-ML | Học Máy & Học Sâu",
    desc: "Bộ bài tập tôi tự làm để học về trí tuệ nhân tạo, viết tay từng bước thay vì gọi thư viện cho xong.",
    detail:
      "Tổng hợp bài học và bài tập tự thực hành về Machine Learning và Deep Learning, mỗi file là một chủ đề độc lập chạy được riêng.\n\nPhần cơ bản (scikit-learn): làm sạch và tiền xử lý dữ liệu, chuẩn hoá đặc trưng, KNN, Decision Tree, phân loại nhiều lớp, ma trận nhầm lẫn và các chỉ số đánh giá, kiểm định chéo, gộp bằng Pipeline, vector hoá văn bản TF-IDF kèm Naive Bayes.\n\nPhần học sâu (TensorFlow/Keras): mạng perceptron nhiều lớp, mạng nơ-ron tích chập, và phân loại chữ số viết tay MNIST.\n\nViết tay từng bước thay vì gọi thư viện cho xong, để nắm rõ toán học phía sau mỗi thuật toán.",
    tech: ["Python", "scikit-learn", "TensorFlow", "Keras", "NumPy", "pandas"],
    role: "ML / AI Developer",
    client: "Dự án tự học",
    yearRole: "2026 • Machine Learning",
  },
};

// Dự án KHÔNG CÔNG KHAI MÃ NGUỒN: sản phẩm cho doanh nghiệp + tool cá nhân.
// GitHub API chỉ trả về repo công khai nên các mục này phải gộp thủ công và KHÔNG đặt
// `link` tới GitHub. Thứ tự ở đây = thứ tự hiển thị: việc làm thật cho doanh nghiệp
// đứng trước, rồi tới sản phẩm có người dùng thật, cuối cùng là tool cá nhân.
const privateProjects = [
  {
    id: "MadalenaApp",
    category: "REACT NATIVE • PHP API",
    shortName: "MADALENA APP",
    title: "Madalena | App khách hàng thân thiết",
    desc: "App tích điểm cho khách của một chuỗi mỹ phẩm, đã có trên Google Play. Tôi làm một mình từ app tới máy chủ.",
    detail:
      "Ứng dụng khách hàng thân thiết cho chuỗi mỹ phẩm Madalena, đã phát hành trên Google Play và đang phục vụ khách thật. Tôi làm một mình toàn bộ: app di động, REST API, cơ sở dữ liệu và các công cụ vận hành cho quản trị viên.\n\nPhía khách hàng: hạng thành viên tự xếp theo doanh thu tích luỹ (GOLDEN → VIP → VIP PRO → VIP PROMAX → VIP BLACK), mã QR định danh để nhân viên quét tại quầy, màn hình tra cứu chi tiêu từng năm, và bảng đặc quyền riêng cho mỗi hạng.\n\nFlash sale chạy theo khung giờ do quản trị viên hẹn trước. Thời gian còn lại do máy chủ tính chứ không tin đồng hồ máy khách, nên đổi giờ điện thoại cũng không lách được. Khách được nhắc ba lần: lúc đặt lịch, trước 15 phút và đúng giờ mở — mỗi mốc có cờ chống gửi trùng.\n\nChiến dịch chúc mừng sinh nhật gửi tự động bằng cron. Bảo mật: xác thực JWT HS256, quyền admin kiểm tra thẳng từ cơ sở dữ liệu thay vì tin token, và chặn brute-force đăng nhập theo cặp IP + số điện thoại.\n\nBackend ban đầu chạy Node/Express trên Render kèm database Aiven. Tôi tự port toàn bộ sang PHP để gộp chung hạ tầng với website công ty, cắt hẳn chi phí máy chủ hằng tháng. Kèm theo là bộ công cụ chạy từ máy Windows để nhập doanh thu hàng tháng và xuất danh sách khách, không cần SSH vào hosting.",
    tech: ["React Native", "Expo", "TypeScript", "PHP", "MySQL", "JWT", "Expo Push"],
    image: projectImage("MadalenaApp"),
    role: "Full-stack Developer (một mình toàn bộ)",
    client: "Madalena — dự án công ty",
    year: "2026",
    yearRole: "2026 • React Native & PHP",
    link: undefined as string | undefined,
    demo: "https://play.google.com/store/apps/details?id=com.madalena.app",
    demoLabel: "Tải trên Google Play",
  },
  {
    id: "MadalenaWeb",
    category: "PHP • WEB",
    shortName: "MADALENA WEB",
    title: "Madalena | Website thương mại điện tử",
    desc: "Website bán mỹ phẩm đang hoạt động thật. Tôi làm phần mã giảm giá, quản lý đơn hàng và tìm kiếm sản phẩm.",
    detail:
      "Website bán hàng của Madalena, chạy thật và có khách đặt hàng mỗi ngày. Tôi vào dự án khi site đã tồn tại, với vai trò lập trình viên tính năng trong đội — không phải người dựng toàn bộ site, nhưng phần tôi làm là những mảng nghiệp vụ chính bên dưới.\n\nHệ thống mã giảm giá làm từ đầu: quản trị viên tạo mã, gắn mã vào từng sản phẩm, giới hạn số lần mỗi số điện thoại được dùng, lưu trữ và thống kê mức tiêu thụ của từng mã. Phía khách thì nhập mã ngay lúc thanh toán.\n\nQuản lý đơn hàng: khách xem lại đơn cũ và tự huỷ đơn, thông tin thanh toán được nhớ cho lần mua sau. Phía cửa hàng nhận email báo mỗi khi có đơn mới, và toàn bộ đơn tự đồng bộ sang Google Sheets kèm địa chỉ, mã giảm giá, mức giảm — nhờ vậy bộ phận bán hàng theo dõi ngay trên bảng tính quen thuộc thay vì phải vào trang quản trị.\n\nNgoài ra: tìm kiếm sản phẩm, trạng thái \"Tạm hết hàng\" kèm việc tự đẩy hàng hết xuống cuối danh sách, nhãn miễn phí vận chuyển, và sửa lại cách nhập giảm giá — quản trị viên nhập thẳng giá sau giảm rồi hệ thống tự tính ra phần trăm chiết khấu, thay vì phải tự nhẩm.\n\nNền tảng là PHP tự viết của đơn vị làm web (AltoRouter, PDO, giỏ hàng, SEO, cache file, trang quản trị riêng) nên phải đọc hiểu codebase có sẵn rồi mới chèn tính năng vào.",
    tech: ["PHP", "MySQL", "JavaScript", "Google Sheets API", "AltoRouter", "PDO"],
    image: projectImage("MadalenaWeb"),
    role: "PHP Developer (phát triển tính năng)",
    client: "Madalena — dự án công ty",
    year: "2026",
    yearRole: "2026 • PHP",
    // Mã nguồn là tài sản của công ty nên không công khai, nhưng site chạy thật thì
    // công khai → chỉ đưa link bản chạy thật, giữ nhãn "private" cho phần mã nguồn.
    link: undefined as string | undefined,
    demo: "https://madalena.vn",
  },
  {
    id: "LichIUH",
    category: "KOTLIN • ANDROID",
    shortName: "LỊCH IUH",
    title: "Lịch IUH | Widget lịch học",
    desc: "Xem lịch học ngay ngoài màn hình điện thoại, không cần mở app — làm cho sinh viên trường tôi.",
    detail:
      "App Android cho sinh viên Đại học Công nghiệp TP.HCM. Ra đời vì app chính thức của trường bắt phải mở app rồi đăng nhập mới xem được lịch, trong khi thứ sinh viên cần chỉ là liếc một cái biết tiết sau học phòng nào.\n\nBa widget đặt thẳng ngoài màn hình chính: lịch 7 ngày tới gom theo từng ngày, lịch học hôm nay, và đếm ngược tới ngày thi. Mỗi buổi hiện tiết, tên môn và phòng, ghi rõ \"Trực tuyến\" nếu học online, đánh dấu buổi dạy bù và ẩn buổi tạm ngưng.\n\nDữ liệu lấy qua API chính thức của trường bằng đăng nhập OAuth2, tự đồng bộ nền hai lần mỗi ngày (6h sáng và 6h tối). Kết quả được lưu lại nên mở màn hình là widget hiện ngay, không phải chờ mạng. Mật khẩu lưu mã hoá bằng EncryptedSharedPreferences vì token của trường chỉ sống 30 phút, phải tự đăng nhập lại ngầm.\n\nMáy chủ của trường gửi thiếu chứng chỉ trung gian nên Android từ chối kết nối. Tôi nhúng thẳng chứng chỉ đó vào app và khai báo trong network security config để đi qua được, thay vì tắt kiểm tra chứng chỉ — cách làm tắt đó dễ nhưng mở toang cửa cho tấn công chen giữa.",
    tech: ["Kotlin", "Jetpack Glance", "WorkManager", "OAuth2", "EncryptedSharedPreferences"],
    image: projectImage("LichIUH"),
    role: "Android Developer",
    client: "Sản phẩm cá nhân — người dùng thật",
    year: "2026",
    yearRole: "2026 • Kotlin & Android",
    link: undefined as string | undefined,
  },
  {
    id: "WorkFlowAI",
    category: "PYTHON & AI",
    shortName: "WORKFLOW AI",
    title: "WorkFlow AI | Sản xuất video AI",
    desc: "Công cụ làm video bằng AI: nhập ý tưởng, máy tự viết kịch bản, tạo hình ảnh rồi ghép thành phim.",
    detail:
      "Công cụ làm video bằng AI theo một dây chuyền khép kín: nhập ý tưởng → AI viết kịch bản → chia thành từng cảnh → sinh ảnh và video cho mỗi cảnh → ghép lại thành phim hoàn chỉnh bằng ffmpeg. Mục tiêu là làm trọn quy trình trong một tool, không phải nhảy qua lại giữa năm sáu trang web.\n\nKhó nhất là khâu sinh hình ảnh: nền tảng đích không mở API công khai, nên tool gắn vào một cửa sổ Chrome thật qua giao thức gỡ lỗi từ xa (CDP) và điều khiển bằng Playwright, dùng chính tài khoản của người dùng. Vì giao diện web có thể đổi bất cứ lúc nào, mọi bước đều có phương án dự phòng dán tay để tool không chết cứng khi nhà cung cấp cập nhật.\n\nPhần hỏi AI cho kịch bản có bốn chế độ để người dùng chọn theo túi tiền: gọi API trả phí, điều khiển trình duyệt để dùng tài khoản sẵn có, dán tay, hoặc mua credit qua license server riêng.\n\nLicense server đó là phần hạ tầng để bán tool: khoá API và mẫu câu lệnh nằm trên máy chủ chứ không nằm trong bản giao cho khách, khách nạp credit bằng mã. Mỗi lần hỏi AI trừ đúng một lượt bất kể model đắt hay rẻ, và nếu AI trả về sai định dạng thì tự hoàn lại credit.",
    tech: ["Python", "FastAPI", "Playwright", "CDP", "ffmpeg", "SQLite"],
    image: projectImage("WorkFlowAI"),
    role: "Python / AI Developer",
    client: "Sản phẩm cá nhân (private)",
    year: "2026",
    yearRole: "2026 • Python & AI",
    link: undefined as string | undefined,
  },
  {
    id: "NoteMod",
    category: "ANDROID • REVERSE ENGINEERING",
    shortName: "NOTE MOD",
    title: "Ghi chú Mod | Dịch ngược app Xiaomi",
    desc: "Thêm tính năng vào app Ghi chú có sẵn của điện thoại Xiaomi mà không làm mất chức năng cũ nào.",
    detail:
      "App Ghi chú của Xiaomi thiếu vài thứ tôi cần, nhưng viết lại từ đầu thì mất những tính năng chỉ hãng mới làm được: vẽ tay, viết bút cảm ứng, bản đồ tư duy — chúng chạy trên thư viện native riêng. Nên thay vì viết lại, tôi sửa thẳng vào app gốc.\n\nQuy trình: dịch ngược app ra 15.386 file, viết tính năng mới bằng Kotlin, biên dịch xuống smali rồi tiêm vào đúng chỗ, ký lại và cài. Đổi luôn tên gói (13 authority, 88 URI) để bản sửa cài song song bản gốc, lỡ hỏng vẫn còn đường lùi.\n\nĐã thêm được: màn Lịch trình dạng lịch tuần (chụm ngón phóng to, vạch đỏ chỉ giờ hiện tại, sự kiện lặp và nhắc trước), đồng bộ qua Supabase thay cho Mi Cloud, và trợ lý Gemini.\n\nHai chỗ tốn nhiều thời gian nhất: công cụ dịch ngược không đọc nổi tài nguyên nếu chưa nạp khung miui.system lấy từ máy thật — chỗ này tôi từng kết luận nhầm là không làm được; và vì Xiaomi không phát hành thư viện API, tôi phải dựng một module khai lớp giả để biên dịch được, chữ ký phải khớp tuyệt đối tới từng kiểu trả về.\n\nĐánh đổi phải chấp nhận: bản sửa thiếu 29 quyền cấp chữ ký nên mất đồng bộ Mi Cloud và mở khoá ghi chú riêng tư bằng vân tay — không sửa được vì cần khoá ký của hãng.",
    tech: ["Kotlin", "smali", "apktool", "Supabase", "Gemini API", "Android"],
    image: projectImage("NoteMod"),
    role: "Android / Reverse Engineering",
    client: "Sản phẩm cá nhân (private)",
    year: "2026",
    yearRole: "2026 • Reverse Engineering",
    link: undefined as string | undefined,
  },
  {
    id: "AutoTool",
    category: "PYTHON • AUTOMATION",
    shortName: "AUTOTOOL",
    title: "AutoTool | Tự động hoá web",
    desc: "Phần mềm máy tính làm thay việc nhập liệu tay: sửa giá hàng loạt và xuất báo cáo Excel.",
    detail:
      "Công cụ nội bộ sinh ra để bỏ một việc thủ công lặp đi lặp lại: mỗi đợt khuyến mãi phải mở trang quản trị, sửa giá từng sản phẩm một, hàng trăm lần. Tool tự đăng nhập rồi làm hàng loạt.\n\nNgười dùng tick chọn sản phẩm rồi chọn cách chỉnh: nhập phần trăm chiết khấu áp cho cả loạt, hoặc đặt đồng giá một mức cho tất cả. Có kiểm tra dữ liệu nhập ngay tại chỗ (chiết khấu phải là số 0–100, tự bỏ số 0 thừa) để không lỡ tay đẩy giá sai lên sàn.\n\nNgoài chỉnh giá còn trích xuất được đơn hàng kèm địa chỉ và xuất ra Excel để đối chiếu.\n\nToàn bộ tác vụ nặng chạy ở luồng nền nên cửa sổ không bị treo trắng khi đang xử lý — đây là lỗi kinh điển của ứng dụng Tkinter viết vội, và cũng là lý do người dùng hay tưởng phần mềm hỏng rồi tắt ngang giữa chừng.",
    tech: ["Python", "Tkinter", "Selenium", "openpyxl", "threading"],
    image: projectImage("AutoTool"),
    role: "Python Developer",
    client: "Công cụ nội bộ (private)",
    year: "2026",
    yearRole: "2026 • Python",
    link: undefined as string | undefined,
  },
];

// Danh sách dự án tĩnh = dự án private + các repo công khai thật trên GitHub.
// Dùng để hiển thị tức thì khi mở trang và làm phương án dự phòng khi không gọi được API
// (offline / vượt giới hạn request). Bản fetch động bên dưới sẽ ghi đè phần repo công khai.
const publicProjects = [
  {
    id: "DiemDanhQR",
    category: "JAVASCRIPT",
    shortName: "QR ATTENDANCE",
    title: "DiemDanhQR | Điểm danh QR",
    ...REPO_META.DiemDanhQR,
    image: projectImage("DiemDanhQR"),
    year: "2026",
    yearRole: "2026 • JavaScript",
    link: `https://github.com/${GITHUB_USER}/DiemDanhQR`,
    demo: "https://tthanh2k6.github.io/DiemDanhQR/",
  },
  {
    id: "AI_Lab",
    category: "TYPESCRIPT & AI",
    shortName: "AI LAB",
    title: "AI_Lab | Thử nghiệm AI",
    ...REPO_META.AI_Lab,
    image: projectImage("AI_Lab"),
    year: "2026",
    yearRole: "2026 • TypeScript",
    link: `https://github.com/${GITHUB_USER}/AI_Lab`,
    demo: "https://ai-lab-tthanh2006.vercel.app",
  },
  {
    id: "KNN",
    ...REPO_META.KNN,
    image: projectImage("KNN"),
    year: "2026",
    link: `https://github.com/${GITHUB_USER}/KNN`,
  },
  {
    id: "H-c-AI-ML",
    ...REPO_META["H-c-AI-ML"],
    image: projectImage("H-c-AI-ML"),
    year: "2026",
    link: `https://github.com/${GITHUB_USER}/H-c-AI-ML`,
  },
  {
    id: "Portfolio",
    category: "WEB & 3D",
    shortName: "PORTFOLIO",
    title: "Portfolio | Trang cá nhân",
    ...REPO_META.Portfolio,
    image: projectImage("Portfolio"),
    year: "2026",
    yearRole: "2026 • Web & 3D",
    link: `https://github.com/${GITHUB_USER}/Portfolio`,
    demo: "https://portfolio-tthanh2006.vercel.app/",
  },
];

// Danh sách hiển thị mặc định: dự án không công khai mã nguồn đứng trước, rồi tới repo công khai.
// Được export để trang /admin dùng CHUNG một nguồn — trước đây admin tự chép lại danh sách
// riêng nên bị lệch, và mỗi lần bấm lưu là ghi đè danh sách thiếu dự án xuống localStorage.
export const projects = [...privateProjects, ...publicProjects];

// Nhãn cho nút chính của card, tuỳ theo dự án có công khai mã nguồn hay không:
//  - không có link  -> dự án private, nút trơ (không bấm được)
//  - link GitHub    -> mở mã nguồn
//  - link khác      -> website chạy thật của khách hàng
function primaryLinkLabel(link?: string) {
  if (!link) return "Private • mã nguồn không công khai";
  return link.includes("github.com") ? "Xem trên GitHub" : "Xem website";
}

// Modal "Xem chi tiết": card chỉ đủ chỗ cho 3 dòng mô tả nên phần viết sâu cho nhà
// tuyển dụng (cách giải quyết vấn đề, quyết định kỹ thuật, đánh đổi) để hết ở đây.
function ProjectDetailModal({
  proj,
  onClose,
}: {
  proj: any;
  onClose: () => void;
}) {
  // Esc để đóng + khoá cuộn nền, tránh cuộn xuyên qua modal xuống carousel bên dưới
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // detail có thể xuống dòng bằng \n\n -> tách thành từng đoạn cho dễ đọc
  const paragraphs = String(proj.detail || proj.desc || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className="pd-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={proj.title}
      onClick={onClose}
    >
      {/* Chặn nổi bọt để bấm bên trong panel không đóng modal */}
      <div className="pd-panel" onClick={(e) => e.stopPropagation()}>
        <button className="pd-close" onClick={onClose} aria-label="Đóng">
          ✕
        </button>

        <div className="pd-banner">
          <img
            src={proj.image}
            alt={proj.title}
            onError={(e) => {
              const t = e.currentTarget;
              t.src = `https://placehold.co/1440x880/111219/ffffff?text=${encodeURIComponent(
                proj.shortName || proj.title
              )}`;
            }}
          />
        </div>

        <div className="pd-body">
          <span className="pd-category">{proj.category}</span>
          <h2 className="pd-title">{proj.title}</h2>

          <div className="pd-meta">
            <div>
              <span>Vai trò</span>
              <strong>{proj.role}</strong>
            </div>
            <div>
              <span>Bối cảnh</span>
              <strong>{proj.client}</strong>
            </div>
            <div>
              <span>Năm</span>
              <strong>{proj.year}</strong>
            </div>
          </div>

          {proj.tech?.length ? (
            <div className="pd-tech">
              {proj.tech.map((t: string) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          ) : null}

          <div className="pd-text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="pd-actions">
            {proj.demo ? (
              <a
                href={proj.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn pd-btn-primary"
              >
                {proj.demoLabel || "Xem bản chạy thật"}
              </a>
            ) : null}
            {proj.link ? (
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn"
              >
                {primaryLinkLabel(proj.link)}
              </a>
            ) : (
              <span className="pd-btn pd-btn-private">
                {primaryLinkLabel(undefined)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Chuyển một repo trả về từ GitHub API sang đúng cấu trúc card dự án
function mapRepoToProject(repo: any) {
  const lang = repo.language || "Code";
  const year = (repo.updated_at || "").slice(0, 4);
  const base = {
    id: repo.name,
    category: (repo.language || "PROJECT").toUpperCase(),
    shortName: repo.name,
    title: repo.name,
    desc: repo.description || "Dự án mã nguồn trên GitHub — bấm để xem chi tiết.",
    image: projectImage(repo.name),
    role: `${lang} Developer`,
    client: "Dự án cá nhân",
    year,
    yearRole: `${year} • ${lang}`,
    link: repo.html_url,
    // Trường "Website" của repo trên GitHub = bản deploy chạy thật, dùng làm nút phụ.
    demo: repo.homepage || undefined,
  };
  // Ghi đè bằng thông tin tự soạn (vai trò, mức độ dùng AI...) nếu repo có trong REPO_META
  return { ...base, ...(REPO_META[repo.name] || {}) };
}

export function ProjectSection() {
  const [projectList, setProjectList] = useState<any[]>(projects);
  const [activeIndex, setActiveIndex] = useState(12);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNoTransitions, setIsNoTransitions] = useState(false);
  const [isFastTransitions, setIsFastTransitions] = useState(false);

  // Dự án đang mở trong modal chi tiết (null = đang đóng)
  const [detailProj, setDetailProj] = useState<any | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(12);
  const isTransitioningRef = useRef(false);
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bản ref của trạng thái modal: resetAutoplayTimer chạy trong setTimeout nên đọc
  // state trực tiếp sẽ dính giá trị cũ (stale closure).
  const detailOpenRef = useRef(false);

  // Mở modal thì dừng hẳn autoplay, đóng thì chạy lại — không thì carousel vẫn
  // trượt sau lưng modal, đóng ra đã lạc sang dự án khác.
  useEffect(() => {
    detailOpenRef.current = detailProj !== null;
    if (detailProj) {
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    } else {
      resetAutoplayTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailProj]);

  // Đồng bộ state refs để tránh lỗi stale closure trong window events/timeouts
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // Lưới an toàn: nếu đang transition mà sau ~1.2s vẫn chưa nhận được 'transitionend'
  // (vd: tab bị ẩn, transition bị huỷ giữa chừng) thì tự gỡ khoá để không kẹt cứng slider.
  useEffect(() => {
    if (!isTransitioning) return;
    const failSafe = setTimeout(() => {
      setIsTransitioning(false);
      setIsFastTransitions(false);
    }, 1200);
    return () => clearTimeout(failSafe);
  }, [isTransitioning]);

  // Tải danh sách dự án (chỉ chạy phía client). Thứ tự ưu tiên:
  //   1. localStorage "project_list" (do admin chỉnh) — nếu có thì dùng luôn, không gọi API.
  //   2. Hiển thị ngay danh sách tĩnh, rồi fetch repo công khai từ GitHub để cập nhật.
  //   3. Nếu fetch lỗi (offline / vượt giới hạn request) thì giữ nguyên danh sách tĩnh.
  useEffect(() => {
    // Gán danh sách + canh activeIndex về giữa dải nhân bản (5 bộ) để cuộn vòng mượt
    const applyList = (raw: any[]) => {
      const list = raw.map((item: any) =>
        item.yearRole ? item : { ...item, yearRole: `${item.year} • ${item.role}` }
      );
      setProjectList(list);
      const N = list.length;
      // Bộ thứ 3 (floor(5/2)=2 -> 2*N) + phần tử giữa của bộ (floor(N/2)), để dư bộ ở cả 2 phía.
      const initialIndex = Math.floor(5 / 2) * N + Math.floor(N / 2);
      setActiveIndex(initialIndex);
      activeIndexRef.current = initialIndex;
    };

    // 1. Ưu tiên danh sách do admin quản lý
    const stored = localStorage.getItem("project_list");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          applyList(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse project_list", e);
      }
    }

    // 2. Hiển thị ngay danh sách tĩnh (4 repo thật) làm nội dung tức thì + dự phòng
    applyList(projects);

    // 3. Lấy repo công khai mới nhất từ GitHub (tự cập nhật khi thêm repo mới)
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((repos) => {
        if (cancelled || !Array.isArray(repos)) return;
        // Bỏ các repo fork, chỉ giữ dự án của chính mình
        const mapped = repos.filter((r: any) => !r.fork).map(mapRepoToProject);
        // Luôn giữ dự án private (tool) ở đầu — GitHub API không trả về chúng
        if (mapped.length > 0) applyList([...privateProjects, ...mapped]);
      })
      .catch((err) => console.error("Không lấy được repo GitHub:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  // Effect tính toán căn giữa
  const calculateTranslation = () => {
    if (!trackRef.current) return;
    const activeCard = trackRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLDivElement;
    if (!activeCard) return;

    const viewportCenter = window.innerWidth / 2;
    const activeCardCenterOffset =
      activeCard.offsetLeft + activeCard.offsetWidth / 2;
    const tx = viewportCenter - activeCardCenterOffset;
    setTranslateX(tx);
  };

  useEffect(() => {
    calculateTranslation();
    window.addEventListener("resize", calculateTranslation);
    return () => window.removeEventListener("resize", calculateTranslation);
  }, [activeIndex, projectList]);

  // Thiết lập độ trễ autoplay
  const AUTOPLAY_DELAY = 3000;

  const resetAutoplayTimer = () => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }

    // Đang đọc chi tiết thì không tự chuyển card
    if (detailOpenRef.current) return;

    // Tạm dừng hoàn toàn autoplay nếu đang hover card active
    if (trackRef.current) {
      const activeCard = trackRef.current.querySelector(
        ".project-card.active"
      ) as HTMLDivElement;
      if (activeCard && activeCard.matches(":hover")) {
        return;
      }
    }

    autoplayTimeoutRef.current = setTimeout(() => {
      const currentIdx = activeIndexRef.current;
      if (projectList.length === 0) return;
      const nextLogical = (currentIdx + 1) % projectList.length;
      goToProject(nextLogical);
    }, AUTOPLAY_DELAY);
  };

  // Tìm index đích gần nhất theo vòng tròn (modular): từ vị trí hiện tại đi tới logic đích
  // theo hướng ngắn nhất, thay vì luôn đi tiến. Nhờ vậy chuyển từ card cuối -> card đầu
  // sẽ trượt sang phải 1 bước thay vì lùi qua cả danh sách.
  const getShortestPath = (fromIndex: number, targetLogical: number) => {
    const len = projectList.length;
    if (len === 0) return fromIndex;
    const currentLogical = fromIndex % len;
    let diff = targetLogical - currentLogical;
    // Chuẩn hóa diff về khoảng [-len/2, len/2] (ở đây ngưỡng 2 = floor(5/2)) để chọn chiều ngắn nhất:
    // nếu đi tiến quá nửa vòng thì đổi sang đi lùi (và ngược lại).
    if (diff > 2) diff -= len;
    if (diff < -2) diff += len;
    return fromIndex + diff;
  };

  const goToProject = (targetLogical: number) => {
    if (isTransitioningRef.current) return;

    const currentIdx = activeIndexRef.current;
    const closestTarget = getShortestPath(currentIdx, targetLogical);
    const N = projectList.length;
    if (N === 0) return;

    // Đích trùng vị trí hiện tại (vd: bấm vào chính card active ở giữa) -> không có
    // chuyển động nào -> sự kiện 'transitionend' của transform sẽ KHÔNG bao giờ bắn.
    // Phải thoát sớm, nếu không setIsTransitioning(true) bên dưới sẽ kẹt true mãi mãi
    // và khoá toàn bộ thao tác cuộn/click sau đó.
    if (closestTarget === currentIdx) {
      setIsFastTransitions(false);
      return;
    }

    // Vùng an toàn = bộ nhân bản ở giữa [2*N .. 3*N-1]. Nếu đích gần nhất vẫn nằm
    // trong vùng này thì chỉ cần transition mượt bình thường (còn dư bộ 2 phía nên không lo hết card).
    if (closestTarget >= 2 * N && closestTarget <= 3 * N - 1) {
      setIsTransitioning(true);
      setActiveIndex(closestTarget);
    } else {
      // Đích bị trôi ra ngoài vùng an toàn -> phải "tái định vị" về giữa để còn chỗ cuộn tiếp.
      setIsTransitioning(true);
      // safeTarget: cùng logic đích nhưng đặt trong bộ giữa.
      const safeTarget = 2 * N + targetLogical;
      // start: lùi safeTarget lại đúng quãng đường (closestTarget - currentIdx) cần trượt,
      // để khi trượt từ start -> safeTarget mắt thấy đúng hướng/khoảng cách như đi tới closestTarget.
      const start = safeTarget - (closestTarget - currentIdx);

      // Thủ thuật chống nhấp nháy: nhảy tức thì (tắt transition) về 'start' tương đương,
      // người dùng không thấy vì vị trí hiển thị giống hệt vị trí cũ.
      setIsNoTransitions(true);
      setActiveIndex(start);

      // 35ms: chờ React commit DOM + browser áp layout của bước nhảy (đang tắt transition) xong
      // mới bật lại transition, tránh trình duyệt gộp 2 lần đổi index thành 1 animation giật.
      setTimeout(() => {
        setIsNoTransitions(false);

        // 20ms: thêm 1 frame đệm sau khi bật lại transition rồi mới đổi tới safeTarget,
        // đảm bảo cú trượt cuối chạy mượt thay vì bị nhảy cóc.
        setTimeout(() => {
          setActiveIndex(safeTarget);
        }, 20);
      }, 35);
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target === e.currentTarget && e.propertyName === "transform") {
      setIsTransitioning(false);
      setIsFastTransitions(false);
    }
  };

  // Xử lý khi click vào card
  const handleCardClick = (idx: number) => {
    if (isTransitioningRef.current) return;
    if (projectList.length === 0) return;
    const clickedLogical = idx % projectList.length;
    setIsFastTransitions(true);
    goToProject(clickedLogical);
    resetAutoplayTimer();
  };

  // Tín hiệu hover của con trỏ chuột
  const triggerCursorHover = (enter: boolean) => {
    const eventName = enter ? "cursorHoverEnter" : "cursorHoverLeave";
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const handleCardMouseEnter = (idx: number) => {
    triggerCursorHover(true);
    if (idx === activeIndex) {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    }
  };

  const handleCardMouseLeave = () => {
    triggerCursorHover(false);
    resetAutoplayTimer();
  };

  // Timers & listeners của autoplay
  useEffect(() => {
    resetAutoplayTimer();
    return () => {
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    };
  }, [activeIndex, projectList]);

  useEffect(() => {
    const handleGlobalInteraction = () => {
      resetAutoplayTimer();
    };

    window.addEventListener("mousemove", handleGlobalInteraction);
    window.addEventListener("mousedown", handleGlobalInteraction);
    window.addEventListener("keydown", handleGlobalInteraction);
    window.addEventListener("wheel", handleGlobalInteraction);
    document.addEventListener("mouseleave", handleGlobalInteraction);
    document.addEventListener("mouseenter", handleGlobalInteraction);

    return () => {
      window.removeEventListener("mousemove", handleGlobalInteraction);
      window.removeEventListener("mousedown", handleGlobalInteraction);
      window.removeEventListener("keydown", handleGlobalInteraction);
      window.removeEventListener("wheel", handleGlobalInteraction);
      document.removeEventListener("mouseleave", handleGlobalInteraction);
      document.removeEventListener("mouseenter", handleGlobalInteraction);
    };
  }, [projectList]);

  // Nhân bản danh sách 5 lần (vd 5 dự án -> 25 card) để tạo ảo giác cuộn vô hạn:
  // luôn còn card đệm ở 2 đầu, kết hợp cú nhảy "tái định vị" trong goToProject.
  const repeatCount = 5;
  const cardsData = Array.from(
    { length: repeatCount * projectList.length },
    (_, idx) => {
      const proj = projectList[idx % projectList.length];
      return { ...proj, globalIdx: idx };
    }
  );

  const logicalProjIndex = activeIndex % projectList.length;

  return (
    <>
      {/* Khối style đóng gói phạm vi */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .project-section-wrapper {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: #06070d;
          background-image: url('/IMG/background.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          overflow: hidden;
          font-family: 'Be Vietnam Pro', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #ffffff;
          user-select: none; -webkit-user-select: none;
          -webkit-user-drag: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Nền mờ ảo đồng bộ */
        .project-section-wrapper::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(0,162,255,0.04) 0%, rgba(240,147,43,0.01) 60%, transparent 100%);
          pointer-events: none; z-index: 1;
          animation: techPulse 8s ease-in-out infinite alternate;
        }
        @keyframes techPulse { 0%{opacity:.5} 100%{opacity:1} }

        /* ===== GỢI Ý CUỘN ===== */
        .scroll-hint {
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 100px;
          padding: 9px 20px;
          color: rgba(255,255,255,0.6);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          backdrop-filter: blur(6px);
          background: rgba(255,255,255,0.04);
        }

        /* ===== TIÊU ĐỀ GALLERY CHÍNH ===== */
        .gallery-title-wrapper {
          text-align: center;
          margin-top: 120px;
          z-index: 2;
          opacity: 0;
          animation: fadeUp 0.9s ease 0.3s forwards;
        }

        .gallery-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2.6rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0;
          display: flex;
          justify-content: center;
          gap: 14px;
        }

        .gallery-title .word-project {
          color: #ffffff;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        }

        .gallery-title .word-showcase {
          background: linear-gradient(90deg, #00a2ff 0%, #f0932b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 8px rgba(0, 162, 255, 0.15));
        }

        /* ===== CONTAINER CUỘN PHIM ===== */
        .filmstrip-container {
          position: relative;
          width: 100%;
          height: 580px;
          z-index: 2;
          overflow: visible;
          display: flex;
          align-items: center;
          opacity: 0;
          animation: fadeIn 1.2s ease 0.4s forwards;
        }

        /* Cuộn phim răng đục chạy nền */
        .filmstrip-bg-ribbon {
          position: absolute;
          left: 0; right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 260px;
          background: rgba(18, 20, 27, 0.4);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1;
          pointer-events: none;
        }

        .filmstrip-bg-ribbon::before, .filmstrip-bg-ribbon::after {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 10px;
          background-image: repeating-linear-gradient(to right, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 8px, transparent 8px, transparent 18px);
        }
        .filmstrip-bg-ribbon::before { top: 6px; }
        .filmstrip-bg-ribbon::after { bottom: 6px; }

        /* Track di chuyển */
        .filmstrip-track {
          display: flex;
          align-items: center;
          height: 100%;
          will-change: transform;
          transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 2;
        }

        /* ===== CLASS KHÓA TRANSITION ĐỂ JUMP TRÁNH NHẤP NHÁY VÀ GIẬT HÌNH ===== */
        .no-transitions, .no-transitions * {
          transition: none !important;
          animation: none !important;
        }

        /* ===== TRƯỢT NHANH KHI CLICK CARD HOẶC INDICATOR ===== */
        .fast-transitions, .fast-transitions * {
          transition-duration: 0.28s !important;
        }

        /* ===== CARD DỰ ÁN ===== */
        .project-card {
          position: relative;
          width: 360px;
          height: 220px;
          margin: 0 35px;
          border-radius: 20px;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(18, 19, 26, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.06);
          opacity: 0.25;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 14px;
          transition: height 0.65s cubic-bezier(0.25, 1, 0.5, 1), 
                      border-color 0.5s ease, 
                      box-shadow 0.5s ease,
                      opacity 0.6s ease;
        }

        /* Thẻ lân cận */
        .project-card.neighbor {
          opacity: 0.65;
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* Thẻ active phình to */
        .project-card.active {
          height: 550px;
          opacity: 1;
          border: 2px solid #ffffff;
          box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(255,255,255,0.08);
          background: #111219;
          z-index: 10;
          padding: 16px;
        }

        /* KHUNG ẢNH DÙNG CHUNG */
        .card-img-box {
          width: 100%;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          flex-shrink: 0;
          transition: height 0.65s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.65s ease;
        }

        .project-card.active .card-img-box {
          height: 200px;
          border-radius: 14px;
        }

        /* Transition của ảnh */
        .project-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(1) brightness(0.5);
          transition: filter 0.45s ease, transform 0.6s ease;
        }

        /* Sắc độ thẻ lân cận */
        .project-card.neighbor .project-card-img {
          filter: grayscale(0.6) brightness(0.75);
        }

        /* Sắc độ thẻ active chính giữa */
        .project-card.active .project-card-img {
          filter: grayscale(0) brightness(0.95);
        }

        .project-card:hover .project-card-img {
          transform: scale(1.03);
        }

        /* Canh phần trên của ảnh (hữu ích cho ảnh dọc như DiemDanhQR -> lộ header app) */
        .project-card-img.fit-top {
          object-position: center top;
        }

        /* Phóng to ảnh có nhiều lề trống (AI_Lab) để nội dung lấp đầy khung, canh phần trên */
        .project-card-img.zoom {
          transform: scale(1.5);
          object-position: center top;
        }
        .project-card:hover .project-card-img.zoom {
          transform: scale(1.55);
        }

        /* --- STYLE THÔNG TIN THU GỌN --- */
        .info-collapsed {
          display: flex;
          flex-direction: column;
          margin-top: 12px;
          opacity: 1;
          transition: opacity 0.4s ease;
        }

        .project-card.active .info-collapsed {
          opacity: 0;
          height: 0;
          margin: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .collapsed-num {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .collapsed-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .collapsed-preview-link {
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-top: 10px;
          display: inline-block;
        }

        /* --- STYLE THÔNG TIN MỞ RỘNG --- */
        .info-expanded {
          display: flex;
          flex-direction: column;
          margin-top: 14px;
          opacity: 0;
          height: 0;
          overflow: hidden;
          transition: opacity 0.5s ease 0.15s, height 0.65s cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
        }

        .project-card.active .info-expanded {
          opacity: 1;
          height: calc(100% - 214px);
          pointer-events: auto;
        }

        .expanded-title {
          font-size: 1.28rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
          flex-shrink: 0;
        }

        .expanded-desc {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.5;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-shrink: 0;
        }

        .expanded-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.85);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 12px;
          flex-shrink: 0;
        }

        .detail-row {
          display: flex;
          gap: 8px;
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.4);
          width: 60px;
          font-weight: 500;
        }

        /* Cụm nút cuối card: gom nút "bản chạy thật" + nút mã nguồn vào một khối,
           khối này mới là thứ bị đẩy xuống đáy (thay cho margin-top:auto của từng nút). */
        .expanded-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .expanded-btn {
          background: #252e42;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          text-align: center;
          padding: 12px 0;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          width: 100%;
          transition: all 0.3s ease;
          margin-top: 0;
        }

        .expanded-btn:hover {
          background: #ffffff;
          color: #000000;
        }

        /* Nút chính (bản chạy thật) — nổi bật hơn nút xem mã nguồn */
        .expanded-btn.primary-cta {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        .expanded-btn.primary-cta:hover {
          background: #c9d4ff;
          border-color: #c9d4ff;
        }

        /* Dự án không công khai mã nguồn: nút chỉ để thông báo, không bấm được */
        .expanded-btn.is-private {
          background: transparent;
          border-style: dashed;
          border-color: rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.55);
          cursor: default;
          letter-spacing: 1px;
        }

        .expanded-btn.is-private:hover {
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
        }

        /* Nút chi tiết là <button> chứ không phải <a>, nên phải trả lại font và
           con trỏ mặc định của trình duyệt cho khớp các nút dạng link còn lại. */
        button.expanded-btn {
          font-family: inherit;
          cursor: pointer;
        }

        /* Dòng chú thích nhỏ dưới nút: cho biết dự án có công khai mã nguồn không */
        .expanded-note {
          font-size: 0.68rem;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
          text-align: center;
        }

        /* ===== MODAL CHI TIẾT DỰ ÁN ===== */
        .pd-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(4, 5, 9, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          animation: pdFade 0.25s ease;
        }

        @keyframes pdFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pd-panel {
          position: relative;
          width: min(880px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          background: #12131a;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65);
          animation: pdRise 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        @keyframes pdRise {
          from { transform: translateY(18px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .pd-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(10, 11, 16, 0.72);
          backdrop-filter: blur(6px);
          color: #fff;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
        }

        .pd-close:hover {
          background: #ffffff;
          color: #000000;
          transform: rotate(90deg);
        }

        .pd-banner {
          width: 100%;
          aspect-ratio: 1440 / 880;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
          background: #0c0d12;
        }

        .pd-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .pd-body { padding: 26px 32px 32px; }

        .pd-category {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #8ea2ff;
        }

        .pd-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin: 6px 0 18px;
          letter-spacing: -0.5px;
        }

        .pd-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding: 16px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .pd-meta div { display: flex; flex-direction: column; gap: 3px; }

        .pd-meta span {
          font-size: 0.68rem;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        .pd-meta strong {
          font-size: 0.88rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
        }

        .pd-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 18px 0 4px;
        }

        .pd-tech span {
          font-size: 0.74rem;
          font-weight: 600;
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(142, 162, 255, 0.11);
          border: 1px solid rgba(142, 162, 255, 0.22);
          color: #c3cdff;
        }

        .pd-text {
          margin-top: 18px;
          font-size: 0.92rem;
          line-height: 1.72;
          color: rgba(255, 255, 255, 0.74);
        }

        .pd-text p { margin: 0 0 13px; }
        .pd-text p:last-child { margin-bottom: 0; }

        .pd-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .pd-btn {
          flex: 1 1 200px;
          text-align: center;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: #252e42;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .pd-btn:hover { background: #fff; color: #000; }

        .pd-btn-primary {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .pd-btn-primary:hover { background: #c9d4ff; border-color: #c9d4ff; }

        .pd-btn-private {
          background: transparent;
          border-style: dashed;
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.5);
          cursor: default;
        }

        .pd-btn-private:hover {
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 640px) {
          .pd-overlay { padding: 16px 12px; }
          .pd-body { padding: 20px 20px 24px; }
          .pd-title { font-size: 1.3rem; }
          .pd-meta { grid-template-columns: 1fr; gap: 10px; }
        }

        /* ===== ĐIỀU KHIỂN PHÍA DƯỚI ===== */
        .bottom-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 60px 40px 60px;
          z-index: 2;
          opacity: 0;
          animation: fadeIn 0.9s ease 0.5s forwards;
        }

        /* Indicator slide */
        .indicators-wrapper {
          display: flex;
          gap: 12px;
        }

        .indicator {
          width: 32px;
          height: 3px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          transition: background 0.3s ease, width 0.3s ease;
        }

        .indicator.active {
          background: #ffffff;
          width: 48px;
        }

        /* Hoạt ảnh */
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .gallery-title-wrapper { margin-top: 100px; }
          .project-card { width: 320px; }
          .project-card.active { height: 510px; }
          .card-img-box { height: 110px; }
          .project-card.active .card-img-box { height: 180px; }
          .bottom-controls { padding: 0 30px 30px 30px; }
        }
      `}</style>

      <div className="project-section-wrapper">
        {/* Thanh điều hướng */}
        <NavBar className="mix-blend-difference" />

        {/* Khối tiêu đề */}
        <div className="gallery-title-wrapper">
          <h1 className="gallery-title">
            <span className="word-project">Project</span>
            <span className="word-showcase">Showcase</span>
          </h1>
        </div>

        {/* Slider cuộn phim */}
        <main className="filmstrip-container" id="filmstripContainer">
          <div className="filmstrip-bg-ribbon" />
          <div
            ref={trackRef}
            className={`filmstrip-track ${
              isNoTransitions ? "no-transitions" : ""
            } ${isFastTransitions ? "fast-transitions" : ""}`}
            style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {cardsData.map((proj) => {
              const idx = proj.globalIdx;
              const isActive = idx === activeIndex;
              const isNeighbor =
                idx === activeIndex - 1 || idx === activeIndex + 1;

              return (
                <div
                  key={idx}
                  className={`project-card ${isActive ? "active" : ""} ${
                    isNeighbor ? "neighbor" : ""
                  }`}
                  data-index={idx}
                  onClick={() => handleCardClick(idx)}
                  onMouseEnter={() => handleCardMouseEnter(idx)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {/* Khung ảnh dùng chung */}
                  <div className="card-img-box">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className={`project-card-img ${
                        proj.id === "AI_Lab" ? "zoom" : ""
                      } ${proj.id === "DiemDanhQR" ? "fit-top" : ""}`}
                      draggable="false"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const og = ghImage(proj.id);
                        // Thiếu ảnh local -> thử ảnh OpenGraph GitHub; nếu vẫn lỗi -> placeholder
                        if (!target.dataset.fallback && proj.id) {
                          target.dataset.fallback = "og";
                          target.src = og;
                        } else {
                          target.src = `https://placehold.co/600x338/111219/ffffff?text=${encodeURIComponent(
                            proj.shortName
                          )}`;
                        }
                      }}
                    />
                  </div>

                  {/* Thông tin thu gọn */}
                  <div className="info-collapsed">
                    <span className="collapsed-num">{proj.category}</span>
                    <h3 className="collapsed-title">{proj.shortName}</h3>
                    <span className="collapsed-preview-link">
                      {proj.yearRole}
                    </span>
                  </div>

                  {/* Thông tin mở rộng */}
                  <div className="info-expanded">
                    <h2 className="expanded-title">{proj.title}</h2>
                    <p className="expanded-desc">{proj.desc}</p>
                    <div className="expanded-details">
                      <div className="detail-row">
                        <span className="detail-label">Role:</span>
                        <span>{proj.role}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Client:</span>
                        <span>{proj.client}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Year:</span>
                        <span>{proj.year}</span>
                      </div>
                    </div>
                    {/* Card chỉ giữ MỘT hành động cho gọn; link bản chạy thật và mã
                        nguồn chuyển hết vào modal cùng với mô tả đầy đủ. */}
                    <div className="expanded-actions">
                      <button
                        type="button"
                        className="expanded-btn primary-cta"
                        onMouseEnter={() => triggerCursorHover(true)}
                        onMouseLeave={() => triggerCursorHover(false)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailProj(proj);
                        }}
                      >
                        Xem chi tiết
                      </button>
                      <span className="expanded-note">
                        {proj.link
                          ? "Mã nguồn công khai"
                          : "Mã nguồn không công khai"}
                        {proj.demo ? " • có bản chạy thật" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {detailProj ? (
          <ProjectDetailModal
            proj={detailProj}
            onClose={() => setDetailProj(null)}
          />
        ) : null}

        {/* Indicator ở footer */}
        <footer className="bottom-controls">
          <div className="indicators-wrapper" id="indicatorsWrapper">
            {projectList.map((proj, idx) => (
              <div
                key={idx}
                className={`indicator ${
                  idx === logicalProjIndex ? "active" : ""
                }`}
                onMouseEnter={() => triggerCursorHover(true)}
                onMouseLeave={() => triggerCursorHover(false)}
                onClick={() => {
                  setIsFastTransitions(true);
                  goToProject(idx);
                  resetAutoplayTimer();
                }}
              />
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
