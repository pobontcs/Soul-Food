import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TableView from './tableView';

function WareHouse() {
  const [active, setActive] = useState('down'); 
  const [type, setType] = useState('');

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
      const options=["Cold Storage","Warm Storage","Both Storage"];
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

        const inputStorage=( <div className='d-flex flex-column'>
             
          <form className='my-5'>
            <div className='d-flex flex-row my-3'>
                      <input className='bg-white mx-2 border-1 rounded-1' placeholder='Batch Id' type="text">
                      </input>
                      <input className='bg-white mx-2 border-1 rounded-1' placeholder='WareHouseId' type='text'></input>
                </div>
                <div className='d-flex flex-column'>
                      <input className='bg-white mx-2 border-1 rounded-1 w-25 my-3' placeholder='Quantity' type='number'></input>
                      <input className='bg-white mx-2 border-1 rounded-1 w-25 my-3' placeholder='Temprature' type='number'></input>
                      <input className='bg-white mx-2 border-1 rounded-1 w-25 my-3' placeholder='Humidity' type='number'></input>
                      <button className='rounded w-25'>Enter Batch</button>
                </div>
          </form>
                   <TableView columns={["WarehouseId","WareHouse Name","Capacity Left"]} data={warehouseData}></TableView>   
            </div>);

        const wareHouseEntry=(
                    <div className='d-flex flex-column my-5'>
                      <form>

                                              <div className='d-flex flex-row my-3'>

                                                          <input placeholder='WareHouse Name' className='w-25 mx-2 bg-white border-1 rounded'></input>
                                                          <input placeholder='WareHouse Location' className='w-50 mx-2 bg-white border-1 rounded'></input>
                                              </div>

                                              <div className='d-flex flex-row'>
                                              <input
                                                      list="storage-types"
                                                       className='w-25 mx-2 bg-white border-1 rounded bg-black'
                                                        placeholder="Storagetype"
                                                        value={type}
                                                        onChange={(e) => setType(e.target.value)}
                                                      />
                                                                <datalist id="storage-types">
                                                                  {options.map(opt => <option key={opt} value={opt} />)}
                                                                </datalist>
                                                          <input placeholder='Capacity' type="number" className='w-25 mx-2 bg-white border-1 rounded'></input>
                                                          
                                              </div>
                                  <button className='my-2 rounded'>Submit</button>
                      </form>
                    </div>

                    );

        const retail=(
                            <div className='d-flex flex-column my-3'>
                                  <form>
                                    <div className='d-flex flex-row my-3 mx-2'> 
                                                         
                                                  <input placeholder='RetailerName' style={{marginRight:"300px"}} className='bg-white border-0 rounded p-1  '></input>  
                                                  <div className='d-flex flex-column align-items-baseline'> <label>Quality Check: </label>
                                                                                       <label>Expiry: </label>
                                                  </div>      
                                                      
                                    </div>
                                    <div className='d-flex flex-row my-3 mx-2'> 
                                            <input className='rounded' placeholder='QCID (mantadory)' required ></input>
                                            <button className='p-1 rounded shadow-lg'>Confirm</button>
                                    </div>
                                    <button>Ship</button>
                                    </form>
                                    <TableView columns={["WarehouseId","WareHouse Name","Capacity Left"]} data={warehouseData}></TableView>
                            </div>
        );




  return (
    <div className='d-flex flex-row'>

      <div className=' card d-flex flex-column' style={{height:"1000px",backgroundColor:"#D8C9AE",width:"200px"}}>

              <h4> WareHouse</h4>
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




      <div className='card d-flex flex-column mx-3' style={{height:"1000px",width:"800px",backgroundColor:"#575757"}}>
  {active === 'truck' && retail}
  {active === 'dash' && wareHouseEntry}
  {active === 'down' && inputStorage}
</div>


    </div>
    
  );
}

export default WareHouse;
                                                   