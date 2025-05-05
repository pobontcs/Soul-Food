import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TableView from './tableView';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import axios from 'axios';


function Inspection() {
    
    const [transportID,setTransportID]=useState();
                                                    const [onTable,setTable]=useState("WareHouse");
                                                    const handleStatusChange = (e) => {
                                                        const { name, value } = e.target;
                                                        setTransportID(prev => ({
                                                        ...prev,
                                                        [name]: value
                                                        }));
                                                    };
    const [transport, setTransport] = useState([]);
    const column = ["QCID", "Safety Rate", "Temperature", "Quantity", "Inspector Id", "Date"];
    const [column2,setColumn2] = useState([]);
    const [data2,setData2] = useState([]);
    const [column3,setColumn3] = useState([]);
    const [data3,setData3] = useState([]);
    const [retData,setRetData]= useState([]);
    const [retcolumn,setRetColumn]=useState([]);

            

    const [reqColumn,setReqColumn]=useState([]);
    const [reqData,setReqData]=useState([]);
    const QcRecords=(<TableView data={data3} columns={column3} tableName={"QC DATA"} />);
    const BatchRecords=(<TableView data={data2} columns={column2} tableName={"Batch DATA"} />);
    const reqRecords =(<TableView data={reqData} columns={reqColumn} tableName={'Request Query'}/>);
    const retailRecords=(<TableView data={retData} columns={retcolumn}/>);



    const [hover, setHover] = useState(false);
    const navigate = useNavigate();
    const [chemicalRate, setChemicalRate] = useState(0);
    const [temperature, setTemperature] = useState(10);
    const signout = () => navigate("/");
    const [batchData,setBatchData]=useState({
        InspectID:'',
        QueryID:'',
        Quantity:0,
        expireDate:'',
        Humidity:'',
        PreserveRate:0,
        Temperature:''
    });
    const [retailData,setRetailData]=useState({
                    Order_no:"",
                    Temperature:"",
                    Humidity:"",
                    InspectID:""
    });
    const handleBatchChange = (e) => {
        const { name, value } = e.target;
        setBatchData(prev => ({
          ...prev,
          [name]: value
        }));
      };
    const handleRetailChange = (e) => {
        const { name, value } = e.target;
        setRetailData(prev => ({
          ...prev,
          [name]: value
        }));
      };
      const FetchRetailData = async () =>{
        try{
            const res= await axios.get('http://localhost:5001/api/cast/away');
            if (res.data.success){
                setRetData(res.data.data);
                setRetColumn(res.data.columns);
            }
        }
        catch(err){
            console.log("Error Retail")
        }
    };
    useEffect(()=>{
        const FetchRetailData = async () =>{
            try{
                const res= await axios.get('http://localhost:5001/api/cast/away');
                if (res.data.success){
                    setRetData(res.data.data);
                    setRetColumn(res.data.columns);
                }
            }
            catch(err){
                console.log("Error Retail",err)
            }
        };
         FetchRetailData();
    },[])

    useEffect(()=>{
        const fetchTransportData= async () => { try{
            const res= await axios.get('http://localhost:5001/api/transport/listing');
                    if(res.data.success){
                        setTransport(res.data.data);
                    }
        }
        catch(err){
            console.log("failed transport data")
        }
    }; fetchTransportData();
       
    },[]);
    
    useEffect (()=>{
        const fetchReqData= async () =>{
            try{
                const res= await axios.get('http://localhost:5001/api/reqs');

                    if(res.data.success){
                            setReqColumn(res.data.columns);
                                setReqData(res.data.data);
                    }

            }
            catch(err){
                console.error('Failed to fetch Requests',err);
            }
        }; fetchReqData();
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

    useEffect(()=>{
        const fetchQCData= async ()=>{

            try{
                const res= await axios.get('http://localhost:5001/api/show/qcid');
                if(res.data.success){
                    setData3(res.data.data);
                    setColumn3(res.data.columns);
                }
                else{
                    alert("API Error");
                }
            }
            catch(err){
                console.log(err);
                alert("UI error",err);
            }

        }; fetchQCData();
    },[]);

    const handleCastAway= async (e)=>{
        e.preventDefault();
        const payload={
            Order_no:retailData.Order_no,
            InspectorID:retailData.InspectID,
            Temperature:retailData.Temperature,
            Humidity:retailData.Humidity
        };
        try{
            const res =await axios.post('http://localhost:5001/api/cast',payload);
            if(res.data.success){
                setRetailData({
                    Order_no:"",
                    InspectID:"",
                    Temperature:"",
                    Humidity:'',
                });
                window.location.reload();
                alert("Cast Away",res.data.message);
            }
            else{
                alert("backend error");
            }
        }
        catch(err){
            alert("UI ERROR");
        }
    };

        const handleBatchControl= async (e)=>{
            e.preventDefault();
try{

            const res = await fetch ('http://localhost:5001/api/batch/entry',{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(batchData)
            });
            const result = await res.json();
      if (result.success) {
        setBatchData({
        InspectID:'',
        QueryID:'',
        Quantity:0,
        expireDate:'',
        Humidity:'',
        PreserveRate:0,
        Temperature:''
        })
        alert("✅ Batch created successfully!");
        window.location.reload();
        
      } else {
        alert("❌ Failed to create batch backend");
      }
        }catch(err){
            console.log(err);
            alert("❌ Failed to create batch UI");
        }

        };

        const handleTransportRelease = async (e)=>{
            e.preventDefault();
            try{

                const res = await fetch ('http://localhost:5001/api/truck/release',{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({TransportationID: transportID})
                });
                const result = await res.json();
          if (result.success) {
            setTransportID('');
            alert("✅ Transport released");
            
          } else {
            alert("❌ Failed to create batch backend");
          }
            }catch(err){
                console.log(err);
                alert("❌ Failed to create batch UI");
            }
        };

                const addToWareHouse=( <form onSubmit={handleBatchControl}>
                    <div className='card-header' style={{ backgroundColor: "#575757" }}>
                    <h2 className='text-white'>Inspection Info</h2>
                </div>
                <ul className='list-group list-group-flush'>
                    <li className="list-group-item my-2 rounded">
                        <input onChange={handleBatchChange} 
                            value={batchData.InspectID}
                        className='rounded border-0 p-1 bg-transparent text-dark' placeholder='Inspect Id' name='InspectID'></input>
                    </li>
                    <li className="list-group-item my-2">
                        <input onChange={handleBatchChange} 
                        value={batchData.QueryID}
                        className='rounded border-1 p-1 bg-transparent text-dark' placeholder='QueryID' name='QueryID'></input>
                    </li>
                    <li className="list-group-item my-2 d-flex flex-row">
                       <label className='my-2 mx-2'> Quantity:  </label>
                        <input 
                        value={batchData.Quantity}
                        onChange={handleBatchChange} type='number' className='rounded border-1 p-1 bg-transparent text-dark' placeholder='Quantity' name='Quantity'></input>
                    </li>
                    <li className="d-flex flex-row list-group-item my-2">
                        <label className='mx-2'>Expire Date</label>
                        <input onChange={handleBatchChange} 
                            value={batchData.expireDate}
                        type='date' className='rounded border-1 p-1 text-dark bg-transparent' name='expireDate'></input>
                    </li>
                    <li className="d-flex flex-row list-group-item my-2">
                        <label className='mx-2'>Humidity</label>
                    <div className="position-relative">
                    <input
                    name='Humidity'
                    value={batchData.Humidity}
                         type='number'
                         onChange={handleBatchChange}
                            className='rounded border-1 p-1 pe-4 text-dark bg-transparent'
                            defaultValue={50}
                            style={{ width: '80px' }}
                            />
                            <span
                            className="position-absolute"
                            style={{
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                pointerEvents: 'none',
                                color: 'gray'
                            }}
                            >
                            %
                            </span>
                        </div>
                            </li>

                    {/* Preservative Rate Input */}
                    <li className="d-flex flex-row list-group-item my-2">
                        <label className='mx-3'>Preservative Rate</label>
                        <input 
                        value={batchData.PreserveRate}
                        name='PreserveRate' type='range' min="0" max="10"  onChange={(e) => {
                            handleBatchChange(e);
                            setChemicalRate(e.target.value); // updates separately too
                        }}
                            className='rounded border-0 p-0 cursor-pointer'></input>
                        <label className='card mx-4 text-black-90 p-2' style={{ fontSize: "30px", padding: "0" }}>{chemicalRate}</label>
                    </li>
                    {/* Temperature Input */}
                    <li className="d-flex flex-row list-group-item my-2">
                        <label className='mx-3'>Temperature</label>
                        <input 
                        onChange={handleBatchChange}
                        value={batchData.Temperature}
                        name='Temperature' type='number' className='rounded border-0 p-1 cursor-pointer w-25 mx-2' ></input>
                        <label>°C</label>
                    </li>
                    <li><button className='rounded btn btn-dark'>Confirm</button></li>
                </ul>
                </form>);

                const CreateBatch =(
                    <form onSubmit={handleBatchControl}>
                        <div className='card-header' style={{ backgroundColor: "#575757" }}>
                        <h2 className='text-white'>Inspection Info</h2>
                    </div>
                    <ul className='list-group list-group-flush'>
                        <li className="list-group-item my-2 rounded">
                            <input onChange={handleBatchChange} 
                                value={batchData.InspectID}
                            className='rounded border-0 p-1 bg-transparent text-dark' placeholder='Inspect Id' name='InspectID'></input>
                        </li>
                        <li className="list-group-item my-2">
                            <input onChange={handleBatchChange} 
                            value={batchData.QueryID}
                            className='rounded border-1 p-1 bg-transparent text-dark' placeholder='QueryID' name='QueryID'></input>
                        </li>
                        <li className="list-group-item my-2 d-flex flex-row">
                           <label className='my-2 mx-2'> Quantity:  </label>
                            <input 
                            value={batchData.Quantity}
                            onChange={handleBatchChange} type='number' className='rounded border-1 p-1 bg-transparent text-dark' placeholder='Quantity' name='Quantity'></input>
                        </li>
                        <li className="d-flex flex-row list-group-item my-2">
                            <label className='mx-2'>Expire Date</label>
                            <input onChange={handleBatchChange} 
                                value={batchData.expireDate}
                            type='date' className='rounded border-1 p-1 text-dark bg-transparent' name='expireDate'></input>
                        </li>
                        <li className="d-flex flex-row list-group-item my-2">
                            <label className='mx-2'>Humidity</label>
                        <div className="position-relative">
                        <input
                        name='Humidity'
                        value={batchData.Humidity}
                             type='number'
                             onChange={handleBatchChange}
                                className='rounded border-1 p-1 pe-4 text-dark bg-transparent'
                                defaultValue={50}
                                style={{ width: '80px' }}
                                />
                                <span
                                className="position-absolute"
                                style={{
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                    color: 'gray'
                                }}
                                >
                                %
                                </span>
                            </div>
                                </li>

                        {/* Preservative Rate Input */}
                        <li className="d-flex flex-row list-group-item my-2">
                            <label className='mx-3'>Preservative Rate</label>
                            <input 
                            value={batchData.PreserveRate}
                            name='PreserveRate' type='range' min="0" max="10"  onChange={(e) => {
                                handleBatchChange(e);
                                setChemicalRate(e.target.value); // updates separately too
                            }}
                                className='rounded border-0 p-0 cursor-pointer'></input>
                            <label className='card mx-4 text-black-90 p-2' style={{ fontSize: "30px", padding: "0" }}>{chemicalRate}</label>
                        </li>
                        {/* Temperature Input */}
                        <li className="d-flex flex-row list-group-item my-2">
                            <label className='mx-3'>Temperature</label>
                            <input 
                            onChange={handleBatchChange}
                            value={batchData.Temperature}
                            name='Temperature' type='number' className='rounded border-0 p-1 cursor-pointer w-25 mx-2' ></input>
                            <label>°C</label>
                        </li>
                        <li><button className='rounded-4'>Confirm</button></li>
                    </ul>
                    </form>
                );

                const CastAway=(
                <div className='d-flex flex-column'>
                    <form className='d-flex flex-column' onSubmit={handleCastAway}>
                       
                        <input className='bg-white border-0 rounded-1 p-2 text-black' placeholder='InspectorId' value={retailData.InspectID}
                        name='InspectID' onChange={handleRetailChange} 
                        required/>
                        <input className='bg-white border-0 rounded-1 p-2 my-2 text-black' placeholder='OrderNo' value={retailData.Order_no}
                        name='Order_no' onChange={handleRetailChange}
                        required/>
                        <input className='bg-black border-0 rounded-1 p-2 my-2' placeholder='Temperature' type='number' value={retailData.Temperature}
                        name='Temperature' onChange={handleRetailChange}
                        />
                        <input className='bg-black border-0 rounded-1 p-2 my-2' placeholder='Humidity' type='number' value={retailData.Humidity}
                        name='Humidity'
                        onChange={handleRetailChange}
                        />
                            <button className='btn rounded-4 shadow-lg btn-success shadow-sm'>Cast AWAY</button>
                    </form>
                </div>
                
            );







    return (
        <div className='d-flex flex-column my-0 container-fluid'>
            {/* Header */}
            <div className='d-flex flex-row my-2 card' style={{ backgroundColor: "#575757", width: "1180px", boxShadow: "0 10px 10px" }}>
                <button className='p-1 mx-5 rounded'
                    style={{
                        backgroundColor: hover ? "transparent" : "#D8C9AE",
                        fontSize: "20px",
                        padding: "2px",
                        color: hover ? "" : "#575757"
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={signout}> SignOut
                </button>
                <h1 className='text-white mx-5'>Soul Food</h1>
            </div>
            <br />

            {/* Main Section */}
            <div className='d-flex flex-row'>
                {/* Inspection Form */}
                <div className='card border-0' style={{ backgroundColor: "#D8C9AE", boxShadow: "0 10px 10px" }}>
                    {onTable=="Requests" && CreateBatch}
                    {onTable=="WareHouse" && addToWareHouse}
                    {onTable=="Shopping" && CastAway}
                </div>

                {/* Table View */}
                <div className='card mx-lg-5 d-flex flex-column' style={{ backgroundColor: "#575757", boxShadow: "0 10px 10px" }}>
                    <div className=' d-flex card-header flex-row'>
                        <button onClick={()=>{setTable("Batching")}}><i className='fas fa-magnifying-glass'></i></button>
                        <button onClick={()=>{setTable("WareHouse")}}><i className='fas fa-house'></i></button>
                        <button onClick={()=>{setTable("WareHouse")}}><i className='fas fa-truck'></i></button>
                        <button onClick={()=>{setTable("Requests")}}><i className='fas fa-database'></i></button>
                        <button onClick={()=>{setTable("Shopping")}}><i className='fas fa-shopping-cart'></i></button>
                    </div>
                    <div>
                                    {onTable=== "WareHouse" && QcRecords}
                                    {onTable=== "Batching" && BatchRecords}
                                    {onTable=== "Requests" && reqRecords}
                                    {onTable=== "Shopping" && retailRecords}
                    </div>
                    
                </div>
            </div>

            
            <div className="d-flex justify-content-center m-5 flex-column justify-content-center align-items-center">
                                                    <h1 >Transport Release</h1>
                                                        <form  onSubmit={handleTransportRelease} className='d-flex flex-row'>
                                                        <input
                                                            list="transport-ids"
                                                            type="number"
                                                            placeholder="Transportation ID"
                                                            name="TransportationID"
                                                            className="form-control text-black me-2"
                                                            value={transportID}
                                                            onChange={(e)=>setTransportID(e.target.value)}
                                                        />
                                                        
                                                        <button type="submit" className="btn btn-danger">
                                                            Release
                                                        </button>

                                                        <datalist id="transport-ids">
                                                            {transport && transport.length > 0 ? (
                                                            transport.map((id, index) => (
                                                                <option key={index} value={id} />
                                                            ))
                                                            ) : (
                                                            <option disabled>No transport Occupied</option>
                                                            )}
                                                        </datalist>
                                                        </form>

            </div>
        </div>
    );
}

export default Inspection;
