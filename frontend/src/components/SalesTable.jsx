import React from "react";

const SalesTable = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <span>Loading transactions...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <span className="empty-icon">📋</span>
        <p>No transactions found</p>
        <p className="empty-hint">Try adjusting your search or filters</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  return (
    <div className="table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Region</th>
            <th>Product</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row._id || idx}>
              <td>{formatDate(row.date)}</td>
              <td className="customer-cell">
                <span className="customer-name">{row.customerName || "-"}</span>
              </td>
              <td>{row.phoneNumber || "-"}</td>
              <td>
                <span className="region-badge">{row.customerRegion || "-"}</span>
              </td>
              <td>{row.productName || "-"}</td>
              <td>{row.productCategory || "-"}</td>
              <td className="qty-cell">{row.quantity ?? "-"}</td>
              <td className="amount-cell">{formatAmount(row.finalAmount || row.totalAmount)}</td>
              <td>
                <span className="payment-badge">{row.paymentMethod || "-"}</span>
              </td>
              <td>
                <span className={`status-badge status-${(row.orderStatus || "").toLowerCase()}`}>
                  {row.orderStatus || "-"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
