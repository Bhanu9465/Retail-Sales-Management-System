import React from "react";

const SortDropdown = ({ sort, setSort }) => {
  const handleChange = (e) => {
    const [field, order] = e.target.value.split("_");
    setSort({ field, order });
  };

  const value = `${sort.field}_${sort.order}`;

  return (
    <div className="sort-dropdown">
      <label className="sort-label">Sort by:</label>
      <select value={value} onChange={handleChange} className="sort-select">
        <option value="date_desc">Date (Newest First)</option>
        <option value="date_asc">Date (Oldest First)</option>
        <option value="quantity_desc">Quantity (High → Low)</option>
        <option value="quantity_asc">Quantity (Low → High)</option>
        <option value="customerName_asc">Customer Name (A–Z)</option>
        <option value="customerName_desc">Customer Name (Z–A)</option>
        <option value="totalAmount_desc">Amount (High → Low)</option>
        <option value="totalAmount_asc">Amount (Low → High)</option>
      </select>
    </div>
  );
};

export default SortDropdown;
