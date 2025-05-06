
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

///dashboard logic start
    app.post('/api/delete/batch',(req,res)=>{
          const {BatchID} = req.body;
          const sql=`DELETE FROM BATCH WHERE BatchID = ?;`;
            db.query(sql,[BatchID],(err)=>{
                    if(err){
                      return res.status(400).json({ success: false, message: "All fields required" });
                    }
                    return res.json({ success: true, message: "Delete Successful" });

            });
    });
    app.post('/api/delete/farm',(req,res)=>{
          const {FarmID} = req.body;
          const sql=`DELETE FROM FARM WHERE FarmID = ?;`;
            db.query(sql,[FarmID],(err)=>{
                    if(err){
                      return res.status(400).json({ success: false, message: "All fields required" });
                    }
                    return res.json({ success: true, message: "Delete Successful" });

            });
    });
    app.post('/api/add/inspect',(req,res)=>{
              const {Name}=req.body;
              const sql=`INSERT INTO INSPECTOR(Name,Total_Inspections)
                          VALUES(?,0);`;

                          db.query(sql,[Name],(err,result)=>{
                            if(err){
                              return res.status(400).json({ success: false, message: "All fields required" });
                            }
                            return res.json({ success: true, message: "ADD Successful" });
                          });
    });
    app.post('/api/truck/add',(req,res)=>{
              const {Name,Type}=req.body;
              const sql=`INSERT INTO TRANSPORT(Name,Type,Available)
                          VALUES(?,?,'yes');`;

                          db.query(sql,[Name,Type],(err,result)=>{
                            if(err){
                              return res.status(400).json({ success: false, message: "All fields required" });
                            }
                            return res.json({ success: true, message: "ADD Successful" });
                          });
    });
    
    






///dashboard logic end

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

