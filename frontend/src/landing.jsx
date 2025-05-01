import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TableView from './tableView';
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import axios from 'axios';

function Landing(){
  const [hover, setHover] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const navigate=useNavigate('');
  useEffect(() => {
    let start = 0;
    const end = 60; // Target 60%
    const duration = 4000; // 4 seconds
    const incrementTime = 20;
    const step = (end / (duration / incrementTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setPercentage(start);
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

    return(
        <div className=' container-fluid  d-flex flex-column' style={{width:"1200px"}}>

            <div className='card d-flex flex-row my-1 mx-3 shadow-lg' style={{
                width:"1200px",
                backgroundColor:'#1c2529'
            }}>
              <div className='d-flex flex-row' style={{marginLeft:"70%"}}>
                <button onClick={()=>navigate('/warehouse')} className='bg-light rounded mx-2 animate-text'><i className='fas fa-archive ' style={{color:"black"}}></i></button>
                <button onClick={()=>navigate('/batching')} className='bg-light rounded animate-text' style={{color:"black"}}><i className='fas fa-leaf '></i></button>
                <button onClick={()=>navigate('/613BRH023')} className='bg-light rounded animate-text mx-2' style={{color:"black"}}><i className='fas fa-house '></i></button>
              </div>
            </div>

            

                    
                    <div className=' container-fluid d-flex flex-column mx-3 my-4 rounded' style={{
                      backgroundColor:"#A1D1B1",
                      width:"1200px"
                    }}>
                    <div className='d-flex flex-row rounded-4 my-2'>
                                <img src='src/assets/phase1.jpg' className='img-fluid w-50 rounded-4 shadow animate-text' alt="Soul Food" />
                                      <div className='container text-center d-flex flex-column justify-content-center'>
                                                        <h1 className='display-1 fw-bold animate-text text-light'>Soul</h1>
                                                        <h2 className='display-2 fw-bold animate-text text-bg-light'>FOOD</h2>
                                      </div>
</div>

                            <div className='d-flex flex-row  rounded-4 my-4'> <h3 className='display-4 word-by-word' style={{color:"#1c2529"}}>The  Most Reliable Tracing System </h3></div>
                            <div className='d-flex flex-column card rounded-4 my-5'> <h1 className='display-4 word-by-word'> Our vision</h1>
                                <p1 className=' word-by-word'> Our Engineers has Built a Massive Components System</p1>
                                <p1 className=' word-by-word'> Leading a Agro Product Trace its quality from farm to your home</p1>
                                <p1 className=' word-by-word'> Now You Can Have All The Products Details</p1>
                                <p1 className=' word-by-word'> From Farm To Your Kitchen</p1>
                            </div>
                            <div className='card d-flex flex-row my-1 rounded-5' style={{backgroundColor:"#1c2529"}}>
                                  <div className='card animate-text w-25 justify-content-center'>
                                    <h1>Features</h1>
                                  </div>
                                  <div className='card animate-text mx-5 justify-content-center p-3'>
                                    <p className='word-by-word'>1. Track Harvest</p>
                                    <p className='word-by-word'>2.Track How much Path Crossed</p>
                                    <p className='word-by-word'>3.Track Condition Rate</p>
                                    <p className='word-by-word'>4. Ensured high security batching</p>
                                  </div>
                                  <div className='card animate-text mx-5 justify-content-center p-3'>
                                    <h3 className='word-by-word'>Trusted By Many</h3>
                                    <CircularProgressbar
          value={percentage}
          text={`${Math.round(percentage)}K Users`}
          styles={buildStyles({
            pathColor: "#4ade80",
            textColor: "#4ade80",
            trailColor: "#d6d6d6",
            textSize: "15px",
          })}
        />
                                  </div>

                            </div>

                    </div>
                <footer className='card mx-3 w-100' style={{width:"1300px",backgroundColor:"#1c2529"}}>
                  <p1 className='text-light'> All Rights Reserved</p1>
                </footer>

            </div>



            
        

    );
}

export default Landing;