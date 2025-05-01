import React, { useState } from "react";

function TableView({ columns, data, tableName, width = "100%", height = "auto" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("all");

  // Filter data based on search term and selected column
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    
    if (selectedColumn === "all") {
      // Search across all columns
      return row.some(cell => 
        String(cell).toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // Search in specific column
      const columnIndex = columns.indexOf(selectedColumn);
      if (columnIndex === -1) return true;
      return String(row[columnIndex]).toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  return (
    <div
      className="table-responsive rounded-3"
      style={{
        width: width,
        height: height,
        overflowY: "auto",
        boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.2)",
        transition: "0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(15px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0px 10px 10px rgba(0, 0, 0, 0.2)";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      <h1
        className="d-flex justify-content-center"
        style={{
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: "gray",
        }}
      >
        {tableName}
      </h1>
      
      {/* Search Controls */}
      <div className="d-flex mb-3 p-2 bg-light rounded">
        <div className="me-2" style={{ width: "200px" }}>
          <select 
            className="form-select"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            <option value="all">All Columns</option>
            {columns.map((col, index) => (
              <option key={index} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div className="flex-grow-1">
          <input
            type="text"
            className="form-control"
            placeholder={`Search in ${selectedColumn === "all" ? "all columns" : selectedColumn}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <table className="table table-hover align-middle">
        <thead className="bg-danger text-white">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-3 py-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-light text-dark">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-2"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "gray";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;