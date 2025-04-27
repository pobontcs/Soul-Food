import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TableView from './tableView';
import axios from 'axios';

function Batching() {
  const [activeForm, setActiveForm] = useState('producting');
  const [columns, setColumns] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [columns3, setColumns3] = useState([]);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3,setData3]=useState([]);
  const [Req,SetReqData]=useState({
    ListingID:''
  });
  const navigate=useNavigate();
  const [farmData, setFarmData] = useState({
    FarmName: "",
    FarmLocation: "",
    AreaNo: ""
  });
  const [harvestData, setHarvestData] = useState({
    FarmID: '',
    ProductName: '',
    Origin: '',
    HarvestDate: ''
  });
  const [batchData,setBatchData]=useState({
        ProductID:'',
        Quantity:null,
        FarmID:'',

  });
  

  const handleFarmChange = (e) => {
    const { name, value } = e.target;
    setFarmData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/farms');
        if (res.data.success) {
          setColumns(res.data.columns);
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch farms:', err);
      }
    };

    fetchFarmData();
  },[]);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/prods');
        if (res.data.success) {
          setColumns2(res.data.columns);
          setData2(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
  
    fetchProductData();
  }, []);

  useEffect(()=>{
    const fetchBoth= async () =>{
        try{
          const res =await axios.get("http://localhost:5001/api/refresh");
          if (res.data.success) {
            setColumns3(res.data.columns3);
            setData3(res.data.data3);
          }
        }
        catch(err){
          console.error('Failed to fetch products:', err);
        }
    };

    fetchBoth();
  },[])
    
  
  
  const handleHarvestChange = (e) => {
    const { name, value } = e.target;
    setHarvestData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleReqChange = (e) => {
    const { name, value } = e.target;
    SetReqData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleBatchChange = (e) => {
    const { name, value } = e.target;
    setBatchData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(batchData)
      });
  
      const result = await res.json();
      if (result.success) {
        alert("✅ Batch created successfully!");
        setData3({
          ProductID: '',
          Quantity: null,
          FarmID: ''
        });
        const ProdRes= await axios.get("http://localhost:5001/api/prods");

        if(ProdRes.data.success){
          setColumns2(ProdRes.data.columns3);
          setData2(ProdRes.data.data3);
        }
      } else {
        alert("❌ Failed to create batch");
      }
    } catch (error) {
      alert("❌ Server error while creating batch",error);
    }
  };
  
  

  const handleReqSubmit = async (e)=>{
    e.preventDefault();

    try{ 
      
      const res= await fetch("http://localhost:5001/api/req",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(Req)
    });
        const result =await res.json();
          if(result.success){
              alert("req sent successfully");
              SetReqData({ListingID:''});
            }
      }
    catch(err){
      alert("❌ Server error while creating batch",err);
     }
  };

  
  
  const handleHarvestSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch("http://localhost:5001/api/prod",{

        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(harvestData)
      }

      );
      const result=await res.json();
        if(result.success){
      alert("Harvest data submitted successfully!");
      setHarvestData({
        FarmID: '',
        ProductName: '',
        Origin: '',
        HarvestDate: '',
      
      })
        const ProdRes= await axios.get("http://localhost:5001/api/prods");

        if(ProdRes.data.success){
          setColumns2(ProdRes.data.columns);
          setData2(ProdRes.data.data);
        }
    
    }else {
      alert("❌ Failed to add Product");
    }
      

    }
    catch(error){
      alert("failed server")
    }
  };




  const handleFarmSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/farm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(farmData)
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Farm added successfully");
        setFarmData({ FarmName: "", FarmLocation: "", AreaNo: "" });

        //  Refresh table after adding new farm
        const res = await axios.get('http://localhost:5001/api/farms');
        if (res.data.success) {
          setColumns(res.data.columns);
          setData(res.data.data);
        }

      } else {
        alert("❌ Failed to add farm");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error connecting to server");
    }
  };

  // 🧾 Forms
  const batching = (
    <form className='align-items-center' onSubmit={handleBatchSubmit}>
      <input
        placeholder='FarmId'
        name='FarmID'
        value={batchData.FarmID}
        onChange={handleBatchChange}
        className='card text-lg p-2 border-1 my-4'
        required
      />
      <input
        placeholder='ProductID'
        name='ProductID'
        value={batchData.ProductID}
        onChange={handleBatchChange}
        className='card text-lg p-2 border-1 my-4'
        required
      />
      <input
        placeholder='Quantity'
        name='Quantity'
        type='number'
        value={batchData.Quantity || ''}
        onChange={handleBatchChange}
        className='card text-lg p-2 border-1 my-4'
        required
      />
      <button type='submit' className='rounded-3 btn btn-dark'>Create Grade</button>
    </form>
  );
  

  const prodTable=(<TableView columns={columns2} data={data2}></TableView>);
  const FarmTable=(<TableView columns={columns} data={data} />);
  

  const producting = (
    <form onSubmit={handleHarvestSubmit}>
      <input
        placeholder='FarmId'
        name='FarmID'
        value={harvestData.FarmID}
        onChange={handleHarvestChange}
        className='card text-lg p-2 border-1 my-4'
        required
      />
      <input
        placeholder='ProductName'
        name='ProductName'
        value={harvestData.ProductName}
        onChange={handleHarvestChange}
        className='card text-lg p-2 border-1 my-4'
        required
      />
      <input
        placeholder='Origin'
        name='Origin'
        value={harvestData.Origin}
        onChange={handleHarvestChange}
        className='card text-lg p-2 border-1 my-4'
        required
      />
      <div className='d-flex flex-row'>
        <label htmlFor="harvestDate" className="form-label text-muted mx-2 my-3">Harvest Date</label>
        <input
          type='date'
          name='HarvestDate'
          id='harvestDate'
          value={harvestData.HarvestDate}
          onChange={handleHarvestChange}
          className='card text-lg p-2 border-1 my-2'
          style={{ backgroundColor: "black", color: "white" }}
          required
        />
      </div>
      <button type="submit" className='rounded-3 btn btn-dark mt-4'>Harvest</button>
    </form>
  );

  const farmAdd = (
    <form className='align-items-center' onSubmit={handleFarmSubmit}>
    <input
      placeholder='FarmName'
      name="FarmName"
      value={farmData.FarmName}
      onChange={handleFarmChange}
      className='card text-lg p-2 border-1 my-4'
    />
    <input
      placeholder='FarmLocation'
      name="FarmLocation"
      value={farmData.FarmLocation}
      onChange={handleFarmChange}
      className='card text-lg p-2 border-1 my-4'
    />
    <input
      placeholder='AreaNo'
      name="AreaNo"
      value={farmData.AreaNo}
      onChange={handleFarmChange}
      className='card text-lg p-2 border-1 my-4'
    />
    <button className='rounded-3'>Add</button>
  </form>

  );
  const signout = () => navigate("/");
  return (
    <div className='d-flex flex-column' >
      {/* Toggle Buttons */}
      <div className='card my-5 border-2 d-flex flex-row justify-content-center align-items-center'
        style={{ width: "1000px", backgroundColor: "#575757",height:"120px" }}>
        <button onClick={signout} style={{ background: "transparent", border: "none" }}><i className='fas fa-power-off h-100'></i></button>

        <button onClick={() => setActiveForm('producting')} style={{ background: "transparent", border: "none" }}>
          <i className='fas fa-leaf' style={{ color: activeForm === 'producting' ? 'white' : 'black', fontSize: '30px' }}></i>
        </button>
        <button onClick={() => setActiveForm('batching')} style={{ background: "transparent", border: "none" }}>
          <i className='fas fa-box' style={{ color: activeForm === 'batching' ? 'white' : 'black', fontSize: '30px' }}></i>
        </button>
        <button onClick={() => setActiveForm('farmAdd')} style={{ background: "transparent", border: "none" }}>
          <i className='fas fa-plus' style={{ color: activeForm === 'farmAdd' ? 'white' : 'black', fontSize: '30px' }}></i>
        </button>
      </div>

      {/* Content Section */}
      <div className='d-flex flex-row ' >
        <div className='card flex-row border-2 shadow-lg p-3' style={{ width: "400px", height: "500px", backgroundColor: "#D8C9AE" }}>
          {activeForm === 'batching' && batching}
          {activeForm === 'producting' && producting}
          {activeForm === 'farmAdd' && farmAdd}
        </div>

        <div className='card flex-row border-2 shadow-lg' style={{ width: "600px", height: "500px", marginLeft: "30px", overflowY: "auto" }}>
          {activeForm==='batching' && prodTable}
          {activeForm==='producting' && FarmTable}
          {activeForm==='farmAdd' && FarmTable}
        </div>
      </div>

      <div className='card my-5 d-flex flex-row'>
          <div>
          <TableView columns={columns3} data={data3} />  
          </div>
          <div className='card d-flex flex-column mx-5' style={{backgroundColor:"#676767"}}>
                        <form className='d-flex flex-column ' onSubmit={handleReqSubmit}>

                        <input style={{color:"black"}}
              placeholder='ListingID'
  className='rounded border-0  my-2 p-2 text-bg-dark'
  value={Req.ListingID || ''} 
  name='ListingID'
  onChange={handleReqChange} 
/>
                             <button>Req Inspect</button>
                             

                        </form>
          </div>
      </div>
    </div>
    
    
  );
}

export default Batching;
