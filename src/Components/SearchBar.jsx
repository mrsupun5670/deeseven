import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if(query.trim() === "") return;
    navigate(`/store?search=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSearch}>
      <div className="relative w-full ">
        <input
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
          type="text"
          placeholder="Search..."
          className="text-s w-full pl-12 pr-4 py-1 bg-white border-2 border-[#ffb700] rounded-full text-md focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ffb700]">
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
