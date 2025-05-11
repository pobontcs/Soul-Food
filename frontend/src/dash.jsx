import React, { useState, useEffect } from "react";
import TableView from "./tableView";
import { Form, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PieChartComponent from "./piechart";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,AreaChart,Area } from "recharts";



function Dash() {
  const [activeZones,setActiveZones] = useState();
  const [totalWareHouse,setActiveWares] = useState();

  const [totalBatches,setTotalBatches] = useState();
  const[navigateBar,setNavigateBar]=useState('Analyze');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const navigate = useNavigate();
  const[qcColumn,setQcColumn]=useState([]);
  const[qcData,setQcData]=useState([]);
  const[retailColumn,setRetailColumn]=useState([]);
  const[retailData,setRetailData]=useState([]);
  const[farmColumn,setFarmColumn]=useState([]);
  const[farmData,setFarmData]=useState([]);
  const[wareColumn,setWareColumn]=useState([]);
  const[wareData,setWareData]=useState([]);
  const [data2, setData2] = useState([]);
  const [column2, setColumn2] = useState([]);

  const [storage,setStorage]=useState();
  const [Capacity,SetCapacity]= useState();

  const [farmProductCounts, setFarmProductCounts] = useState([]);
  const [columns4, setColumns4] = useState([]);
  const [warehouseBatchCounts, setWarehouseBatchCounts] = useState([]);
  const [columnsWarehouse, setColumnsWarehouse] = useState([]);
  const [qualityAnalyzeData,setQualityAnalyzeData]= useState([]);
  const [qualityAnalyzeColumns,setQualityAnalyzeColumns]= useState([]);

  const[inspectorColumn,setInspectorColumn]=useState([]);
  const[inspectorData,setInspectorData]=useState([]);
  const [inspectorName,setInspectorName]=useState({
    Name:''
  });
  const handleInspectChange = (e) => {
    const { name, value } = e.target;
    setInspectorName(prev => ({
      ...prev,
      [name]: value
    }));
  };


useEffect(() => {
  const fetchWarehouseBatchCounts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/warehouse/batch-count');
      if (res.data.success) {
        setColumnsWarehouse(res.data.columns);
        const formattedData = res.data.data.map(item => ({
          warehouseID: item[0],
          batchCount: item[1],
        }));
        setWarehouseBatchCounts(formattedData);
      }
    } catch (err) {
      alert("UI error: Unable to fetch warehouse batch counts");
      console.error(err);
    }
  };

  fetchWarehouseBatchCounts();
}, []);
useEffect(() => {
  const fetchInspectorData= async ()=>{
    try{
        const res = await axios.get('http://localhost:5001/api/inspector/show');
            if(res.data.success){
                setInspectorData(res.data.data);
                setInspectorColumn(res.data.columns);
            }
            else{
                alert("API Error");
            }
    }
    catch(err){
        console.log(err);
        alert("UI error",err);
    }
}; fetchInspectorData();

}, []);



