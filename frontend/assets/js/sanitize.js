/**
 * sanitize.js - Bộ lọc HTML dùng chung cho nội dung bài viết.
 * Chỉ cho phép whitelist thẻ/ thuộc tính cần thiết, loại bỏ script, iframe,
 * thuộc tính on*, URL javascript: và các thẻ nguy hiểm khác.
 * Nội dung bài viết trong MockData/DB luôn lưu dưới dạng content_html.
 */

window.Sanitize = (function () {
    const ALLOWED_TAGS = new Set([
        'P', 'BR', 'STRONG', 'EM', 'U', 'H2', 'H3',
        'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'IMG'
    ]);

    // Các thẻ bị loại bỏ hoàn toàn (kể cả nội dung bên trong)
    const DROP_TAGS = new Set([
        'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META',
        'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'OPTION',
        'SVG', 'MATH', 'VIDEO', 'AUDIO', 'SOURCE', 'TRACK', 'CANVAS', 'NOSCRIPT'
    ]);

    // Chuẩn hóa các thẻ do trình soạn thảo/browser sinh ra về whitelist
    const NORMALIZE_TAGS = {
        B: 'STRONG',
        I: 'EM',
        DIV: 'P',
        SECTION: 'P',
        ARTICLE: 'P',
        FIGURE: 'P',
        FIGCAPTION: 'P'
    };

    function isSafeHttpUrl(url) {
        if (!url) return false;
        const value = String(url).trim();
        if (!value || /[\u0000-\u0020]/.test(value)) return false;
        try {
            const parsed = new URL(value, window.location.href);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch (e) {
            return false;
        }
    }

    function isSafeImageSrc(src) {
        if (!src) return false;
        const value = String(src).trim();
        if (isSafeHttpUrl(value)) return true;
        // Cho phép ảnh tải lên dạng dataURL ảnh (component upload trả về dataURL)
        return /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(value);
    }

    function cleanInto(sourceNode, targetParent, doc) {
        Array.from(sourceNode.childNodes || []).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                targetParent.appendChild(doc.createTextNode(node.nodeValue));
                return;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            const originalTag = node.tagName;
            if (DROP_TAGS.has(originalTag)) return;

            const tag = NORMALIZE_TAGS[originalTag] || originalTag;

            // Thẻ không nằm trong whitelist: giữ lại nội dung con, bỏ vỏ
            if (!ALLOWED_TAGS.has(tag)) {
                cleanInto(node, targetParent, doc);
                return;
            }

            if (tag === 'IMG') {
                const src = node.getAttribute('src') || '';
                if (!isSafeImageSrc(src)) return;
                const img = doc.createElement('img');
                img.setAttribute('src', src.trim());
                const alt = (node.getAttribute('alt') || '').trim().slice(0, 300);
                img.setAttribute('alt', alt);
                img.setAttribute('loading', 'lazy');
                targetParent.appendChild(img);
                return;
            }

            if (tag === 'A') {
                const href = node.getAttribute('href') || '';
                if (!isSafeHttpUrl(href)) {
                    cleanInto(node, targetParent, doc);
                    return;
                }
                const link = doc.createElement('a');
                link.setAttribute('href', href.trim());
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                cleanInto(node, link, doc);
                targetParent.appendChild(link);
                return;
            }

            if (tag === 'BR') {
                targetParent.appendChild(doc.createElement('br'));
                return;
            }

            const el = doc.createElement(tag.toLowerCase());
            cleanInto(node, el, doc);

            // Bỏ thẻ rỗng không cần thiết (trừ br/img)
            if (tag !== 'BR' && tag !== 'IMG' && !el.textContent.trim() && !el.querySelector('img')) {
                return;
            }
            targetParent.appendChild(el);
        });
    }

    // Trả về chuỗi HTML đã qua whitelist
    function html(input) {
        if (input === null || input === undefined || input === '') return '';
        const raw = String(input);
        const parser = new DOMParser();
        const parsed = parser.parseFromString(`<body>${raw}</body>`, 'text/html');
        const doc = document.implementation.createHTMLDocument('');
        const container = doc.createElement('div');
        cleanInto(parsed.body, container, doc);
        return container.innerHTML;
    }

    // Trích xuất văn bản thuần (dùng cho excerpt, đếm ký tự, tìm kiếm)
    function text(input) {
        if (input === null || input === undefined || input === '') return '';
        const spaced = String(input)
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<\/(p|h2|h3|li|blockquote|ul|ol)>/gi, ' ');
        const clean = html(spaced);
        if (!clean) return '';
        const doc = document.implementation.createHTMLDocument('');
        const div = doc.createElement('div');
        div.innerHTML = clean;
        return (div.textContent || '').replace(/\s+/g, ' ').trim();
    }

    function isEmpty(input) {
        return text(input).length === 0;
    }

    return {
        html,
        text,
        isEmpty,
        isSafeHttpUrl,
        isSafeImageSrc
    };
})();
