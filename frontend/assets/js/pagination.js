/**
 * pagination.js - Thành phần phân trang dùng chung cho Substack Clone
 * Hỗ trợ render nút Trước/Sau, dải số trang, thanh đếm "x–y / tổng",
 * dropdown chọn page size (10/20/50), đồng bộ query string (?page=2)
 * và tự động thích ứng khi dữ liệu ít hơn 1 trang.
 */

window.Pagination = (function () {
    // Đọc tham số từ URL
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            page: parseInt(params.get('page'), 10) || null,
            pageSize: parseInt(params.get('pageSize'), 10) || null
        };
    }

    // Cập nhật tham số query string trên thanh địa chỉ mà không reload trang
    function updateUrlParams(page, pageSize, syncUrl = true, replace = false) {
        if (!syncUrl) return;
        const url = new URL(window.location.href);
        if (page > 1) {
            url.searchParams.set('page', page);
        } else {
            url.searchParams.delete('page');
        }
        if (pageSize && pageSize !== 10) {
            url.searchParams.set('pageSize', pageSize);
        } else {
            url.searchParams.delete('pageSize');
        }
        const method = replace ? 'replaceState' : 'pushState';
        window.history[method]({ page, pageSize }, '', url.toString());
    }

    // Tính toán phân trang cho mảng items
    function paginate(items = [], page = 1, pageSize = 10) {
        const totalItems = items.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const currentPage = Math.min(Math.max(1, page), totalPages);

        const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        const pagedItems = totalItems === 0 ? [] : items.slice(startIndex, endIndex);

        const from = totalItems === 0 ? 0 : startIndex + 1;
        const to = endIndex;

        return {
            pagedItems,
            currentPage,
            pageSize,
            totalPages,
            totalItems,
            from,
            to
        };
    }

    // Tạo danh sách các số trang cần hiển thị (ví dụ: 1, 2, ..., 5, 6, ..., 10)
    function generatePageNumbers(currentPage, totalPages) {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        if (currentPage > 3) {
            pages.push('...');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }
        pages.push(totalPages);

        return pages;
    }

    /**
     * Khởi tạo và render bộ phân trang
     * @param {Object} options
     * @param {HTMLElement|string} options.container - Phần tử chứa thanh phân trang
     * @param {Array} options.items - Danh sách toàn bộ phần tử
     * @param {number} [options.currentPage] - Trang bắt đầu
     * @param {number} [options.pageSize] - Số phần tử mỗi trang (mặc định 10)
     * @param {Array<number>} [options.pageSizeOptions] - Danh sách tùy chọn kích thước trang (mặc định [10, 20, 50])
     * @param {boolean} [options.syncUrl] - Có đồng bộ query string không (mặc định true)
     * @param {Function} options.onPageChange - Callback (pagedItems, meta) => void
     */
    function render(options) {
        const {
            container,
            pageSizeOptions = [10, 20, 50],
            syncUrl = true,
            onPageChange
        } = options;

        let containerEl = typeof container === 'string' ? document.querySelector(container) : container;
        if (!containerEl) return null;

        // Danh sách có thể thay đổi sau khi lọc, không giữ closure cố định
        let items = Array.isArray(options.items) ? options.items : [];

        const urlParams = getUrlParams();
        let currentPage = options.currentPage || urlParams.page || 1;
        let pageSize = options.pageSize || urlParams.pageSize || 10;
        let isFirstRender = true;

        // Đảm bảo pageSize hợp lệ
        if (!pageSizeOptions.includes(pageSize)) {
            pageSize = pageSizeOptions[0];
        }

        function triggerUpdate(newPage, newPageSize) {
            currentPage = newPage;
            pageSize = newPageSize;

            const meta = paginate(items, currentPage, pageSize);
            currentPage = meta.currentPage; // Cập nhật lại nếu page vượt quá totalPages

            updateUrlParams(currentPage, pageSize, syncUrl, isFirstRender);
            isFirstRender = false;
            renderUI(meta);

            if (typeof onPageChange === 'function') {
                onPageChange(meta.pagedItems, meta);
            }
        }

        function renderUI(meta) {
            const { from, to, totalItems, totalPages } = meta;

            // Lấy chuỗi bản dịch
            const prevText = window.I18n ? window.I18n.t('pagination.prev', {}, 'Trước') : 'Trước';
            const nextText = window.I18n ? window.I18n.t('pagination.next', {}, 'Sau') : 'Sau';
            const perPageText = window.I18n ? window.I18n.t('pagination.perPage', {}, 'mục/trang') : 'mục/trang';
            const showingText = window.I18n 
                ? window.I18n.t('pagination.showing', { from, to, total: totalItems }, `Hiển thị ${from}–${to} / ${totalItems}`)
                : `Hiển thị ${from}–${to} / ${totalItems}`;

            const isMultiPage = totalPages > 1;
            const pageNumbers = generatePageNumbers(currentPage, totalPages);

            containerEl.innerHTML = `
                <div class="pagination-wrapper flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-borderDark text-xs text-gray-400 w-full">
                    <!-- Thông tin tổng số & Lựa chọn Page Size -->
                    <div class="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                        <span class="pagination-info font-medium text-gray-300">
                            ${showingText}
                        </span>
                        <div class="flex items-center space-x-1.5">
                            <select class="pagination-pagesize-select bg-cardBg border border-borderDark text-gray-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-substackOrange transition cursor-pointer">
                                ${pageSizeOptions.map(size => `
                                    <option value="${size}" ${size === pageSize ? 'selected' : ''}>${size} ${perPageText}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <!-- Nút Điều Hướng & Danh Sách Trang -->
                    <div class="flex items-center space-x-1.5 ${isMultiPage ? 'flex' : 'hidden'}">
                        <!-- Nút Trước -->
                        <button type="button" 
                            class="pagination-btn-prev px-3 py-1.5 rounded-lg bg-cardBg border border-borderDark text-white transition flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-borderDark"
                            ${currentPage <= 1 ? 'disabled' : ''}>
                            <i class="fa-solid fa-chevron-left text-[10px]"></i>
                            <span>${prevText}</span>
                        </button>

                        <!-- Dải số trang -->
                        <div class="pagination-pages-list flex items-center space-x-1">
                            ${pageNumbers.map(p => {
                                if (p === '...') {
                                    return `<span class="px-2 py-1 text-gray-500">...</span>`;
                                }
                                const isActive = p === currentPage;
                                return `
                                    <button type="button" 
                                        data-page="${p}"
                                        ${isActive ? 'aria-current="page"' : ''}
                                        class="pagination-page-btn w-8 h-8 rounded-lg flex items-center justify-center font-medium transition ${
                                            isActive 
                                                ? 'bg-substackOrange text-white font-bold shadow' 
                                                : 'bg-cardBg border border-borderDark text-gray-300 hover:bg-borderDark hover:text-white'
                                        }">
                                        ${p}
                                    </button>
                                `;
                            }).join('')}
                        </div>

                        <!-- Nút Sau -->
                        <button type="button" 
                            class="pagination-btn-next px-3 py-1.5 rounded-lg bg-cardBg border border-borderDark text-white transition flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-borderDark"
                            ${currentPage >= totalPages ? 'disabled' : ''}>
                            <span>${nextText}</span>
                            <i class="fa-solid fa-chevron-right text-[10px]"></i>
                        </button>
                    </div>
                </div>
            `;

            // Gắn sự kiện chọn Page Size
            const sizeSelect = containerEl.querySelector('.pagination-pagesize-select');
            if (sizeSelect) {
                sizeSelect.addEventListener('change', (e) => {
                    const newSize = parseInt(e.target.value, 10);
                    triggerUpdate(1, newSize);
                });
            }

            // Gắn sự kiện nút Trước
            const prevBtn = containerEl.querySelector('.pagination-btn-prev');
            if (prevBtn && currentPage > 1) {
                prevBtn.addEventListener('click', () => {
                    triggerUpdate(currentPage - 1, pageSize);
                });
            }

            // Gắn sự kiện nút Sau
            const nextBtn = containerEl.querySelector('.pagination-btn-next');
            if (nextBtn && currentPage < totalPages) {
                nextBtn.addEventListener('click', () => {
                    triggerUpdate(currentPage + 1, pageSize);
                });
            }

            // Gắn sự kiện các nút số trang
            containerEl.querySelectorAll('.pagination-page-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const pageNum = parseInt(btn.getAttribute('data-page'), 10);
                    if (pageNum && pageNum !== currentPage) {
                        triggerUpdate(pageNum, pageSize);
                    }
                });
            });
        }

        // Lắng nghe sự kiện người dùng bấm nút Back/Forward của trình duyệt
        if (syncUrl) {
            // Gỡ listener cũ nếu component được render lại trên cùng container
            if (containerEl._paginationPopHandler) {
                window.removeEventListener('popstate', containerEl._paginationPopHandler);
            }
            containerEl._paginationPopHandler = () => {
                const updated = getUrlParams();
                const newPage = updated.page || 1;
                const newSize = updated.pageSize || pageSize;
                if (newPage !== currentPage || newSize !== pageSize) {
                    triggerUpdate(newPage, newSize);
                }
            };
            window.addEventListener('popstate', containerEl._paginationPopHandler);
        }

        // Chạy lần đầu
        triggerUpdate(currentPage, pageSize);

        return {
            getCurrentPage: () => currentPage,
            getPageSize: () => pageSize,
            goToPage: (p) => triggerUpdate(p, pageSize),
            updateItems: (newItems) => {
                items = Array.isArray(newItems) ? newItems : [];
                triggerUpdate(1, pageSize);
            }
        };
    }

    return {
        paginate,
        render,
        getUrlParams
    };
})();
