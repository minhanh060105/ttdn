/**
 * layout.js - Khung sườn điều hướng, phân quyền, thanh demo và thành phần dùng chung
 * Substack Clone Frontend
 */

window.Layout = (function () {
    // 1. Quản lý Trạng thái & Vai trò
    function getDemoRole() {
        let role = localStorage.getItem('demo_role');
        if (!role) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            role = isLoggedIn ? 'blogger' : 'guest';
            localStorage.setItem('demo_role', role);
        }
        return role;
    }

    function setDemoRole(newRole) {
        localStorage.setItem('demo_role', newRole);
        if (newRole === 'guest') {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('userHandle');
        } else {
            localStorage.setItem('isLoggedIn', 'true');
            if (newRole === 'admin') {
                localStorage.setItem('userHandle', 'nguyenadmin');
            } else if (newRole === 'blogger') {
                localStorage.setItem('userHandle', 'hhoanganh0710');
            } else if (newRole === 'user') {
                localStorage.setItem('userHandle', 'maihoa_reader');
            }
        }
        window.location.reload();
    }

    function getDemoState() {
        return sessionStorage.getItem('demo_data_state') || 'normal'; // 'normal' | 'loading' | 'empty' | 'error'
    }

    function setDemoState(newState) {
        sessionStorage.setItem('demo_data_state', newState);
        window.dispatchEvent(new CustomEvent('demoStateChanged', { detail: { state: newState } }));
        if (typeof window.onDemoStateChange === 'function') {
            window.onDemoStateChange(newState);
        }
    }

    // Lấy thông tin người dùng hiện tại theo vai trò
    function getCurrentUser() {
        const role = getDemoRole();
        if (role === 'guest') return null;
        const handle = localStorage.getItem('userHandle') || 'hhoanganh0710';
        if (window.MockData && window.MockData.users) {
            const found = window.MockData.users.find(u => u.handle === handle);
            if (found) return found;
        }
        return {
            id: 3,
            handle: handle,
            display_name: 'Người dùng ' + role.toUpperCase(),
            avatar_url: `https://i.pravatar.cc/150?u=${handle}`,
            role_id: role === 'admin' ? 1 : (role === 'blogger' ? 2 : 3)
        };
    }

    // Kiểm tra trang hiện tại
    const currentPath = window.location.pathname;
    const isPagesRoot = currentPath.includes('/pages/') && !currentPath.includes('/pages/admin/');
    const isAdminPath = currentPath.includes('/admin/');
    const basePath = isAdminPath ? '../' : '';

    // 2. Phân Quyền Trang (Route Guard)
    function checkPagePermissions() {
        const role = getDemoRole();
        
        // Trang Admin
        if (isAdminPath && role !== 'admin') {
            renderAccessDenied(
                'Yêu cầu quyền Quản trị viên (Admin)',
                'Bạn đang truy cập vào khu vực quản trị nhưng vai trò hiện tại của bạn là ' + role.toUpperCase() + '. Vui lòng chuyển vai trò thành Admin ở thanh demo bên dưới hoặc quay lại trang chủ.'
            );
            return false;
        }

        // Trang Blogger
        const bloggerOnlyFiles = ['my-posts.html', 'post-editor.html', 'my-notes.html'];
        const isBloggerPage = bloggerOnlyFiles.some(f => currentPath.endsWith(f));
        if (isBloggerPage && role !== 'blogger' && role !== 'admin') {
            renderAccessDenied(
                'Yêu cầu quyền Tác giả (Blogger)',
                'Chức năng viết bài và quản lý nội dung chỉ dành cho vai trò Blogger hoặc Admin. Vai trò hiện tại của bạn là ' + role.toUpperCase() + '. Hãy dùng thanh demo góc phải để đổi vai trò thành Blogger.'
            );
            return false;
        }

        return true;
    }

    function renderAccessDenied(title, desc) {
        document.body.innerHTML = `
            <div class="min-h-screen bg-darkBg text-gray-200 flex flex-col items-center justify-center p-6 text-center">
                <div class="w-20 h-20 bg-red-900/30 border border-red-500/40 rounded-full flex items-center justify-center text-red-400 text-3xl mb-6 shadow-xl">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-white mb-3">${title}</h1>
                <p class="text-sm text-gray-400 max-w-lg mb-8 leading-relaxed">${desc}</p>
                <div class="flex flex-wrap gap-4 justify-center">
                    <a href="${basePath}index.html" class="bg-substackOrange hover:bg-substackOrangeHover text-white font-medium px-6 py-2.5 rounded-lg transition shadow">
                        <i class="fa-solid fa-house mr-2"></i> Quay về Trang chủ
                    </a>
                    <button onclick="Layout.setDemoRole('admin')" class="bg-cardBg hover:bg-borderDark text-white font-medium px-6 py-2.5 rounded-lg transition border border-borderDark">
                        <i class="fa-solid fa-user-shield mr-2"></i> Chuyển sang Admin ngay
                    </button>
                    <button onclick="Layout.setDemoRole('blogger')" class="bg-cardBg hover:bg-borderDark text-white font-medium px-6 py-2.5 rounded-lg transition border border-borderDark">
                        <i class="fa-solid fa-pen-nib mr-2"></i> Chuyển sang Blogger
                    </button>
                </div>
            </div>
        `;
        renderDemoBar();
    }

    // 3. Render Thanh Demo
    function renderDemoBar() {
        let barContainer = document.getElementById('demoToolbarContainer');
        if (!barContainer) {
            barContainer = document.createElement('div');
            barContainer.id = 'demoToolbarContainer';
            document.body.appendChild(barContainer);
        }

        const currentRole = getDemoRole();
        const currentState = getDemoState();
        const isCollapsed = localStorage.getItem('demo_bar_collapsed') === 'true';

        barContainer.innerHTML = `
            <div id="demoFloatingToolbar" class="fixed bottom-4 right-4 z-50 text-xs font-sans transition-all duration-300">
                ${isCollapsed ? `
                    <button onclick="Layout.toggleDemoBarCollapse(false)" class="bg-cardBg/95 hover:bg-borderDark border border-substackOrange text-substackOrange px-3.5 py-2 rounded-full shadow-2xl flex items-center space-x-2 backdrop-blur">
                        <i class="fa-solid fa-sliders"></i>
                        <span class="font-bold uppercase tracking-wider text-[11px]">Demo: ${currentRole}</span>
                        <i class="fa-solid fa-chevron-up text-[10px]"></i>
                    </button>
                ` : `
                    <div class="bg-sidebarBg/95 border border-borderDark text-gray-200 rounded-2xl p-4 shadow-2xl w-80 backdrop-blur-md">
                        <div class="flex items-center justify-between border-b border-borderDark pb-2.5 mb-3">
                            <div class="flex items-center space-x-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-substackOrange animate-pulse"></span>
                                <span class="font-bold text-white text-sm">Thanh Điều Khiển Demo</span>
                            </div>
                            <button onclick="Layout.toggleDemoBarCollapse(true)" class="text-gray-400 hover:text-white text-sm p-1" title="Thu gọn thanh demo">
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                        </div>

                        <!-- Chọn vai trò -->
                        <div class="mb-3">
                            <label class="block text-gray-400 text-[11px] mb-1.5 font-medium">Vai trò người dùng (demo_role):</label>
                            <div class="grid grid-cols-4 gap-1.5 bg-darkBg p-1 rounded-xl border border-borderDark">
                                <button onclick="Layout.setDemoRole('guest')" class="py-1.5 rounded-lg text-center font-medium transition ${currentRole === 'guest' ? 'bg-substackOrange text-white' : 'text-gray-400 hover:text-white'}">Guest</button>
                                <button onclick="Layout.setDemoRole('user')" class="py-1.5 rounded-lg text-center font-medium transition ${currentRole === 'user' ? 'bg-substackOrange text-white' : 'text-gray-400 hover:text-white'}">User</button>
                                <button onclick="Layout.setDemoRole('blogger')" class="py-1.5 rounded-lg text-center font-medium transition ${currentRole === 'blogger' ? 'bg-substackOrange text-white' : 'text-gray-400 hover:text-white'}">Blogger</button>
                                <button onclick="Layout.setDemoRole('admin')" class="py-1.5 rounded-lg text-center font-medium transition ${currentRole === 'admin' ? 'bg-substackOrange text-white' : 'text-gray-400 hover:text-white'}">Admin</button>
                            </div>
                        </div>

                        <!-- Chọn trạng thái dữ liệu -->
                        <div class="mb-3">
                            <label class="block text-gray-400 text-[11px] mb-1.5 font-medium">Trạng thái dữ liệu trang:</label>
                            <div class="grid grid-cols-4 gap-1.5 bg-darkBg p-1 rounded-xl border border-borderDark">
                                <button onclick="Layout.setDemoState('normal')" class="py-1.5 rounded-lg text-center font-medium transition ${currentState === 'normal' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}">Chuẩn</button>
                                <button onclick="Layout.setDemoState('loading')" class="py-1.5 rounded-lg text-center font-medium transition ${currentState === 'loading' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}">Tải...</button>
                                <button onclick="Layout.setDemoState('empty')" class="py-1.5 rounded-lg text-center font-medium transition ${currentState === 'empty' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}">Rỗng</button>
                                <button onclick="Layout.setDemoState('error')" class="py-1.5 rounded-lg text-center font-medium transition ${currentState === 'error' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:text-white'}">Lỗi</button>
                            </div>
                        </div>

                        <!-- Vùng nút tùy chọn riêng cho từng màn hình -->
                        <div id="pageCustomDemoControls" class="pt-2 border-t border-borderDark hidden"></div>

                        <!-- Chuyển nhanh tới Mục lục Screens -->
                        <div class="pt-2.5 border-t border-borderDark flex items-center justify-between text-[11px]">
                            <a href="${basePath}screens.html" class="text-substackOrange hover:underline flex items-center space-x-1 font-medium">
                                <i class="fa-solid fa-list-check"></i>
                                <span>Mục lục 17 giao diện</span>
                            </a>
                            <span class="text-gray-500">v1.0 • Static Mock</span>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    function toggleDemoBarCollapse(collapsed) {
        localStorage.setItem('demo_bar_collapsed', collapsed ? 'true' : 'false');
        renderDemoBar();
    }

    // 4. Toast Thông báo
    function showToast(message, type = 'info') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed top-16 right-4 z-50 flex flex-col space-y-2 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl border text-sm transition-all transform duration-300 translate-y-2 opacity-0 ${
            type === 'success' ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200' :
            type === 'error' ? 'bg-red-950/95 border-red-500/40 text-red-200' :
            type === 'warning' ? 'bg-amber-950/95 border-amber-500/40 text-amber-200' :
            'bg-sidebarBg/95 border-borderDark text-white'
        }`;

        const icon = type === 'success' ? 'fa-circle-check text-emerald-400' :
                     type === 'error' ? 'fa-triangle-exclamation text-red-400' :
                     type === 'warning' ? 'fa-circle-exclamation text-amber-400' :
                     'fa-circle-info text-substackOrange';

        toast.innerHTML = `
            <i class="fa-solid ${icon} text-base"></i>
            <span class="flex-1 font-medium">${message}</span>
            <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-white ml-2 text-xs">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // 5. Modal Xác Nhận Hành Động
    function showConfirmModal({ title = 'Xác nhận hành động', message = 'Bạn có chắc chắn muốn thực hiện hành động này?', confirmText = 'Đồng ý', confirmClass = 'bg-red-600 hover:bg-red-700', onConfirm }) {
        let modal = document.getElementById('globalConfirmModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'globalConfirmModal';
            modal.className = 'fixed inset-0 bg-black/75 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="bg-sidebarBg border border-borderDark rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
                <div class="flex items-center space-x-3 text-red-400">
                    <div class="w-10 h-10 rounded-full bg-red-950/50 flex items-center justify-center text-xl">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white">${title}</h3>
                </div>
                <p class="text-sm text-gray-300 leading-relaxed">${message}</p>
                <div class="flex justify-end space-x-3 pt-2">
                    <button id="confirmCancelBtn" class="bg-cardBg hover:bg-borderDark text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition border border-borderDark">Hủy</button>
                    <button id="confirmOkBtn" class="${confirmClass} text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow">${confirmText}</button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        function close() {
            modal.classList.add('hidden');
        }

        modal.querySelector('#confirmCancelBtn').onclick = close;
        modal.querySelector('#confirmOkBtn').onclick = () => {
            close();
            if (typeof onConfirm === 'function') onConfirm();
        };

        // Đóng bằng Esc
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // 6. Modal Đăng Nhập Dùng Chung
    function openAuthModal() {
        let modal = document.getElementById('globalAuthModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'globalAuthModal';
            modal.className = 'fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="bg-sidebarBg border border-borderDark rounded-2xl w-full max-w-md p-6 relative shadow-2xl text-center">
                <button onclick="Layout.closeAuthModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-lg">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="text-substackOrange text-3xl mb-3 inline-block bg-borderDark p-3 rounded-full">
                    <i class="fa-solid fa-book-bookmark"></i>
                </div>
                <h3 class="text-lg font-bold text-white mb-1">Đăng nhập vào Substack</h3>
                <p class="text-xs text-gray-400 mb-6">Chưa có tài khoản? <a href="${basePath}register.html" class="text-substackOrange hover:underline">Đăng ký ngay</a></p>
                
                <div class="space-y-4 text-left">
                    <div>
                        <label class="block text-xs text-gray-400 mb-1">Email</label>
                        <input type="email" id="quickLoginEmail" value="hhoanganh0710@gmail.com" class="w-full bg-darkBg border border-borderDark rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-substackOrange">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-400 mb-1">Mật khẩu</label>
                        <input type="password" id="quickLoginPassword" value="12345678" class="w-full bg-darkBg border border-borderDark rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-substackOrange">
                    </div>
                    <button onclick="Layout.executeQuickLogin()" class="w-full bg-substackOrange hover:bg-substackOrangeHover text-white font-semibold py-2.5 rounded-lg transition text-sm shadow">
                        Tiếp tục đăng nhập
                    </button>
                    <div class="text-center pt-2">
                        <span class="text-xs text-gray-500">Hoặc chọn nhanh vai trò ở thanh Demo góc phải</span>
                    </div>
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
    }

    function closeAuthModal() {
        const modal = document.getElementById('globalAuthModal');
        if (modal) modal.classList.add('hidden');
    }

    function executeQuickLogin() {
        setDemoRole('blogger');
        closeAuthModal();
        showToast('Đăng nhập thành công với vai trò Blogger!', 'success');
    }

    function requireAuth(actionCallback) {
        const role = getDemoRole();
        if (role === 'guest') {
            openAuthModal();
            return false;
        }
        if (typeof actionCallback === 'function') {
            actionCallback();
        }
        return true;
    }

    // 7. Định Dạng Ngày & Số
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return num.toLocaleString('vi-VN');
    }

    // 8. Render Header & Sidebar Dùng Chung
    function renderHeader(targetId = 'appHeader') {
        const el = document.getElementById(targetId);
        if (!el) return;

        const role = getDemoRole();
        const user = getCurrentUser();
        const currentLang = (window.I18n ? window.I18n.getCurrentLang() : 'vi').toUpperCase();

        el.className = "h-14 border-b border-borderDark flex items-center justify-between px-4 sticky top-0 bg-darkBg z-40";
        el.innerHTML = `
            <div class="flex items-center space-x-3">
                <a href="${basePath}index.html" class="text-substackOrange text-2xl font-bold flex items-center space-x-2" title="Trang chủ Substack">
                    <i class="fa-solid fa-book-bookmark"></i>
                    <span class="text-white text-base tracking-tight font-extrabold hidden sm:inline">Substack</span>
                </a>
                <!-- Nút đổi ngôn ngữ -->
                <button onclick="I18n.toggleLanguage()" class="bg-borderDark hover:bg-gray-700 text-xs text-substackOrange font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1.5" title="Chuyển đổi Tiếng Việt / English">
                    <i class="fa-solid fa-globe text-gray-400"></i>
                    <span><span id="langLabel" class="text-white uppercase">${currentLang}</span></span>
                </button>
            </div>

            <!-- Công cụ tìm kiếm nhanh trên header màn hình vừa & lớn -->
            <div class="hidden md:flex items-center flex-1 max-w-xs mx-6">
                <form action="${basePath}search.html" method="GET" class="w-full relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-500 text-xs"></i>
                    <input type="text" name="q" placeholder="Tìm kiếm bài viết, thẻ..." class="w-full bg-sidebarBg border border-borderDark rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-substackOrange transition">
                </form>
            </div>

            <div class="flex items-center space-x-3 text-gray-400">
                ${role === 'guest' ? `
                    <button onclick="Layout.openAuthModal()" class="bg-substackOrange hover:bg-substackOrangeHover text-white text-xs font-semibold px-4 py-1.5 rounded-full transition shadow">
                        Đăng nhập
                    </button>
                ` : `
                    <a href="${basePath}my-notes.html" class="hover:text-white text-sm" title="Ghi chú nhanh"><i class="fa-regular fa-bell"></i></a>
                    <div class="relative group">
                        <div class="flex items-center space-x-2 cursor-pointer py-1" onclick="document.getElementById('headerUserDropdown')?.classList.toggle('hidden')">
                            <img src="${user.avatar_url}" alt="${user.display_name}" class="w-7 h-7 rounded-full object-cover border border-borderDark">
                            <span class="text-xs text-white font-medium hidden sm:inline max-w-[100px] truncate">${user.display_name}</span>
                            <i class="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                        </div>
                        <div id="headerUserDropdown" class="hidden absolute right-0 mt-2 w-48 bg-sidebarBg border border-borderDark rounded-xl shadow-2xl py-1.5 text-xs text-gray-300 z-50">
                            <div class="px-3 py-2 border-b border-borderDark">
                                <p class="font-bold text-white truncate">${user.display_name}</p>
                                <p class="text-gray-400 text-[11px] truncate">@${user.handle} • <span class="text-substackOrange font-medium uppercase">${role}</span></p>
                            </div>
                            <a href="${basePath}profile.html?handle=${user.handle}" class="flex items-center space-x-2 px-3 py-2 hover:bg-borderDark text-gray-300">
                                <i class="fa-regular fa-user w-4"></i><span>Xem trang hồ sơ</span>
                            </a>
                            ${role === 'blogger' || role === 'admin' ? `
                                <a href="${basePath}my-posts.html" class="flex items-center space-x-2 px-3 py-2 hover:bg-borderDark text-gray-300">
                                    <i class="fa-regular fa-newspaper w-4"></i><span>Bài viết của tôi</span>
                                </a>
                                <a href="${basePath}my-notes.html" class="flex items-center space-x-2 px-3 py-2 hover:bg-borderDark text-gray-300">
                                    <i class="fa-regular fa-note-sticky w-4"></i><span>Ghi chú của tôi</span>
                                </a>
                            ` : ''}
                            ${role === 'admin' ? `
                                <a href="${basePath}admin/post-review.html" class="flex items-center space-x-2 px-3 py-2 hover:bg-borderDark text-substackOrange font-medium">
                                    <i class="fa-solid fa-gauge-high w-4"></i><span>Trang Quản trị Admin</span>
                                </a>
                            ` : ''}
                            <div class="border-t border-borderDark my-1"></div>
                            <button onclick="Layout.setDemoRole('guest')" class="w-full text-left flex items-center space-x-2 px-3 py-2 hover:bg-borderDark text-red-400">
                                <i class="fa-solid fa-arrow-right-from-bracket w-4"></i><span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    // Render Sidebar chính cho độc giả và blogger
    function renderSidebar(activeNav = 'home', targetId = 'appSidebar') {
        const el = document.getElementById(targetId);
        if (!el) return;

        const role = getDemoRole();
        const user = getCurrentUser();

        el.className = "w-64 p-4 hidden md:flex flex-col justify-between border-r border-borderDark sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto";
        el.innerHTML = `
            <div class="space-y-4">
                <nav class="space-y-1 text-sm">
                    <a href="${basePath}index.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'home' ? 'bg-borderDark text-white' : 'text-gray-400 hover:bg-borderDark hover:text-white'}">
                        <i class="fa-solid fa-house w-5"></i>
                        <span data-i18n="nav.home">Trang chủ</span>
                    </a>
                    <a href="${basePath}search.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'search' ? 'bg-borderDark text-white' : 'text-gray-400 hover:bg-borderDark hover:text-white'}">
                        <i class="fa-solid fa-magnifying-glass w-5"></i>
                        <span data-i18n="nav.explore">Khám phá & Tìm kiếm</span>
                    </a>
                    <a href="${basePath}tag.html?slug=cong-nghe" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'tag' ? 'bg-borderDark text-white' : 'text-gray-400 hover:bg-borderDark hover:text-white'}">
                        <i class="fa-solid fa-hashtag w-5"></i>
                        <span>Chủ đề nổi bật</span>
                    </a>
                    <a href="${role === 'guest' ? '#' : basePath + 'profile.html?handle=' + (user?.handle || 'hhoanganh0710')}" onclick="${role === 'guest' ? 'Layout.openAuthModal()' : ''}" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'profile' ? 'bg-borderDark text-white' : 'text-gray-400 hover:bg-borderDark hover:text-white'}">
                        <i class="fa-regular fa-user w-5"></i>
                        <span data-i18n="nav.profile">Hồ sơ cá nhân</span>
                    </a>

                    ${role === 'blogger' || role === 'admin' ? `
                        <div class="pt-3 pb-1 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tác giả</div>
                        <a href="${basePath}my-posts.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'my-posts' ? 'bg-borderDark text-white' : 'text-gray-400 hover:bg-borderDark hover:text-white'}">
                            <i class="fa-regular fa-newspaper w-5"></i>
                            <span data-i18n="nav.my_posts">Bài viết của tôi</span>
                        </a>
                        <a href="${basePath}my-notes.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'my-notes' ? 'bg-borderDark text-white' : 'text-gray-400 hover:bg-borderDark hover:text-white'}">
                            <i class="fa-regular fa-note-sticky w-5"></i>
                            <span data-i18n="nav.my_notes">Ghi chú của tôi</span>
                        </a>
                    ` : ''}

                    ${role === 'admin' ? `
                        <div class="pt-3 pb-1 px-3 text-[11px] font-semibold text-substackOrange uppercase tracking-wider">Quản trị</div>
                        <a href="${basePath}admin/post-review.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium text-substackOrange hover:bg-borderDark">
                            <i class="fa-solid fa-shield-halved w-5"></i>
                            <span>Bảng quản trị Admin</span>
                        </a>
                    ` : ''}
                </nav>

                ${(role === 'blogger' || role === 'admin') ? `
                    <div class="pt-2">
                        <a href="${basePath}post-editor.html?new=true" class="w-full bg-substackOrange hover:bg-substackOrangeHover text-white font-semibold py-2.5 px-4 rounded-xl transition shadow-md flex items-center justify-center space-x-2 text-sm">
                            <i class="fa-solid fa-pen"></i>
                            <span data-i18n="nav.create">Viết bài mới</span>
                        </a>
                    </div>
                ` : ''}
            </div>

            <!-- Footer sidebar -->
            <div class="pt-4 border-t border-borderDark text-xs text-gray-500 space-y-2">
                <div class="flex items-center justify-between">
                    <a href="${basePath}screens.html" class="text-gray-400 hover:text-substackOrange transition font-medium">Mục lục 17 giao diện</a>
                    <span class="bg-borderDark text-gray-300 px-2 py-0.5 rounded text-[10px] uppercase">${role}</span>
                </div>
                <p class="text-[11px] leading-relaxed">Substack Clone © 2026. Giao diện HTML tĩnh chuẩn hoá.</p>
            </div>
        `;
    }

    // Render Sidebar dành riêng cho Admin
    function renderAdminSidebar(activeNav = 'review', targetId = 'adminSidebar') {
        const el = document.getElementById(targetId);
        if (!el) return;

        // Đếm số lượng pending từ mock data
        const pendingPostsCount = (window.MockData?.posts?.filter(p => p.status === 'pending') || []).length;
        const pendingReportsCount = (window.MockData?.reports?.filter(r => r.status === 'pending') || []).length;

        el.className = "w-64 p-4 hidden md:flex flex-col justify-between border-r border-borderDark sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-sidebarBg";
        el.innerHTML = `
            <div class="space-y-4">
                <div class="px-3 py-2 bg-borderDark/60 rounded-xl border border-borderDark">
                    <p class="text-xs text-gray-400">Không gian quản trị</p>
                    <p class="text-sm font-bold text-white flex items-center space-x-2 mt-0.5">
                        <i class="fa-solid fa-user-shield text-substackOrange"></i>
                        <span>Admin Control Panel</span>
                    </p>
                </div>

                <nav class="space-y-1 text-sm">
                    <a href="post-review.html" class="flex items-center justify-between px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'review' ? 'bg-substackOrange text-white' : 'text-gray-300 hover:bg-borderDark hover:text-white'}">
                        <div class="flex items-center space-x-3">
                            <i class="fa-solid fa-list-check w-5"></i>
                            <span>Duyệt bài viết</span>
                        </div>
                        ${pendingPostsCount > 0 ? `
                            <span class="bg-amber-500 text-black font-bold text-[11px] px-2 py-0.5 rounded-full">${pendingPostsCount}</span>
                        ` : ''}
                    </a>

                    <a href="reports.html" class="flex items-center justify-between px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'reports' ? 'bg-substackOrange text-white' : 'text-gray-300 hover:bg-borderDark hover:text-white'}">
                        <div class="flex items-center space-x-3">
                            <i class="fa-solid fa-flag w-5"></i>
                            <span>Xử lý báo cáo</span>
                        </div>
                        ${pendingReportsCount > 0 ? `
                            <span class="bg-rose-500 text-white font-bold text-[11px] px-2 py-0.5 rounded-full">${pendingReportsCount}</span>
                        ` : ''}
                    </a>

                    <a href="users.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'users' ? 'bg-substackOrange text-white' : 'text-gray-300 hover:bg-borderDark hover:text-white'}">
                        <i class="fa-solid fa-users-gear w-5"></i>
                        <span>Quản lý người dùng</span>
                    </a>

                    <a href="languages.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'languages' ? 'bg-substackOrange text-white' : 'text-gray-300 hover:bg-borderDark hover:text-white'}">
                        <i class="fa-solid fa-language w-5"></i>
                        <span>Quản lý ngôn ngữ</span>
                    </a>

                    <a href="ui-translations.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition font-medium ${activeNav === 'translations' ? 'bg-substackOrange text-white' : 'text-gray-300 hover:bg-borderDark hover:text-white'}">
                        <i class="fa-solid fa-book-atlas w-5"></i>
                        <span>Từ điển giao diện</span>
                    </a>
                </nav>
            </div>

            <div class="pt-4 border-t border-borderDark space-y-2">
                <a href="../index.html" class="flex items-center space-x-2 text-xs text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-borderDark transition">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Quay lại trang người dùng</span>
                </a>
                <a href="../screens.html" class="flex items-center space-x-2 text-xs text-substackOrange hover:underline px-3 py-1 font-medium">
                    <i class="fa-solid fa-list-check"></i>
                    <span>Mục lục 17 màn hình</span>
                </a>
            </div>
        `;
    }

    // Render Mobile Bottom Navigation
    function renderBottomNav(activeNav = 'home', targetId = 'appBottomNav') {
        const el = document.getElementById(targetId);
        if (!el) return;

        const role = getDemoRole();
        const user = getCurrentUser();

        el.className = "md:hidden fixed bottom-0 left-0 right-0 bg-sidebarBg border-t border-borderDark flex items-center justify-around py-2 px-1 z-40 text-xs";
        el.innerHTML = `
            <a href="${basePath}index.html" class="flex flex-col items-center py-1 px-3 ${activeNav === 'home' ? 'text-substackOrange' : 'text-gray-400'}">
                <i class="fa-solid fa-house text-base"></i>
                <span class="text-[10px] mt-1">Trang chủ</span>
            </a>
            <a href="${basePath}search.html" class="flex flex-col items-center py-1 px-3 ${activeNav === 'search' ? 'text-substackOrange' : 'text-gray-400'}">
                <i class="fa-solid fa-magnifying-glass text-base"></i>
                <span class="text-[10px] mt-1">Khám phá</span>
            </a>
            ${role === 'blogger' || role === 'admin' ? `
                <a href="${basePath}post-editor.html?new=true" class="flex flex-col items-center py-1 px-3 ${activeNav === 'create' ? 'text-substackOrange' : 'text-gray-400'}">
                    <div class="w-8 h-8 rounded-full bg-substackOrange text-white flex items-center justify-center -mt-3 shadow-lg">
                        <i class="fa-solid fa-plus text-sm"></i>
                    </div>
                    <span class="text-[10px] mt-0.5">Viết bài</span>
                </a>
            ` : ''}
            <a href="${basePath}tag.html?slug=cong-nghe" class="flex flex-col items-center py-1 px-3 ${activeNav === 'tag' ? 'text-substackOrange' : 'text-gray-400'}">
                <i class="fa-solid fa-hashtag text-base"></i>
                <span class="text-[10px] mt-1">Chủ đề</span>
            </a>
            <a href="${role === 'guest' ? '#' : basePath + 'profile.html?handle=' + (user?.handle || 'hhoanganh0710')}" onclick="${role === 'guest' ? 'Layout.openAuthModal()' : ''}" class="flex flex-col items-center py-1 px-3 ${activeNav === 'profile' ? 'text-substackOrange' : 'text-gray-400'}">
                <i class="fa-regular fa-user text-base"></i>
                <span class="text-[10px] mt-1">Hồ sơ</span>
            </a>
        `;
    }

    // 9. Tự khởi chạy layout
    document.addEventListener('DOMContentLoaded', () => {
        if (checkPagePermissions()) {
            renderDemoBar();
        }

        // Lắng nghe sự kiện phím Escape để đóng các modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAuthModal();
                const confirmModal = document.getElementById('globalConfirmModal');
                if (confirmModal) confirmModal.classList.add('hidden');
            }
        });
    });

    return {
        getDemoRole,
        setDemoRole,
        getDemoState,
        setDemoState,
        getCurrentUser,
        renderDemoBar,
        toggleDemoBarCollapse,
        showToast,
        showConfirmModal,
        openAuthModal,
        closeAuthModal,
        executeQuickLogin,
        requireAuth,
        formatDate,
        formatNumber,
        renderHeader,
        renderSidebar,
        renderAdminSidebar,
        renderBottomNav,
        basePath
    };
})();
