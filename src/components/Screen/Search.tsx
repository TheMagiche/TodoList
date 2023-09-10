import { Todo } from "@/@types/todos";
import React from "react";

type SearchComponentProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
  searchText,
  setSearchText,
}: SearchComponentProps) => {
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search ..."
        />
      </div>
    </>
  );
};

export default SearchComponent;
