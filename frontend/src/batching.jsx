import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TableView from './tableView';

function Batching(){
    const [activeForm, setActiveForm] = useState('producting');

                        const batching= (
            <form action="" className='align-items-center'>
                        <input placeholder='FarmId' className='card text-lg p-2 border-1 my-4'></input>
                        <input placeholder='ProductID' className='card text-lg p-2 border-1 my-4'></input>
                        <input placeholder='Quantity' className='card text-lg p-2 border-1 my-4'></input>
                       
                       <button className='rounded-3'>Create Batch</button>

            </form>);
                const producting=(<form>
                    <input placeholder='FarmId' className='card text-lg p-2 border-1 my-4' />
                  
                    <input placeholder='ProductName' className='card text-lg p-2 border-1 my-4' />
                  
                  <div className='d-flex flex-row'>
                    <label htmlFor="harvestDate" className="form-label text-muted mx-2 my-3">Harvest Date</label>
                    <input
                      type='date'
                      name='harvestDate'
                      id="harvestDate"
                      className='card text-lg p-2 border-1 my-2'
                      style={{ backgroundColor: "black", color: "white" }}
                    />
                    </div>
                  
                    <button className='rounded-3 btn btn-dark mt-4'>Harvest</button>
                  </form>);



            const farm = ["101", "102", "103", "104"];


               const columns=[
                "FarmId","AreaCode","ProductID","ProductName"
               ]
               const data = [
                [101, "AR-01", "P001", "Wheat"],
                [102, "AR-02", "P002", "Corn"],
                [103, "AR-01", "P003", "Rice"],
                [104, "AR-03", "P004", "Soybean"],
                [105, "AR-02", "P005", "Barley"]
              ];


        return(

            <div className='d-flex flex-column'>

<div className='card my-5 border-2 d-flex flex-row justify-content-center align-items-center' style={{ width: "900px", backgroundColor: "#575757" }}>
        <button onClick={() => setActiveForm('producting')} style={{ background: "transparent", border: "none" }}>
          <i className='fas fa-leaf' style={{ color: activeForm === 'producting' ? 'white' : 'black', fontSize: '24px' }}></i>
        </button>
        <button onClick={() => setActiveForm('batching')} style={{ background: "transparent", border: "none" }}>
          <i className='fas fa-box' style={{ color: activeForm === 'batching' ? 'white' : 'black', fontSize: '24px' }}></i>
        </button>
      </div>



                    <div className='d-flex flex-row ' style={{width:"900px"}}>
                    <div className='card flex-row border-2 shadow-lg p-3' style={{ width: "400px", height: "500px", backgroundColor: "#D8C9AE" }}>
          {activeForm === 'batching' ? batching : producting}
        </div>
                                
                                <div className=' card flex-row border-2 shadow-lg' style={{width:"600px",height:"500px", marginLeft:"30px"}}>
                                            <TableView columns={columns} data={data}/>
                                </div>

                    </div>
            </div>
        );

}


export default Batching;