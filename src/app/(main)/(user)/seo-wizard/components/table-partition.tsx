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

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  return (
    <section className="flex justify-center mt-6 gap-2 items-center">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="p-2 text-sm bg-slate-200 rounded-full disabled:opacity-50"
      >
        <Icons.previous />
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={`py-2 px-3 text-sm border rounded-lg ${
            number === currentPage
              ? "bg-[#F9FAFC] border-border"
              : "border-transparent"
          } hover:bg-[#F9FAFC] hover:border-border`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="p-2 text-sm bg-slate-200 rounded-full disabled:opacity-50"
      >
        <Icons.next />
      </button>
    </section>
  );
};

export default TablePartition;
