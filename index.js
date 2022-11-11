const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt =require('jsonwebtoken')
require('dotenv').config();


const app=express()

//middle wares
app.use(cors())
app.use(express.json())



app.get('/',(req,res)=>{
    res.send('this is server side')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4hum0hz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({'message':'unothorized access'})
    }
    const token=authHeader.split(' ')[1];

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err, decoded){
        if(err){
            res.status(403).send({'message':'unauthorized access'})
        }
        req.decoded = decoded;
        next();
    })
    
}



async function run(){
    try{
        const blogColloection = client.db('serviceDB').collection('blogs');
        const serviceCollection = client.db('serviceDB').collection('services');
        const reviewCollection = client.db('serviceDB').collection('reviews')
        app.get('/blogs',async(req,res)=>{
            const query={}
            const cursor = blogColloection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs)
        })

        app.get('/services',async(req,res)=>{
            const query={}
            const cursor = serviceCollection.find({});
            console.log(req.query)
            if(req.query.dataAmount){
                let services = await cursor.limit(parseInt(req.query.dataAmount)).toArray();
                return res.send(services)
            }else{
                let services = await cursor.toArray();
                return res.send(services)
            }
        })

        app.post('/services',async(req,res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;

            console.log(id)
            const query={_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })

        app.get('/reviews/:serviceId',async(req,res)=>{
            const sid = (req.params.serviceId);
            console.log(sid);
            const query = {serviceId:sid}
            const cursor =  reviewCollection.find(query);
            const reviews =await cursor.toArray();
            res.send(reviews);
        })
    
    }

    finally{

    }
}


run().catch(err=>console.log(err))




app.listen(port,()=>{
    console.log(`app is listening on port ${port}`)
})

