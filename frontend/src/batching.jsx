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
  const [data, setData] = useState([]);
  const [farmData, setFarmData] = useState({
    FarmName: "",
    FarmLocation: "",
    AreaNo: ""
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

        // ⏬ Refresh table after adding new farm
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
    <form className='align-items-center'>
      <input placeholder='FarmId' className='card text-lg p-2 border-1 my-4' />
      <input placeholder='ProductID' className='card text-lg p-2 border-1 my-4' />
      <input placeholder='Quantity' className='card text-lg p-2 border-1 my-4' />
      <button className='rounded-3'>Create Batch</button>
    </form>
  );

  const producting = (
    <form>
      <input placeholder='FarmId' className='card text-lg p-2 border-1 my-4' />
      <input placeholder='ProductName' className='card text-lg p-2 border-1 my-4' />
      <div className='d-flex flex-row'>
        <label htmlFor="harvestDate" className="form-label text-muted mx-2 my-3">Harvest Date</label>
        <input
          type='date'
          name='harvestDate'
          id="harvestDate"
          className='card text-lg p-2 border-1 my-2'
          style={{ backgroundColor: "black", color: "white" }} required
        />
      </div>
      <button className='rounded-3 btn btn-dark mt-4'>Harvest</button>
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

  return (
    <div className='d-flex flex-column'>
      {/* Toggle Buttons */}
      <div className='card my-5 border-2 d-flex flex-row justify-content-center align-items-center'
        style={{ width: "900px", backgroundColor: "#575757" }}>
        <button onClick={() => setActiveForm('producting')} style={{ background: "transparent", border: "none" }}>
          <i className='fas fa-leaf' style={{ color: activeForm === 'producting' ? 'white' : 'black', fontSize: '24px' }}></i>
        </button>
        <button onClick={() => setActiveForm('batching')} style={{ background: "transparent", border: "none" }}>
          <i className='fas fa-box' style={{ color: activeForm === 'batching' ? 'white' : 'black', fontSize: '24px' }}></i>
        </button>
        <button onClick={() => setActiveForm('farmAdd')} style={{ background: "transparent", border: "none" }}>
          <i className='fas fa-plus' style={{ color: activeForm === 'farmAdd' ? 'white' : 'black', fontSize: '24px' }}></i>
        </button>
      </div>

      {/* Content Section */}
      <div className='d-flex flex-row ' style={{ width: "900px" }}>
        <div className='card flex-row border-2 shadow-lg p-3' style={{ width: "400px", height: "500px", backgroundColor: "#D8C9AE" }}>
          {activeForm === 'batching' && batching}
          {activeForm === 'producting' && producting}
          {activeForm === 'farmAdd' && farmAdd}
        </div>

        <div className='card flex-row border-2 shadow-lg' style={{ width: "600px", height: "500px", marginLeft: "30px", overflowY: "auto" }}>
          <TableView columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default Batching;
