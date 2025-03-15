import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
  return (
    <div className="relative w-full ">
      <input
        type="text"
        placeholder="Search..."
        className="text-s w-full pl-12 pr-4 py-1 bg-white border-2 border-[#ffb700] rounded-full text-md focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ffb700]">
        <FontAwesomeIcon icon={faSearch} />
      </div>
    </div>
  );
}

export default SearchBar;
