import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: "./config.env" });

const Db: string = process.env.ATLAS_URI || "";
const client = new MongoClient(Db);
const app = express();
const port = process.env.PORT || 5000;


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


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  connectDB();
});
