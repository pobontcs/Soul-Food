import React, { useState, useEffect } from "react";
import TableView from "./tableView";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
function Dash() {
  const [activeZones,setActiveZones] = useState();
  const [totalWareHouse,setActiveWares] = useState();

  const [totalBatches,setTotalBatches] = useState();
  const[navigateBar,setNavigateBar]=useState('Supplychain');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const navigate = useNavigate();
  const [data2, setData2] = useState([]);
  const [column2, setColumn2] = useState([]);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const signout = () => {
    navigate("/");
  };
  useEffect(()=>{
        const fetchFarmCount= async ()=>{
              try{
                    const res =await axios.get('http://localhost:5001/api/farm/count');
                    if (res.data.success){
                      setActiveZones(res.data.data);
                    }

              }
              catch(err){
                alert("Ui error")
              }



        }; fetchFarmCount();

  },[]);
  useEffect(()=>{
        const fetchWareCount= async ()=>{
              try{
                    const res =await axios.get('http://localhost:5001/api/ware/count');
                    if (res.data.success){
                      setActiveWares(res.data.data);
                    }

              }
              catch(err){
                alert("Ui error")
              }



        }; fetchWareCount();

  },[]);
  useEffect(()=>{
        const fetchBatchCount= async ()=>{
              try{
                    const res =await axios.get('http://localhost:5001/api/batch/count');
                    if (res.data.success){
                      setTotalBatches(res.data.data);
                    }

              }
              catch(err){
                alert("Ui error")
              }



        }; fetchBatchCount();

  },[]);




  useEffect(()=>{
    
    const fetchBatchData= async ()=>{
        try{
            const res = await axios.get('http://localhost:5001/api/show/batch');
                if(res.data.success){
                    setData2(res.data.data);
                    setColumn2(res.data.columns);
                }
                else{
                    alert("API Error");
                }
        }
        catch(err){
            console.log(err);
            alert("UI error",err);
        }
    }; fetchBatchData();
},[]);

  const [columns,setColumns] = useState([]);
  const [data,setData]=useState([]);  

  useEffect(()=>{
  const fetchBatchData= async () =>{

    try {
      const res = await axios.get('http://localhost:5001/api/supplychain');
      if (res.data.success) {
        setColumns(res.data.columns);
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };
  fetchBatchData();
},[]);
const supplyChainData=(<TableView data={data} columns={columns} width="100%" />);
const BatchRecords=(<TableView data={data2} columns={column2} tableName={"Batch DATA"} />);

  return (
    <div className="d-flex flex-column vh-100" style={{
      width:"1300px"

    }}>
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
      <div className="d-flex flex-grow-1" style={{height:"1200px"}}>
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
              <CircularProgressbar value={70} maxValue={200} text="Storage" />
            </div>
            <div className="card p-4">
              <p>Active Farms</p>
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
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("box")}> <i className="fas fa-box"></i></button>
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("Supplychain")}> Supply Chain</button>
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("Supplychain")}> <i className="fas fa-leaf"></i></button>
          

      </div>

          {/* Table */}
          <div className="mt-4">

            {navigateBar==="Supplychain" && supplyChainData}
            {navigateBar==="box" && BatchRecords}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dash;