useEffect(() => {
  const fetchQualityTemperatureData = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/quality-control/temperature');
      if (res.data.success) {
        const formattedData = res.data.data.map(item => ({
          RecordID: item[0],
          Temperature: item[1]
        }));
        setQualityAnalyzeData(formattedData);
        setQualityAnalyzeColumns(res.data.columns);
      }
    } catch (err) {
      console.error('Failed to fetch temperature data:', err);
      setQualityAnalyzeData([]);
    }
  };
  fetchQualityTemperatureData();
}, []);




  useEffect(() => {
    const fetchFarmProductCounts = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/farm/product-count');
        if (res.data.success) {
          setColumns4(res.data.columns); 
          const formattedData = res.data.data.map(item => ({
            farmName: item[0], 
            productCount: item[1],
          }));
          
          setFarmProductCounts(formattedData);
        }
      } catch (err) {
        alert("UI error: Unable to fetch farm product counts");
        console.error(err);  
      }
    };

    fetchFarmProductCounts();
  }, []);



  const [del1,setDel1]=useState({
    BatchID:""
  });
  const handleBatchChange = (e) => {
    const { name, value } = e.target;
    setDel1(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

    const handleInspectInput= async (e)=>{
      e.preventDefault();
      try{
        const res = await fetch('http://localhost:5001/api/add/inspect', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inspectorName)
        });
        const result = await res.json();
        if(result.success){
          setInspectorName({
            Name:""
          });
          const fetchInspectorData= async ()=>{
            try{
                const res = await axios.get('http://localhost:5001/api/inspector/show');
                    if(res.data.success){
                        setInspectorData(res.data.data);
                        setInspectorColumn(res.data.columns);
                    }
                    else{
                        alert("API Error");
                    }
            }
            catch(err){
                console.log(err);
                alert("UI error",err);
            }
        }; fetchInspectorData();

        }

      }catch(err){
        alert("inpect submit error UI");
      }
    };



  const handleDeletationBatch= async (e)=>{
    e.preventDefault();
    const payload={
      BatchID:del1.BatchID
    };
    try{
      const res = await fetch('http://localhost:5001/api/delete/batch', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(del1)
      });
      const result = await res.json();
      
      if (result.success) {
      
        setDel1({
          BatchID:""
        });
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
        
      }

    }
    catch(err){
      console.error("Axios error:", err.response?.data || err.message);
      alert("UI Error");
    }
    
  };

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
                    };

              }
              catch(err){
                alert("Ui error")
              }



        }; fetchFarmCount();

  },[]);

  useEffect(()=>{
          const fetchQCDATA=async ()=>{
            try{
                  const res=await axios.get('http://localhost:5001/api/show/qcid');
                  if (res.data.success){
                    setQcColumn(res.data.columns);
                    setQcData(res.data.data);
                  };
            }
            catch(err){
              alert("UI error");
            }
          };
          fetchQCDATA();
  },[]);
  useEffect(()=>{
          const fetchWareDATA=async ()=>{
            try{
                  const res=await axios.get('http://localhost:5001/api/warehouses');
                  if (res.data.success){
                    setWareColumn(res.data.columns);
                    setWareData(res.data.data);
                  };
            }
            catch(err){
              alert("UI error");
            }
          };
          fetchWareDATA();
  },[]);
  useEffect(()=>{
          const fetchFarmDATA=async ()=>{
            try{
                  const res=await axios.get('http://localhost:5001/api/farms');
                  if (res.data.success){
                    setFarmColumn(res.data.columns);
                    setFarmData(res.data.data);
                  };
            }
            catch(err){
              alert("UI error");
            }
          };
          fetchFarmDATA();
  },[]);
  useEffect(()=>{
          const fetchRETAILDATA=async ()=>{
            try{
                  const res=await axios.get('http://localhost:5001/api/retail/data');
                  if (res.data.success){
                    setRetailColumn(res.data.columns);
                    setRetailData(res.data.data);
                  };
            }
            catch(err){
              alert("UI error");
            }
          };
          fetchRETAILDATA();
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
const supplyChainData=(
  <div className="d-flex flex-column gap-2 container container-fluid">
    <button 
        className="btn btn-dark rounded-2 w-25 py-2"
        onClick={() => navigate('/inspection')}
    >
        <i className="fas fa-desktop me-2" style={{color:"white"}}></i>
        Inspection Dashboard
    </button>
    <TableView data={data} columns={columns} tableName={"Supply Chain"} width="100%" />
</div>
);
const BatchRecords=(
<div className="d-flex flex-column container container-fluid" >
  <form className="d-flex flex-row" onSubmit={handleDeletationBatch}>
    <input className="rounded bg-dark border-0 shadow-sm my-2 p-2 text-light" placeholder="BatchID" onChange={handleBatchChange}
    value={del1.BatchID} name="BatchID"
    ></input>
    <button className="btn btn-danger mx-1" style={{height:"40px",marginTop:"8px"}}>Delete</button>
  </form>
<TableView data={data2} columns={column2} tableName={"Batch DATA"} />
</div>);

const Quality=(<div className="d-flex flex-column container container-fluid">
  <TableView data={qcData} columns={qcColumn} tableName={"Quality records"}/>

</div>);
const Farms=(<div className="d-flex flex-column container container-fluid">
  <button className="btn btn-dark rounded-2 w-25 py-2" onClick={() => navigate('/batching')}><i className="fas fa-desktop"></i>  Batching</button>
  <TableView data={farmData} columns={farmColumn} tableName={"Farm records"}/>

</div>);

const wareHouses=(
  <div className="d-flex flex-column container container-fluid">
        <button className="btn btn-dark rounded-2 w-25 py-2" onClick={() => navigate('/warehouse')}><i className="fas fa-desktop"></i> </button>
        <TableView data={wareData} columns={wareColumn} tableName={"Warehouses"}/>
  </div>
);
const Retails=(
  <div className="d-flex flex-column container container-fluid">
        
        <TableView data={retailData} columns={retailColumn} tableName={"Purchase Phases"}/>
  </div>
);

const analyze = (
  <div className="d-flex flex-column gap-4 container container-fluid">
    <div className="d-flex flex-row">
      <div>
      <h3>Farm Product Count Analysis</h3>
      <ResponsiveContainer width={400} height={400}>
        <BarChart data={farmProductCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="FarmID" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="productCount" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      </div>
      <div className="mx-3">
      <h3 className="text-xl font-semibold mb-4">Batches per Warehouse</h3>
      <ResponsiveContainer width={400} height={400}>
        <BarChart data={warehouseBatchCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="warehouseID" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="batchCount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      </div>
      <div > 
      <h3>Qc Analysis</h3>
      <ResponsiveContainer width={400}height={400}>
        <AreaChart data={qualityAnalyzeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="RecordID" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Temperature"
            stroke="#ff7300"
            fill="#ff7300"
            fillOpacity={0.3}
            name="Temperature (°C)"
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
    
  </div>
);



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
             <CircularProgressbar maxValue={1000} value={200} text="Capacity"/>
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
          <button className="my-2  mx-2 rounded-1 shadow" onClick={()=>setNavigateBar("Retail")}> <i className="fas fa-bolt"></i></button>
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("Warehouse")}> <i className="fas fa-truck"></i></button>
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("Quality")}> <i className="fas fa-search"></i></button>
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("box")}> <i className="fas fa-box"></i></button>
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("Farm")}> <i className="fas fa-leaf"></i></button>
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("Supplychain")}> Supply Chain</button>
          <button className="my-2 mx-2 rounded-1" onClick={()=>setNavigateBar("Analyze")}> <i className="fas fa-chart-line"></i></button>
          

      </div>

          {/* Table */}
          <div className="mt-4">

            {navigateBar==="Supplychain" && supplyChainData}
            {navigateBar==="box" && BatchRecords}
            {navigateBar==="Quality" && Quality}
            {navigateBar==="Farm" && Farms}
            {navigateBar==="Warehouse" && wareHouses}
            {navigateBar==="Retail" && Retails}
            {navigateBar==="Analyze" && analyze}
          </div>
          <div className="card d-flex flex-row container container-flui my-1">
            <div className="card mx-5 ">
              <form className="d-flex flex-row container container-fluid" onSubmit={handleInspectInput}>
                <h3 className="mx-3"> Inspector Input :</h3>
                <input placeholder="Name" name="Name" onChange={handleInspectChange} value={inspectorName.Name}/>
                <button className="btn btn-dark"><i className="fas fa-plus"></i></button>
              </form>
              
            </div>
            <div className="card mx-2"> <TableView data={inspectorData} columns={inspectorColumn}/>
            </div>
             
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Dash;
