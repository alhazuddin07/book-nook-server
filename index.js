import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors';


const app = express()
const PORT = 5000

app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectClient = await connectToMongoDB();

const db = connectClient.db("book-nook");
const bookCollection = db.collection("books");


app.post('/add-book', async( req, res )=> {
  const bookData = req.body;
  const result = await bookCollection.insertOne(bookData);
  res.send(result)
});

app.get('/all-books', async(req, res)=> {
  const result = await bookCollection.find().toArray();
  res.send(result);
});

app.get('/book/:id', async(req, res)=> {
  const {id} = req.params;
  const result = await bookCollection.findOne({_id: new ObjectId(id)});
  res.send(result);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});