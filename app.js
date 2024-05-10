const express =require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser')
const mongoose=require('mongoose')

const productRoutes=require('./api/routes/products')
const orderRoutes=require('./api/routes/orders')

mongoose.connect('mongodb://vasanthrajark:'+process.env.MONGO_ATLAS_PW+'@ac-rln0kig-shard-00-00.thvry6q.mongodb.net:27017,ac-rln0kig-shard-00-01.thvry6q.mongodb.net:27017,ac-rln0kig-shard-00-02.thvry6q.mongodb.net:27017/?ssl=true&replicaSet=atlas-ym9lka-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0').then(()=>{
    console.log("connection made")
}).catch(error => console.error(error));;


app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type, Accept, Authorizationn')
    if(req.method=== 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({})
    }
    next()
})

app.use('/products',productRoutes)
app.use('/orders',orderRoutes)
app.use((req,res,next)=>{
    const error =new Error('Not found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports=app;