/**
 * layout.js - Khung sườn điều hướng, Header, Sidebar dùng chung
 * Substack Clone Frontend
 */
window.Layout = (function () {
    const pathname = window.location.pathname;
    const isAdmin = pathname.includes('/admin/');
    const basePath = isAdmin ? '../' : '';

    function getDemoRole() {
        return localStorage.getItem('demo_role') || 'blogger';
    }

    function setDemoRole(newRole) {
        localStorage.setItem('demo_role', newRole);
        localStorage.setItem('isLoggedIn', newRole !== 'guest' ? 'true' : 'false');
        if (newRole === 'admin') localStorage.setItem('userHandle', 'nguyenadmin');
        else if (newRole === 'blogger') localStorage.setItem('userHandle', 'hhoanganh0710');
        else if (newRole === 'user') localStorage.setItem('userHandle', 'maihoa_reader');
        else localStorage.removeItem('userHandle');
        window.location.reload();
    }

    function getDemoState() {
        return sessionStorage.getItem('demo_data_state') || 'normal';
    }

    function setDemoState(newState) {
        sessionStorage.setItem('demo_data_state', newState);
        window.dispatchEvent(new CustomEvent('demoStateChanged', { detail: { state: newState } }));
    }

    function getCurrentUser() {
        const handle = localStorage.getItem('userHandle') || 'hhoanganh0710';
        if (window.MockData && Array.isArray(window.MockData.users)) {
            const found = window.MockData.users.find(u => u.handle === handle);
            if (found) return found;
        }
        return {
            id: 3,
            handle: handle,
            display_name: 'Hoàng Anh',
            avatar_url: `https://i.pravatar.cc/150?u=${handle}`,
            role_id: 2
        };
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }

    function formatNumber(num) {
        return (num || 0).toLocaleString('vi-VN');
    }

    function showToast(message, type = 'success') {
        const existing = document.getElementById('appToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'appToast';
        const colors = {
            success: 'bg-emerald-600',
            warning: 'bg-amber-600',
            error: 'bg-rose-600',
            info: 'bg-blue-600'
        };
        toast.className = `fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl text-white text-xs font-semibold shadow-2xl transition duration-300 ${colors[type] || colors.success}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    function requireAuth(callback) {
        if (getDemoRole() === 'guest') {
            window.location.href = basePath + 'login.html';
            return;
        }
        if (typeof callback === 'function') callback();
    }

    function renderHeader(targetId = 'appHeader') {
        const el = document.getElementById(targetId);
        if (!el) return;

        const role = getDemoRole();
        const user = getCurrentUser();
        const currentLang = window.I18n ? window.I18n.getCurrentLang() : (localStorage.getItem('preferred_lang') || 'vi');

        el.className = "h-14 border-b border-borderDark sticky top-0 z-40 bg-darkBg/95 backdrop-blur px-4 flex items-center justify-between";
        el.innerHTML = `
            <div class="flex items-center space-x-3">
                <a href="${basePath}index.html" class="text-substackOrange text-2xl font-bold flex items-center space-x-2">
                    <i class="fa-solid fa-book-bookmark"></i>
                    <span class="text-white text-base tracking-tight font-extrabold hidden sm:inline">Substack</span>
                </a>

                <!-- Dropdown Chọn ngôn ngữ -->
                <div class="relative inline-block text-left" id="langDropdownWrapper">
                    <button type="button" onclick="Layout.toggleLangDropdown(event)" class="bg-cardBg border border-borderDark px-2.5 py-1.5 rounded-xl text-xs text-gray-300 hover:text-white flex items-center space-x-1.5 transition">
                        <i class="fa-solid fa-globe text-substackOrange"></i>
                        <span id="currentLangLabel">${currentLang === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)'}</span>
                        <i class="fa-solid fa-chevron-down text-[10px] ml-1"></i>
                    </button>
                    <div id="langDropdownList" class="hidden absolute left-0 mt-2 w-36 bg-sidebarBg border border-borderDark rounded-xl shadow-2xl py-1 z-50 text-xs">
                        <button type="button" onclick="Layout.switchLanguage('vi')" class="w-full text-left px-3 py-2 hover:bg-cardBg flex items-center justify-between text-gray-200">
                            <span>Tiếng Việt</span><span class="text-gray-500 font-mono text-[10px]">VI</span>
                        </button>
                        <button type="button" onclick="Layout.switchLanguage('en')" class="w-full text-left px-3 py-2 hover:bg-cardBg flex items-center justify-between text-gray-200">
                            <span>English</span><span class="text-gray-500 font-mono text-[10px]">EN</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex items-center space-x-3">
                ${role === 'guest' ? `
                    <a href="${basePath}login.html" class="px-4 py-1.5 rounded-xl bg-cardBg border border-borderDark text-xs font-semibold text-white">Đăng nhập</a>
                    <a href="${basePath}register.html" class="px-4 py-1.5 rounded-xl bg-substackOrange hover:bg-substackOrangeHover text-xs font-semibold text-white shadow">Bắt đầu viết</a>
                ` : `
                    <a href="${basePath}profile.html?handle=${user.handle}" class="flex items-center space-x-2">
                        <img src="${user.avatar_url}" alt="Avatar" class="w-8 h-8 rounded-full object-cover border border-borderDark">
                    </a>
                `}
            </div>
        `;

        document.addEventListener('click', (e) => {
            const wrapper = document.getElementById('langDropdownWrapper');
            const list = document.getElementById('langDropdownList');
            if (wrapper && list && !wrapper.contains(e.target)) {
                list.classList.add('hidden');
            }
        });
    }

    function toggleLangDropdown(e) {
        if (e) e.stopPropagation();
        const list = document.getElementById('langDropdownList');
        if (list) list.classList.toggle('hidden');
    }

    function switchLanguage(lang) {
        if (window.I18n) {
            window.I18n.setLang(lang);
        } else {
            localStorage.setItem('preferred_lang', lang);
        }
        window.location.reload();
    }

    function renderSidebar(activeNav = 'home', targetId = 'appSidebar') {
        const el = document.getElementById(targetId);
        if (!el) return;

        const role = getDemoRole();
        const user = getCurrentUser();

        el.className = "w-60 shrink-0 hidden md:block py-5 pr-4 border-r border-borderDark space-y-4";
        el.innerHTML = `
            <nav class="space-y-1 text-xs font-medium">
                <a href="${basePath}index.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'home' ? 'bg-substackOrange text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                    <i class="fa-solid fa-house w-4 text-center"></i>
                    <span data-i18n="nav.home">Trang chủ</span>
                </a>
                <a href="${basePath}search.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'search' ? 'bg-substackOrange text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                    <i class="fa-solid fa-compass w-4 text-center"></i>
                    <span data-i18n="nav.explore">Khám phá</span>
                </a>

                ${role !== 'guest' ? `
                    <a href="${basePath}my-posts.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'my-posts' ? 'bg-substackOrange text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                        <i class="fa-regular fa-newspaper w-4 text-center"></i>
                        <span data-i18n="nav.my_posts">Bài viết của tôi</span>
                    </a>
                    <a href="${basePath}my-notes.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'my-notes' ? 'bg-substackOrange text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                        <i class="fa-regular fa-note-sticky w-4 text-center"></i>
                        <span data-i18n="nav.my_notes">Ghi chú cá nhân</span>
                    </a>
                    <a href="${basePath}profile.html?handle=${user.handle}" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'profile' ? 'bg-substackOrange text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                        <i class="fa-regular fa-user w-4 text-center"></i>
                        <span data-i18n="nav.profile">Hồ sơ tác giả</span>
                    </a>
                ` : ''}

                ${role === 'admin' ? `
                    <div class="pt-3 border-t border-borderDark text-[11px] font-bold text-gray-500 uppercase tracking-wider px-3">Quản trị Admin</div>
                    <a href="${basePath}admin/post-review.html" class="flex items-center space-x-3 px-3 py-2 rounded-xl text-rose-400 hover:bg-cardBg">
                        <i class="fa-solid fa-list-check w-4 text-center"></i>
                        <span>Duyệt bài viết</span>
                    </a>
                    <a href="${basePath}admin/categories.html" class="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-cardBg">
                        <i class="fa-solid fa-folder-tree w-4 text-center"></i>
                        <span>Quản lý danh mục</span>
                    </a>
                    <a href="${basePath}admin/reports.html" class="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-cardBg">
                        <i class="fa-solid fa-shield-halved w-4 text-center"></i>
                        <span>Xử lý báo cáo</span>
                    </a>
                    <a href="${basePath}admin/users.html" class="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-cardBg">
                        <i class="fa-solid fa-users-gear w-4 text-center"></i>
                        <span>Quản lý người dùng</span>
                    </a>
                    <a href="${basePath}admin/languages.html" class="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-cardBg">
                        <i class="fa-solid fa-language w-4 text-center"></i>
                        <span>Quản lý ngôn ngữ</span>
                    </a>
                ` : ''}
            </nav>
        `;
    }

    function renderAdminSidebar(activeNav = 'categories', targetId = 'adminSidebar') {
        const el = document.getElementById(targetId);
        if (!el) return;

        el.className = "w-60 shrink-0 hidden md:block py-5 pr-4 border-r border-borderDark space-y-4";
        el.innerHTML = `
            <div class="space-y-1 text-xs font-medium">
                <a href="../index.html" class="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-cardBg mb-3">
                    <i class="fa-solid fa-arrow-left w-4 text-center"></i>
                    <span>Về Website</span>
                </a>
                <a href="post-review.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'review' ? 'bg-rose-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                    <i class="fa-solid fa-list-check w-4 text-center"></i>
                    <span>Duyệt bài viết</span>
                </a>
                <a href="categories.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'categories' ? 'bg-rose-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                    <i class="fa-solid fa-folder-tree w-4 text-center"></i>
                    <span>Quản lý danh mục</span>
                </a>
                <a href="reports.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'reports' ? 'bg-rose-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                    <i class="fa-solid fa-shield-halved w-4 text-center"></i>
                    <span>Xử lý báo cáo</span>
                </a>
                <a href="users.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'users' ? 'bg-rose-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                    <i class="fa-solid fa-users-gear w-4 text-center"></i>
                    <span>Quản lý người dùng</span>
                </a>
                <a href="languages.html" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activeNav === 'languages' ? 'bg-rose-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-cardBg'}">
                    <i class="fa-solid fa-language w-4 text-center"></i>
                    <span>Quản lý ngôn ngữ</span>
                </a>
            </div>
        `;
    }

    function renderBottomNav(activeNav = 'home', targetId = 'appBottomNav') {
        const el = document.getElementById(targetId);
        if (!el) return;
        const user = getCurrentUser();
        el.className = "md:hidden fixed bottom-0 left-0 right-0 bg-sidebarBg border-t border-borderDark flex items-center justify-around h-14 text-xs z-40";
        el.innerHTML = `
            <a href="${basePath}index.html" class="${activeNav === 'home' ? 'text-substackOrange' : 'text-gray-400'}"><i class="fa-solid fa-house text-lg"></i></a>
            <a href="${basePath}search.html" class="${activeNav === 'search' ? 'text-substackOrange' : 'text-gray-400'}"><i class="fa-solid fa-compass text-lg"></i></a>
            <a href="${basePath}post-editor.html?new=true" class="text-substackOrange"><i class="fa-solid fa-circle-plus text-2xl"></i></a>
            <a href="${basePath}profile.html?handle=${user.handle}" class="${activeNav === 'profile' ? 'text-substackOrange' : 'text-gray-400'}"><i class="fa-regular fa-user text-lg"></i></a>
        `;
    }

    function showConfirmModal({ title, message, confirmText = 'Xác nhận', onConfirm }) {
        if (confirm(message)) {
            if (typeof onConfirm === 'function') onConfirm();
        }
    }

    return {
        getDemoRole,
        setDemoRole,
        getDemoState,
        setDemoState,
        getCurrentUser,
        formatDate,
        formatNumber,
        showToast,
        showConfirmModal,
        requireAuth,
        renderHeader,
        renderSidebar,
        renderAdminSidebar,
        renderBottomNav,
        switchLanguage,
        toggleLangDropdown,
        basePath
    };
})();

function containsHTML(str) {
    if (!str) return false;
    return /<[^>]*>?/gm.test(str);
}