interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const range = (start: number, end: number) => {
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   };

//   return (
//     <div>
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         {'<'}
//       </button>
//       {range(1, totalPages).map((page) => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           disabled={currentPage === page}
//         >
//           {page}
//         </button>
//       ))}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         {'>'}
//       </button>
//     </div>
//   );
// };

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const renderPageNumbers = () => {
//     const maxPages = 4; // Jumlah maksimal halaman yang akan ditampilkan
//     const pageNumbers = [];
//     let startPage = Math.max(1, currentPage - 1);
//     let endPage = Math.min(totalPages, startPage + maxPages - 1);

//     if (totalPages > maxPages && currentPage > maxPages - 1) {
//       startPage = Math.min(currentPage - 1, totalPages - maxPages + 1);
//       endPage = Math.min(totalPages, startPage + maxPages - 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <button
//           key={i}
//           onClick={() => onPageChange(i)}
//           disabled={currentPage === i}
//         >
//           {i}
//         </button>,
//       );
//     }

//     return pageNumbers;
//   };

//   return (
//     <div>
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         {'<'}
//       </button>
//       {renderPageNumbers()}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         {'>'}
//       </button>
//     </div>
//   );
// };

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const renderPageNumbers = () => {
//     const maxPages = 4; // Jumlah maksimal halaman yang akan ditampilkan
//     const pageNumbers = [];

//     let startPage = Math.max(1, totalPages - maxPages + 1);
//     let endPage = totalPages;

//     if (currentPage <= maxPages - 2) {
//       startPage = 1;
//       endPage = Math.min(maxPages, totalPages);
//     } else if (currentPage >= totalPages - 1) {
//       startPage = Math.max(1, totalPages - maxPages + 1);
//       endPage = totalPages;
//     } else {
//       startPage = currentPage - 1;
//       endPage = Math.min(currentPage + 2, totalPages);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <button
//           key={i}
//           onClick={() => onPageChange(i)}
//           disabled={currentPage === i}
//         >
//           {i}
//         </button>,
//       );
//     }

//     if (currentPage > maxPages - 2 && totalPages > maxPages) {
//       pageNumbers.unshift(
//         <span key='left-ellipsis' onClick={() => onPageChange(startPage - 1)}>
//           ...
//         </span>,
//       );
//     }

//     if (currentPage < totalPages - 1 && totalPages > maxPages) {
//       pageNumbers.push(
//         <span key='right-ellipsis' onClick={() => onPageChange(endPage + 1)}>
//           ...
//         </span>,
//       );
//     }

//     return pageNumbers;
//   };

//   return (
//     <div>
//       <button
//         onClick={() => onPageChange(Math.max(1, currentPage - 1))}
//         disabled={currentPage === 1}
//       >
//         {'<'}
//       </button>
//       {renderPageNumbers()}
//       <button
//         onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
//         disabled={currentPage === totalPages}
//       >
//         {'>'}
//       </button>
//     </div>
//   );
// };

// pake ini
// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const renderPageNumbers = () => {
//     const maxPages = 3; // Adjust this value to control the number of visible pages near the current page
//     const pageNumbers = [];

//     // Logic for determining start and end page numbers
//     let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
//     let endPage = Math.min(totalPages, startPage + maxPages - 1);

//     if (totalPages <= maxPages) {
//       startPage = 1;
//       endPage = totalPages;
//     } else if (currentPage <= maxPages - 1) {
//       endPage = Math.min(maxPages, totalPages);
//     } else if (currentPage >= totalPages - (maxPages - 1)) {
//       startPage = Math.max(totalPages - maxPages + 1, 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <button
//           key={i}
//           onClick={() => onPageChange(i)}
//           disabled={currentPage === i}
//         >
//           {i}
//         </button>,
//       );
//     }

//     if (startPage > 2 && totalPages > maxPages) {
//       pageNumbers.unshift(
//         <span key='left-ellipsis' onClick={() => onPageChange(startPage - 1)}>
//           ...
//         </span>,
//       );
//     }

//     if (endPage < totalPages - 1 && totalPages > maxPages) {
//       pageNumbers.push(
//         <span key='right-ellipsis' onClick={() => onPageChange(endPage + 1)}>
//           ...
//         </span>,
//       );
//     }

//     return pageNumbers;
//   };

//   return (
//     <div>
//       <button
//         onClick={() => onPageChange(Math.max(1, currentPage - 1))}
//         disabled={currentPage === 1}
//       >
//         {'<'}
//       </button>
//       {renderPageNumbers()}
//       <button
//         onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
//         disabled={currentPage === totalPages}
//       >
//         {'>'}
//       </button>
//     </div>
//   );
// };

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const renderPageNumbers = () => {
//     const maxPages = 4; // Jumlah maksimal halaman yang akan ditampilkan
//     const pageNumbers = [];

//     if (totalPages <= maxPages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(
//           <button
//             key={i}
//             onClick={() => onPageChange(i)}
//             disabled={currentPage === i}
//           >
//             {i}
//           </button>,
//         );
//       }
//     } else {
//       pageNumbers.push(
//         <button
//           key={1}
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//         >
//           1
//         </button>,
//       );

//       if (currentPage > 2) {
//         pageNumbers.push(<span key='left-ellipsis'>...</span>);
//       }

//       let startPage = Math.max(2, currentPage - 1);
//       let endPage = Math.min(totalPages - 1, startPage + maxPages - 3);

//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(
//           <button
//             key={i}
//             onClick={() => onPageChange(i)}
//             disabled={currentPage === i}
//           >
//             {i}
//           </button>,
//         );
//       }

//       if (currentPage < totalPages - 1) {
//         pageNumbers.push(<span key='right-ellipsis'>...</span>);
//       }

//   pageNumbers.push(
//     <button
//       key={totalPages}
//       onClick={() => onPageChange(totalPages)}
//       disabled={currentPage === totalPages}
//     >
//       {totalPages}
//     </button>,
//   );
//     }

//     return pageNumbers;
//   };

//   return <div>{renderPageNumbers()}</div>;
// };

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const maxPages = 3; // Adjust this value to control the number of visible pages near the current page
    const pageNumbers = [];

    // Logic for determining start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (totalPages <= maxPages) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= maxPages - 1) {
      endPage = Math.min(maxPages, totalPages);
    } else if (currentPage >= totalPages - (maxPages - 1)) {
      startPage = Math.max(totalPages - maxPages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          disabled={currentPage === i}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            backgroundColor: currentPage === i ? '#00B5C0' : 'transparent',
            color: currentPage === i ? '#fff' : '#000',
            border: '1px solid #007bff',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {i}
        </button>,
      );
    }

    if (startPage > 2 && totalPages > maxPages) {
      pageNumbers.unshift(
        <span
          key='left-ellipsis'
          onClick={() => onPageChange(startPage - 1)}
          style={{ cursor: 'pointer', marginRight: '5px' }}
        >
          ...
        </span>,
      );
    }

    if (endPage < totalPages - 1 && totalPages > maxPages) {
      pageNumbers.push(
        <span
          key='right-ellipsis'
          onClick={() => onPageChange(endPage + 1)}
          style={{ cursor: 'pointer', marginLeft: '5px' }}
        >
          ...
        </span>,
      );
    }

    return pageNumbers;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{
          margin: '0 5px',
          padding: '5px 10px',
          backgroundColor: currentPage === 1 ? '#ccc' : '#fff',
          color: currentPage === 1 ? '#000' : '#007bff',
          border: '1px solid #007bff',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        {'<'}
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={{
          margin: '0 5px',
          padding: '5px 10px',
          backgroundColor: currentPage === totalPages ? '#ccc' : '#fff',
          color: currentPage === totalPages ? '#000' : '#007bff',
          border: '1px solid #007bff',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        {'>'}
      </button>
    </div>
  );
};
export default Pagination;
