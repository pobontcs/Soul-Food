const express=require("express");
const cors=require("cors")

const app=express();

app.use(cors());
app.use(express.json());

const validUser ={
email:"admin",
password:"1234"
};
const inspector={
    email:"inspect",
    password:"1234"
}
const wareHouse={
    email:"storage",
    password:"1234"
}

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (email === validUser.email && password === validUser.password) {
        res.json({ success: true, role: "admin", message: "Login Successful" });
    } 
    else if (email === inspector.email && password === inspector.password) {
        res.json({ success: true, role: "inspector", message: "Login Successful" });
    }
    else if(email===wareHouse.email && password=== wareHouse.password){
        res.json({success:true,role:"wareHouse",message:"loginSuccessful"});
    } 
    else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));