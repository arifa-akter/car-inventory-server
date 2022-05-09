const express = require('express');
const { MongoClient, ServerApiVersion ,ObjectId } = require('mongodb');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const port = process.env.PORT||5000;
require('dotenv').config()
const app = express()
// middleware
app.use(cors())
app.use(express.json())
// function verifyJWT(req , res, next){
//     const authHeader = req.headers.authorization
//         console.log('inside verifyJWT',authHeader)
//         if(!authHeader){
//             return res.status(401).send({message:'your user not authorize'})
//         }
//         const token = authHeader.split(' ')[1]
//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ,(err, decoded)=>{
//             if(err){
//                 return res.status(403).send({messages:'forbiden asses'})
//             }
//            req.decoded = decoded
       
//         })
//         next()
// }


// mongodb connected
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nkpih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
     await client.connect()
     const servicesCollection = client.db("carInventory").collection("inventory")
     const addItemCollection = client.db("addItems").collection("addCar")
     const updateCollection = client.db("upDate").collection("upDateItem")
    // get all services
    app.get('/inventory' ,async(req , res)=>{
        const query ={}
        const cursor = servicesCollection.find(query)
        const services = await cursor.toArray()
        res.send(services)
    })
    // put quantity
    app.put( '/service/:id' , async(req , res)=>{
        const id = req.params.id 
        const quantityIncrease = req.body
        // console.log(quantityIncrease)
        // res.send(quantityIncrease.quantity)
        const filter = {_id: ObjectId(id)}
        const options = {upsert :true}
        // res.send(filter)
        const updateDoc ={
            $set:{
                quantity:quantityIncrease.quantity
                // quantityIncrease
            }
        }
        
        const result = await servicesCollection.updateOne(filter,updateDoc , options)
        // console.dir(result)
        res.send(result)
        
    })

    // auth
    // app.post('/login',(req,res)=>{
    //      const user = req.body
    //      const accessToken = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET, {
    //        expiresIn:'1d'
    //      })

    // })
      // get one services by id
      app.get('/service/:id',async(req , res)=>{
        const id = req.params.id
        const query = {_id:ObjectId(id)}
        const service = await servicesCollection.findOne(query)
        res.send(service)
    })
    // post update from manage inventory
    app.post('/inventory' , async(req,res)=>{
        const newAddItem = req.body;
        console.log('add new item', newAddItem)
        const result = await servicesCollection.insertOne(newAddItem)
        res.send(result)

    })
      // delete update from manage inventory
      app.delete('/inventory/:id' , async(req, res)=>{
        const id = req.params.id
        const query = {_id: ObjectId(id)}
        const result = await servicesCollection.deleteOne(query)
        res.send(result)
    })
  
    // post add item 
    app.post('/addItems' , async(req,res)=>{
        const newAddItem = req.body;
        console.log('add new item', newAddItem)
        const result = await addItemCollection.insertOne(newAddItem)
        res.send(result)

    })
    // get add item
    app.get( '/addItems',async(req , res)=>{
       const email = req.query.email
       const query ={email:email}
       const cursor = addItemCollection.find(query)
       const services = await cursor.toArray()
       res.send(services)
    })

    // delete add item form my item route 
    app.delete('/addItems/:id' , async(req, res)=>{
        const id = req.params.id
        const query = {_id: ObjectId(id)}
        const result = await addItemCollection.deleteOne(query)
        res.send(result)
    })

    // update item 
    app.post('/update' , async(req,res)=>{
        const newAddItem = req.body;
        console.log('add new item', newAddItem)
        const result = await updateCollection.insertOne(newAddItem)
        res.send(result)

    })

    app.get('/update' ,async(req , res)=>{
        const email = req.query.email
        console.log(email)
        const query ={email:email}
        const cursor = updateCollection.find(query)
        const services = await cursor.toArray()
        res.send(services)
    })

    app.delete('/update/:id' , async(req, res)=>{
        const id = req.params.id
        const query = {_id: ObjectId(id)}
        const result = await updateCollection.deleteOne(query)
        res.send(result)
    })
 
    
    }
    finally{
    
    }
    }
    run().catch(console.dir)


// checking server
app.get('/' ,(req ,res)=>{
    res.send('hello car inventory')
})
app.listen(port,()=>{
    console.log('car inventory curd operation')
})
