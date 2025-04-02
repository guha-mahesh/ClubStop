import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

dotenv.config({ path: "./config.env" });

const Db: string = process.env.ATLAS_URI || "";
const client = new MongoClient(Db);
const app = express();
const port = process.env.PORT || 5000;

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST",
  credentials: true,
}));

app.use(bodyParser.json());


export async function connectDB(): Promise<void> {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("MongoDB connection error:", e);
  }
}


export async function insertData(collectionName: string, data: Record<string, any>): Promise<void> {
  try {
    const database = client.db("Puffino");
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(data);
    console.log(`Data inserted with _id: ${result.insertedId}`);
  } catch (e) {
    console.error("Error inserting data:", e);
  }
}




// @ts-ignore
app.post("/register", async (req, res) => {
  const { user, pwd } = req.body;

  try {
    const database = client.db("Puffino");
    const collection = database.collection("Users");

    const filterQuery = { username: user };
    const document = await collection.findOne(filterQuery);

    if (document) {
    return res.status(409).json({ message: "Username Taken" });
    } 

  

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

   

    const result = await collection.insertOne({ username: user, password: hashedPassword });
    console.log("User registered with _id:", result.insertedId);

    res.status(200).json({ message: "Registration successful" });
  } catch (e) {
    console.error("Error registering user:", e);
    res.status(500).json({ message: "Registration failed" });
  }
});

// @ts-ignore
app.post("/Signin", async (req, res) => {
  const { user, pwd } = req.body;

  try {
    const database = client.db("Puffino");
    const collection = database.collection("Users");

    const filterQuery = { username: user };
const document = await collection.findOne(filterQuery);

if (document) {
  const isMatch = await bcrypt.compare(pwd, document.password)
  if (isMatch) {
    const token = jwt.sign({ username: document.username }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: user,
      username: document.username,
      token,
     });
  } else {
    res.status(401).json({ 
      message: "Invalid Password" });
  }
} else {
  res.status(401).json({ message: "Invalid Username"});
}

  } catch (e) {
    console.error("Error Signing In:", e);
    res.status(500).json({ message: "Sign In failed" });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  connectDB();
});
