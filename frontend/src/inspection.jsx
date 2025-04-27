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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ChartComponent = ({ chemicalRate, temperature }) => {
    const chartData = {
        labels: Array.from({ length: 11 }, (_, i) => i),
        datasets: [
            {
                label: "Temperature (°C)",
                data: Array.from({ length: 11 }, (_, i) => (temperature / 10) * i), 
                borderColor: "#ff4500",
                backgroundColor: "rgba(255, 69, 0, 0.5)",
                tension: 0.4,
            }
        ]
    };

    const chartOptions = {
        scales: {
            x: { title: { display: true, text: "Rating" }, min: 0, max: 10 },
            y: { title: { display: true, text: "Temperature (°C)" }, min: 10, max: 100 }
        }
    };

    return (
        <div className="card p-3 mx-5" style={{ width: "600px", backgroundColor: "#fff", boxShadow: "0 10px 10px rgba(0,0,0,0.1)" }}>
            <h3 className="text-center">Temperature </h3>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};












function Inspection() {
    

    const [onTable,setTable]=useState("WareHouse");

    const column = ["QCID", "Safety Rate", "Temperature", "Quantity", "Inspector Id", "Date"];
    const [column2,setColumn2] = useState([]);
    const [data2,setData2] = useState([]);
    const [column3,setColumn3] = useState([]);
    const [data3,setData3] = useState([]);
    const data = [
        ["QC1234", "High", "25°C", 100, "INS001", "2025-03-22"],
        ["QC1235", "Medium", "30°C", 150, "INS002", "2025-03-21"],
        ["QC1236", "Low", "22°C", 200, "INS003", "2025-03-20"],
        ["QC1237", "High", "28°C", 120, "INS004", "2025-03-19"],
        ["QC1238", "Medium", "26°C", 180, "INS005", "2025-03-18"]
    ];

            

    const [reqColumn,setReqColumn]=useState([]);
    const [reqData,setReqData]=useState([]);
    const QcRecords=(<TableView data={data3} columns={column3} tableName={"QC DATA"} />);
    const BatchRecords=(<TableView data={data2} columns={column2} tableName={"Batch DATA"} />);
    const reqRecords =(<TableView data={reqData} columns={reqColumn} tableName={'Request Query'}/>);




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
    const handleBatchChange = (e) => {
        const { name, value } = e.target;
        setBatchData(prev => ({
          ...prev,
          [name]: value
        }));
      };


    
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
                    <li><button className='rounded'>Confirm</button></li>
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
                                    {onTable=== "Shopping" && reqRecords}
                    </div>
                    
                </div>
            </div>

            {/* Chart */}
            <div className="d-flex justify-content-center m-5">
                <ChartComponent chemicalRate={chemicalRate} temperature={temperature} />
            </div>
        </div>
    );
}

export default Inspection;
