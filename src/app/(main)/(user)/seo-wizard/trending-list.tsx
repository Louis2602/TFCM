"use client";

import React, { useState, useEffect, useMemo } from "react";
import TrendingHeader from "./components/trending-header";
import TrendingTable from "./components/trending-table";
import TablePartition from "./components/table-partition";

interface RowData {
  id: number;
  title: string;
  used: number;
  category: string;
  checked: boolean;
}

const TrendingList: React.FC<{ isTag: boolean }> = ({ isTag }) => {
  const rowsPerPage = 10;
  const [rows, setRows] = useState<RowData[]>([]);
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState(true);
  const [sortMode, setSortMode] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let i = 0;
        const filePath = isTag
          ? "/file/trending-tags.txt"
          : "/file/trending-keywords.txt";
        const response = await fetch(filePath);
        const text = await response.text();
        const data = text.split("\n").map((line) => {
          const [title, used, category] = line.split("/");
          return {
            id: ++i,
            title,
            used: parseInt(used),
            category,
            checked: false,
          };
        });
        setRows(data);
      } catch (error) {
        console.error("Error fetching the file:", error);
      }
    };

    fetchData();
  }, [isTag]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const filteredRows = rows.filter((row) =>
    searchMode ? row.title.includes(search) : row.category.includes(search)
  );

  const sortedRows = useMemo(
    () =>
      sortMode
        ? [...filteredRows].sort((a, b) =>
            sortMode === 1 ? b.used - a.used : a.used - b.used
          )
        : filteredRows,
    [filteredRows, sortMode]
  );

  const paginatedRows = useMemo(
    () =>
      sortedRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [sortedRows, currentPage]
  );

  return (
    <>
      <TrendingHeader
        isTag={isTag}
        rows={rows}
        setSearchMode={setSearchMode}
        handleSearchChange={handleSearchChange}
      />

      <TrendingTable
        isTag={isTag}
        rows={rows}
        paginatedRows={paginatedRows}
        setRows={setRows}
        setSearchMode={setSearchMode}
        setSortMode={setSortMode}
        handleSearchChange={handleSearchChange}
      />

      <TablePartition
        rowsPerPage={rowsPerPage}
        sortedRows={sortedRows}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default TrendingList;
