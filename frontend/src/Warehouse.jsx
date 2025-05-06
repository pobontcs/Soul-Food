import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TableView from './tableView';
import axios from 'axios';
function WareHouse() {
  const[changeTable,setChangeTable]=useState("Retail Req");
  const [storageActive, setStorageActive] = useState('batch');
  const[storage,setStorageColumn]=useState([]);
  const [capacitance,setStorageData]=useState([]);
  const [active, setActive] = useState('down'); 
  const [column1,setColumn1]=useState([]);
  const [data1,setData1]=useState([]);
  const [column2,setColumn2]=useState([]);
  const [data2,setData2]=useState([]);
  const [column3,setColumn3]=useState([]);
  const [data3,setData3]=useState([]);
  
  const isStorageActive = (btn) => storageActive === btn;

const getStorageButtonClass = (btn) =>
  `mx-3 rounded-4 px-3 py-2 transition-colors duration-200 ${
    isStorageActive(btn) ? 'bg-white text-black' : 'bg-transparent text-white'
  }`;

  const [wareHouseData,setWareHouseData]=useState({
          Capacity:0,
          WarehouseType:'',
          Name:'',
          Location:''
  });
  const [entryData,setEntryData]=useState({
    BatchID:'',
    WarehouseID:'',
    Quantity:'',
    TransportationID:''
  });



  const warehouseData = [
    ["WH001", "Central Depot", 120],
    ["WH002", "North Wing", 75],
    ["WH003", "East Bay Storage", 30],
    ["WH004", "South Vault", 0],
    ["WH005", "Main Hub", 200],
    ["WH006", "Overflow Storage", 50],
    ["WH007", "Packaging Unit", 90],
    ["WH008", "Return Zone", 10],
    ["WH009", "Hazardous Goods", 15],
    ["WH010", "Cold Storage", 5]
  ];


    
  useEffect(()=>{
    const fetchWareHouseData = async()=>{
      try {
        const res = await axios.get('http://localhost:5001/api/warehouses');
        if (res.data.success) {
          setColumn1(res.data.columns);
          setData1(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch farms:', err);
      }
    };
      fetchWareHouseData();
  },[]);
  useEffect(()=>{
    const fetchWareHouseStorage = async()=>{
      try {
        const res = await axios.get('http://localhost:5001/api/storage');
        if (res.data.success) {
          setStorageData(res.data.data3);
          setStorageColumn(res.data.columns3);
        }
      } catch (err) {
        console.error('Failed to fetch farms:', err);
      }
    };
      fetchWareHouseStorage();
  },[]);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/add/prod/warehouse');
        if (res.data.success) {
          setColumn3(res.data.columns);
          setData3(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch farms:', err);
      }
    };
    fetchBatchData();
  }, []);
  useEffect(() => {
    const fetchListData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/add/prod/batch');
        if (res.data.success) {
          setColumn2(res.data.columns);
          setData2(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch farms:', err);
      }
    };
    fetchListData();
  }, []);
  


    const BatchTable=(<TableView data={data2} columns={column2} />);
    const ListTable=(<TableView data={data3} columns={column3} />);

 





      const options=["Cold","Warm","Both"];
      const [transport, setTransport] = useState([]);

      useEffect(() => {
        const fetchTransportData = async () => {
          try {
            const res = await axios.get('http://localhost:5001/api/set/transport');
            if (res.data.success) {
              setTransport(res.data.data); // Set transport data
              console.log(res.data.data);  // Log the fetched transport data
            }
          } catch (err) {
            console.error('Failed to fetch transport:', err);
          }
        };
        fetchTransportData();
      }, []);







  const isActive = (btn) => active === btn;

  const getButtonClass = (btn) =>
    `rounded shadow my-3 px-3 py-2 transition-colors duration-200 ${
      isActive(btn) ? 'bg-[#575757]' : 'bg-transparent'
    }`;

  const getIconClass = (btn) =>
    `text-xl ${
      isActive(btn) ? 'text-white' : 'text-[#575757]'
    }`;

  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const handleWareChange = (e) => {
    const { name, value } = e.target;
    setWareHouseData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    setEntryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

          const handleWareHouseInput= async (e)=>{
            e.preventDefault();

                  try{
                    const res =await fetch("http://localhost:5001/api/warehouse/entry",{
                      method:"POST",
                      headers:{
                        "Content-Type": "application/json"
                      },
                      body:JSON.stringify(wareHouseData)
                    }
                  );
                  const result =await res.json();
                  if(result.success){
                    alert(" sent successfully");
                    setWareHouseData({
                      Capacity:0,
                      Name:'',
                      WarehouseType:'',
                      Location:''
                    });
                    const ProdRes= await axios.get("http://localhost:5001/api/warehouses");

        if(ProdRes.data.success){
          setColumn1(ProdRes.data.columns);
          setData1(ProdRes.data.data);
        }
    
    }else {
      alert("❌ Failed to add Product");
    }
                    
          }
      catch(err){
                    alert("failed server");
                  }
          };

          const handleEntryBatch= async (e)=>{
                        e.preventDefault();

                    try{
                      const res =await fetch("http://localhost:5001/api/warehouse/batch/entry",{
                        method:"POST",
                        headers:{
                          "Content-Type": "application/json"
                        },
                        body:JSON.stringify(entryData)
                      }
                    );
                    const result =await res.json();
                    if(result.success){
                      alert(" sent successfully");
                      setEntryData({
                        BatchID:'',
                        WareHouseID:'',
                        Quantity:'',
                        TransportationID:''
                      });
                    } else(err)
                      alert(err);
                      console.log(err);
                    
                  }
                    catch(err){
                      console.log(err);
                      alert("front end er jhamela")
                    }

          };








        const inputStorage=( <div className='d-flex flex-column'>
             
          <form className='my-5' onSubmit={handleEntryBatch}>
            <div className='d-flex flex-row my-3'>
                      <input className='bg-white mx-2 border-1 rounded-1 text-black '
                        onChange={handleEntryChange}
                        value={entryData.BatchID}
                        name="BatchID"
                      style={{height:"70px"}}  type='number' placeholder='Batch Id'>
                      </input>

                      <input className='bg-white mx-2 border-1 rounded-1 text-black'
                      onChange={handleEntryChange}
                      value={entryData.WarehouseID}
                      name="WarehouseID" style={{height:"70px"}} placeholder='WareHouseId'  type='number'></input>
                     
                      <input className='bg-white mx-2 border-1 rounded-1 w-25  mx-2 text-black '
                      onChange={handleEntryChange}
                      value={entryData.Quantity}
                      name="Quantity"
                      style={{height:"70px"}} placeholder='Quantity' type='number'></input>
                      
                      <input
                        list="transport-ids"
                        name="TransportationID"
                        className="w-25 mx-2 bg-white border-1 rounded bg-black text-black-50"
                        placeholder="Select Transport ID"
                        value={entryData.TransportationID}  
                        onChange={handleEntryChange}
/>

<datalist id="transport-ids">
  {transport && transport.length > 0 ? (
    transport.map((id, index) => (
      <option key={index} value={id} />
    ))
  ) : (
    <option disabled>No transport available</option>
  )}
</datalist>
                </div>
                
                      
                      
                      <button className='rounded w-25'>Enter Batch</button>
                
          </form>
                    <div className='d-flex flex column'>
                    <div className='d-flex flex-row'>
  <button
    type="button"
    className={getStorageButtonClass('batch')}
    onClick={() => setStorageActive('batch')}
  >
    Batch
  </button>
  <button
    type="button"
    className={getStorageButtonClass('warehouse')}
    onClick={() => setStorageActive('warehouse')}
  >
    Warehouses
  </button>


                    </div>


                    </div>

                {storageActive=='batch' && BatchTable}
                {storageActive=='warehouse' && ListTable}

                   
            </div>);







        const wareHouseEntry=(
                    <div className='d-flex flex-column my-5'>
                     <div className='card shadow-lg '>
                     <form onSubmit={handleWareHouseInput}>

<div className='d-flex flex-row my-3'>
  <input
    placeholder='WareHouse Name'
    name='Name'
    value={wareHouseData.Name}
    onChange={handleWareChange}
    className='w-25 p-3 mx-2  bg-white border-1 rounded text-black-50'
  />
  <input
    placeholder='WareHouse Location'
    name='Location'
    value={wareHouseData.Location}
    onChange={handleWareChange}
    className='w-50 mx-2 bg-white border-1 rounded text-black-50'
  />
</div>

<div className='d-flex flex-row'>
  <input
    list="storage-types"
    name='WarehouseType'
    className='w-25 mx-2 bg-white border-1 rounded bg-black text-black-50'
    placeholder="Storage Type"
    value={wareHouseData.WarehouseType}
    onChange={handleWareChange}
  />
  <datalist id="storage-types">
    {options.map(opt => <option key={opt} value={opt} />)}
  </datalist>

  <input
    placeholder='Capacity'
    name='Capacity'
    value={wareHouseData.Capacity}
    onChange={handleWareChange}
    type="number"
    className='w-25 mx-2 p-3 bg-white border-1 rounded text-black-50'
  />
</div>

<button type="submit" className='my-4 rounded'>Submit</button>
<TableView data={data1} columns={column1} tableName={'WareHouses'} />

</form>

                      </div>
                    </div>

                    );
                        const storageTable=(<TableView columns={storage} data={capacitance} tableName={"WareHouse Status"}/>);
        const retail=(
                            <div className='d-flex flex-column my-3'>
                              <div className='d-flex flex-row'></div>
                              <div>
                                {storageTable}
                              </div>
                            </div>
        );




  return (
    <div className='d-flex flex-row' style={{
      width:"1500px",
      paddingRight:"200px",

    }}>

      <div className=' card d-flex flex-column border-0' style={{height:"1000px",backgroundColor:"#D8C9AE",width:"300px"}}>

              <h4 className=' display-2  text-white font-weight-bold'> WareHouse</h4>
              <hr></hr>
 
              <button onClick={() => setActive('down')} className={getButtonClass('down')}>
        <i className={`fas fa-circle-arrow-down ${getIconClass('down')}`}></i>
      </button>

      <button onClick={() => setActive('truck')} className={getButtonClass('truck')}>
        <i className={`fas fa-truck ${getIconClass('truck')}`}></i>
      </button>

      <button onClick={() => setActive('user')} className={getButtonClass('user')}>
        <i className={`fas fa-user fa-fw ${getIconClass('user')}`}></i>
      </button>

      <button onClick={() => setActive('dash')} className={getButtonClass('dash')}>
        <i className={`fas fa-plus fa-fw ${getIconClass('dash')}`}></i>
      </button>
      </div>




      <div className='card d-flex flex-column mx-3 border-0 shadow-lg' style={{height:"1000px",width:"1100px",backgroundColor:"#575757"}}>
  <div>
        {active === 'truck' && retail}
        {active === 'dash' && wareHouseEntry}
        {active === 'down' && inputStorage}
  </div>
  <div className='my-4'>
      
  </div>
  
</div>

      
    </div>
    
  );
}

export default WareHouse;
                                                   