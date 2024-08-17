import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/global/icons";
import { TextField } from "@mui/material";
import { toast } from "sonner";
import {
  getUserTrendingTags,
  getUserTrendingKeywords,
} from "@/lib/actions/seo-wizard/query";
import { save, update } from "@/lib/actions/seo-wizard/save";

interface RowData {
  id: number;
  title: string;
  used: number;
  category: string;
  checked: boolean;
}

interface TrendingHeaderProps {
  rows: RowData[];
  isTag: boolean;
  setSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TrendingHeader: React.FC<TrendingHeaderProps> = ({
  rows,
  isTag,
  setSearchMode,
  handleSearchChange,
}) => {
  const textFieldRef = useRef<HTMLInputElement>(null);

  const focusTextField = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };

  const handleSaveAll = async () => {
    const trendings = isTag
      ? await getUserTrendingTags()
      : await getUserTrendingKeywords();

    if (!trendings.success) {
      toast.error("Oops, an error has occurred", {
        description: trendings.message,
      });
      return;
    }

    console.log(trendings.data);

    const savingRows = rows.filter((row) => row.checked === true);
    if (savingRows.length === 0) {
      toast.error(`No ${isTag ? "tag" : "keyword"} has been selected`);
      return;
    }

    for (const row of savingRows) {
      const existTrending = trendings.data?.find(
        (trending) => trending.title === row.title
      );
      const action = existTrending ? update : save;

      const { success, message } = await action(
        row.title,
        row.used,
        row.category
      );
      if (!success) {
        toast.error("Oops, an error has occurred", { description: message });
        return;
      }
    }

    toast.success(
      `Saving all selected ${isTag ? "tags" : "keywords"} successfully`
    );
  };

  return (
    <section className="flex flex-col justify-between md:flex-row">
      <h1 className="font-heading font-bold text-2xl my-4">
        Trending {isTag ? "tags" : "keywords"}
      </h1>
      <section className="flex gap-4 my-4 justify-between md:justify-end">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search topic"
          InputProps={{
            startAdornment: (
              <button onClick={focusTextField} className="w-8">
                <Icons.search color="#959595" />
              </button>
            ),
          }}
          className="w-1/2"
          onChange={handleSearchChange}
          onFocus={() => setSearchMode(true)}
          inputRef={textFieldRef}
        />
        <Button onClick={() => handleSaveAll()}>
          Saved {isTag ? "tags" : "keywords"}
        </Button>
      </section>
    </section>
  );
};

export default TrendingHeader;
