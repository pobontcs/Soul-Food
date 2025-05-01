import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Retailer() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchQcData = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/retail');
                if (res.data.success) {
                    // Add chosenQty field to each item for UI state
                    setItems(res.data.data.map(item => ({ ...item, chosenQty: 0 })));
                }
            } catch (err) {
                alert("bugs on retail");
            }
        };

        fetchQcData();
    }, []);

    const increaseQty = (index) => {
        const updatedItems = [...items];
        if (updatedItems[index].chosenQty < updatedItems[index].Quantity) {
            updatedItems[index].chosenQty += 1;
            setItems(updatedItems);
        }
    };

    const decreaseQty = (index) => {
        const updatedItems = [...items];
        if (updatedItems[index].chosenQty > 0) {
            updatedItems[index].chosenQty -= 1;
            setItems(updatedItems);
        }
    };

    return (
        <div className='d-flex flex-row ' style={{ marginTop: "-30px" }}>
            {/* Sidebar */}
            <div className='card d-flex flex-column mx-2 shadow-lg w-25' style={{ backgroundColor: '#5B2333', height: "1000px" }}>
                <h1 className='display-3 text-light word-by-word'>SOUL</h1>
                <h1 className='display-3 text-light animate-text'>FOOD</h1>

                <button className='my-5 rounded-1 shadow-lg' style={{ backgroundColor: '#F7F4F3', color: "black" }}>Available</button>
                <button className='my-5 rounded-1 shadow-lg' style={{ backgroundColor: '#F7F4F3', color: "black" }}>Purchase History</button>
                <button className='my-5 rounded-1 shadow-lg' style={{ backgroundColor: '#F7F4F3', color: "black",fontSize:"50px" }}><i className='fas fa-shopping-bag'></i></button>
            </div>

            {/* Product List Section */}
            <div className='card d-flex flex-column p-3 overflow-auto' name="productList" 
     style={{ backgroundColor: '#F7F4F3', maxHeight: "1000px", width: "1200px" }}>

    <h3 className='text-center mb-4 text-black-50'>Available Products</h3>

    {items.map((item, index) => (
        <div key={index} className='card mb-5 shadow-sm p-3 w-100 d-flex flex-row justify-content-between align-items-center'>
            <div>
                <h5><strong>Product:</strong> {item.ProdName}</h5>
                <p><strong>Origin:</strong> {item.Origin}</p>
                <p><strong>Available:</strong> {item.Quantity}</p>
            </div>
            
            <div className='d-flex align-items-center'>
                <button className='btn btn-outline-secondary me-2' onClick={() => decreaseQty(index)}>-</button>
                <span className='px-3'>{item.chosenQty}</span>
                <button className='btn btn-outline-secondary ms-2' onClick={() => increaseQty(index)}>+</button>
            </div>
        </div>
    ))}
</div>

        </div>
    );
}

export default Retailer;
