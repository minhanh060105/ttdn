/**
 * image-upload.js - Component tải ảnh dùng chung (avatar, ảnh bìa bài viết)
 * Preview ngay bằng FileReader, validate định dạng (PNG/JPG/WEBP) và dung lượng,
 * hiển thị lỗi INLINE, hỗ trợ xóa/đổi ảnh. Kết quả trả về dưới dạng dataURL.
 */

window.ImageUpload = (function () {
    const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
    const DEFAULT_MAX_MB = 2;

    function t(key, params, fallback) {
        return window.I18n ? window.I18n.t(key, params, fallback) : fallback;
    }

    // Đọc và kiểm tra tệp ảnh, trả về Promise<dataURL>. Dùng chung cho
    // component upload và trình soạn thảo khi chèn ảnh vào nội dung.
    function readFile(file, options = {}) {
        const maxSizeMB = options.maxSizeMB || DEFAULT_MAX_MB;
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error(t('upload.read_error', {}, 'Không đọc được tệp ảnh, vui lòng thử lại')));
                return;
            }
            const typeOk = ACCEPTED_TYPES.includes(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name);
            if (!typeOk) {
                reject(new Error(t('upload.invalid_type', {}, 'Chỉ chấp nhận ảnh PNG, JPG hoặc WEBP')));
                return;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                reject(new Error(t('upload.too_large', { max: maxSizeMB }, `Ảnh vượt quá dung lượng tối đa ${maxSizeMB}MB`)));
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error(t('upload.read_error', {}, 'Không đọc được tệp ảnh, vui lòng thử lại')));
            reader.readAsDataURL(file);
        });
    }

    function mount(container, options = {}) {
        if (typeof container === 'string') container = document.querySelector(container);
        if (!container) return null;

        const shape = options.shape === 'cover' ? 'cover' : 'circle';
        const maxSizeMB = options.maxSizeMB || DEFAULT_MAX_MB;
        const fieldName = options.name || 'imageUpload';

        let currentValue = options.url || '';

        const previewClass = shape === 'cover'
            ? 'w-full max-w-md aspect-video rounded-xl'
            : 'w-24 h-24 rounded-full';
        const placeholderIcon = shape === 'cover' ? 'fa-regular fa-image' : 'fa-regular fa-user';

        container.innerHTML = `
            <div class="image-upload-root space-y-2">
                <div class="image-upload-preview ${previewClass} border-2 border-borderDark overflow-hidden bg-darkBg flex items-center justify-center text-gray-500 text-2xl">
                    ${currentValue
                        ? `<img src="${window.Layout ? Layout.escapeHtml(currentValue) : currentValue}" alt="${t('upload.preview_alt', {}, 'Ảnh xem trước')}" class="w-full h-full object-cover">`
                        : `<i class="${placeholderIcon}"></i>`}
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button type="button" class="image-upload-pick bg-cardBg hover:bg-borderDark border border-borderDark text-gray-200 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5">
                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                        <span>${t('upload.choose', {}, 'Tải ảnh lên')}</span>
                    </button>
                    <button type="button" class="image-upload-remove ${currentValue ? '' : 'hidden'} bg-cardBg hover:bg-rose-950/60 border border-borderDark text-gray-400 hover:text-rose-400 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5">
                        <i class="fa-regular fa-trash-can"></i>
                        <span>${t('upload.remove', {}, 'Xóa ảnh')}</span>
                    </button>
                </div>
                <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden">
                <p class="text-[10px] text-gray-500">${t('upload.hint', { max: maxSizeMB }, `PNG, JPG hoặc WEBP, tối đa ${maxSizeMB}MB`)}</p>
            </div>
        `;

        const root = container.querySelector('.image-upload-root');
        const preview = root.querySelector('.image-upload-preview');
        const pickBtn = root.querySelector('.image-upload-pick');
        const removeBtn = root.querySelector('.image-upload-remove');
        const fileInput = root.querySelector('input[type="file"]');

        function updatePreview(value) {
            preview.innerHTML = value
                ? `<img src="${window.Layout ? Layout.escapeHtml(value) : value}" alt="${t('upload.preview_alt', {}, 'Ảnh xem trước')}" class="w-full h-full object-cover">`
                : `<i class="${placeholderIcon}"></i>`;
            removeBtn.classList.toggle('hidden', !value);
        }

        function showError(message) {
            clearError();
            const errorEl = document.createElement('p');
            errorEl.className = 'field-error text-red-500 text-xs mt-1 flex items-center space-x-1 font-medium';
            errorEl.setAttribute('aria-live', 'polite');
            errorEl.setAttribute('data-for', fieldName);
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-circle-exclamation text-[11px]';
            const text = document.createElement('span');
            text.textContent = message;
            errorEl.append(icon, text);
            root.appendChild(errorEl);
        }

        function clearError() {
            root.querySelectorAll('.field-error').forEach(el => el.remove());
        }

        function setValue(value, notify = true) {
            currentValue = value || '';
            updatePreview(currentValue);
            if (notify && typeof options.onChange === 'function') {
                options.onChange(currentValue);
            }
        }

        pickBtn.addEventListener('click', () => fileInput.click());

        removeBtn.addEventListener('click', () => {
            clearError();
            fileInput.value = '';
            setValue(null);
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            clearError();

            readFile(file, { maxSizeMB })
                .then(dataUrl => setValue(dataUrl))
                .catch(err => {
                    showError(err.message);
                    fileInput.value = '';
                });
        });

        updatePreview(currentValue);

        return {
            element: root,
            getValue: () => currentValue,
            setValue,
            clear: () => setValue(null),
            clearError
        };
    }

    return { mount, readFile };
})();
