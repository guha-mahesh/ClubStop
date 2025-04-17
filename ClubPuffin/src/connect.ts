import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb"; 
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";











dotenv.config({ path: "./server/config.env" });

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

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided. Please login to proceed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      error: "Authentication failed", 
      message: "The provided token is invalid or has expired. Please login again."
    });
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

//@ts-ignore
app.get("/users", verifyToken, async (req, res) => {
  try {
    const database = client.db("Puffino");
    const collection = database.collection("Users");

    const { user } = req.query;

    //@ts-ignore
    if (user && req.user.username !== user) {
      return res.status(403).json({ message: "Username does not match token" });
    }

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
app.post("/ClubCreate",verifyToken, async (req, res) => {
  const { name, description, user, school } = req.body;

  
    //@ts-ignore
    if (user && req.user.username !== user) {
      return res.status(403).json({ message: "Username does not match token" });
    }

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
    const userID = userDocument._id;

    const clubResult = await clubsCollection.insertOne({
      creator: user,
      ClubName: name,
      ClubDescription: description,
      School: school
    });

    console.log("Club created with _id:", clubResult.insertedId);

    const updateResult = await usersCollection.updateOne(
  { _id: userID },
  {
    //@ts-ignore
    $push: {
      clubs: { clubID: clubResult.insertedId, clubName: name },
      joinedClubs: { clubID: clubResult.insertedId, clubName: name }
    }
  }
);
const result2 = await clubsCollection.updateOne(
  { _id: clubResult.insertedId },
  {
    //@ts-ignore
    $push: {
      members: {
        memberUserID: userID,
        role: "Leader"
      }
    }
  }
);

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: "Club created and added to user", clubID: clubResult.insertedId });
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
app.post("/ClubRate",verifyToken, async (req, res) => {
  const { name, clubID, ascendancy, camaraderie, legacy, prestige, obligation, total, clubName } = req.body;

  //@ts-ignore
  if (name && req.user.username !== name) {
    return res.status(403).json({ message: "Username does not match token" });
  }

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


    if (!Array.isArray(clubDocument.Ratings)) {
      await clubsCollection.updateOne(
        { _id: ObjectId.createFromHexString(clubID) },
        {
          $set: {
            Ratings: []  
          }
        }
      );
    }


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

// @ts-ignore
app.post("/delete",verifyToken, async (req, res) => {
  const { collect, field, username } = req.query;


  //@ts-ignore
  if (req.user && req.user.username !== username) {
    return res.status(403).json({ message: "Username does not match token" });
  }
  if (!username || !collect) {
    console.error("Not all fields provided");
    return res.status(400).json({ message: "Bad Request: Missing username or collection" });
  }

  if (collect && typeof collect === 'string' && typeof username === 'string') {
    try {
      const database = client.db('Puffino');
      const collection = database.collection(collect);

      if (!field) {
        const result = await collection.deleteOne({ username: username });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Username not found for deletion" });
        }

        return res.status(200).json({ message: "Deletion successful" });
      } else {
        const updateResult = await collection.updateOne(
          { username: username },
          { $unset: { field: "" } }
        );

        if (updateResult.modifiedCount === 0) {
          return res.status(404).json({ message: "Field not found or no modification done" });
        }

        return res.status(200).json({ message: "Field unset successful" });
      }
    } catch (error) {
      console.error("Error during deletion or update:", error);
      return res.status(500).json({ message: "Internal Server Error: Deletion or update failed" });
    }
  } else {
    return res.status(400).json({ message: "Bad Request: Invalid data type for 'collect' or 'username'" });
  }
});

// @ts-ignore
app.post("/joinClub",verifyToken, async (req, res) => {
  const { name, ClubID } = req.body;


  //@ts-ignore
  if (req.user && req.user?.username !== name) {
    return res.status(403).json({ message: "Username does not match token" });
  }
  try {
    const database = client.db("Puffino");
    const collection = database.collection("clubs");
    const userCollection = database.collection('Users');
    console.log(ClubID);
    const filterQuery = { _id: ObjectId.createFromHexString(ClubID) };
    const filterQuery2 = { username: name };
    const clubDocument = await collection.findOne(filterQuery);
    const userDocument = await userCollection.findOne(filterQuery2);

    if (!userDocument) {
      return res.status(404).json({ message: "User not found" });
    }
    const userID = userDocument._id;

    if (!clubDocument) {
      return res.status(404).json({ message: "Club not found." });
    }
    if (!userDocument) {
      return res.status(404).json({ message: "User not found." });
    }
    if (userDocument.joinedClubs && userDocument.joinedClubs.includes(clubDocument.ClubName)) {
      return res.status(400).json({ message: "User is already a member of this club." });
    }
    const result = await userCollection.updateOne(
      { username: name },
      { //@ts-ignore
        $push: {
          joinedClubs: {
            clubName: clubDocument.ClubName,
            clubID: ClubID
          }
        }
      }
    );
    const result2 = await collection.updateOne(
      { _id: ObjectId.createFromHexString(ClubID) },
      {
        //@ts-ignore
        $push: {
          members: {
            memberUserID: userID,
            role: "member"
          }
        }
      }
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: `Successfully joined the ${clubDocument.ClubName} club.` });
    } else {
      return res.status(500).json({ message: "Failed to join the club." });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});




app.get("/randomClub", async (req, res) => {
  try {
    const database = client.db("Puffino");
    const collection = database.collection("clubs");

    const randomClub = await collection.aggregate([
      { $sample: { size: 1 } }
    ]).toArray();

    if (randomClub.length > 0) {
      res.status(200).json({ _id: randomClub[0]._id });
    } else {
      res.status(404).json({ message: "No clubs found" });
    }
  } catch (e) {
    console.error("Error fetching random club:", e);
    res.status(500).json({ message: "Failed to retrieve random club" });
  }
});