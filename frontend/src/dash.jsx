import React, { useState, useEffect } from "react";
import TableView from "./tableView";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Dash() {
  const activeZones = 5;
  const totalWareHouse = 100;
  const totalBatches = 100;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const navigate = useNavigate();
  const [data2, setData2] = useState([]);
  const [columns2, setColumns2] = useState([]);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const signout = () => {
    navigate("/");
  };

  const columns = ["BatchId", "ProductID", "HarvestDate", "Processing Date"];
  const data = [
    ["24ABC", "Wheat", "10/02/25", "15/02/25"],
    ["24ABC", "Flour", "10/02/25", "16/02/25"],
    ["24ABC", "Bread", "10/02/25", "17/02/25"],
    ["25XYZ", "Corn", "15/03/25", "20/03/25"],
    ["25XYZ", "Popcorn", "15/03/25", "22/03/25"],
    ["25XYZ", "Cornflakes", "15/03/25", "23/03/25"],
    ["26LMN", "Soybeans", "20/04/25", "25/04/25"],
    ["26LMN", "Tofu", "20/04/25", "27/04/25"],
    ["26LMN", "Soy Milk", "20/04/25", "28/04/25"]
  ];

  

  
  const fetchBatchData= async () =>{

    try {
      const res = await axios.get('http://localhost:5001/api/farms');
      if (res.data.success) {
        setColumns2(res.data.columns);
        setData2(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };



  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <div className="d-flex align-items-center bg-warning text-dark p-2 rounded">
        <button
          className="btn btn-dark me-3"
          onClick={() => setSideBarOpen(!sideBarOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="fw-bold m-0">Soul Food</h1>
      </div> 
      
      
      
      

      {/* Main Layout with Sidebar & Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className={`sidebar bg-dark text-white p-3 ${
            sideBarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <button className="btn btn-light mb-3" onClick={() => setSideBarOpen(false)}>Close</button>
          <ul className="list-unstyled">
            <li><a href="#" className="text-white"><i className="fab fa-github p-2"></i></a></li>
            <li><a href="#" className="text-white"><i className="fab fa-facebook p-2"></i></a></li>
            <li><a href="#" className="text-white">Orders</a></li>
            <li><a href="#" className="text-white" onClick={signout}>Logout</a></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="content flex-grow-1 p-4">
          {/* Info Cards */}
          <div className="d-flex flex-wrap gap-4">
            <div style={{ width: "150px", height: "100px" }}>
              <CircularProgressbar value={70} text="Storage" />
            </div>
            <div className="card p-4">
              <p>Active Zones</p>
              <h1>{activeZones}</h1>
            </div>
            <div className="card p-4">
              <p>Total WareHouses</p>
              <h1>{totalWareHouse}</h1>
            </div>
            <div className="card p-4">
              <p>Total Batches</p>
              <h1>{totalBatches}</h1>
            </div>
          </div>
          <div className='d-flex flex-row mx-5 my-5'>
          <button className="my-2  mx-2 rounded-1 shadow"> <i className="fas fa-bolt"></i></button>
          <button className="my-2 mx-2 rounded-1"> <i className="fas fa-truck"></i></button>
          <button className="my-2 mx-2 rounded-1"> <i className="fas fa-search"></i></button>
          <button className="my-2 mx-2 rounded-1"> <i className="fas fa-box"></i></button>
          <button className="my-2 mx-2 rounded-1" onClick={fetchBatchData}> <i className="fas fa-leaf"></i></button>
          

      </div>

          {/* Table */}
          <div className="mt-4">
            <TableView data={data} columns={columns} width="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dash;
