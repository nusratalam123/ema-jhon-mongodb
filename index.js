const express = require('express')
const bodyParser = require('body-parser')
const cors= require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()

app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fzj7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = 5000

app.get('/', (req, res) => {
  res.send("hello from heroku its working well")
})

//const password="emaWatson123"



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");
  console.log('database connected')

  app.post('/addProduct',(req, res) => {

    const products=req.body;
    productsCollection.insertMany(products)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })

app.get('/products',(req, res) => {
  //productsCollection.find({}).limit(20)
  productsCollection.find({})
  .toArray((err,documents) => {
    res.send(documents);
  })
})


app.get('/products/:key',(req, res) => {
  productsCollection.find({key:req.params.key})
  .toArray((err,documents) => {
    res.send(documents[0]);
  })
})


app.post('/productByKey',(req, res) => {
  const productKeys=req.body;
  productsCollection.find({key:{$in:productKeys}})
  .toArray((err,documents) => {
    res.send(documents);
  })
})


app.post('/addOrder',(req, res) => {

  const order=req.body;
  ordersCollection.insertOnehero(order)
  .then(result => {
    console.log(result.insertedCount);
    res.send(result.insertedCount>0)
  })
})

 
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT||port)