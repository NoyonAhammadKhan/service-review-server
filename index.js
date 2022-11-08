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



async function run(){
    try{
        const blogColloection = client.db('serviceDB').collection('blogs');
        const serviceCollection = client.db('serviceDB').collection('services')

        app.get('/blogs',async(req,res)=>{
            const query={}
            const cursor = blogColloection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs)
        })

        app.get('/services',async(req,res)=>{
            const query={}
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        })


    
    }
    finally{

    }
}


run().catch(err=>console.log(err))




app.listen(port,()=>{
    console.log(`app is listening on port ${port}`)
})

