import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function HomePage() {
  const [hover, setHover] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch("http://localhost:5001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            if (data.role === "admin") {
                navigate("/613BRH023");
            } else if (data.role === "inspector") {
                navigate("/inspection");
            }
            else if(data.role==="wareHouse"){
                navigate("/warehouse");
            }
        } else {
            alert("Invalid email or password!");
        }

    } catch (error) {
        console.error("Login error:", error);
    }
};

 

  return (
    <>
      <style>
        {`
          @keyframes anime {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          h1.intro {
            animation: anime 0.7s ease-out;
            font-family: 'Roboto', sans-serif;
            margin-left: 100px;
            margin-bottom: 150px;
            font-weight: 900;
            font-size: 80px;
            color: gray;
            text-shadow: 0 10px 50px;
          }
          
          h2.intro {
            animation: anime 0.7s ease-out;
            font-family: 'Roboto', sans-serif;
            margin-left: 110px;
            margin-top: 100px;
            font-weight: 900;
            font-size: 30px;
            color: gray;
            text-shadow: 0 10px 50px;
            animation-delay: 0.5s;
          }
          
          body {
            background: url('/food1.png') no-repeat center center;
            background-size: cover;
            position: relative;
            margin: 0;
            height: 100vh;
            opacity: 1;
            backdrop-filter: blur(2px);
          }
          
          .blur-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.5);
            z-index: -1;
          }
        `}
      </style>

      <div className="blur-background"></div>
      <h1 className="intro" style={{ fontSize: '80px', top: '30px' }}>Soul Food</h1>

      <div className='d-flex flex-column' style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        width: hover ? "700px" : "500px",
        height: "400px",
        borderRadius: "50px",
        marginLeft: "100px",
        boxShadow: "0 20px 15px rgba(0, 0, 0, 0.5)",
        transition: "0.3s ease-in-out"
      }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <form onSubmit={handleLogin} className='d-flex flex-column'>
          <input
            type='text'
            value={email}
            style={{
              backgroundColor: "white",
              border: "none",
              marginTop: "90px",
              borderRadius: "50px",
              width: hover ? "300px" : "250px",
              height: "40px",
              marginBottom: "20px",
              padding: "20px",
              boxShadow: "0 10px 10px black",
              transition: "0.3s ease-in-out",
              color: "black",
              fontFamily: "sans-serif",
              fontWeight: "bold"
            }}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          />
          <input
            type="password"
            value={password}
            style={{
              backgroundColor: "white",
              border: "none",
              marginTop: "10px",
              borderRadius: "50px",
              width: hover ? "300px" : "250px",
              height: "40px",
              marginBottom: "20px",
              padding: "20px",
              boxShadow: "0 10px 10px black",
              transition: "0.3s ease-in-out",
              color: "black",
              fontFamily: "sans-serif",
              fontWeight: "bold"
            }}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          />
          <button
            onClick={handleLogin}
            className="btn btn-dark rounded shadow-sm border-0 text-light"
            style={{
              transition: "0.3s ease-in-out"
            }}
          >
            Login
          </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default HomePage;