// import { MongoClient } from "mongodb";

// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crmnext_db";
// const DB_NAME = "crmnext_db";

// let cachedClient = null;
// let cachedDb = null;

// export async function connectToDatabase() {
//   if (cachedDb) {
//     return { client: cachedClient, db: cachedDb };
//   }

//   if (!MONGO_URI) {
//     throw new Error("MongoDB connection string is missing!");
//   }

//   const client = new MongoClient(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   try {
//     await client.connect();
//     const db = client.db(DB_NAME);
//     cachedClient = client;
//     cachedDb = db;
//     console.log("✅ MongoDB Connected Successfully!");
//     return { client, db };
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error);
//     throw new Error("Failed to connect to database");
//   }
// }
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in environment variables!");
}

let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        console.log("✅ Successfully connected to MongoDB!");
        return { client, db: client.db() };
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
