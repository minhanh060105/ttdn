/**
 * i18n.js - Quản lý đa ngôn ngữ (Tiếng Việt & Tiếng Anh)
 * Hỗ trợ fallback linh hoạt khi không kết nối Backend Next.js
 */

window.I18n = (function () {
    const DEFAULT_LANG = 'vi';

    // Lấy ngôn ngữ hiện tại từ localStorage
    function getCurrentLang() {
        return localStorage.getItem('preferred_lang') || DEFAULT_LANG;
    }

    // Lấy từ điển dựa trên MockData
    function buildDictionary(langCode) {
        const dict = {};
        if (window.MockData && window.MockData.languages && window.MockData.ui_translations) {
            const lang = window.MockData.languages.find(l => l.code === langCode);
            if (lang) {
                window.MockData.ui_translations
                    .filter(item => item.language_id === lang.id)
                    .forEach(item => {
                        dict[item.translation_key] = item.translation_value;
                    });
            }
        }
        return dict;
    }

    let activeLang = getCurrentLang();
    let currentDict = buildDictionary(activeLang);

    // Cập nhật từ Backend nếu có chạy API
    async function loadTranslationsFromAPI(langCode) {
        try {
            const res = await fetch(`http://localhost:3000/api/translations?code=${langCode}`, {
                signal: AbortSignal.timeout(1000)
            });
            if (res.ok) {
                const apiData = await res.json();
                currentDict = { ...currentDict, ...apiData };
            }
        } catch (e) {
            // Không sao, dùng dictionary từ MockData
        }
        applyI18n();
    }

    // Dịch một key
    function t(key, fallback = '') {
        if (currentDict && currentDict[key]) {
            return currentDict[key];
        }
        return fallback || key;
    }

    // Quét toàn bộ DOM và áp dụng bản dịch
    function applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = t(key);
            if (translation) {
                el.textContent = translation;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = t(key);
            if (translation) {
                el.setAttribute('placeholder', translation);
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = t(key);
            if (translation) {
                el.setAttribute('title', translation);
            }
        });

        // Cập nhật nhãn ngôn ngữ trên header nếu có
        const langLabel = document.getElementById('langLabel');
        if (langLabel) {
            langLabel.textContent = activeLang.toUpperCase();
        }
    }

    // Đổi ngôn ngữ
    async function setLang(newLang) {
        activeLang = newLang;
        localStorage.setItem('preferred_lang', newLang);
        currentDict = buildDictionary(newLang);
        await loadTranslationsFromAPI(newLang);
        // Dispatch sự kiện cho các component lắng nghe
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));
    }

    // Chuyển đổi qua lại giữa vi và en
    async function toggleLanguage() {
        const nextLang = activeLang === 'vi' ? 'en' : 'vi';
        await setLang(nextLang);
    }

    // Tự khởi tạo khi trang load
    document.addEventListener('DOMContentLoaded', () => {
        activeLang = getCurrentLang();
        currentDict = buildDictionary(activeLang);
        applyI18n();
        loadTranslationsFromAPI(activeLang);
    });

    return {
        getCurrentLang,
        setLang,
        toggleLanguage,
        t,
        applyI18n
    };
})();
