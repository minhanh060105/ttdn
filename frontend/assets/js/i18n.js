/**
 * assets/js/i18n.js
 * Quản lý đa ngôn ngữ tĩnh phía Frontend qua file JSON / từ điển nội bộ
 */
window.I18n = (function () {
    const STORAGE_KEY = 'preferred_lang';
    const DEFAULT_LANG = 'vi';

    // Từ điển tĩnh dự phòng tức thì
    const localDict = {
        vi: {
            "nav.home": "Trang chủ",
            "nav.explore": "Khám phá & Tìm kiếm",
            "nav.my_posts": "Bài viết của tôi",
            "nav.my_notes": "Ghi chú của tôi",
            "nav.profile": "Hồ sơ cá nhân",
            "nav.create": "Viết bài mới",
            "banner.title": "Kiếm tiền từ công việc bạn tin tưởng",
            "banner.subtitle": "Nền tảng xuất bản độc lập giúp bạn tự do sáng tạo.",
            "common.popular": "Đọc nhiều nhất",
            "common.empty_posts": "Chưa có bài viết nào ở ngôn ngữ này.",
            "common.read_more": "Đọc tiếp",
            "common.filter_all": "Tất cả chủ đề",
            "common.report": "Báo cáo vi phạm"
        },
        en: {
            "nav.home": "Home",
            "nav.explore": "Explore & Search",
            "nav.my_posts": "My Posts",
            "nav.my_notes": "My Notes",
            "nav.profile": "Profile",
            "nav.create": "New Post",
            "banner.title": "Make money doing the work you believe in",
            "banner.subtitle": "An independent publishing platform where you create freely.",
            "common.popular": "Popular stories",
            "common.empty_posts": "No posts found for this language.",
            "common.read_more": "Read more",
            "common.filter_all": "All topics",
            "common.report": "Report"
        }
    };

    function getCurrentLang() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    }

    let activeLang = getCurrentLang();
    let currentDict = localDict[activeLang] || localDict[DEFAULT_LANG];

    // Đọc trực tiếp từ file JSON trong thư mục frontend/locales/
    async function loadJsonFile(langCode) {
        try {
            const pathname = window.location.pathname;
            const prefix = pathname.includes('/pages/admin/') ? '../../' : (pathname.includes('/pages/') ? '../' : '');
            const res = await fetch(`${prefix}locales/${langCode}.json`);
            if (res.ok) {
                const data = await res.json();
                currentDict = { ...currentDict, ...data };
                applyI18n();
            }
        } catch (e) {
            applyI18n();
        }
    }

    function t(key, fallback = '') {
        return (currentDict && currentDict[key]) ? currentDict[key] : (fallback || key);
    }

    function applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = t(key);
            if (text) el.textContent = text;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = t(key);
            if (text) el.setAttribute('placeholder', text);
        });

        const label = document.getElementById('currentLangLabel') || document.getElementById('langLabel');
        if (label) {
            label.textContent = activeLang === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)';
        }
    }

    function setLang(newLang) {
        activeLang = newLang;
        localStorage.setItem(STORAGE_KEY, newLang);
        currentDict = localDict[newLang] || localDict[DEFAULT_LANG];
        loadJsonFile(newLang);
        applyI18n();
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));
    }

    document.addEventListener('DOMContentLoaded', () => {
        activeLang = getCurrentLang();
        currentDict = localDict[activeLang] || localDict[DEFAULT_LANG];
        applyI18n();
        loadJsonFile(activeLang);
    });

    return {
        getCurrentLang,
        setLang,
        t,
        applyI18n
    };
})();