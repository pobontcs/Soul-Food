import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Retailer() {
    const [items, setItems] = useState([]);
    const [retailerInfo,setRetailerInfo]= useState({
        Name:"",
        Email:"",
        Location:"",
    });
    const handleRetailerChange = (e) => {
        const { name, value } = e.target;
        setRetailerInfo(prev => ({
          ...prev,
          [name]: value
        }));
    };

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

    const handleRetailerReq= async (e)=>{
                e.preventDefault();

                const res= await fetch("http://localhost:5001/api/submit/order");
                const selectedItem=items.find(item=>item.chosenQty >0 );

                if (!selectedItem) {
                    alert("Please select at least one product.");
                    return;
                }
                const selectedItems = items
                .filter(item => item.chosenQty > 0)
                .map(item => ({
                    BatchID: item.BatchID,
                    WarehouseID: item.WarehouseID,
                    Quantity: item.chosenQty
                }));
                const payload = {
                    
                    Name: retailerInfo.Name,
                    Email: retailerInfo.Email,
                    Location: retailerInfo.Location,
                    items:selectedItems
                };
                try{
                    const res = await axios.post("http://localhost:5001/api/submit/order", payload);

                    if (res.data.success) {
                        alert("Order placed . You will recieve an Email soon");
                        setItems(prev => prev.map(item => ({ ...item, chosenQty: 0 }))); // reset
                    } else {
                        alert("Failed to place order.");
                    }
                }
                catch(err){
                    console.log("bug on frontend",err)
                }

    };



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

            const Prod_list=(1);



    return (
        <div className='d-flex flex-row ' style={{ marginTop: "-30px" }}>
            {/* Sidebar */}
            <div className='card d-flex flex-column mx-2 shadow-lg w-25' style={{ backgroundColor: '#5B2333', height: "1000px" }}>
                <h1 className='display-3 text-light word-by-word'>SOUL</h1>
                <h1 className='display-3 text-light animate-text'>FOOD</h1>

                <form style={{marginTop:"200px"}} onSubmit={handleRetailerReq}>
                <input className='rounded bg-light border-0 p-2 my-2 text-black shadow-sm' placeholder='Name' type='text' name='Name' 
                value={retailerInfo.Name}
                onChange={handleRetailerChange} required/>
                <input className='rounded bg-light border-0 p-2 text-black' placeholder='email' type='email' name='Email'
                value={retailerInfo.Email}
                onChange={handleRetailerChange} required/>
                <input className='rounded bg-light border-0 p-2 my-2 text-black' placeholder='Location' type='text' name='Location'
                value={retailerInfo.Location}
                onChange={handleRetailerChange} required/>
                <button className='my-5 rounded-1 shadow-lg ' style={{ backgroundColor: '#F7F4F3', color: "black",fontSize:"20px" }}><i className='fas fa-shopping-bag'></i></button>
                </form>
            </div>

            {/* Product List Section */}
            <div className='card d-flex flex-column p-3 overflow-auto' name="productList" 
                        style={{ backgroundColor: '#F7F4F3', maxHeight: "1000px", width: "1200px" }}>

                        <h3 className='text-center mb-4 text-black-50'>Available Products</h3>

                            {items.map((item, index) => (
                            <div key={index} className='card mb-5 shadow-sm p-3 w-100 d-flex flex-row justify-content-between align-items-center'>
                             <div className='d-flex flex-column justify-content-between align-content-between'>
                        <h5><strong>Product:</strong> {item.ProdName}</h5>
                        <p><strong>Origin:</strong> {item.Origin}</p>
                         <p><strong>Available:</strong> {item.Quantity} kg</p>
                         <p><strong>BatchNo:</strong> {item.BatchID}</p>
                         <p><strong>WareHouse:</strong> {item.WarehouseID}</p>
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
