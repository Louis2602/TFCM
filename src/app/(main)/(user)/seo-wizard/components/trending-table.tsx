import React, { useState } from "react";
import { Icons } from "@/components/global/icons";
import { toast } from "sonner";
import { Popover, OverlayTrigger } from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import {
  getUserTrendingTags,
  getUserTrendingKeywords,
} from "@/lib/actions/seo-wizard/query";
import { save } from "@/lib/actions/seo-wizard/save";

interface RowData {
  id: number;
  title: string;
  used: number;
  category: string;
  checked: boolean;
}

interface TrendingTableProps {
  isTag: boolean;
  rows: RowData[];
  paginatedRows: RowData[];
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  setSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSortMode: React.Dispatch<React.SetStateAction<number>>;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TrendingTable: React.FC<TrendingTableProps> = ({
  isTag,
  rows,
  paginatedRows,
  setRows,
  setSearchMode,
  setSortMode,
  handleSearchChange,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [hideInput, setHideInput] = useState(true);

  const handleCheckboxChange = (id: number) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, checked: !row.checked } : row
      )
    );
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setRows(rows.map((row) => ({ ...row, checked })));
    setSelectAll(checked);
  };

  const handleSortByUsed = () =>
    setSortMode((prevMode) => (prevMode === 1 ? 2 : 1));

  const renderPopover = (rowId: number, isTag: boolean) => (
    <Popover
      id={`popover-${rowId}`}
      className="relative p-4 bg-white border w-72 rounded-lg shadow-lg mb-5 ms-[-6.25%]"
    >
      <span className="absolute top-full right-3 transform border-x-8 border-x-transparent border-t-8 border-t-white" />
      <Popover.Header>
        <strong>Save</strong>
      </Popover.Header>
      <Popover.Body>
        Save this {isTag ? "tag" : "keyword"} to your library for another use.
      </Popover.Body>
    </Popover>
  );

  const handleSave = async (id: number) => {
    const trendings = isTag
      ? await getUserTrendingTags()
      : await getUserTrendingKeywords();
    if (!trendings.success) {
      toast.error("Oops, an error has occurred", {
        description: trendings.message,
      });
    }

    const row = rows.find((row) => row.id === id);
    if (!row) {
      return;
    }

    const existTrending = trendings.data?.find(
      (trending) => trending.title === row.title
    );

    if (existTrending) {
      toast.error(`This ${isTag ? "tag" : "keyword"} has already been saved`);
      return;
    }

    const { success, message } = await save(row.title);

    if (success) {
      toast.success(
        `${existTrending ? "Updating" : "Saving"} ${
          isTag ? "tag" : "keyword"
        } successfully`
      );
    } else {
      toast.error("Oops, an error has occurred", {
        description: message,
      });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAllChange}
                className="text-border"
                sx={{
                  "&.Mui-checked": { color: "hsl(var(--primary))" },
                  color: "hsl(var(--border))",
                }}
              />
            </TableCell>
            <TableCell className="w-1/5">{isTag ? "Tag" : "Keyword"}</TableCell>
            <TableCell className="w-1/5">
              <section className="flex justify-end">
                <button
                  onClick={handleSortByUsed}
                  className="font-semibold flex gap-2 items-center cursor-pointer"
                >
                  Used
                  <Icons.sort />
                </button>
              </section>
            </TableCell>
            <TableCell>
              <section className="flex justify-between items-center">
                <article className="font-semibold">
                  Description/Category
                </article>
                <section className="flex gap-2">
                  <input
                    className={`block border-2 border-border rounded-full shadow-sm py-1 pl-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 ${
                      hideInput ? "invisible" : ""
                    }`}
                    placeholder="Search category"
                    onChange={handleSearchChange}
                    onFocus={() => setSearchMode(false)}
                  />
                  <button onClick={() => setHideInput((prev) => !prev)}>
                    <Icons.search color="#534D59" />
                  </button>
                </section>
              </section>
            </TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row) => (
            <TableRow
              key={row.id}
              className={row.checked ? "bg-[#F9FAFC]" : ""}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={row.checked}
                  onChange={() => handleCheckboxChange(row.id)}
                  sx={{
                    "&.Mui-checked": { color: "hsl(var(--primary))" },
                    color: "hsl(var(--border))",
                  }}
                />
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>
                <section className="flex justify-end">
                  {new Intl.NumberFormat("de-DE").format(row.used)}
                </section>
              </TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>
                <section className="hidden xl:block">
                  <OverlayTrigger
                    trigger={["hover", "focus"]}
                    placement="top"
                    overlay={renderPopover(row.id, isTag)}
                    rootClose
                  >
                    <button
                      onClick={() => handleSave(row.id)}
                      className="text-muted-foreground"
                    >
                      <Icons.save />
                    </button>
                  </OverlayTrigger>
                </section>
                <button
                  onClick={() => handleSave(row.id)}
                  className="text-muted-foreground xl:hidden"
                >
                  <Icons.save />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TrendingTable;
