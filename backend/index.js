
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const db=require("./db/connection");
const { data } = require("react-router-dom");
const app = express();
app.use(cors());
app.use(express.json());

const users = {
  admin: { email: "admin", password: "1234" },
  inspector: { email: "inspect", password: "1234" },
  wareHouse: { email: "storage", password: "1234" },
};

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
    const sql="INSERT INTO FARM(PostalCode,FarmName,Location) VALUES(?,?,?)";
    db.query(sql,[AreaNo,FarmName,FarmLocation],(err,result)=>{
        if(err){
            console.error("Insert error:", err);
      return res.status(500).json({ success: false, message: "Database insert error" });
      
        }res.json({ success: true, message: "Farm added successfully" });
    })
});

app.post("/api/prod",(req,res)=>{
    const {FarmID,ProductName,Origin,HarvestDate}=req.body;
    if(!FarmID||!ProductName||!Origin||!HarvestDate){
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const sql='INSERT INTO PRODUCT(FarmID,ProdName,Origin,HarvestDate) VALUES(?,?,?,?)';

    db.query(sql,[FarmID,ProductName,Origin,HarvestDate],(err,result)=>{
      if(err){
        console.error("Insert error:", err);
  return res.status(500).json({ success: false, message: "Database insert error" });
  
    }res.json({ success: true, message: "Product added successfully" });
})

});



app.post('/api/req',(req,res)=>{

          const {ListingID}=req.body;
          if(!ListingID){
            return res.status(400).json({ success: false, message: "All fields are required" });
          }

          const insertSQL="INSERT INTO REQ (ProductID,Quantity) SELECT ProductID,LotCount FROM GRADING WHERE ListingID = ?"

          db.query(insertSQL,[ListingID],(err,result)=>{
                  if(err){
                    console.error("Insert error:", err);
                    return res.status(500).json({ success: false, message: "Database insert error" });
                  }
                  res.json({ success: true, message: "Request sent successfully" });
          })

});


app.post("/api/batch/entry", (req, res) => {
  const { InspectID, QueryID, Quantity, expireDate, Humidity, PreserveRate, Temperature } = req.body;

  if (!InspectID || !QueryID || !Quantity || !expireDate || !Humidity || !PreserveRate || !Temperature) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const getProductIDQuery = `SELECT ProductID FROM REQ WHERE QueryId = ?`;
  db.query(getProductIDQuery, [QueryID], (err, productResult) => {
    if (err || productResult.length === 0) {
      console.error("Error fetching ProductID:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch ProductID" });
    }

    const ProductID = productResult[0].ProductID;

    const getFarmAndHarvestQuery = `SELECT FarmID, HarvestDate FROM PRODUCT WHERE ProductID = ?`;
    db.query(getFarmAndHarvestQuery, [ProductID], (err2, farmResult) => {
      if (err2 || farmResult.length === 0) {
        console.error("Error fetching FarmID and HarvestDate:", err2);
        return res.status(500).json({ success: false, message: "Failed to fetch Farm info" });
      }

      const { FarmID, HarvestDate } = farmResult[0];


      const insertBatchQuery = `
        INSERT INTO BATCH (ProductID, FarmID, HarvestDate, ProcessingDate, Quantity, Temprature, Humidity, PreservationRate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertBatchQuery, [ProductID, FarmID, HarvestDate, expireDate, Quantity, Temperature, Humidity, PreserveRate], (err3, insertBatchResult) => {
        if (err3) {
          console.error("Error inserting Batch:", err3);
          return res.status(500).json({ success: false, message: "Failed to create Batch" });
        }

        const insertedBatchID = insertBatchResult.insertId; 


        const getInspectorNameQuery = `SELECT Name FROM INSPECTOR WHERE InspectorID = ?`;
        db.query(getInspectorNameQuery, [InspectID], (err4, inspectorResult) => {
          if (err4 || inspectorResult.length === 0) {
            console.error("Error fetching Inspector Name:", err4);
            return res.status(500).json({ success: false, message: "Failed to fetch Inspector Name" });
          }

          const InspectorName = inspectorResult[0].Name;

          const updateInspectorQuery = `
            UPDATE INSPECTOR
            SET Total_Inspections = Total_Inspections + 1
            WHERE InspectorID = ?
          `;
          db.query(updateInspectorQuery, [InspectID], (err5) => {
            if (err5) {
              console.error("Error updating Inspector:", err5);
              return res.status(500).json({ success: false, message: "Failed to update Inspector info" });
            }

            const insertQCRecordQuery = `
              INSERT INTO QUALITY_CONTROL_RECORD (BatchID, InspectorName, InspectionDate, InspectorID, Quantity, Temperature)
              VALUES (?, ?, CURRENT_DATE(), ?, ?, ?)
            `;
            db.query(insertQCRecordQuery, [insertedBatchID, InspectorName, InspectID, Quantity, Temperature], (err6) => {
              if (err6) {
                console.error("Error inserting Quality Control Record:", err6);
                return res.status(500).json({ success: false, message: "Failed to create Quality Control Record" });
              }

              const insertMovementQuery = `
                INSERT INTO SUPPLYCHAIN_MOVEMENT (BatchID,Stage,CurrentTemprature,Quantity)
                VALUES (?,"Batched", ?, ?)
              `;
              db.query(insertMovementQuery, [insertedBatchID, Temperature, Quantity], (err7) => {
                if (err7) {
                  console.error("Error inserting Supply Chain Movement:", err7);
                  return res.status(500).json({ success: false, message: "Failed to create Supply Chain Movement" });
                }

                return res.status(200).json({ success: true, message: "Batch entry completed successfully" });
              });
            });
          });
        });
      });
    });
  });
});










app.post("/api/batch",(req,res)=>{
  const {FarmID,ProductID,Quantity}=req.body;
  if (!FarmID || !ProductID || !Quantity) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  
        const insertBatchQuery=`INSERT INTO GRADING(ProductID,FarmID,Lotcount)
                                VALUES(?,?,?)`;
          db.query(insertBatchQuery,[ProductID,FarmID,Quantity],(err,result)=>{
            if (err) {
              console.error("Batch insert error:", err);
              return res.status(500).json({ success: false, message: "Database insert error" });
            }
      
            res.json({ success: true, message: "Batch created successfully"});
          });
});

app.get('/api/refresh',(req,res)=>{
            db.query('SELECT * FROM GRADING',(err,results,fields)=>{
              if(err){
                console.error('Error Fetching Farm Data',err);
            return res.status(500).json({success:false,message:'DB error'});
              }
              const columns3=fields.map(field=>field.name);
              const data3=results.map(row=>Object.values(row));

              res.json({success:true,columns3,data3});
            });
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

app.get('/api/show/batch',(req,res)=>{
    db.query('SELECT * FROM BATCH',(err,results,fields)=>{
      if(err){
        console.error(err);
        return res.status(500).json({success:false,message:'DB error'});
      }
      const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
    });

});
app.get('/api/show/qcid',(req,res)=>{
    db.query('SELECT * FROM QUALITY_CONTROL_RECORD',(err,results,fields)=>{
      if(err){
        console.error(err);
        return res.status(500).json({success:false,message:'DB error'});
      }
      const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
    });

});



app.get('/api/prods',(req,res)=>{
  db.query('SELECT * FROM PRODUCT',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })
});
app.get('/api/reqs',(req,res)=>{
  db.query('SELECT * FROM REQ',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
