import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors';


const app = express();
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
};

const connectClient = await connectToMongoDB();

const db = connectClient.db("book-nook");
const bookCollection = db.collection("books");
const borrowCollection = db.collection("my-borrow");


app.post('/add-book', async (req, res) => {
  const bookData = req.body;
  const result = await bookCollection.insertOne(bookData);
  res.send(result);
});

app.post('/my-borrow', async (req, res) => {
  const data = req.body;
  const result = await borrowCollection.insertOne(data);
  res.send(result);
});

app.patch('/book/:id', async (req, res) => {
  const { id } = req.params;

  const result = await bookCollection.updateOne(
    {
      _id: new ObjectId(id),
      totalCopies: { $gt: 0 }
    },
    {
      $inc: {
        totalCopies: -1
      }
    }
  );

  if (result.matchedCount === 0) {
    return res.status(400).send({
      message: "Book is not available"
    });
  }

  res.send({
    success: true,
    message: "Book copies updated successfully"
  });
});

app.get('/my-borrow', async (req, res) => {
  const { email, bookId } = req.query;

  const result = await borrowCollection.findOne({
    email,
    bookId
  });

  res.send({ alreadyBorrowed: !!result });
});

app.get('/all-books', async (req, res) => {
  const result = await bookCollection.find().toArray();
  res.send(result);
});

app.get('/book/:id', async (req, res) => {
  const { id } = req.params;
  const result = await bookCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});