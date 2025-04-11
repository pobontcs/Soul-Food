import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function WareHouse() {
  const [active, setActive] = useState('down'); 

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

        const inputStorage= <div className='d-flex flex-column'>
              <div className='card'>

              </div>

        </div>


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
        <i className={`fas fa-tachometer fa-fw ${getIconClass('dash')}`}></i>
      </button>
      </div>




      <div className=' card d-flex flex-column mx-3' style={{height:"1000px",width:"800px"}}>

      </div>

    </div>
    
  );
}

export default WareHouse;
