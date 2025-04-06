import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb"; // Import ObjectId correctly
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  connectDB();
});

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


app.post("/Signin", async (req, res) => {
  const { user, pwd } = req.body;

  try {
    const database = client.db("Puffino");
    const collection = database.collection("Users");

    const filterQuery = { username: user };
    const document = await collection.findOne(filterQuery);

    if (document) {
      const isMatch = await bcrypt.compare(pwd, document.password);
      if (isMatch) {
        const token = jwt.sign({ username: document.username, id: document._id }, SECRET_KEY, { expiresIn: "12h" });
        res.status(200).json({
          message: "Login Successful",
          token,
          username: document.username,
        });
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    } else {
      res.status(401).json({ message: "Invalid Username" });
    }
  } catch (e) {
    console.error("Error Signing In:", e);
    res.status(500).json({ message: "Sign In failed" });
  }
});


app.get("/users", async (req, res) => {
  try {
    const database = client.db("Puffino");
    const collection = database.collection("Users");

    const { user } = req.query;

    if (user) {
      const userData = await collection.find({ username: user }).toArray();
      if (userData.length > 0) {
        res.status(200).json(userData[0]);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      const users = await collection.find({}).toArray();
      res.status(200).json(users);
    }
  } catch (e) {
    console.error("Error fetching users:", e);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
});

// @ts-ignore
app.post("/ClubCreate", async (req, res) => {
  const { name, description, user } = req.body;

  if (!name || !description || !user) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const database = client.db("Puffino");
    const clubsCollection = database.collection("clubs");
    const usersCollection = database.collection("Users");

    const filterQuery = { username: user };
    const userDocument = await usersCollection.findOne(filterQuery);

    if (!userDocument) {
      return res.status(404).json({ message: "User not found" });
    }

    const clubResult = await clubsCollection.insertOne({
      creator: user,
      ClubName: name,
      ClubDescription: description,
    });

    console.log("Club created with _id:", clubResult.insertedId);

    const updateResult = await usersCollection.updateOne(
      { username: user },
      //@ts-ignore
      { $push: { clubs: { clubId: clubResult.insertedId, clubName: name } } }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: "Club created and added to user", clubId: clubResult.insertedId });
    } else {
      res.status(500).json({ message: "Failed to add club to user" });
    }
  } catch (e) {
    console.error("Error Creating Club", e);
    res.status(500).json({ message: "Creation failed" });
  }
});


app.get("/clubs", async (req, res) => {
  try {
    const database = client.db("Puffino");
    const collection = database.collection("clubs");

    const { club, name } = req.query;

    let query = {};

    if (club) {
      //@ts-ignore
      query = { _id: ObjectId.createFromHexString(club) }; 
    } else if (name) {
      query = { name: name };
    }

    if (Object.keys(query).length > 0) {
      const clubData = await collection.findOne(query);
      if (clubData) {
        res.status(200).json(clubData);
      } else {
        res.status(404).json({ message: "Club not found" });
      }
    } else {
      const clubs = await collection.find({}).toArray();
      res.status(200).json(clubs);
    }
  } catch (e) {
    console.error("Error fetching club:", e);
    res.status(500).json({ message: "Failed to retrieve club" });
  }
});
// @ts-ignore
app.post("/ClubRate", async (req, res) => {
  const { name, clubID, ascendancy, camaraderie, legacy, prestige, obligation, total, clubName } = req.body;

  if (!name || !total || !clubID || !ascendancy || !camaraderie || !prestige || !obligation || !legacy || !clubName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const database = client.db("Puffino");
    const clubsCollection = database.collection("clubs");
    const usersCollection = database.collection("Users");

    const filterQuery = { username: name };
    const filterQuery2 = { _id: ObjectId.createFromHexString(clubID) };
    const userDocument = await usersCollection.findOne(filterQuery);
    const clubDocument = await clubsCollection.findOne(filterQuery2);

    if (!userDocument) {
      return res.status(404).json({ message: "User not found" });
    } else if (!clubDocument) {
      return res.status(404).json({ message: "Club not found" });
    }

    // If Ratings is not an array, we need to replace it with an empty array
    if (!Array.isArray(clubDocument.Ratings)) {
      await clubsCollection.updateOne(
        { _id: ObjectId.createFromHexString(clubID) },
        {
          $set: {
            Ratings: []  // Initialize Ratings as an array if it is not already an array
          }
        }
      );
    }

    // Now push the new rating into the Ratings array
    const clubRateResult = await clubsCollection.updateOne(
      { _id: ObjectId.createFromHexString(clubID) },
      {
        // @ts-ignore
        $push: {
          Ratings: {
            camaraderie: parseFloat(camaraderie),
            ascendancy: parseFloat(ascendancy),
            prestige: parseFloat(prestige),
            obligation: parseFloat(obligation),
            legacy: parseFloat(legacy),
            total: parseFloat(total),
          },
        },
      }
    );

    console.log("Club rated with _id:", clubRateResult.modifiedCount);

    const updateRateResult = await usersCollection.updateOne(
      { username: name },
      // @ts-ignore
      { $push: { Ratedclubs: { clubName: clubName, clubID: clubID } } }
    );

    if (updateRateResult.modifiedCount > 0) {
      res.status(200).json({ message: "Club rated and added to user", clubId: clubID });
    } else {
      res.status(500).json({ message: "Failed to add club to user" });
    }
  } catch (e) {
    console.error("Error Creating Club", e);
    res.status(500).json({ message: "Creation failed" });
  }
});
