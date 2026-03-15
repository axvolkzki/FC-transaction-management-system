import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
    )
    .reduce((acc, page, idx, arr) => {
      if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        <span>Rows per Page:</span>
        <select
          className="page-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="pagination-count">
          {from}–{to} of {totalItems}
        </span>
      </div>

      <div className="pagination-controls">
        <button className="page-btn" onClick={() => onPageChange(1)} disabled={currentPage === 1}>«</button>
        <button className="page-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="page-ellipsis">...</span>
          ) : (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >{page}</button>
          )
        )}

        <button className="page-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>›</button>
        <button className="page-btn" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages || totalPages === 0}>»</button>
      </div>
    </div>
  );
}