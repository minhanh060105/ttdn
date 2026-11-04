/**
 * mock-data.js - Dữ liệu giả lập chuẩn theo lược đồ cơ sở dữ liệu
 * Dành cho hệ thống blog Substack Clone (frontend tĩnh)
 */

window.MockData = (function () {
    // 1. ROLES
    const roles = [
        { id: 1, name: 'admin', description: 'Quản trị viên toàn quyền hệ thống' },
        { id: 2, name: 'blogger', description: 'Tác giả viết bài, xuất bản ghi chú' },
        { id: 3, name: 'user', description: 'Độc giả tương tác, bình luận, theo dõi' }
    ];

    // 2. USERS (>= 8 users, đủ vai trò, 1 user bị ban)
    const users = [
        {
            id: 1,
            email: 'admin@substack.vn',
            handle: 'nguyenadmin',
            display_name: 'Nguyễn Văn Quản Trị Viên Hệ Thống',
            bio: 'Trưởng ban điều hành nội dung và an ninh mạng của Substack Clone. Đam mê mã nguồn mở.',
            avatar_url: 'https://i.pravatar.cc/150?u=nguyenadmin',
            role_id: 1,
            is_active: true,
            ban_reason: null,
            banned_at: null,
            created_at: '2024-01-10T08:00:00Z'
        },
        {
            id: 2,
            email: 'lequyen.mod@substack.vn',
            handle: 'lequyen_mod',
            display_name: 'Lê Hoàng Quyên (Moderator)',
            bio: 'Chuyên viên kiểm duyệt nội dung và hỗ trợ cộng đồng tác giả.',
            avatar_url: 'https://i.pravatar.cc/150?u=lequyen_mod',
            role_id: 1,
            is_active: true,
            ban_reason: null,
            banned_at: null,
            created_at: '2024-01-15T09:30:00Z'
        },
        {
            id: 3,
            email: 'hhoanganh0710@gmail.com',
            handle: 'hhoanganh0710',
            display_name: 'Phạm Đình Hoàng Anh',
            bio: 'Kỹ sư phần mềm đam mê System Architecture, Microservices, Next.js và trải nghiệm người dùng hiện đại.',
            avatar_url: 'https://i.pravatar.cc/150?u=hhoanganh0710',
            role_id: 2,
            is_active: true,
            ban_reason: null,
            banned_at: null,
            created_at: '2024-02-01T10:00:00Z'
        },
        {
            id: 4,
            email: 'tranminh.cloud@gmail.com',
            handle: 'tranminh_tech',
            display_name: 'Trần Minh - Cloud & DevOps Specialist',
            bio: 'Chia sẻ kinh nghiệm thực chiến về hạ tầng Kubernetes, CI/CD và chi phí Cloud Native.',
            avatar_url: 'https://i.pravatar.cc/150?u=tranminh_tech',
            role_id: 2,
            is_active: true,
            ban_reason: null,
            banned_at: null,
            created_at: '2024-02-14T11:20:00Z'
        },
        {
            id: 5,
            email: 'bui.lanhuong.art@gmail.com',
            handle: 'lanhuong_art',
            display_name: 'Bùi Lan Hương - UI Designer',
            bio: 'Nhà thiết kế thị giác, đam mê Typography, Dark Theme và Minimalism.',
            avatar_url: 'https://i.pravatar.cc/150?u=lanhuong_art',
            role_id: 2,
            is_active: true,
            ban_reason: null,
            banned_at: null,
            created_at: '2024-02-20T14:10:00Z'
        },
        {
            id: 6,
            email: 'dangmaihoa@gmail.com',
            handle: 'maihoa_reader',
            display_name: 'Đặng Mai Hoa',
            bio: 'Độc giả yêu sách triết học phương Đông, thói quen ghi chú atomic notes.',
            avatar_url: 'https://i.pravatar.cc/150?u=maihoa_reader',
            role_id: 3,
            is_active: true,
            ban_reason: null,
            banned_at: null,
            created_at: '2024-03-01T15:00:00Z'
        },
        {
            id: 7,
            email: 'vutuananh.hust@gmail.com',
            handle: 'tuananh_coder',
            display_name: 'Vũ Tuấn Anh',
            bio: 'Sinh viên công nghệ thông tin, đang tìm hiểu về thuật toán và distributed systems.',
            avatar_url: 'https://i.pravatar.cc/150?u=tuananh_coder',
            role_id: 3,
            is_active: true,
            ban_reason: null,
            banned_at: null,
            created_at: '2024-03-10T16:40:00Z'
        },
        {
            id: 8,
            email: 'quangcao.spammer247@gmail.com',
            handle: 'quangcao_spammer',
            display_name: 'Đại Lý Tăng Like Kéo Sub Siêu Rẻ Nhất Quả Đất',
            bio: 'Chuyên cung cấp tương tác ảo, bán tài khoản giá rẻ, liên hệ Zalo 0999xxxxxx.',
            avatar_url: 'https://i.pravatar.cc/150?u=quangcao_spammer',
            role_id: 3,
            is_active: false,
            ban_reason: 'Vi phạm quy định chống Spam, phát tán bình luận quảng cáo độc hại liên tục.',
            banned_at: '2024-04-12T16:45:00Z',
            created_at: '2024-04-01T08:00:00Z'
        }
    ];

    // 3. LANGUAGES
    const languages = [
        { id: 1, code: 'vi', name: 'Tiếng Việt', is_active: true, is_default: true },
        { id: 2, code: 'en', name: 'English', is_active: true, is_default: false },
        { id: 3, code: 'ja', name: '日本語 (Japanese)', is_active: false, is_default: false }
    ];

    // 4. UI TRANSLATIONS (>= 25 keys)
    const ui_translations = [
        // Tiếng Việt (id: 1)
        { language_id: 1, translation_key: "nav.home", translation_value: "Trang chủ" },
        { language_id: 1, translation_key: "nav.subscriptions", translation_value: "Đăng ký" },
        { language_id: 1, translation_key: "nav.chat", translation_value: "Trò chuyện" },
        { language_id: 1, translation_key: "nav.activity", translation_value: "Hoạt động" },
        { language_id: 1, translation_key: "nav.explore", translation_value: "Khám phá" },
        { language_id: 1, translation_key: "nav.profile", translation_value: "Hồ sơ cá nhân" },
        { language_id: 1, translation_key: "nav.create", translation_value: "Viết bài" },
        { language_id: 1, translation_key: "nav.my_posts", translation_value: "Bài viết của tôi" },
        { language_id: 1, translation_key: "nav.my_notes", translation_value: "Ghi chú của tôi" },
        { language_id: 1, translation_key: "nav.admin_review", translation_value: "Duyệt bài viết" },
        { language_id: 1, translation_key: "nav.admin_reports", translation_value: "Xử lý báo cáo" },
        { language_id: 1, translation_key: "nav.admin_users", translation_value: "Quản lý người dùng" },
        { language_id: 1, translation_key: "nav.admin_languages", translation_value: "Quản trị ngôn ngữ" },
        { language_id: 1, translation_key: "nav.admin_translations", translation_value: "Từ điển giao diện" },
        { language_id: 1, translation_key: "banner.title", translation_value: "Kiếm tiền từ công việc bạn tin tưởng" },
        { language_id: 1, translation_key: "banner.subtitle", translation_value: "Nền tảng xuất bản độc lập giúp bạn tự do sáng tạo và kết nối sâu sắc với độc giả." },
        { language_id: 1, translation_key: "auth.loginTitle", translation_value: "Đăng nhập hoặc đăng ký" },
        { language_id: 1, translation_key: "auth.desc", translation_value: "Tham gia vào các cuộc thảo luận thú vị và sâu sắc nhất." },
        { language_id: 1, translation_key: "auth.signin", translation_value: "Đăng nhập" },
        { language_id: 1, translation_key: "auth.signup", translation_value: "Đăng ký" },
        { language_id: 1, translation_key: "auth.signout", translation_value: "Đăng xuất" },
        { language_id: 1, translation_key: "auth.email_placeholder", translation_value: "Nhập địa chỉ email của bạn" },
        { language_id: 1, translation_key: "search.placeholder", translation_value: "Tìm kiếm bài viết, tác giả, thẻ..." },
        { language_id: 1, translation_key: "common.read_more", translation_value: "Đọc tiếp" },
        { language_id: 1, translation_key: "common.popular", translation_value: "Đọc nhiều nhất" },
        { language_id: 1, translation_key: "common.filter_all", translation_value: "Tất cả chủ đề" },
        { language_id: 1, translation_key: "common.empty_posts", translation_value: "Chưa có bài viết nào ở ngôn ngữ này." },
        { language_id: 1, translation_key: "common.comments", translation_value: "Bình luận" },
        { language_id: 1, translation_key: "common.report", translation_value: "Báo cáo vi phạm" },
        { language_id: 1, translation_key: "common.follow", translation_value: "Theo dõi" },
        { language_id: 1, translation_key: "common.following", translation_value: "Đang theo dõi" },

        // English (id: 2)
        { language_id: 2, translation_key: "nav.home", translation_value: "Home" },
        { language_id: 2, translation_key: "nav.subscriptions", translation_value: "Subscriptions" },
        { language_id: 2, translation_key: "nav.chat", translation_value: "Chat" },
        { language_id: 2, translation_key: "nav.activity", translation_value: "Activity" },
        { language_id: 2, translation_key: "nav.explore", translation_value: "Explore" },
        { language_id: 2, translation_key: "nav.profile", translation_value: "Profile" },
        { language_id: 2, translation_key: "nav.create", translation_value: "Create post" },
        { language_id: 2, translation_key: "nav.my_posts", translation_value: "My Posts" },
        { language_id: 2, translation_key: "nav.my_notes", translation_value: "My Notes" },
        { language_id: 2, translation_key: "nav.admin_review", translation_value: "Post Review" },
        { language_id: 2, translation_key: "nav.admin_reports", translation_value: "Moderation Reports" },
        { language_id: 2, translation_key: "nav.admin_users", translation_value: "User Management" },
        { language_id: 2, translation_key: "nav.admin_languages", translation_value: "Languages" },
        { language_id: 2, translation_key: "nav.admin_translations", translation_value: "UI Translations" },
        { language_id: 2, translation_key: "banner.title", translation_value: "Make money doing the work you believe in" },
        { language_id: 2, translation_key: "banner.subtitle", translation_value: "An independent publishing platform where you create freely and connect deeply." },
        { language_id: 2, translation_key: "auth.loginTitle", translation_value: "Log in or sign up" },
        { language_id: 2, translation_key: "auth.desc", translation_value: "Join the most interesting and insightful discussions." },
        { language_id: 2, translation_key: "auth.signin", translation_value: "Sign in" },
        { language_id: 2, translation_key: "auth.signup", translation_value: "Sign up" },
        { language_id: 2, translation_key: "auth.signout", translation_value: "Sign out" },
        { language_id: 2, translation_key: "auth.email_placeholder", translation_value: "Enter your email" },
        { language_id: 2, translation_key: "search.placeholder", translation_value: "Search posts, authors, tags..." },
        { language_id: 2, translation_key: "common.read_more", translation_value: "Read more" },
        { language_id: 2, translation_key: "common.popular", translation_value: "Popular stories" },
        { language_id: 2, translation_key: "common.filter_all", translation_value: "All topics" },
        { language_id: 2, translation_key: "common.empty_posts", translation_value: "No posts found for this language." },
        { language_id: 2, translation_key: "common.comments", translation_value: "Comments" },
        { language_id: 2, translation_key: "common.report", translation_value: "Report" },
        { language_id: 2, translation_key: "common.follow", translation_value: "Follow" },
        { language_id: 2, translation_key: "common.following", translation_value: "Following" }
    ];

    // 5. TAGS (>= 8 thẻ)
    const tags = [
        { id: 1, name: 'Công nghệ', slug: 'cong-nghe', description: 'Kiến trúc hệ thống, phần mềm và xu hướng số' },
        { id: 2, name: 'Trí tuệ nhân tạo', slug: 'tri-tue-nhan-tao', description: 'LLMs, Prompt Engineering, Agentic AI' },
        { id: 3, name: 'Kinh doanh & Startup', slug: 'kinh-doanh', description: 'Mô hình kinh doanh, gọi vốn và phát triển sản phẩm' },
        { id: 4, name: 'Thiết kế UI/UX', slug: 'thiet-ke-ui-ux', description: 'Trải nghiệm người dùng, Design System và Micro-interactions' },
        { id: 5, name: 'Triết học & Cuộc sống', slug: 'triet-hoc-cuoc-song', description: 'Tư duy phản biện, tâm lý học và nhân sinh quan' },
        { id: 6, name: 'Lập trình Web', slug: 'lap-trinh-web', description: 'HTML/CSS/JS, Tailwind, Next.js và hiệu năng' },
        { id: 7, name: 'DevOps & Cloud', slug: 'devops-cloud', description: 'Docker, Kubernetes, AWS, CI/CD pipelines' },
        { id: 8, name: 'Kỹ năng phát triển', slug: 'ky-nang-phat-trien', description: 'Phương pháp học tập sâu, quản trị thời gian' }
    ];

    // 6. POSTS (>= 16 bài, đủ cả 4 status: published, pending, draft, rejected)
    const posts = [
        {
            id: 1,
            author_id: 3,
            group_id: 101,
            language_id: 1,
            title: 'Kiến trúc Hệ thống Phân tán Hiện đại: Từ Monolith sang Microservices và Bài học Thực chiến Đau đớn',
            slug: 'kien-truc-he-thong-phan-tan-hien-dai',
            content: '<p>Chuyển đổi từ một hệ thống nguyên khối đồ sộ (monolith) sang kiến trúc microservices là một hành trình đầy cạm bẫy kỹ thuật. Trong bài viết này, chúng ta sẽ mổ xẻ những quyết định sai lầm phổ biến nhất, từ việc chia domain chưa đúng cho tới việc vướng bẫy giao dịch phân tán (distributed transactions).</p><h3>1. Tại sao Monolith vẫn chưa chết?</h3><p>Nhiều nhóm kỹ sư trẻ vội vàng chia nhỏ dịch vụ khi lưu lượng truy cập còn rất thấp. Hậu quả là chi phí vận hành mạng và overhead giao tiếp tăng gấp mười lần, trong khi hiệu suất kinh doanh không đổi.</p><blockquote>"Đừng bao giờ xây dựng Microservices trừ khi Monolith của bạn đã được tối ưu hóa đến giới hạn vật lý của nó."</blockquote><p>Hãy xem xét kiến trúc Modular Monolith trước khi bạn đưa Kubernetes vào hệ sinh thái của mình.</p>',
            thumbnail_url: 'https://picsum.photos/seed/kien-truc-he-thong-phan-tan-hien-dai/800/450',
            status: 'published',
            reviewed_by: 1,
            reviewed_at: '2024-03-15T09:00:00Z',
            reject_reason: null,
            published_at: '2024-03-15T09:05:00Z',
            created_at: '2024-03-14T10:00:00Z',
            deleted_at: null,
            views_count: 1420
        },
        {
            id: 2,
            author_id: 4,
            group_id: 102,
            language_id: 1,
            title: 'Tối ưu hóa Chi phí Kubernetes trên AWS: Tiết kiệm 45% Ngân sách Cloud Hàng Tháng',
            slug: 'toi-uu-hoa-chi-phi-kubernetes-aws',
            content: '<p>Chi phí hạ tầng điện toán đám mây là bài toán đau đầu của mọi CTO. Bài viết chia sẻ chiến lược áp dụng Spot Instances kết hợp Karpenter tự động co giãn cụm worker nodes một cách thông minh.</p><p>Nhờ phân loại đúng workload stateless và stateful, chúng tôi đã cắt giảm gần một nửa chi phí hạ tầng mà vẫn đảm bảo SLA 99.99%.</p>',
            thumbnail_url: 'https://picsum.photos/seed/toi-uu-hoa-chi-phi-kubernetes-aws/800/450',
            status: 'published',
            reviewed_by: 1,
            reviewed_at: '2024-03-18T14:00:00Z',
            reject_reason: null,
            published_at: '2024-03-18T14:10:00Z',
            created_at: '2024-03-17T08:30:00Z',
            deleted_at: null,
            views_count: 980
        },
        {
            id: 3,
            author_id: 5,
            group_id: 103,
            language_id: 1,
            title: 'Nghệ thuật Thiết kế Dark Theme Chuẩn Công Thái Học: Đừng Chỉ Dùng Màu Đen Tuyệt Đối (#000000)',
            slug: 'nghe-thuat-thiet-ke-dark-theme-chuan-cong-thai-hoc',
            content: '<p>Tại sao giao diện của Substack, Linear hay GitHub không bao giờ dùng nền đen thuần túy? Màu đen #000000 tạo độ tương phản quá gắt với chữ trắng, gây mỏi mắt nghiêm trọng khi đọc lâu.</p><p>Hãy sử dụng các sắc xám tối như #121212 kết hợp các lớp đổ bóng phân tầng card để tạo chiều sâu tự nhiên.</p>',
            thumbnail_url: 'https://picsum.photos/seed/nghe-thuat-thiet-ke-dark-theme-chuan-cong-thai-hoc/800/450',
            status: 'published',
            reviewed_by: 2,
            reviewed_at: '2024-03-20T10:00:00Z',
            reject_reason: null,
            published_at: '2024-03-20T10:15:00Z',
            created_at: '2024-03-19T11:00:00Z',
            deleted_at: null,
            views_count: 2310
        },
        {
            id: 4,
            author_id: 3,
            group_id: 101,
            language_id: 2,
            title: 'Building High-Performance Web Applications with Next.js 15 and Server Components',
            slug: 'building-high-performance-nextjs-15',
            content: '<p>Server Components in Next.js revolutionize the mental model of React developers. Streaming SSR, partial prerendering, and zero-bundle-size dependencies enable blazing fast TTFB.</p><p>In this post, we dive deep into cache invalidation mechanics and real-world edge scenarios.</p>',
            thumbnail_url: 'https://picsum.photos/seed/building-high-performance-nextjs-15/800/450',
            status: 'published',
            reviewed_by: 1,
            reviewed_at: '2024-03-22T08:00:00Z',
            reject_reason: null,
            published_at: '2024-03-22T08:10:00Z',
            created_at: '2024-03-21T09:00:00Z',
            deleted_at: null,
            views_count: 1750
        },
        {
            id: 5,
            author_id: 3,
            group_id: 101,
            language_id: 1,
            title: 'Tự Động Hóa Quy Trình Code Review Với LLM: Tăng Tốc Độ Release Gấp Đôi Mà Không Giảm Chất Lượng',
            slug: 'tu-dong-hoa-code-review-voi-llm',
            content: '<p>Tích hợp AI Agent vào GitHub Actions để phân tích Pull Request: từ phát hiện code smell, lỗ hổng injection cho đến gợi ý viết Unit Test đầy đủ.</p><p>Bài viết hướng dẫn cách setup prompt hệ thống để tránh tình trạng ảo giác (hallucination) khi đọc diff mã nguồn phức tạp.</p>',
            thumbnail_url: 'https://picsum.photos/seed/tu-dong-hoa-code-review-voi-llm/800/450',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            reject_reason: null,
            published_at: null,
            created_at: '2024-04-02T10:00:00Z',
            deleted_at: null,
            views_count: 0
        },
        {
            id: 6,
            author_id: 4,
            group_id: 102,
            language_id: 1,
            title: 'Bảo Mật Hệ Thống Thanh Toán Trực Tuyến Đạt Chuẩn PCI-DSS Dành Cho Kỹ Sư Backend Mới Vào Nghề',
            slug: 'bao-mat-he-thong-thanh-toan-pci-dss',
            content: '<p>Không bao giờ được lưu CVV hay số thẻ nguyên bản vào cơ sở dữ liệu. Tokenization là chìa khóa vàng.</p><p>Quy trình mã hóa kép ở tầng ứng dụng và cơ sở dữ liệu cần thực hiện ra sao? Cùng tìm hiểu chi tiết.</p>',
            thumbnail_url: 'https://picsum.photos/seed/bao-mat-he-thong-thanh-toan-pci-dss/800/450',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            reject_reason: null,
            published_at: null,
            created_at: '2024-04-03T11:30:00Z',
            deleted_at: null,
            views_count: 0
        },
        {
            id: 7,
            author_id: 5,
            group_id: 103,
            language_id: 1,
            title: 'Micro-interactions: Chi Tiết Nhỏ Làm Nên Sự Khác Biệt Giữa Ứng Dụng Bình Thường Và Sản Phẩm Xuất Sắc',
            slug: 'micro-interactions-chi-tiet-nho-tao-khac-biet',
            content: '<p>Âm thanh click nhẹ khi bấm nút like, hiệu ứng rung phản hồi haptic, hay animation biến hình mượt mà của thanh tab. Đó là những điểm chạm cảm xúc giữ chân người dùng ở lại ứng dụng.</p>',
            thumbnail_url: 'https://picsum.photos/seed/micro-interactions-chi-tiet-nho-tao-khac-biet/800/450',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            reject_reason: null,
            published_at: null,
            created_at: '2024-04-04T15:20:00Z',
            deleted_at: null,
            views_count: 0
        },
        {
            id: 8,
            author_id: 3,
            group_id: 101,
            language_id: 1,
            title: 'Tự Viết Một Trình Phân Tích Cú Pháp SQL Mini Bằng TypeScript Trong 500 Dòng Code',
            slug: 'tu-viet-parser-sql-mini-typescript',
            content: '<p>Bài viết còn đang phác thảo dở dang về Lexer, Tokenizer và xây dựng cây cú pháp trừu tượng AST cho câu lệnh SELECT đơn giản.</p>',
            thumbnail_url: 'https://picsum.photos/seed/tu-viet-parser-sql-mini-typescript/800/450',
            status: 'draft',
            reviewed_by: null,
            reviewed_at: null,
            reject_reason: null,
            published_at: null,
            created_at: '2024-04-05T09:00:00Z',
            deleted_at: null,
            views_count: 0
        },
        {
            id: 9,
            author_id: 3,
            group_id: 101,
            language_id: 1,
            title: 'Kinh Nghiệm Phỏng Vấn Vị Trí Senior Fullstack Tại Các Tập Đoàn Công Nghệ Đa Quốc Gia',
            slug: 'kinh-nghiem-phong-van-senior-fullstack',
            content: '<p>Tập trung vào Live Coding thuật toán, System Design quy mô triệu người dùng và câu hỏi văn hóa ứng xử Behavioral Questions.</p>',
            thumbnail_url: 'https://picsum.photos/seed/kinh-nghiem-phong-van-senior-fullstack/800/450',
            status: 'draft',
            reviewed_by: null,
            reviewed_at: null,
            reject_reason: null,
            published_at: null,
            created_at: '2024-04-06T14:00:00Z',
            deleted_at: null,
            views_count: 0
        },
        {
            id: 10,
            author_id: 3,
            group_id: 101,
            language_id: 1,
            title: 'Bí Kíp Kiếm Hàng Triệu Đô Nhờ Tiền Điện Tử Và Dự Án Đầu Tư Lợi Nhuận Khủng 300% Mỗi Tháng Không Rủi Ro',
            slug: 'bi-kip-kiem-tien-dien-tu-loi-nhuan-khung',
            content: '<p>Bài viết chứa liên kết tiếp thị liên kết mờ ám và hứa hẹn lợi nhuận bất khả thi về mặt tài chính.</p>',
            thumbnail_url: 'https://picsum.photos/seed/bi-kip-kiem-tien-dien-tu-loi-nhuan-khung/800/450',
            status: 'rejected',
            reviewed_by: 1,
            reviewed_at: '2024-04-07T10:15:00Z',
            reject_reason: 'Nội dung chứa dấu hiệu lừa đảo tài chính, cam kết lợi nhuận phi thực tế và vi phạm nghiêm trọng Tiêu chuẩn Cộng đồng.',
            published_at: null,
            created_at: '2024-04-06T18:00:00Z',
            deleted_at: null,
            views_count: 0
        },
        {
            id: 11,
            author_id: 4,
            group_id: 102,
            language_id: 1,
            title: 'Chia Sẻ Bản Quyền Phần Mềm Crack Windows Và Key Kích Hoạt Miễn Phí Mới Nhất 2024',
            slug: 'chia-se-crack-windows-key-mien-phi',
            content: '<p>Nội dung chia sẻ liên kết tải tệp thực thi vi phạm bản quyền phần mềm độc hại.</p>',
            thumbnail_url: 'https://picsum.photos/seed/chia-se-crack-windows-key-mien-phi/800/450',
            status: 'rejected',
            reviewed_by: 2,
            reviewed_at: '2024-04-08T11:00:00Z',
            reject_reason: 'Vi phạm bản quyền phần mềm số và phát tán tệp tin không an toàn đến người dùng.',
            published_at: null,
            created_at: '2024-04-07T20:30:00Z',
            deleted_at: null,
            views_count: 0
        },
        {
            id: 12,
            author_id: 4,
            group_id: 102,
            language_id: 1,
            title: 'Xây Dựng Hệ Thống Giám Sát Metrics Thời Gian Thực Với Prometheus và Grafana Từ Số Không',
            slug: 'xay-dung-giam-sat-prometheus-grafana',
            content: '<p>Giám sát không chỉ là việc nhìn đồ thị CPU/RAM. Đó là việc thiết lập các Golden Signals: Latency, Traffic, Errors và Saturation để phát hiện sự cố trước khi khách hàng phàn nàn.</p>',
            thumbnail_url: 'https://picsum.photos/seed/xay-dung-giam-sat-prometheus-grafana/800/450',
            status: 'published',
            reviewed_by: 1,
            reviewed_at: '2024-03-25T16:00:00Z',
            reject_reason: null,
            published_at: '2024-03-25T16:15:00Z',
            created_at: '2024-03-24T12:00:00Z',
            deleted_at: null,
            views_count: 850
        },
        {
            id: 13,
            author_id: 5,
            group_id: 103,
            language_id: 1,
            title: 'Design Systems Cho Startup: Làm Thế Nào Để Xây Dựng Thư Viện UI Tinh Gọn Mà Vẫn Mở Rộng Được?',
            slug: 'design-systems-cho-startup-tinh-gon',
            content: '<p>Đừng cố sao chép Design System khổng lồ của Google Material hay Apple HIG khi team chỉ có 2 designer. Hãy bắt đầu từ Token màu sắc, Typography và 5 Component cốt lõi nhất.</p>',
            thumbnail_url: 'https://picsum.photos/seed/design-systems-cho-startup-tinh-gon/800/450',
            status: 'published',
            reviewed_by: 2,
            reviewed_at: '2024-03-28T09:30:00Z',
            reject_reason: null,
            published_at: '2024-03-28T09:45:00Z',
            created_at: '2024-03-27T10:00:00Z',
            deleted_at: null,
            views_count: 1120
        },
        {
            id: 14,
            author_id: 3,
            group_id: 101,
            language_id: 1,
            title: 'Hiểu Về Cơ Chế Concurrency Trong Go: Goroutines, Channels và Những Cạm Bẫy Deadlock Thường Gặp',
            slug: 'co-che-concurrency-trong-go-goroutines',
            content: '<p>Go nổi tiếng nhờ mô hình CSP (Communicating Sequential Processes). Nhưng nếu không cẩn thận đóng channel hay quên sync.WaitGroup, bộ nhớ của bạn sẽ bị rò rỉ âm thầm trong bóng tối.</p>',
            thumbnail_url: 'https://picsum.photos/seed/co-che-concurrency-trong-go-goroutines/800/450',
            status: 'published',
            reviewed_by: 1,
            reviewed_at: '2024-03-30T14:20:00Z',
            reject_reason: null,
            published_at: '2024-03-30T14:30:00Z',
            created_at: '2024-03-29T15:00:00Z',
            deleted_at: null,
            views_count: 1640
        },
        {
            id: 15,
            author_id: 4,
            group_id: 102,
            language_id: 2,
            title: 'Mastering Docker Multi-Stage Builds: Slim Down Your Production Images from 1.2GB to 35MB',
            slug: 'mastering-docker-multi-stage-builds',
            content: '<p>Bloated Docker images slow down deployment pipelines and introduce unexpected CVE vulnerabilities. Learn how to leverage Alpine Linux and distroless base images.</p>',
            thumbnail_url: 'https://picsum.photos/seed/mastering-docker-multi-stage-builds/800/450',
            status: 'published',
            reviewed_by: 2,
            reviewed_at: '2024-04-01T08:00:00Z',
            reject_reason: null,
            published_at: '2024-04-01T08:15:00Z',
            created_at: '2024-03-31T20:00:00Z',
            deleted_at: null,
            views_count: 670
        },
        {
            id: 16,
            author_id: 3,
            group_id: 101,
            language_id: 1,
            title: 'Bài Viết Đã Bị Xóa Nháp Để Thử Nghiệm Trường Hợp Lỗi Dữ Liệu Tồn Tại Trong Cơ Sở Dữ Liệu Cũ',
            slug: 'bai-viet-da-bi-xoa-thu-nghiem',
            content: '<p>Nội dung này đã bị đánh dấu xóa mềm deleted_at.</p>',
            thumbnail_url: 'https://picsum.photos/seed/bai-viet-da-bi-xoa-thu-nghiem/800/450',
            status: 'published',
            reviewed_by: 1,
            reviewed_at: '2024-01-01T00:00:00Z',
            reject_reason: null,
            published_at: '2024-01-01T00:00:00Z',
            created_at: '2024-01-01T00:00:00Z',
            deleted_at: '2024-02-01T00:00:00Z',
            views_count: 10
        }
    ];

    // 7. POST_TAGS (Liên kết bài viết và thẻ)
    const post_tags = [
        { post_id: 1, tag_id: 1 },
        { post_id: 1, tag_id: 6 },
        { post_id: 2, tag_id: 7 },
        { post_id: 2, tag_id: 1 },
        { post_id: 3, tag_id: 4 },
        { post_id: 4, tag_id: 6 },
        { post_id: 4, tag_id: 1 },
        { post_id: 5, tag_id: 2 },
        { post_id: 5, tag_id: 1 },
        { post_id: 6, tag_id: 1 },
        { post_id: 6, tag_id: 3 },
        { post_id: 7, tag_id: 4 },
        { post_id: 8, tag_id: 6 },
        { post_id: 9, tag_id: 8 },
        { post_id: 10, tag_id: 3 },
        { post_id: 11, tag_id: 1 },
        { post_id: 12, tag_id: 7 },
        { post_id: 13, tag_id: 4 },
        { post_id: 14, tag_id: 1 },
        { post_id: 14, tag_id: 6 },
        { post_id: 15, tag_id: 7 }
    ];

    // 8. NOTES (>= 8 ghi chú ngắn của tác giả)
    const notes = [
        {
            id: 1,
            author_id: 3,
            content: 'Vừa hoàn thành tối ưu hóa truy vấn SQL giảm 80% thời gian phản hồi cho bảng 10 triệu bản ghi. Chìa khóa là dùng Composite Index và tránh dùng SELECT * lãng phí!',
            image_url: 'https://picsum.photos/seed/sql-opt-note/600/350',
            created_at: '2024-04-08T09:15:00Z'
        },
        {
            id: 2,
            author_id: 3,
            content: 'Substack mang lại cảm giác viết lách tĩnh lặng đến kỳ lạ. Không còn áp lực thuật toán mạng xã hội ồn ào.',
            image_url: null,
            created_at: '2024-04-07T14:20:00Z'
        },
        {
            id: 3,
            author_id: 4,
            content: 'Hôm nay Kubernetes cụm staging bị sập vì một anh bạn cấu hình memory limit quá hẹp. Nhớ luôn đặt Requests và Limits cẩn thận nhé anh em DevOps!',
            image_url: 'https://picsum.photos/seed/k8s-crash/600/350',
            created_at: '2024-04-06T18:40:00Z'
        },
        {
            id: 4,
            author_id: 5,
            content: 'Bộ icon mới vẽ theo phong cách duotone hoàn thiện sau 3 đêm thức trắng. Mọi người thích màu cam #ff6719 hơn hay xanh lá emerald?',
            image_url: 'https://picsum.photos/seed/icon-design-note/600/350',
            created_at: '2024-04-05T11:00:00Z'
        },
        {
            id: 5,
            author_id: 3,
            content: 'Đang chuẩn bị kịch bản cho loạt bài viết về Microservices thực chiến. Các bạn muốn tập trung vào Saga Pattern hay Event-driven với Apache Kafka?',
            image_url: null,
            created_at: '2024-04-04T16:10:00Z'
        },
        {
            id: 6,
            author_id: 6,
            content: 'Đọc xong cuốn "Atomic Habits", nhận ra rằng tiến bộ 1% mỗi ngày là quy luật mạnh mẽ nhất của sự tích lũy thành công.',
            image_url: null,
            created_at: '2024-04-03T20:30:00Z'
        },
        {
            id: 7,
            author_id: 4,
            content: 'Một buổi chiều yên ả bên tách cà phê và giải quyết xong 5 issue tồn đọng trên GitHub. Cảm giác thật thanh thản!',
            image_url: 'https://picsum.photos/seed/coffee-coding/600/350',
            created_at: '2024-04-02T15:00:00Z'
        },
        {
            id: 8,
            author_id: 5,
            content: 'Khoảng trắng (white space) trong thiết kế đồ họa không phải là khoảng trống vô nghĩa, đó chính là hơi thở của bố cục thị giác.',
            image_url: null,
            created_at: '2024-04-01T10:45:00Z'
        }
    ];

    // 9. COMMENTS (có cả cha và reply lồng 1 cấp)
    const comments = [
        {
            id: 1,
            post_id: 1,
            user_id: 6,
            parent_id: null,
            content: 'Bài viết phân tích rất thực tế anh ơi! Nhóm em từng cố chia nhỏ 5 service khi chỉ có 100 người dùng và suýt toang vì quản lý mạng.',
            created_at: '2024-03-15T10:30:00Z',
            deleted_at: null
        },
        {
            id: 2,
            post_id: 1,
            user_id: 3,
            parent_id: 1,
            content: 'Cảm ơn em! Đó là bài học xương máu mà gần như startup công nghệ nào cũng phải trả giá ít nhất một lần.',
            created_at: '2024-03-15T11:00:00Z',
            deleted_at: null
        },
        {
            id: 3,
            post_id: 1,
            user_id: 7,
            parent_id: null,
            content: 'Cho em hỏi nếu dùng Modular Monolith thì sau này tách ra microservices có mất nhiều thời gian tái cấu trúc database không ạ?',
            created_at: '2024-03-16T08:15:00Z',
            deleted_at: null
        },
        {
            id: 4,
            post_id: 1,
            user_id: 4,
            parent_id: 3,
            content: 'Nếu ngay từ đầu bạn đã cô lập schema theo từng module và chỉ giao tiếp qua Service Interface thì việc tách ra rất nhẹ nhàng nhé bạn.',
            created_at: '2024-03-16T09:00:00Z',
            deleted_at: null
        },
        {
            id: 5,
            post_id: 3,
            user_id: 7,
            parent_id: null,
            content: 'Đồng ý với tác giả, tông màu #121212 này dịu mắt hơn hẳn so với màu đen kịt #000000 của OLED.',
            created_at: '2024-03-20T12:00:00Z',
            deleted_at: null
        },
        {
            id: 6,
            post_id: 1,
            user_id: 8,
            parent_id: null,
            content: 'Kiếm tiền tự động nhận 500k mỗi ngày tại link lừa đảo http://scam-link.xyz hãy truy cập ngay kẻo lỡ!',
            created_at: '2024-03-17T09:00:00Z',
            deleted_at: null
        }
    ];

    // 10. FOLLOWS
    const follows = [
        { follower_id: 6, following_id: 3 },
        { follower_id: 7, following_id: 3 },
        { follower_id: 5, following_id: 3 },
        { follower_id: 3, following_id: 4 },
        { follower_id: 3, following_id: 5 },
        { follower_id: 7, following_id: 4 }
    ];

    // 11. REACTIONS (post | note | comment, 4 loại: like, love, insightful, funny)
    const reactions = [
        { user_id: 6, target_type: 'post', post_id: 1, note_id: null, comment_id: null, type: 'insightful' },
        { user_id: 7, target_type: 'post', post_id: 1, note_id: null, comment_id: null, type: 'like' },
        { user_id: 4, target_type: 'post', post_id: 1, note_id: null, comment_id: null, type: 'love' },
        { user_id: 5, target_type: 'post', post_id: 1, note_id: null, comment_id: null, type: 'like' },
        { user_id: 6, target_type: 'post', post_id: 3, note_id: null, comment_id: null, type: 'love' },
        { user_id: 3, target_type: 'note', post_id: null, note_id: 1, comment_id: null, type: 'like' },
        { user_id: 6, target_type: 'note', post_id: null, note_id: 1, comment_id: null, type: 'love' },
        { user_id: 3, target_type: 'comment', post_id: null, note_id: null, comment_id: 1, type: 'like' },
        { user_id: 7, target_type: 'comment', post_id: null, note_id: null, comment_id: 1, type: 'funny' }
    ];

    // 12. REPORTS (>= 6 reports, đủ 3 status pending|resolved|dismissed, 3 action delete_content|ban_user|warn, 3 target post|note|comment)
    const reports = [
        {
            id: 1,
            reporter_id: 6,
            target_type: 'comment',
            post_id: 1,
            note_id: null,
            comment_id: 6,
            reason: 'Bình luận chứa liên kết lừa đảo tài chính và spam cờ bạc',
            status: 'pending',
            action: null,
            handle_note: null,
            handled_by: null,
            handled_at: null,
            created_at: '2024-04-09T08:00:00Z'
        },
        {
            id: 2,
            reporter_id: 7,
            target_type: 'post',
            post_id: 10,
            note_id: null,
            comment_id: null,
            reason: 'Bài viết quảng cáo tiền ảo lừa đảo lợi nhuận 300%',
            status: 'resolved',
            action: 'delete_content',
            handle_note: 'Đã xác nhận nội dung vi phạm pháp luật và tiêu chuẩn cộng đồng. Gỡ bỏ nội dung vĩnh viễn.',
            handled_by: 1,
            handled_at: '2024-04-07T10:15:00Z',
            created_at: '2024-04-06T19:00:00Z'
        },
        {
            id: 3,
            reporter_id: 3,
            target_type: 'comment',
            post_id: 1,
            note_id: null,
            comment_id: 6,
            reason: 'Tài khoản bot tự động spam tin nhắn rác liên tục trong bài viết của tôi',
            status: 'resolved',
            action: 'ban_user',
            handle_note: 'Tài khoản quangcao_spammer đã bị khóa vĩnh viễn vì tái phạm spam nhiều lần.',
            handled_by: 2,
            handled_at: '2024-04-12T16:45:00Z',
            created_at: '2024-04-12T16:00:00Z'
        },
        {
            id: 4,
            reporter_id: 6,
            target_type: 'note',
            post_id: null,
            note_id: 4,
            comment_id: null,
            reason: 'Hình ảnh có thể vi phạm bản quyền từ bên thứ ba',
            status: 'dismissed',
            action: null,
            handle_note: 'Đã kiểm tra giấy phép mở Creative Commons của tác giả, nội dung hoàn toàn hợp lệ.',
            handled_by: 1,
            handled_at: '2024-04-06T15:00:00Z',
            created_at: '2024-04-05T12:00:00Z'
        },
        {
            id: 5,
            reporter_id: 5,
            target_type: 'post',
            post_id: 11,
            note_id: null,
            comment_id: null,
            reason: 'Bài viết chia sẻ mã độc hại và tệp crack phần mềm',
            status: 'resolved',
            action: 'warn',
            handle_note: 'Đã gửi cảnh báo nhắc nhở tác giả tuân thủ bản quyền phần mềm và từ chối xuất bản bài viết.',
            handled_by: 2,
            handled_at: '2024-04-08T11:00:00Z',
            created_at: '2024-04-08T09:00:00Z'
        },
        {
            id: 6,
            reporter_id: 7,
            target_type: 'post',
            post_id: 1,
            note_id: null,
            comment_id: null,
            reason: 'Tranh luận về việc dùng Microservices hay Monolith có từ ngữ hơi gay gắt',
            status: 'pending',
            action: null,
            handle_note: null,
            handled_by: null,
            handled_at: null,
            created_at: '2024-04-10T11:30:00Z'
        }
    ];

    return {
        roles,
        users,
        languages,
        ui_translations,
        tags,
        posts,
        post_tags,
        notes,
        comments,
        follows,
        reactions,
        reports
    };
})();
