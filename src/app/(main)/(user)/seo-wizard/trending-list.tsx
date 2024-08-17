"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import TrendingHeader from "./components/trending-header";
import TrendingTable from "./components/trending-table";
import TablePartition from "./components/table-partition";
import getTrendingKeywords from "@/lib/actions/seo-wizard/get-trending-keywords";
import getTrendingTags from "@/lib/actions/seo-wizard/get-trending-tags";
import getTrendingsByFile from "@/lib/actions/seo-wizard/get-trendings-by-file";

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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let result = [];

      try {
        result = isTag ? await getTrendingTags() : await getTrendingKeywords();

        if (result.length === 0) {
          result = await getTrendingsByFile(isTag);
        }

        setRows(result);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
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
