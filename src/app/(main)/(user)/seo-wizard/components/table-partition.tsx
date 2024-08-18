import React, { useMemo } from "react";
import { Icons } from "@/components/global/icons";

interface RowData {
  id: number;
  title: string;
  used: number;
  category: string;
  checked: boolean;
}

interface TablePartitionProps {
  rowsPerPage: number;
  sortedRows: RowData[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const TablePartition: React.FC<TablePartitionProps> = ({
  rowsPerPage,
  sortedRows,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const generatePageNumbers = (current: number, total: number) => {
    let pageNumbers: (number | string)[] = [];

    if (total <= 7) {
      pageNumbers = Array.from({ length: total }, (_, i) => i + 1);
    } else {
      const leftBound = Math.max(2, current - 2);
      const rightBound = Math.min(total - 1, current + 2);

      if (current > 4) {
        pageNumbers.push(1, "...");
      } else {
        for (let i = 1; i < leftBound; i++) {
          pageNumbers.push(i);
        }
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }

      if (current < total - 3) {
        pageNumbers.push("...", total);
      } else {
        for (let i = rightBound + 1; i <= total; i++) {
          pageNumbers.push(i);
        }
      }

      if (pageNumbers.length > 7) {
        if (current <= 4) {
          pageNumbers = pageNumbers.slice(0, 5).concat(["...", total]);
        } else if (current >= total - 3) {
          pageNumbers = [1, "..."].concat(pageNumbers.slice(-5));
        } else {
          pageNumbers = [1, "..."].concat(
            pageNumbers.slice(
              pageNumbers.indexOf(current) - 1,
              pageNumbers.indexOf(current) + 2
            ),
            ["...", total]
          );
        }
      }
    }

    return pageNumbers;
  };

  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  return (
    <section className="flex justify-center mt-6 md:gap-1 items-center">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="p-2 text-sm bg-slate-200 rounded-full disabled:opacity-50 me-1"
      >
        <Icons.previous />
      </button>

      {pageNumbers.map((number, index) => (
        <button
          key={index}
          onClick={() => {
            if (typeof number === "number") {
              handlePageChange(number);
            }
          }}
          className={`py-2 px-3 text-sm border rounded-lg ${
            number === currentPage
              ? "bg-[#F9FAFC] border-border"
              : "border-transparent"
          } lg:hover:bg-[#F9FAFC] lg:hover:border-border`}
          disabled={typeof number === "string"}
        >
          {number}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="p-2 text-sm bg-slate-200 rounded-full disabled:opacity-50 ms-1"
      >
        <Icons.next />
      </button>
    </section>
  );
};

export default TablePartition;
