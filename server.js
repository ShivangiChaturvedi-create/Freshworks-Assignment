const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
//Environment Variables
const port = 3000;
const db = './db.json';

// Routes
app.get('/', (req, res) => {
    res.status(200).send({message: "Backend-Project"})
});

// getting all the data
app.get('/get', (req,res)=>{
    fs.readFile(db, (err, data)=>{
        if(err){
            res.status(500).send({message: err})
        }
        if(!data){
            res.status(404).send({message: "Not Found"})
        }
        if(data){
            res.status(200).send(JSON.parse(data));
        }
    })
})
//getting a specific data
app.get('/get/:id', (req,res)=>{
    fs.readFile(db, (err,data)=>{
        if(err){
            res.status(500).send({message: err})
        }
        if(!data){
            res.status(404).send({message: "Not Found"})
        }
        if(data){
            var jsonData = JSON.parse(data)

            res.status(200).send({"message":jsonData.data[req.params.id]});
        }
    })
})

app.post('/create',(req,res)=>{
    fs.readFile(db, (err,data)=>{
        if(err){
            res.status(500).send({message: err})
        }
        if(!data){
            res.status(404).send({message: "Not Found"})
        }
        if(data){
            let dataJson = JSON.parse(data);
            var pointer = Object.keys(dataJson.data).length +1;
            dataJson.data[pointer] = {"name":req.body.name};
            fs.writeFile(db,JSON.stringify(dataJson), (err)=>{
                if(err){
                    res.status(500).send({err: err})
                }
                if(!err){
                    res.status(200).send({message: "Added Successfully"})
                }
            })
        }
    })
})

app.post("/update/:id",(req,res)=>{
    fs.readFile(db, (err, data)=>{
            if(err){
                res.status(500).send({message: err})
            }
            if(!data){
                res.status(404).send({message: "Not Found"})
            }
            if(data){
                let jsonData = JSON.parse(data);
                if(!jsonData.data[req.params.id]){
                    res.status(404).send({message: "No data found for the corrsponding id"})
                    return;
                }
                jsonData.data[req.params.id] = {"name": req.body.name};
                fs.writeFile(db, JSON.stringify(jsonData), (err)=>{
                    if(err){
                        res.status(500).send({err: err})
                    }
                    res.status(200).send({message:"success"});
                })
            }
    })

})
app.get("/delete/:id",(req,res)=>{
    fs.readFile(db, (err, data)=>{
        if(err){
            res.status(500).send({message: err})
        }
        if(!data){
            res.status(404).send({message: "Not Found"})
        }
        if(data){
            let jsonData = JSON.parse(data)
            if(!jsonData.data[req.params.id]){
                res.status(404).send({message:"Id provided is invalid"})
                return;
            }
            delete jsonData.data[req.params.id]
            fs.writeFile(db, JSON.stringify(jsonData), (err)=>{
                if(err){
                    res.status(500).send({err: err})
                }
                res.status(200).send({message:"successfully deleted"});
            })
        }
    })
})


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});