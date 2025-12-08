import React from "react";

const CheckboxGroup = ({ label, options, selected, onChange }) => (
  <div className="filter-group">
    <label className="filter-label">{label}</label>
    <div className="checkbox-list">
      {options.map((opt) => (
        <label key={opt} className="checkbox-item">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selected, opt]);
              } else {
                onChange(selected.filter((s) => s !== opt));
              }
            }}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const FilterPanel = ({ filters, updateFilter, onReset }) => {
  // Filter options - these match the dataset
  const regions = ["North", "South", "East", "West", "Central"];
  const genders = ["Male", "Female", "Other"];
  const categories = ["Electronics", "Clothing", "Grocery", "Beauty", "Sports"];
  const paymentMethods = ["Cash", "Card", "UPI", "Wallet"];

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="reset-btn" onClick={onReset}>
          Reset All
        </button>
      </div>

      <CheckboxGroup
        label="Customer Region"
        options={regions}
        selected={filters.region}
        onChange={(v) => updateFilter("region", v)}
      />

      <CheckboxGroup
        label="Gender"
        options={genders}
        selected={filters.gender}
        onChange={(v) => updateFilter("gender", v)}
      />

      <CheckboxGroup
        label="Product Category"
        options={categories}
        selected={filters.category}
        onChange={(v) => updateFilter("category", v)}
      />

      <CheckboxGroup
        label="Payment Method"
        options={paymentMethods}
        selected={filters.paymentMethod}
        onChange={(v) => updateFilter("paymentMethod", v)}
      />

      <div className="filter-group">
        <label className="filter-label">Age Range</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.ageMin}
            onChange={(e) => updateFilter("ageMin", e.target.value)}
            className="range-input"
            min="0"
          />
          <span className="range-separator">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.ageMax}
            onChange={(e) => updateFilter("ageMax", e.target.value)}
            className="range-input"
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Date Range</label>
        <div className="range-inputs">
          <input
            type="date"
            value={filters.dateStart}
            onChange={(e) => updateFilter("dateStart", e.target.value)}
            className="date-input"
          />
          <span className="range-separator">to</span>
          <input
            type="date"
            value={filters.dateEnd}
            onChange={(e) => updateFilter("dateEnd", e.target.value)}
            className="date-input"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
