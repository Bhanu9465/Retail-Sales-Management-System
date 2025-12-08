import React from "react";

const Pagination = ({ page, setPage, totalPages, total }) => {
  const handlePrev = () => setPage(Math.max(1, page - 1));
  const handleNext = () => setPage(Math.min(totalPages, page + 1));

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing page {page} of {totalPages} ({total.toLocaleString()} total records)
      </div>
      
      <div className="pagination-controls">
        <button 
          className="pagination-btn" 
          onClick={handlePrev} 
          disabled={page <= 1}
        >
          ← Previous
        </button>
        
        <div className="pagination-pages">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              className={`pagination-page ${p === page ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
        
        <button 
          className="pagination-btn" 
          onClick={handleNext} 
          disabled={page >= totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
