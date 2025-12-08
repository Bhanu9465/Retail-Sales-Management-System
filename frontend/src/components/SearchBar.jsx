import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by customer name or phone number..."
        className="search-input"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
