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
            password: 'admin123',
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
            password: '12345678',
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
            password: 'user123',
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
            password: 'spammer123',
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

    // Khôi phục tài khoản đăng ký gần nhất + ảnh đại diện đã tải lên từ localStorage
    // (mock không có server nên cần giữ dữ liệu qua các lần reload trang)
    try {
        const storedUser = JSON.parse(localStorage.getItem('registered_user') || 'null');
        if (storedUser && storedUser.handle && !users.some(u => u.handle === storedUser.handle)) {
            users.push(storedUser);
        }
    } catch (e) { /* dữ liệu hỏng thì bỏ qua */ }
    users.forEach(u => {
        const savedAvatar = localStorage.getItem('avatar_' + u.handle);
        if (savedAvatar) u.avatar_url = savedAvatar;
    });

    // 3. LANGUAGES
    const languages = [
        { id: 1, code: 'vi', name: 'Tiếng Việt', is_active: true, is_default: true },
        { id: 2, code: 'en', name: 'English', is_active: true, is_default: false },
        { id: 3, code: 'ja', name: '日本語 (Japanese)', is_active: false, is_default: false }
    ];

    // 4. TAGS (>= 8 thẻ)
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

    // 5.1 CATEGORIES (Quản lý Danh mục bài viết)
    const categories = [
        { id: 1, name: 'Công nghệ & Phần mềm', slug: 'cong-nghe-phan-mem', description: 'Kiến trúc hệ thống, backend, frontend và mã nguồn mở', post_count: 6, is_active: true, created_at: '2024-01-10T08:00:00Z' },
        { id: 2, name: 'Hạ tầng Cloud & DevOps', slug: 'ha-tang-cloud-devops', description: 'Kubernetes, Docker, CI/CD và giải pháp điện toán đám mây', post_count: 4, is_active: true, created_at: '2024-01-15T09:00:00Z' },
        { id: 3, name: 'Thiết kế UI/UX & Typography', slug: 'thiet-ke-ui-ux', description: 'Trải nghiệm người dùng, Design tokens và Typography chuẩn công thái học', post_count: 3, is_active: true, created_at: '2024-02-01T10:00:00Z' },
        { id: 4, name: 'Trí tuệ nhân tạo (AI)', slug: 'tri-tue-nhan-tao', description: 'LLMs, Prompt Engineering, Agentic AI và ứng dụng thực tế', post_count: 5, is_active: true, created_at: '2024-02-15T11:00:00Z' },
        { id: 5, name: 'Đời sống & Góc nhìn Tác giả', slug: 'doi-song-goc-nhin', description: 'Tản văn, kinh nghiệm sống và triết lý làm việc', post_count: 2, is_active: true, created_at: '2024-03-01T12:00:00Z' },
        { id: 6, name: 'Kinh doanh & Khởi nghiệp', slug: 'kinh-doanh-khoi-nghiep', description: 'Mô hình kinh doanh số, tăng trưởng và tài chính cá nhân', post_count: 1, is_active: false, created_at: '2024-03-10T14:00:00Z' }
    ];

    // 6. POSTS (>= 16 bài, đủ cả 4 status: published, pending, draft, rejected)
    const posts = [
        {
            id: 1,
            author_id: 3,
            group_id: 101,
            category_id: 1,
            language_id: 1,
            title: 'Kiến trúc Hệ thống Phân tán Hiện đại: Từ Monolith sang Microservices và Bài học Thực chiến Đau đớn',
            slug: 'kien-truc-he-thong-phan-tan-hien-dai',
            content_html: "<h2>Vì sao kiến trúc phân tán dễ thất bại?</h2><p>Chuyển từ hệ thống nguyên khối đồ sộ sang microservices là hành trình đầy cạm bẫy kỹ thuật. Nhiều nhóm chia nhỏ dịch vụ quá sớm, khi lưu lượng còn thấp, khiến chi phí vận hành mạng và độ phức tạp tăng vọt.</p><img src=\"https://picsum.photos/seed/microservices-architecture/1000/520\" alt=\"Sơ đồ kiến trúc microservices\"><h3>1. Monolith vẫn chưa chết</h3><p>Một Modular Monolith được thiết kế tốt vẫn là lựa chọn hợp lý cho phần lớn startup. Chỉ tách dịch vụ khi biên giới nghiệp vụ đã rõ ràng.</p><ul><li>Đo lường độ trễ và chi phí trước khi tách.</li><li>Cô lập schema theo module ngay từ đầu.</li><li>Giao tiếp qua interface thay vì truy cập chéo bảng.</li></ul><blockquote>\"Đừng xây dựng Microservices trừ khi Monolith của bạn đã được tối ưu đến giới hạn vật lý.\"</blockquote><h3>2. Lộ trình chuyển đổi an toàn</h3><ol><li>Bóc tách module có lưu lượng độc lập.</li><li>Dựng cơ chế quan sát và truy vết phân tán.</li><li>Chuyển dữ liệu theo từng lát cắt nhỏ.</li></ol><p>Bài học lớn nhất: kiến trúc phải phục vụ bài toán kinh doanh, không phải ngược lại.</p>",
            cover_image: 'https://picsum.photos/seed/kien-truc-he-thong-phan-tan-hien-dai/800/450',
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
            category_id: 2,
            language_id: 1,
            title: 'Tối ưu hóa Chi phí Kubernetes trên AWS: Tiết kiệm 45% Ngân sách Cloud Hàng Tháng',
            slug: 'toi-uu-hoa-chi-phi-kubernetes-aws',
            content_html: "<h2>Bài toán chi phí Cloud không chỉ là hóa đơn</h2><p>Chi phí hạ tầng tăng nhanh khi cụm Kubernetes thiếu cơ chế co giãn thông minh. Chúng tôi kết hợp Spot Instances với Karpenter để tự động chọn loại máy phù hợp.</p><img src=\"https://picsum.photos/seed/kubernetes-cost-chart/1000/520\" alt=\"Biểu đồ chi phí Kubernetes theo tháng\"><h3>Các đòn bẩy tiết kiệm chính</h3><ul><li>Phân loại workload stateless và stateful rõ ràng.</li><li>Đặt requests/limits sát nhu cầu thực tế.</li><li>Dùng chính sách scale-down mạnh hơn cho môi trường staging.</li></ul><p>Sau ba tháng, ngân sách Cloud giảm 45% trong khi SLA vẫn giữ ở 99,99%.</p>",
            cover_image: 'https://picsum.photos/seed/toi-uu-hoa-chi-phi-kubernetes-aws/800/450',
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
            category_id: 3,
            language_id: 1,
            title: 'Nghệ thuật Thiết kế Dark Theme Chuẩn Công Thái Học: Đừng Chỉ Dùng Màu Đen Tuyệt Đối (#000000)',
            slug: 'nghe-thuat-thiet-ke-dark-theme-chuan-cong-thai-hoc',
            content_html: "<h2>Dark theme không phải là đảo màu</h2><p>Nền đen tuyệt đối tạo độ tương phản quá gắt với chữ trắng, gây mỏi mắt khi đọc lâu. Các sản phẩm tốt dùng nhiều lớp xám tối để tạo chiều sâu.</p><img src=\"https://picsum.photos/seed/dark-theme-typography/1000/520\" alt=\"Ví dụ bố cục dark theme với nhiều lớp xám\"><h3>Nguyên tắc thiết kế</h3><ul><li>Dùng #121212 thay vì #000000 cho nền chính.</li><li>Tăng độ sáng bề mặt theo cấp bậc nội dung.</li><li>Giữ độ tương phản chữ tối thiểu 4,5:1.</li></ul><blockquote>Ánh sáng trong giao diện tối đến từ sự chênh lệch tinh tế giữa các lớp bề mặt.</blockquote><p>Typography và khoảng thở quan trọng hơn hiệu ứng hào nhoáng.</p>",
            cover_image: 'https://picsum.photos/seed/nghe-thuat-thiet-ke-dark-theme-chuan-cong-thai-hoc/800/450',
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
            category_id: 1,
            language_id: 2,
            title: 'Building High-Performance Web Applications with Next.js 15 and Server Components',
            slug: 'building-high-performance-nextjs-15',
            content_html: "<h2>Server Components thay đổi cách chia bundle</h2><p>Next.js 15 đưa streaming SSR và partial prerendering vào luồng phát triển mặc định. TTFB giảm mạnh khi phần lớn nội dung được render phía server.</p><img src=\"https://picsum.photos/seed/nextjs-server-components/1000/520\" alt=\"Luồng render Server Components\"><h3>Những điểm cần lưu ý</h3><ul><li>Xác định rõ biên giới client/server của từng component.</li><li>Cache invalidation cần chiến lược theo thẻ dữ liệu.</li><li>Tránh đẩy toàn bộ state xuống client không cần thiết.</li></ul><p>Kết quả thực tế: bundle nhỏ hơn, thời gian tương tác đầu tiên nhanh hơn và trải nghiệm ổn định hơn trên mạng yếu.</p>",
            cover_image: 'https://picsum.photos/seed/building-high-performance-nextjs-15/800/450',
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
            category_id: 1,
            language_id: 1,
            title: 'Tự Động Hóa Quy Trình Code Review Với LLM: Tăng Tốc Độ Release Gấp Đôi Mà Không Giảm Chất Lượng',
            slug: 'tu-dong-hoa-code-review-voi-llm',
            content_html: "<p>Tích hợp AI Agent vào GitHub Actions để phân tích Pull Request là bước ngoặt lớn của quy trình phát triển phần mềm hiện đại. AI có thể đảm nhận phần lớn đánh giá thô về code smell và rủi ro bảo mật.</p><img src=\"https://picsum.photos/seed/ai-code-review-flow/1000/520\" alt=\"Quy trình tích hợp AI Code Review\"><h3>1. Cơ chế Prompting phân tầng</h3><p>Không gửi toàn bộ codebase vào context window. Thay vào đó, trích xuất diff theo từng đoạn kèm manifest và chỉ thị kiểm tra nghiệp vụ.</p><ul><li>Tầng 1: kiểm tra style và lint.</li><li>Tầng 2: phát hiện lỗi logic và bảo mật.</li><li>Tầng 3: gợi ý unit test còn thiếu.</li></ul><img src=\"https://picsum.photos/seed/prompt-benchmark/1000/500\" alt=\"Benchmark độ chính xác của AI review\"><blockquote>Thời gian phản hồi vòng đời PR giảm từ 48 giờ xuống dưới 3 giờ.</blockquote><p>Điểm mấu chốt là con người vẫn giữ vai trò quyết định cuối cùng.</p>",
            cover_image: 'https://picsum.photos/seed/tu-dong-hoa-code-review-voi-llm/800/450',
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
            category_id: 2,
            language_id: 1,
            title: 'Bảo Mật Hệ Thống Thanh Toán Trực Tuyến Đạt Chuẩn PCI-DSS Dành Cho Kỹ Sư Backend Mới Vào Nghề',
            slug: 'bao-mat-he-thong-thanh-toan-pci-dss',
            content_html: "<h2>Tokenization là tuyến phòng thủ đầu tiên</h2><p>Không lưu số thẻ nguyên bản hay CVV trong cơ sở dữ liệu. Tokenization giúp giảm phạm vi tuân thủ PCI-DSS và hạn chế thiệt hại khi có sự cố.</p><img src=\"https://picsum.photos/seed/payment-security-pci/1000/520\" alt=\"Sơ đồ luồng thanh toán an toàn\"><h3>Danh sách kiểm tra tối thiểu</h3><ul><li>Mã hóa dữ liệu nhạy cảm ở tầng ứng dụng.</li><li>Ghi log không chứa thông tin thẻ.</li><li>Luân chuyển khóa theo lịch và kiểm soát truy cập.</li></ul><p>Bảo mật là quy trình liên tục, không phải một lần cấu hình.</p>",
            cover_image: 'https://picsum.photos/seed/bao-mat-he-thong-thanh-toan-pci-dss/800/450',
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
            category_id: 3,
            language_id: 1,
            title: 'Micro-interactions: Chi Tiết Nhỏ Làm Nên Sự Khác Biệt Giữa Ứng Dụng Bình Thường Và Sản Phẩm Xuất Sắc',
            slug: 'micro-interactions-chi-tiet-nho-tao-khac-biet',
            content_html: "<h2>Micro-interactions tạo cảm xúc</h2><p>Một rung phản hồi nhẹ khi bấm like hay chuyển tab mượt mà là những điểm chạm giữ người dùng ở lại lâu hơn.</p><img src=\"https://picsum.photos/seed/micro-interactions-ui/1000/520\" alt=\"Ví dụ micro-interactions trong giao diện\"><blockquote>Chi tiết nhỏ, được lặp lại nhất quán, tạo nên cảm giác sản phẩm được chăm chút.</blockquote><p>Hãy bắt đầu từ những tương tác phổ biến nhất thay vì chạy theo hiệu ứng phức tạp.</p>",
            cover_image: 'https://picsum.photos/seed/micro-interactions-chi-tiet-nho-tao-khac-biet/800/450',
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
            category_id: 1,
            language_id: 1,
            title: 'Tự Viết Một Trình Phân Tích Cú Pháp SQL Mini Bằng TypeScript Trong 500 Dòng Code',
            slug: 'tu-viet-parser-sql-mini-typescript',
            content_html: "<h3>Bản nháp: Lexer và AST</h3><p>Bài viết đang phác thảo cách xây dựng tokenizer, parser và cây cú pháp trừu tượng cho câu lệnh SELECT đơn giản bằng TypeScript.</p><ul><li>Tách token theo từ khóa và toán tử.</li><li>Xây dựng parser đệ quy.</li><li>Kiểm thử với các câu truy vấn lồng nhau.</li></ul>",
            cover_image: 'https://picsum.photos/seed/tu-viet-parser-sql-mini-typescript/800/450',
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
            category_id: 1,
            language_id: 1,
            title: 'Kinh Nghiệm Phỏng Vấn Vị Trí Senior Fullstack Tại Các Tập Đoàn Công Nghệ Đa Quốc Gia',
            slug: 'kinh-nghiem-phong-van-senior-fullstack',
            content_html: "<h2>Chuẩn bị cho vòng phỏng vấn Senior Fullstack</h2><p>Ứng viên cần thể hiện tư duy hệ thống, khả năng giao tiếp và kinh nghiệm xử lý sự cố thực tế bên cạnh thuật toán.</p><ul><li>Luyện live coding có thuyết minh.</li><li>Chuẩn bị câu chuyện System Design theo quy mô triệu người dùng.</li><li>Rèn luyện behavioral questions bằng ví dụ cụ thể.</li></ul>",
            cover_image: 'https://picsum.photos/seed/kinh-nghiem-phong-van-senior-fullstack/800/450',
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
            category_id: 1,
            language_id: 1,
            title: 'Bí Kíp Kiếm Hàng Triệu Đô Nhờ Tiền Điện Tử Và Dự Án Đầu Tư Lợi Nhuận Khủng 300% Mỗi Tháng Không Rủi Ro',
            slug: 'bi-kip-kiem-tien-dien-tu-loi-nhuan-khung',
            content_html: "<h2>Nội dung bị từ chối</h2><p>Bài viết chứa liên kết tiếp thị mờ ám và hứa hẹn lợi nhuận bất khả thi về mặt tài chính.</p><p>Đây là dữ liệu mẫu để kiểm thử trạng thái rejected.</p>",
            cover_image: 'https://picsum.photos/seed/bi-kip-kiem-tien-dien-tu-loi-nhuan-khung/800/450',
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
            category_id: 2,
            language_id: 1,
            title: 'Chia Sẻ Bản Quyền Phần Mềm Crack Windows Và Key Kích Hoạt Miễn Phí Mới Nhất 2024',
            slug: 'chia-se-crack-windows-key-mien-phi',
            content_html: "<h2>Nội dung vi phạm bản quyền</h2><p>Bài viết chia sẻ liên kết tải tệp thực thi crack phần mềm, gây rủi ro bảo mật cho người dùng.</p>",
            cover_image: 'https://picsum.photos/seed/chia-se-crack-windows-key-mien-phi/800/450',
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
            category_id: 2,
            language_id: 1,
            title: 'Xây Dựng Hệ Thống Giám Sát Metrics Thời Gian Thực Với Prometheus và Grafana Từ Số Không',
            slug: 'xay-dung-giam-sat-prometheus-grafana',
            content_html: "<h2>Monitoring không chỉ là đồ thị CPU</h2><p>Một hệ thống giám sát tốt xoay quanh bốn Golden Signals: Latency, Traffic, Errors và Saturation.</p><img src=\"https://picsum.photos/seed/prometheus-grafana-dashboard/1000/520\" alt=\"Dashboard Prometheus và Grafana\"><h3>Thiết lập ban đầu</h3><ul><li>Chuẩn hóa metric theo service và endpoint.</li><li>Đặt alert theo triệu chứng người dùng cảm nhận.</li><li>Liên kết dashboard với runbook xử lý sự cố.</li></ul><blockquote>Cảnh báo tốt là cảnh báo có thể hành động ngay, không phải tiếng ồn.</blockquote><p>Mục tiêu cuối cùng là phát hiện sự cố trước khi khách hàng phàn nàn.</p>",
            cover_image: 'https://picsum.photos/seed/xay-dung-giam-sat-prometheus-grafana/800/450',
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
            category_id: 3,
            language_id: 1,
            title: 'Design Systems Cho Startup: Làm Thế Nào Để Xây Dựng Thư Viện UI Tinh Gọn Mà Vẫn Mở Rộng Được?',
            slug: 'design-systems-cho-startup-tinh-gon',
            content_html: "<h2>Design System vừa đủ cho startup</h2><p>Đừng sao chép hệ thống khổng lồ của Google hay Apple khi đội ngũ chỉ có hai designer. Hãy bắt đầu từ token màu sắc, typography và năm component cốt lõi.</p><img src=\"https://picsum.photos/seed/startup-design-system/1000/520\" alt=\"Bộ component tối giản cho startup\"><h3>Lộ trình mở rộng</h3><ol><li>Chuẩn hóa token và quy tắc đặt tên.</li><li>Tài liệu hóa trạng thái component.</li><li>Đo lường mức độ tái sử dụng theo từng sprint.</li></ol><p>Hệ thống nhỏ nhưng nhất quán luôn thắng thư viện đồ sộ nhưng rối ren.</p>",
            cover_image: 'https://picsum.photos/seed/design-systems-cho-startup-tinh-gon/800/450',
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
            category_id: 1,
            language_id: 1,
            title: 'Hiểu Về Cơ Chế Concurrency Trong Go: Goroutines, Channels và Những Cạm Bẫy Deadlock Thường Gặp',
            slug: 'co-che-concurrency-trong-go-goroutines',
            content_html: "<h2>Mô hình CSP của Go</h2><p>Goroutines và channels giúp xử lý đồng thời gọn gàng, nhưng chỉ khi vòng đời channel và WaitGroup được quản lý cẩn thận.</p><img src=\"https://picsum.photos/seed/go-concurrency-channels/1000/520\" alt=\"Minh họa goroutines và channels\"><h3>Cạm bẫy thường gặp</h3><ul><li>Gửi vào channel đã đóng.</li><li>Quên hủy context khi request kết thúc.</li><li>Khóa mutex quá lâu trong vòng lặp nóng.</li></ul><blockquote>Đồng thời tốt là đồng thời có thể dừng đúng lúc.</blockquote><p>Hãy viết test race và kiểm tra rò rỉ goroutine trước khi lên production.</p>",
            cover_image: 'https://picsum.photos/seed/co-che-concurrency-trong-go-goroutines/800/450',
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
            category_id: 2,
            language_id: 2,
            title: 'Mastering Docker Multi-Stage Builds: Slim Down Your Production Images from 1.2GB to 35MB',
            slug: 'mastering-docker-multi-stage-builds',
            content_html: "<h2>Vì sao Docker image phình to?</h2><p>Image production chứa compiler, cache và tệp debug không cần thiết. Multi-stage builds giúp tách môi trường build khỏi runtime.</p><img src=\"https://picsum.photos/seed/docker-multistage-build/1000/520\" alt=\"So sánh kích thước Docker image trước và sau tối ưu\"><h3>Các bước tối ưu</h3><ul><li>Dùng base image distroless hoặc Alpine.</li><li>Chỉ copy artifact cần thiết sang stage runtime.</li><li>Chạy container bằng user không phải root.</li></ul><p>Kết quả mẫu: image giảm từ 1,2GB xuống còn 35MB và ít lỗ hổng CVE hơn.</p>",
            cover_image: 'https://picsum.photos/seed/mastering-docker-multi-stage-builds/800/450',
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
            category_id: 1,
            language_id: 1,
            title: 'Bài Viết Đã Bị Xóa Nháp Để Thử Nghiệm Trường Hợp Lỗi Dữ Liệu Tồn Tại Trong Cơ Sở Dữ Liệu Cũ',
            slug: 'bai-viet-da-bi-xoa-thu-nghiem',
            content_html: "<p>Nội dung này đã bị đánh dấu xóa mềm deleted_at để kiểm thử trường hợp dữ liệu cũ.</p>",
            cover_image: 'https://picsum.photos/seed/bai-viet-da-bi-xoa-thu-nghiem/800/450',
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

    // Đồng bộ số bài viết của từng danh mục từ nguồn dữ liệu posts
    categories.forEach(cat => {
        cat.post_count = posts.filter(p => p.category_id === cat.id && !p.deleted_at).length;
    });

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

    // 13. TRUY VẤN DÙNG CHUNG (single source of truth)
    // Badge số đếm và nội dung danh sách trên profile đều phải đi qua các hàm này
    // để luôn khớp nhau. Khi chuyển sang API thật, chỉ cần thay phần thân hàm bằng
    // lời gọi endpoint (vd: GET /api/users/:id/notes) mà không phải sửa UI.
    function getNotesByUser(userId) {
        return notes.filter(n => n.author_id === userId);
    }

    function getPublishedPostsByUser(userId) {
        return posts.filter(p => p.author_id === userId && p.status === 'published' && !p.deleted_at);
    }

    function getFollowers(userId) {
        const followerIds = follows.filter(f => f.following_id === userId).map(f => f.follower_id);
        return users.filter(u => followerIds.includes(u.id) && u.is_active);
    }

    function getFollowing(userId) {
        const followingIds = follows.filter(f => f.follower_id === userId).map(f => f.following_id);
        return users.filter(u => followingIds.includes(u.id) && u.is_active);
    }

    function isFollowing(followerId, followingId) {
        return follows.some(f => f.follower_id === followerId && f.following_id === followingId);
    }

    function toggleFollow(followerId, followingId) {
        const idx = follows.findIndex(f => f.follower_id === followerId && f.following_id === followingId);
        if (idx !== -1) {
            follows.splice(idx, 1);
            return false;
        }
        follows.push({ follower_id: followerId, following_id: followingId });
        return true;
    }

    function getCategoryPostCount(categoryId) {
        return posts.filter(p => p.category_id === categoryId && !p.deleted_at).length;
    }

    function getCategoryById(categoryId) {
        return categories.find(c => c.id === categoryId) || null;
    }

    function getLanguageById(languageId) {
        return languages.find(l => l.id === languageId) || null;
    }

    return {
        roles,
        users,
        languages,
        tags,
        categories,
        posts,
        post_tags,
        notes,
        comments,
        follows,
        reactions,
        reports,
        getNotesByUser,
        getPublishedPostsByUser,
        getFollowers,
        getFollowing,
        isFollowing,
        toggleFollow,
        getCategoryPostCount,
        getCategoryById,
        getLanguageById
    };
})();
