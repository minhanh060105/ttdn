/**
 * i18n.js - Quản lý đa ngôn ngữ bằng tệp JSON độc lập (vi.json, en.json)
 * Cache theo ngôn ngữ, fallback về tiếng Việt, đồng bộ preferred_lang.
 */

window.I18n = (function () {
    const DEFAULT_LANG = 'vi';
    const STORAGE_KEY = 'preferred_lang';
    const LANG_CODE_REGEX = /^[a-z]{2}(-[a-z]{2})?$/;

    const dictionaries = {};
    let initPromise = null;

    // Lấy danh sách ngôn ngữ đang hỗ trợ (luôn dùng chung nguồn MockData.languages)
    function getSupportedLanguages() {
        if (window.MockData && Array.isArray(window.MockData.languages)) {
            return window.MockData.languages.filter(l => l.is_active);
        }
        return [
            { id: 1, code: 'vi', name: 'Tiếng Việt', is_active: true, is_default: true },
            { id: 2, code: 'en', name: 'English', is_active: true, is_default: false }
        ];
    }

    // Lấy ngôn ngữ hiện tại từ localStorage, chỉ chấp nhận ngôn ngữ đang bật
    function getCurrentLang() {
        const stored = (localStorage.getItem(STORAGE_KEY) || '').toLowerCase();
        const supportedCodes = getSupportedLanguages().map(l => l.code);
        if (stored && supportedCodes.includes(stored)) return stored;
        return DEFAULT_LANG;
    }

    let activeLang = getCurrentLang();

    // Xác định đường dẫn tương đối tới thư mục locales/ cho mọi trang
    function getLocalesBasePath() {
        const script = document.querySelector('script[src*="i18n.js"]');
        if (script) {
            const src = script.getAttribute('src');
            const idx = src.indexOf('assets/js/i18n.js');
            if (idx !== -1) {
                return src.substring(0, idx) + 'locales/';
            }
        }
        const pathname = window.location.pathname;
        if (pathname.includes('/pages/admin/')) return '../../locales/';
        if (pathname.includes('/pages/')) return '../locales/';
        return 'frontend/locales/';
    }

    // Tải tệp ngôn ngữ qua fetch với cơ chế cache
    async function loadLanguage(langCode) {
        if (!langCode) return null;
        const code = langCode.toLowerCase();
        if (!LANG_CODE_REGEX.test(code)) return null;
        if (dictionaries[code]) return dictionaries[code];

        const url = `${getLocalesBasePath()}${code}.json`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.warn(`[i18n] Không thể tải tệp ngôn ngữ: ${url} (HTTP ${res.status})`);
                return null;
            }
            dictionaries[code] = await res.json();
            return dictionaries[code];
        } catch (error) {
            console.warn(`[i18n] Lỗi nạp tệp ngôn ngữ ${url}:`, error);
            return null;
        }
    }

    // Dịch một khóa với tham số và fallback tự động về tiếng Việt
    function t(key, params = {}, fallback = '') {
        if (!key) return '';
        let template = null;

        if (dictionaries[activeLang] && dictionaries[activeLang][key] !== undefined) {
            template = dictionaries[activeLang][key];
        } else if (dictionaries[DEFAULT_LANG] && dictionaries[DEFAULT_LANG][key] !== undefined) {
            template = dictionaries[DEFAULT_LANG][key];
        }

        if (template === null) template = fallback || key;

        if (params && typeof params === 'object') {
            Object.keys(params).forEach(p => {
                template = template.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
            });
        }
        return template;
    }

    // Áp dụng bản dịch lên toàn bộ DOM hoặc một container cụ thể
    function applyI18n(container = document) {
        if (!container) return;

        container.querySelectorAll('[data-i18n]').forEach(el => {
            const translation = t(el.getAttribute('data-i18n'));
            if (translation) el.textContent = translation;
        });

        container.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const translation = t(el.getAttribute('data-i18n-placeholder'));
            if (translation) el.setAttribute('placeholder', translation);
        });

        container.querySelectorAll('[data-i18n-title]').forEach(el => {
            const translation = t(el.getAttribute('data-i18n-title'));
            if (translation) el.setAttribute('title', translation);
        });

        container.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const translation = t(el.getAttribute('data-i18n-aria-label'));
            if (translation) el.setAttribute('aria-label', translation);
        });

        document.documentElement.setAttribute('lang', activeLang);
    }

    // Đổi ngôn ngữ hiển thị (Layout.selectLanguage chịu trách nhiệm reload trang)
    async function setLang(newLang) {
        if (!newLang) return false;
        const normalized = newLang.toLowerCase();
        const supportedCodes = getSupportedLanguages().map(l => l.code);
        if (!supportedCodes.includes(normalized)) return false;

        const dictionary = await loadLanguage(normalized);
        if (!dictionary) return false;

        if (!dictionaries[DEFAULT_LANG]) await loadLanguage(DEFAULT_LANG);

        activeLang = normalized;
        localStorage.setItem(STORAGE_KEY, normalized);
        applyI18n();
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { lang: normalized }
        }));
        return true;
    }

    // Khởi tạo: nạp từ điển ngay từ đầu, sau đó áp dụng khi DOM sẵn sàng
    function init() {
        if (initPromise) return initPromise;
        initPromise = (async () => {
            activeLang = getCurrentLang();
            await Promise.all([
                loadLanguage(DEFAULT_LANG),
                activeLang !== DEFAULT_LANG ? loadLanguage(activeLang) : Promise.resolve()
            ]);

            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                });
            }

            applyI18n();
            window.dispatchEvent(new CustomEvent('i18nReady', {
                detail: { lang: activeLang }
            }));
        })();
        return initPromise;
    }

    // Cho phép trang chờ từ điển sẵn sàng trước khi render nội dung động
    function ready(callback) {
        return init().then(() => {
            if (typeof callback === 'function') callback();
        });
    }

    init();

    return {
        DEFAULT_LANG,
        getCurrentLang,
        setLang,
        t,
        applyI18n,
        getSupportedLanguages,
        init,
        ready,
        isReady: () => Boolean(dictionaries[activeLang])
    };
})();
