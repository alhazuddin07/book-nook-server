import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors';


const app = express();
const PORT = 5000

app.use(express.json({ limit: "5mb" }));
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


const verifyToken = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  console.log(authHeaders);

  if (authHeaders !== 'user logged in') {
    return res.status(401).send({ msg: 'Unauthorized' });
  };

  console.log('I am middleware');

  next();

};


app.post('/add-book', async (req, res) => {
  const bookData = req.body;
  const result = await bookCollection.insertOne(bookData);
  res.send(result);
});

app.get('/my-books', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const result = await bookCollection
    .find({ userEmail: email })
    .sort({ _id: -1 })
    .toArray();

  res.send(result);
});

app.post('/my-borrow', async (req, res) => {
  const data = req.body;
  const { email, bookId } = data;

  if (!email || !bookId) {
    return res.status(400).send({ message: "Email and book id are required" });
  }

  if (!ObjectId.isValid(bookId)) {
    return res.status(400).send({ message: "Invalid book id" });
  }

  const alreadyBorrowed = await borrowCollection.findOne({ email, bookId });

  if (alreadyBorrowed) {
    return res.status(409).send({
      message: "You have already borrowed this book. Return it before borrowing again.",
    });
  }

  const updateResult = await bookCollection.updateOne(
    {
      _id: new ObjectId(bookId),
      totalCopies: { $gt: 0 },
    },
    {
      $inc: { totalCopies: -1 },
    }
  );

  if (updateResult.matchedCount === 0) {
    return res.status(400).send({
      message: "This book is not available right now.",
    });
  }

  try {
    const result = await borrowCollection.insertOne(data);
    const book = await bookCollection.findOne({ _id: new ObjectId(bookId) });

    res.send({
      success: true,
      insertedId: result.insertedId,
      remainingCopies: book?.totalCopies ?? 0,
    });
  } catch (error) {
    // Put the copy back if the borrow record could not be saved.
    await bookCollection.updateOne(
      { _id: new ObjectId(bookId) },
      { $inc: { totalCopies: 1 } }
    );

    res.status(500).send({
      message: "Could not save this borrow. Please try again.",
    });
  }
});

app.put('/book/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid book id" });
  }

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const updates = {};

  for (const field of ["title", "author", "category", "description"]) {
    if (typeof req.body[field] === "string" && req.body[field].trim()) {
      updates[field] = req.body[field].trim();
    }
  }

  if (req.body.totalCopies !== undefined) {
    const totalCopies = Number(req.body.totalCopies);

    if (!Number.isInteger(totalCopies) || totalCopies < 0) {
      return res.status(400).send({
        message: "Available copies must be zero or more",
      });
    }

    updates.totalCopies = totalCopies;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ message: "No valid fields to update" });
  }

  const result = await bookCollection.updateOne(
    { _id: new ObjectId(id), userEmail: email },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return res.status(404).send({ message: "Book not found" });
  }

  const book = await bookCollection.findOne({ _id: new ObjectId(id) });
  res.send(book);
});

app.delete('/book/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid book id" });
  }

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const result = await bookCollection.deleteOne({
    _id: new ObjectId(id),
    userEmail: email,
  });

  if (result.deletedCount === 0) {
    return res.status(404).send({ message: "Book not found" });
  }

  res.send({ success: true });
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

app.get('/my-borrows', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const result = await borrowCollection
    .find({ email })
    .sort({ bookinDate: -1 })
    .toArray();

  res.send(result);
});

app.delete('/my-borrows/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid borrow id" });
  }

  const borrow = await borrowCollection.findOne({ _id: new ObjectId(id) });

  if (!borrow) {
    return res.status(404).send({ message: "Borrow record not found" });
  }

  const deleteResult = await borrowCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (deleteResult.deletedCount === 0) {
    return res.status(404).send({ message: "Borrow record not found" });
  }

  let remainingCopies = null;

  if (ObjectId.isValid(borrow.bookId)) {
    await bookCollection.updateOne(
      { _id: new ObjectId(borrow.bookId) },
      { $inc: { totalCopies: 1 } }
    );

    const book = await bookCollection.findOne({
      _id: new ObjectId(borrow.bookId),
    });

    remainingCopies = book?.totalCopies ?? null;
  }

  res.send({
    success: true,
    bookId: borrow.bookId,
    remainingCopies,
  });
});

app.get('/all-books', async (req, res) => {
  const result = await bookCollection.find().toArray();
  res.send(result);
});

app.get('/book/:id', verifyToken, async (req, res) => {
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