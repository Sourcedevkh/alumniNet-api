// Pagination and Sorting Helper Functions
const getPaginationOptions = (page, limit) => {
  const currentPage = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(limit, 10) || 10;
  const skip = (currentPage - 1) * itemsPerPage;

  return { currentPage, itemsPerPage, skip };
};

const getPaginationMeta = (totalItems, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

/**
 * @param {string} sortCol
 * @param {string} sortDir
 * @param {Array} allowedColumns
 * @param {string} defaultColumn
 */
const getSortOptions = (sortCol, sortDir, allowedColumns = [], defaultColumn = 'id') => {
  // (ការពារ SQL Injection)
  const sortColumn = allowedColumns.includes(sortCol) ? sortCol : defaultColumn;
  
  // ត្រួតពិនិត្យទិសដៅ (ASC ឬ DESC)
  const sortDirection = (sortDir && sortDir.toUpperCase() === 'asc') ? 'asc' : 'desc';

  return { sortColumn, sortDirection };
};

module.exports = {
  getPaginationOptions,
  getPaginationMeta,
  getSortOptions
};