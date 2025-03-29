import React from "react";

function TableView({ columns, data, tableName, width = "100%", height = "auto" }) {
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
          {data.map((row, rowIndex) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