app.post("/api/warehouse/entry",(req,res)=>{

      const {Capacity,WarehouseType,Name,Location}=req.body;

      if(!Capacity||!WarehouseType||!Name||!Location){
           return res.status(400).json({ success: false, message: "All fields are required" });
      }

      const inserTionSql=`INSERT INTO WAREHOUSE(Capacity,WarehouseType,Name,Location) VALUES(?,?,?,?)`;

      db.query(inserTionSql,[Capacity,WarehouseType,Name,Location],(err,result)=>{
        if(err){
          console.error("Insert error:", err);
          return res.status(500).json({ success: false, message: "Database insert error" });
        }
        const sql=`INSERT INTO STORAGE(Capacity) values(?)`
        db.query(sql,[Capacity],(err)=>{
          if(err){
            console.error("Insert error:", err);
            return res.status(500).json({ success: false, message: "Database insert error" });
          }

        res.json({ success: true, message: "Request sent successfully" });
      
      });
    });

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

app.post("/api/warehouse/batch/entry", (req, res) => {
  const { BatchID, WarehouseID, Quantity, TransportationID } = req.body;

  if (!BatchID || !WarehouseID || !Quantity || !TransportationID) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const selectBatchSql = `SELECT Temprature, Quantity, Humidity FROM BATCH WHERE BatchID = ?`;

  db.query(selectBatchSql, [BatchID], (err, batchResult) => {
    if (err) {
      console.log("Error fetching batch data:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (batchResult.length === 0) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    const { Temprature, Humidity } = batchResult[0];

    const insertBatchWarehouseSql = `
      INSERT INTO BATCH_WAREHOUSE (BatchID, WarehouseID, EntryDate,Quantity)
      VALUES (?, ?, CURDATE(),?)
    `;

    db.query(insertBatchWarehouseSql, [BatchID, WarehouseID,Quantity], (err, insertResult) => {
      if (err) {
        console.log("Error inserting into BATCH_WAREHOUSE:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      const updateSupplyChainSql = `
        UPDATE SUPPLYCHAIN_MOVEMENT
        SET Stage = 'Warehouse'
        WHERE BatchID = ?
      `;

      db.query(updateSupplyChainSql, [BatchID], (err, updateResult) => {
        if (err) {
          console.log("Error updating SUPPLYCHAIN_MOVEMENT:", err);
          return res.status(500).json({ success: false, message: "Database error" });
        }

        const updateWarehouseCapacitySql = `
          UPDATE WAREHOUSE
          SET Capacity = Capacity - ?
          WHERE WarehouseID = ?
        `;

        db.query(updateWarehouseCapacitySql, [Quantity, WarehouseID], (err, warehouseUpdateResult) => {
          if (err) {
            console.log("Error updating WAREHOUSE capacity:", err);
            return res.status(500).json({ success: false, message: "Database error" });
          }

          // Insert into TRANSPORT_BATCH
          const insertTransportBatchSql = `
            INSERT INTO TRANSPORT_BATCH (BatchID, TransportationID, Quantity, Humidity,Temprature)
            VALUES (?, ?, ?, ?,?)
          `;

          db.query(insertTransportBatchSql, [BatchID, TransportationID, Quantity, Humidity,Temprature], (err, transportBatchResult) => {
            if (err) {
              console.log("Error inserting into TRANSPORT_BATCH:", err);
              return res.status(500).json({ success: false, message: "Database error" });
            }

            // Update TRANSPORT Available = 'no'
            const updateTransportSql = `
              UPDATE TRANSPORT
              SET Available = 'no'
              WHERE TransportationID = ?
            `;

            db.query(updateTransportSql, [TransportationID], (err, transportUpdateResult) => {
              if (err) {
                console.log("Error updating TRANSPORT availability:", err);
                return res.status(500).json({ success: false, message: "Database error" });
              }

              // Final success response
              return res.status(200).json({ success: true, message: "Batch entry recorded successfully" });
            });
          });
        });
      });
    });
  });
});

app.post("/api/truck/release", (req, res) => {
  const { TransportationID } = req.body;
  console.log("Received TransportationID:", TransportationID); // Check if it's received

  const sql = `UPDATE TRANSPORT SET Available='yes' WHERE TransportationID=?`;
  db.query(sql, [TransportationID], (err, result) => {
    if (err) {
      console.log("Transport update error:", err);
      return res.status(500).json({ success: false, message: "Database update error" });
    }
    res.json({ success: true, message: "Released successfully" });
  });
});

app.post("/api/submit/order", (req, res) => {
  const { Name, Email, Location, items } = req.body;

  if (!Name || !Email || !Location || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid input data" });
  }

  const sql = `INSERT INTO RETAILER_REQ (Amount, BatchID, WarehouseID, Name, Email, Location) VALUES (?, ?, ?, ?, ?, ?)`;

  const values = items.map(item => [item.Quantity, item.BatchID, item.WarehouseID, Name, Email, Location]);
  let completed = 0;
  let hasError = false;

  values.forEach(valueSet => {
    db.query(sql, valueSet, (err, result) => {
      if (err && !hasError) {
        hasError = true;
        console.log("Order Declined", err);
        return res.status(500).json({ success: false, message: "Database update error" });
      }

      completed++;
      if (completed === values.length && !hasError) {
        res.json({ success: true, message: "Order submitted successfully" });
      }
    });
  });
});

app.post("/api/cast", (req, res) => {
  const { Order_no, InspectorID, Temperature, Humidity } = req.body;

  // Corrected UPDATE syntax for MySQL
  const sqlUpdateBatchWarehouse = `
    UPDATE BATCH_WAREHOUSE BW
    JOIN RETAILER_REQ R ON BW.BatchID = R.BatchID
    SET BW.Quantity = BW.Quantity - R.Amount
    WHERE R.Order_no = ? AND BW.Quantity - R.Amount > 0;
  `;

  // Corrected DELETE syntax for MySQL
  const sqlDeleteBatchWarehouse = `
    DELETE BW FROM BATCH_WAREHOUSE BW
    JOIN RETAILER_REQ R ON BW.BatchID = R.BatchID
    WHERE R.Order_no = ? AND BW.Quantity - R.Amount <= 0;
  `;

  db.query(sqlUpdateBatchWarehouse, [Order_no], (err) => {
    if (err) {
      console.log("BatchWarehouse Update Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    db.query(sqlDeleteBatchWarehouse, [Order_no], (err) => {
      if (err) {
        console.log("BatchWarehouse Delete Error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      // Corrected SUPPLYCHAIN_MOVEMENT queries
      const supplyUpdate = `
        UPDATE SUPPLYCHAIN_MOVEMENT S
        JOIN RETAILER_REQ R ON S.BatchID = R.BatchID
        SET S.Quantity = S.Quantity - R.Amount
        WHERE R.Order_no = ? AND S.Quantity - R.Amount > 0;
      `;

      const supplyDelete = `
        UPDATE SUPPLYCHAIN_MOVEMENT S
        JOIN RETAILER_REQ R ON S.BatchID = R.BatchID
        SET S.Stage = 'Retailed', S.CurrentTemprature = ?
        WHERE R.Order_no = ? AND S.Quantity - R.Amount <= 0;
      `;

      db.query(supplyUpdate, [Order_no], (err) => {
        if (err) {
          console.log("SupplyChain Update Error:", err);
          return res.status(500).json({ success: false, message: "Database error" });
        }

        db.query(supplyDelete, [Temperature, Order_no], (err) => {
          if (err) {
            console.log("SupplyChain Delete Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
          }

          // Get BatchID 
          const getBatchID = `SELECT BatchID FROM RETAILER_REQ WHERE Order_no = ?`;
          db.query(getBatchID, [Order_no], (err, batchRes) => {
            if (err || batchRes.length === 0) {
              console.log("Error fetching BatchID:", err);
              return res.status(500).json({ success: false, message: "Failed to fetch BatchID" });
            }

            const BatchID = batchRes[0].BatchID;

            const updateWarehouse = `
              UPDATE WAREHOUSE W
              JOIN RETAILER_REQ R ON R.WarehouseID = W.WarehouseID
              JOIN BATCH B ON B.BatchID = R.BatchID
              SET W.Capacity = W.Capacity + R.Amount
              WHERE B.BatchID = ?;
            `;
            
            db.query(updateWarehouse, [BatchID], (err) => {
              if (err) {
                console.log("Warehouse Capacity Update Error:", err);
                return res.status(500).json({ success: false, message: "Database error" });
              }

              const insertQC = `
                INSERT INTO QUALITY_CONTROL_RECORD 
                (BatchID, InspectorName, InspectionDate, InspectorID, Quantity, Temperature)
                SELECT ?, I.Name, CURDATE(), ?, R.Amount, ?
                FROM INSPECTOR I, RETAILER_REQ R
                WHERE I.InspectorID = ? AND R.Order_no = ?;
              `;
              
              db.query(insertQC, [BatchID, InspectorID, Temperature, InspectorID, Order_no], (err) => {
                if (err) {
                  console.log("Quality Control Insert Error:", err);
                  return res.status(500).json({ success: false, message: "Database error" });
                }

                const deleteRetailerReq = `DELETE FROM RETAILER_REQ WHERE Order_no = ?`;
                db.query(deleteRetailerReq, [Order_no], (err) => {
                  if (err) {
                    console.log("RetailerReq Delete Error:", err);
                    return res.status(500).json({ success: false, message: "Database error" });
                  }

                  const retailSQL = `
                    INSERT INTO RETAILER(RetailDate, BatchID, InspectorID, Temperature, Humidity)
                    VALUES(CURDATE(), ?, ?, ?, ?);
                  `;
                  
                  db.query(retailSQL, [BatchID, InspectorID, Temperature, Humidity], (err) => {
                    if (err) { 
                      console.log("Retail Insert Error:", err);
                      return res.status(500).json({ success: false, message: "Database error" });
                    }
                    res.json({ success: true, message: "Controlled" });
                  });
                });
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
app.get('/api/storage',(req,res)=>{
            db.query('SELECT * FROM STORAGE',(err,results,fields)=>{
              if(err){
                console.error('Error Fetching Farm Data',err);
            return res.status(500).json({success:false,message:'DB error'});
              }
              const columns3=fields.map(field=>field.name);
              const data3=results.map(row=>Object.values(row));

              res.json({success:true,columns3,data3});
            });
});
app.get('/api/set/transport/table',(req,res)=>{
            db.query('SELECT * FROM TRANSPORT',(err,results,fields)=>{
              if(err){
                console.error('Error Fetching Farm Data',err);
            return res.status(500).json({success:false,message:'DB error'});
              }
              const columns=fields.map(field=>field.name);
              const data=results.map(row=>Object.values(row));

              res.json({success:true,columns,data});
            });
});
app.get('/api/inspector/show',(req,res)=>{
            db.query('SELECT * FROM INSPECTOR',(err,results,fields)=>{
              if(err){
                console.error('Error Fetching Farm Data',err);
            return res.status(500).json({success:false,message:'DB error'});
              }
              const columns=fields.map(field=>field.name);
              const data=results.map(row=>Object.values(row));

              res.json({success:true,columns,data});
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
app.get('/api/retail/data',(req,res)=>{
    db.query('SELECT RetailDate,InspectorID,BatchID,Temperature FROM RETAILER',(err,results,fields)=>{
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


app.get('/api/farm/product-count', (req, res) => {
  const query = `
    SELECT F.FarmName, COUNT(P.ProductID) AS productCount
    FROM FARM F
    LEFT JOIN PRODUCT P ON F.FarmID = P.FarmID
    GROUP BY F.FarmName;
  `;

  db.query(query, (err, results, fields) => {
    if (err) {
      console.error('Error fetching product count by farm:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }

    const columns = fields.map(field => field.name);
    const data = results.map(row => Object.values(row));

    res.json({ success: true, columns, data });
  });
});

app.get('/api/warehouse/batch-count', (req, res) => {
  const query = `
    SELECT W.WarehouseID, COUNT(B.BatchID) AS batchCount
    FROM WAREHOUSE W
    LEFT JOIN BATCH_WAREHOUSE B ON W.WarehouseID = B.WarehouseID
    GROUP BY W.WarehouseID;
  `;

  db.query(query, (err, results, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }

    const columns = fields.map(field => field.name);
    const data = results.map(row => Object.values(row));

    res.json({ success: true, columns, data });
  });
});

// In your backend (index.js or routes file)
app.get('/api/quality-control/temperature', (req, res) => {
  const query = `
    SELECT RecordID, Temperature 
    FROM QUALITY_CONTROL_RECORD
    ORDER BY RecordID
    LIMIT 50;
  `;

  db.query(query, (err, results, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }

    const columns = fields.map(field => field.name);
    const data = results.map(row => Object.values(row));

    res.json({ 
      success: true, 
      columns, 
      data 
    });
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
app.get("/api/warehouses",(req,res)=>{
  db.query('SELECT * FROM WAREHOUSE',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })
});
app.get("/api/supplychain",(req,res)=>{
  db.query('SELECT * FROM SUPPLYCHAIN_MOVEMENT',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })
});
app.get("/api/batch/warehouse/data",(req,res)=>{
  db.query('SELECT * FROM BATCH_WAREHOUSE',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })
});
app.get("/api/add/prod/warehouse",(req,res)=>{
  db.query('SELECT WarehouseID, Capacity, WarehouseType FROM WAREHOUSE',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })

});







app.get("/api/add/prod/warehouse",(req,res)=>{
  db.query('SELECT WarehouseID, Capacity, WarehouseType FROM WAREHOUSE',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })

});
app.get("/api/cast/away",(req,res)=>{
  db.query('SELECT Order_no,WarehouseID,Name,Amount,BatchID FROM RETAILER_REQ',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })

});




app.get("/api/add/prod/batch",(req,res)=>{
  db.query('SELECT BatchID,ProductId,FarmID,Quantity FROM BATCH',(err,results,fields)=>{
    if(err){
      console.error(err);
      return res.status(500).json({success:false,message:'DB error'});
    }
    const columns=fields.map(field=>field.name);
    const data=results.map(row=>Object.values(row));

        res.json({success:true,columns,data});
  })

});




app.get("/api/set/transport", (req, res) => {
  db.query(`SELECT TransportationID FROM TRANSPORT WHERE Available='yes'`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
    
    
    const transportIds = results.map(row => row.TransportationID);

    res.json({ success: true, data: transportIds });
  });
});
app.get("/api/transport/listing",(req,res)=>{
  db.query(` SELECT TransportationID FROM TRANSPORT WHERE Available='no' `, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
    
    
    const transportIds = results.map(row => row.TransportationID);

    res.json({ success: true, data: transportIds });
  });

});




app.get('/api/retail', (req, res) => {
  const query = `
      SELECT 
          bw.WarehouseID,
          bw.BatchID,
          p.ProdName,
          p.Origin,
          bw.Quantity,
          b.Temprature
      FROM 
          BATCH_WAREHOUSE bw
      JOIN 
          BATCH b ON bw.BatchID = b.BatchID
      JOIN 
          PRODUCT p ON b.ProductID = p.ProductID;
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Query failed:', err);
          return res.status(500).json({ success: false, error: 'Query failed' });
      }

      res.json({
          success: true,
          data: results
      });
  });
});

app.get('/api/farm/count',(req,res)=>{
       const query=`SELECT COUNT(*) AS total_rows
                    FROM FARM
       ` ;
       db.query(query,(err,results)=>{
                if(err){
                  console.error('query failed',err);
                  return res.status(500).json({ success: false, error: 'Query failed' });
                }
                res.json({
                  success: true,
                  data: results[0].total_rows
              });
       })
});
app.get('/api/ware/count',(req,res)=>{
       const query=`SELECT COUNT(*) AS total_rows
                    FROM WAREHOUSE
       ` ;
       db.query(query,(err,results)=>{
                if(err){
                  console.error('query failed',err);
                  return res.status(500).json({ success: false, error: 'Query failed' });
                }
                res.json({
                  success: true,
                  data: results[0].total_rows
              });
       })
});
app.get('/api/batch/count',(req,res)=>{
       const query=`SELECT COUNT(*) AS total_rows
                    FROM BATCH
       ` ;
       db.query(query,(err,results)=>{
                if(err){
                  console.error('query failed',err);
                  return res.status(500).json({ success: false, error: 'Query failed' });
                }
                res.json({
                  success: true,
                  data: results[0].total_rows
              });
       })
});




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
