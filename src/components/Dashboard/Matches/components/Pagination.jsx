const Pagination = ({ totalProfiles, profilesPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalProfiles / profilesPerPage);
  if (totalPages <= 1) return null;

  const handlePageClick = (num) => {
    if (num !== currentPage) {
      setCurrentPage(num);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Function to generate page numbers to display
  const getPageNumbers = () => {
    const maxVisiblePages = 7; // Maximum number of page buttons to show (excluding prev/next)
    const pages = [];
    
    // If total pages is less than max visible pages, show all
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Calculate start and end pages
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    // Adjust if we're near the start
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages - 1);
    }
    // Adjust if we're near the end
    else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 4, 2);
    }

    // Add ellipsis if needed after first page
    if (startPage > 2) {
      pages.push('...');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed before last page
    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Pagination">
      <ul className="pagination justify-content-center custom-pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link prev-next-arrow" onClick={handlePrev}>← Prev</button>
        </li>
        
        {pageNumbers.map((num, index) => (
          <li key={index} className={`page-item ${num === currentPage ? 'active' : ''} ${num === '...' ? 'disabled' : ''}`}>
            {num === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <button className="page-link" onClick={() => handlePageClick(num)}>{num}</button>
            )}
          </li>
        ))}
        
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link prev-next-arrow" onClick={handleNext}>Next →</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;