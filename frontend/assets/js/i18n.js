/**
 * assets/js/i18n.js
 * Quản lý đa ngôn ngữ tĩnh phía Frontend bằng cách đọc trực tiếp từ 2 file JSON:
 * locales/vi.json và locales/en.json
 */
window.I18n = (function () {
    const STORAGE_KEY = 'preferred_lang';
    const DEFAULT_LANG = 'vi';

    function getCurrentLang() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    }

    let activeLang = getCurrentLang();
    let currentDict = {};

    // Danh sách các khả năng đường dẫn tương đối tới thư mục locales
    function getPossibleJsonPaths(langCode) {
        return [
            `../locales/${langCode}.json`,
            `../../locales/${langCode}.json`,
            `locales/${langCode}.json`,
            `/frontend/locales/${langCode}.json`
        ];
    }

    // Đọc file JSON từ locales/
    async function loadJsonFile(langCode) {
        const candidatePaths = getPossibleJsonPaths(langCode);
        let loadedData = null;

        for (const path of candidatePaths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    loadedData = await res.json();
                    break; // Nạp thành công thì dừng tìm
                }
            } catch (e) {
                // Tiếp tục thử đường dẫn tiếp theo
            }
        }

        if (loadedData) {
            currentDict = loadedData;
        } else {
            console.warn(`[i18n] Không thể tải file JSON ngôn ngữ: ${langCode}. Kiểm tra thư mục frontend/locales/${langCode}.json`);
        }

        // Cập nhật lại toàn bộ giao diện sau khi đã có dữ liệu JSON
        applyI18n();
    }

    function t(key, fallback = '') {
        return (currentDict && currentDict[key]) ? currentDict[key] : (fallback || key);
    }

    function applyI18n() {
        // 1. Dịch văn bản nội dung thẻ
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = t(key);
            if (text && text !== key) {
                el.textContent = text;
            }
        });

        // 2. Dịch placeholder ô input
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = t(key);
            if (text && text !== key) {
                el.setAttribute('placeholder', text);
            }
        });

        // 3. Đồng bộ nhãn ngôn ngữ trên Header (nếu có)
        const label = document.getElementById('langLabel') || document.getElementById('currentLangLabel');
        if (label) {
            label.textContent = activeLang === 'vi' ? 'TIẾNG VIỆT (VI)' : 'ENGLISH (EN)';
        }
    }

    async function setLang(newLang) {
        activeLang = newLang;
        localStorage.setItem(STORAGE_KEY, newLang);
        await loadJsonFile(newLang);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));
    }

    // Tự động khởi chạy ngay khi DOM sẵn sàng
    document.addEventListener('DOMContentLoaded', async () => {
        activeLang = getCurrentLang();
        await loadJsonFile(activeLang);
    });

    return {
        getCurrentLang,
        setLang,
        t,
        applyI18n,
        loadJsonFile
    };
})();