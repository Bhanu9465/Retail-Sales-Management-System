import React from "react";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import SortDropdown from "./components/SortDropdown";
import SalesTable from "./components/SalesTable";
import Pagination from "./components/Pagination";
import { useSalesQuery } from "./hooks/useSalesQuery";
import "./styles/global.css";

const App = () => {
  const {
    search,
    setSearch,
    filters,
    updateFilter,
    resetFilters,
    sort,
    setSort,
    page,
    setPage,
    data,
    meta,
    loading,
    error,
  } = useSalesQuery();

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Retail Sales Management</h1>
          <p className="header-subtitle">Search, filter, and explore sales transactions</p>
        </div>
      </header>

      {/* Main Layout */}
      <main className="main-layout">
        {/* Sidebar with Filters */}
        <aside className="sidebar">
          <FilterPanel filters={filters} updateFilter={updateFilter} onReset={resetFilters} />
        </aside>

        {/* Content Area */}
        <section className="content">
          {/* Search and Sort Bar */}
          <div className="toolbar">
            <div className="search-wrapper">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <SortDropdown sort={sort} setSort={setSort} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Results Info */}
          <div className="results-info">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>
                Found <strong>{meta.total.toLocaleString()}</strong> transactions
              </span>
            )}
          </div>

          {/* Sales Table */}
          <SalesTable data={data} loading={loading} />

          {/* Pagination */}
          {!loading && data.length > 0 && (
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={meta.totalPages}
              total={meta.total}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
