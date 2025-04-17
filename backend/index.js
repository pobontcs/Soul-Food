const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const db=require("./db/connection");
const app = express();
app.use(cors());
app.use(express.json());

// Dummy users for login
const users = {
  admin: { email: "admin", password: "1234" },
  inspector: { email: "inspect", password: "1234" },
  wareHouse: { email: "storage", password: "1234" },
};

// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  for (const role in users) {
    if (users[role].email === email && users[role].password === password) {
      return res.json({ success: true, role, message: "Login Successful" });
    }
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.post("/api/farm", (req,res)=>{
    const {FarmName,FarmLocation,AreaNo}=req.body;
    if (!FarmName || !FarmLocation || !AreaNo) {
        return res.status(400).json({ success: false, message: "All fields required" });
      }
    const sql="INSERT INTO FARM(AreaNo,FarmName,Location) VALUES(?,?,?)";
    db.query(sql,[AreaNo,FarmName,FarmLocation],(err,result)=>{
        if(err){
            console.error("Insert error:", err);
      return res.status(500).json({ success: false, message: "Database insert error" });
      
        }res.json({ success: true, message: "Farm added successfully" });
    })
});

app.get('/api/farms',(req,res)=>{
    db.query('SELECT * FROM FARM',(err,results,fields)=>{
        if(err){
            console.error('Error Fetching Farm Data',err);
            return res.status(500).json({success:false,message:'DB error'});
        }
        const columns=fields.map(field=>field.name);
        const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
    });
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
