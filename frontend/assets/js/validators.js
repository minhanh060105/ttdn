/**
 * validators.js - Thư viện Validation dùng chung cho Substack Clone
 * Hỗ trợ hiển thị lỗi INLINE ngay dưới ô nhập, validate on blur + on input,
 * chặn thẻ HTML (noHtml), tự động focus trường lỗi đầu tiên và kết nối trực tiếp với i18n.
 */

window.Validators = (function () {
    // Regex phát hiện thẻ HTML hoặc mã nhúng nguy hiểm
    const HTML_TAG_REGEX = /<[a-z!/][\s\S]*>/i;
    const HTML_CHARS_REGEX = /[<>]/;
    const DANGEROUS_ATTR_REGEX = /(?:javascript:|onerror=|onload=|onclick=|onmouseover=)/i;

    // Kiểm tra xem chuỗi có chứa HTML hoặc thuộc tính nguy hiểm hay không
    function hasHtml(str) {
        if (!str || typeof str !== 'string') return false;
        return HTML_TAG_REGEX.test(str) || HTML_CHARS_REGEX.test(str) || DANGEROUS_ATTR_REGEX.test(str);
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Lấy thông báo lỗi i18n
    function getMsg(key, params, fallback) {
        if (window.I18n && typeof window.I18n.t === 'function') {
            return window.I18n.t(key, params, fallback);
        }
        let text = fallback;
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(p => {
                text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
            });
        }
        return text;
    }

    // Tìm thẻ hiển thị lỗi tương ứng với field
    function getErrorElement(fieldEl) {
        if (!fieldEl) return null;
        const key = fieldEl.name || fieldEl.id;
        const parent = fieldEl.closest('.form-group') || fieldEl.parentElement;
        if (!parent) return null;
        return parent.querySelector(`.field-error[data-for="${key}"]`);
    }

    // Hiển thị lỗi INLINE ngay dưới ô input
    function showError(fieldEl, message) {
        if (!fieldEl) return;
        const key = fieldEl.name || fieldEl.id || 'field';

        fieldEl.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-1', 'focus:ring-red-500');
        fieldEl.classList.remove('border-borderDark');
        fieldEl.setAttribute('aria-invalid', 'true');

        const parent = fieldEl.closest('.form-group') || fieldEl.parentElement;
        let errorEl = parent.querySelector(`.field-error[data-for="${key}"]`);

        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.className = 'field-error text-red-500 text-xs mt-1.5 flex items-center space-x-1 font-medium';
            errorEl.setAttribute('aria-live', 'polite');
            errorEl.setAttribute('data-for', key);

            // Chèn sau khối trực tiếp chứa field trong container cha
            let anchor = fieldEl;
            while (anchor.parentElement && anchor.parentElement !== parent) {
                anchor = anchor.parentElement;
            }
            if (anchor.parentElement === parent && anchor.nextSibling) {
                parent.insertBefore(errorEl, anchor.nextSibling);
            } else {
                parent.appendChild(errorEl);
            }
        }

        errorEl.textContent = '';
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-circle-exclamation text-[11px]';
        const text = document.createElement('span');
        text.textContent = message;
        errorEl.append(icon, text);
        errorEl.classList.remove('hidden');
    }

    // Xóa lỗi INLINE khi giá trị hợp lệ
    function clearError(fieldEl) {
        if (!fieldEl) return;
        const key = fieldEl.name || fieldEl.id;

        fieldEl.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-1', 'focus:ring-red-500');
        fieldEl.classList.add('border-borderDark');
        fieldEl.setAttribute('aria-invalid', 'false');

        const parent = fieldEl.closest('.form-group') || fieldEl.parentElement;
        if (parent) {
            const errorEl = parent.querySelector(`.field-error[data-for="${key}"]`);
            if (errorEl) {
                errorEl.remove();
            }
        }
    }

    // Xóa toàn bộ lỗi của một form
    function clearAllErrors(formEl) {
        if (!formEl) return;
        formEl.querySelectorAll('.field-error').forEach(el => el.remove());
        formEl.querySelectorAll('[aria-invalid="true"]').forEach(el => {
            el.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-1', 'focus:ring-red-500');
            el.classList.add('border-borderDark');
            el.setAttribute('aria-invalid', 'false');
        });
    }

    // Kiểm tra tính hợp lệ của một giá trị theo rules
    function validateValue(value, rules, formValues = {}) {
        const strVal = value === null || value === undefined ? '' : String(value).trim();

        // 1. Rule required
        if (rules.required) {
            if (!strVal) {
                return (typeof rules.required === 'object' && rules.required.message)
                    ? rules.required.message
                    : getMsg('validation.required', {}, 'Trường này không được để trống');
            }
        }

        // Bỏ qua các rule khác nếu trường không bắt buộc và đang để trống
        if (!strVal && !rules.required) {
            return null;
        }

        // 2. Rule noHtml: Chặn nhập thẻ HTML và script độc hại
        if (rules.noHtml) {
            if (hasHtml(value)) {
                return (typeof rules.noHtml === 'object' && rules.noHtml.message)
                    ? rules.noHtml.message
                    : getMsg('validation.noHtml', {}, 'Không được nhập thẻ HTML');
            }
        }

        // 3. Rule minLength
        const min = typeof rules.minLength === 'object' ? rules.minLength.value : rules.minLength;
        if (min !== undefined && min !== null && strVal.length < min) {
            return (typeof rules.minLength === 'object' && rules.minLength.message)
                ? rules.minLength.message
                : getMsg('validation.minLength', { min }, `Vui lòng nhập tối thiểu ${min} ký tự`);
        }

        // 4. Rule maxLength
        const max = typeof rules.maxLength === 'object' ? rules.maxLength.value : rules.maxLength;
        if (max !== undefined && max !== null && strVal.length > max) {
            return (typeof rules.maxLength === 'object' && rules.maxLength.message)
                ? rules.maxLength.message
                : getMsg('validation.maxLength', { max }, `Vui lòng không nhập quá ${max} ký tự`);
        }

        // 5. Rule email
        if (rules.email) {
            if (!EMAIL_REGEX.test(strVal)) {
                return (typeof rules.email === 'object' && rules.email.message)
                    ? rules.email.message
                    : getMsg('validation.email', {}, 'Địa chỉ email không đúng định dạng');
            }
        }

        // 6. Rule pattern
        const pattern = rules.pattern instanceof RegExp ? rules.pattern : (rules.pattern?.regex || null);
        if (pattern && !pattern.test(strVal)) {
            return (typeof rules.pattern === 'object' && rules.pattern.message)
                ? rules.pattern.message
                : getMsg('validation.pattern', {}, 'Định dạng không hợp lệ');
        }

        // 7. Rule custom function (value, formValues)
        if (typeof rules.custom === 'function') {
            const customResult = rules.custom(strVal, formValues);
            if (typeof customResult === 'string' && customResult) {
                return customResult;
            }
            if (customResult === false) {
                return getMsg('validation.custom', {}, 'Giá trị không hợp lệ');
            }
        }

        return null;
    }

    // Tìm phần tử input/textarea trong form theo key
    function findFieldElement(formEl, key) {
        if (!formEl || !key) return null;
        return formEl.querySelector(`[name="${key}"]`) || 
               formEl.querySelector(`#${key}`) || 
               document.getElementById(key);
    }

    // Các ô nhập văn bản cần được tự động chặn thẻ HTML
    function isTextLike(el) {
        if (!el) return false;
        if (el.tagName === 'TEXTAREA') return true;
        if (el.tagName !== 'INPUT') return false;
        const type = (el.type || 'text').toLowerCase();
        return ['text', 'email', 'password', 'search', 'url', 'tel'].includes(type);
    }

    // Gộp rule người dùng khai báo với rule noHtml mặc định cho mọi ô văn bản
    function buildEffectiveRules(formEl, rules) {
        const merged = {};
        Object.keys(rules || {}).forEach(key => {
            merged[key] = Object.assign({}, rules[key]);
        });

        const elements = formEl.elements || formEl.querySelectorAll('input, textarea, select');
        Array.from(elements).forEach(el => {
            const key = el.name || el.id;
            if (!key || el.disabled || !isTextLike(el)) return;
            if (!merged[key]) {
                merged[key] = { noHtml: true };
            } else if (merged[key].noHtml === undefined) {
                merged[key].noHtml = true;
            }
        });

        return merged;
    }

    // Thu thập tất cả giá trị trong form thành object { [name]: value }
    function getFormDataValues(formEl) {
        const values = {};
        if (!formEl) return values;
        const elements = formEl.elements || formEl.querySelectorAll('input, textarea, select');
        Array.from(elements).forEach(el => {
            const name = el.name || el.id;
            if (!name) return;
            if (el.type === 'checkbox') {
                values[name] = el.checked;
            } else if (el.type === 'radio') {
                if (el.checked) values[name] = el.value;
            } else {
                values[name] = el.value;
            }
        });
        return values;
    }

    // Validate một field cụ thể, cập nhật UI và trả về error string (hoặc null)
    function validateField(fieldEl, rules, formValues = {}) {
        if (!fieldEl || !rules) return null;
        const val = fieldEl.value;
        const error = validateValue(val, rules, formValues);

        if (error) {
            showError(fieldEl, error);
        } else {
            clearError(fieldEl);
        }
        return error;
    }

    // Validate toàn bộ form thủ công
    function validateForm(formEl, rules) {
        if (!formEl || !rules) return true;
        const formValues = getFormDataValues(formEl);
        let isValid = true;
        let firstInvalidField = null;

        Object.keys(rules).forEach(key => {
            const fieldEl = findFieldElement(formEl, key);
            if (!fieldEl) return;
            const error = validateValue(fieldEl.value, rules[key], formValues);
            if (error) {
                showError(fieldEl, error);
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = fieldEl;
                }
            } else {
                clearError(fieldEl);
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
            if (typeof firstInvalidField.scrollIntoView === 'function') {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return isValid;
    }

    // Gắn validator tự động vào một form
    function attach(formEl, rules, options = {}) {
        if (typeof formEl === 'string') {
            formEl = document.querySelector(formEl);
        }
        if (!formEl || !rules) return null;

        // Mọi ô văn bản trong form đều mặc định chặn thẻ HTML (có thể tắt bằng noHtml: false)
        const effectiveRules = buildEffectiveRules(formEl, rules);
        const touchedMap = {};
        let isSubmitted = false;

        // Thiết lập sự kiện blur và input cho từng field
        Object.keys(effectiveRules).forEach(key => {
            const fieldEl = findFieldElement(formEl, key);
            if (!fieldEl) return;

            touchedMap[key] = false;

            // Khi rời khỏi ô nhập (blur) -> đánh dấu touched và validate
            fieldEl.addEventListener('blur', () => {
                touchedMap[key] = true;
                const formValues = getFormDataValues(formEl);
                validateField(fieldEl, effectiveRules[key], formValues);
            });

            // Khi người dùng gõ phím (input) -> validate nếu đã touched hoặc đã submit
            fieldEl.addEventListener('input', () => {
                if (touchedMap[key] || isSubmitted) {
                    const formValues = getFormDataValues(formEl);
                    validateField(fieldEl, effectiveRules[key], formValues);
                }
            });

            // Đối với select hoặc radio/checkbox lắng nghe change
            if (fieldEl.tagName === 'SELECT' || fieldEl.type === 'checkbox' || fieldEl.type === 'radio') {
                fieldEl.addEventListener('change', () => {
                    touchedMap[key] = true;
                    const formValues = getFormDataValues(formEl);
                    validateField(fieldEl, effectiveRules[key], formValues);
                });
            }
        });

        // Xử lý sự kiện submit của Form
        formEl.addEventListener('submit', (e) => {
            isSubmitted = true;
            const formValues = getFormDataValues(formEl);
            let isValid = true;
            let firstInvalidField = null;

            Object.keys(effectiveRules).forEach(key => {
                const fieldEl = findFieldElement(formEl, key);
                if (!fieldEl) return;
                touchedMap[key] = true;
                const error = validateValue(fieldEl.value, effectiveRules[key], formValues);
                if (error) {
                    showError(fieldEl, error);
                    isValid = false;
                    if (!firstInvalidField) {
                        firstInvalidField = fieldEl;
                    }
                } else {
                    clearError(fieldEl);
                }
            });

            if (!isValid) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (firstInvalidField) {
                    firstInvalidField.focus();
                    if (typeof firstInvalidField.scrollIntoView === 'function') {
                        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
                return false;
            }

            if (typeof options.onSubmit === 'function') {
                e.preventDefault();
                options.onSubmit(formValues, e);
            }
        });

        return {
            validate: () => validateForm(formEl, effectiveRules),
            clear: () => clearAllErrors(formEl),
            getValues: () => getFormDataValues(formEl)
        };
    }

    return {
        hasHtml,
        validateValue,
        validateField,
        validateForm,
        showError,
        clearError,
        clearAllErrors,
        attach
    };
})();
