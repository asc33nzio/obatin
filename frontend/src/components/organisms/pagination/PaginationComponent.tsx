import {
  PaginationContainer,
  PagingButton,
  PagingInfo,
} from '@/styles/organisms/pagination/PaginationComponent.styles';

interface PaginationItf {
  page: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  goToPage: (i: number) => void;
}

const PaginationComponent = ({
  page,
  totalPages,
  handlePrevPage,
  handleNextPage,
  goToPage,
}: PaginationItf) => {
  const renderButtons = () => {
    const pageButtons = [];
    const pagesToShow = 6;
    let startPage = Math.max(
      1,
      Math.min(
        page - Math.floor(pagesToShow / 2),
        totalPages - pagesToShow + 1,
      ),
    );
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    const pagesDiff = pagesToShow - (endPage - startPage + 1);
    if (pagesDiff > 0 && endPage < totalPages) {
      if (startPage === 1) {
        endPage += pagesDiff;
      } else {
        startPage -= pagesDiff;
      }
    }

    if (page > 1) {
      pageButtons.push(
        <PagingButton key='first' onClick={() => goToPage(1)}>
          First
        </PagingButton>,
      );
    }

    if (page > 1) {
      pageButtons.push(
        <PagingButton
          key='prev'
          onClick={() => handlePrevPage()}
          $disabled={page === 1}
        >
          Prev.
        </PagingButton>,
      );
    }

    const middlePageIndex = Math.round((startPage + endPage) / 2);
    for (let i = startPage; i <= endPage; i++) {
      const isCurrentPage = i === page;
      if (i === middlePageIndex) {
        pageButtons.push(
          <PagingInfo key='show-current-page'>
            Page {page} / {totalPages}
          </PagingInfo>,
        );
      }

      if (i <= totalPages) {
        pageButtons.push(
          <PagingButton
            key={`pagingButton${i}`}
            onClick={() => goToPage(i)}
            $bgColor={isCurrentPage ? '#00B5C0' : '#B5FFE1'}
            $isCurrentPage={isCurrentPage}
            disabled={isCurrentPage}
            $disabled={isCurrentPage}
          >
            {i}
          </PagingButton>,
        );
      }
    }

    if (page < totalPages) {
      pageButtons.push(
        <PagingButton
          key='next'
          onClick={handleNextPage}
          disabled={page === totalPages}
          $disabled={page === totalPages}
        >
          Next
        </PagingButton>,
      );
    }

    if (page < totalPages) {
      pageButtons.push(
        <PagingButton key='last' onClick={() => goToPage(totalPages)}>
          Last
        </PagingButton>,
      );
    }

    return pageButtons;
  };

  return <PaginationContainer>{renderButtons()}</PaginationContainer>;
};

export default PaginationComponent;
