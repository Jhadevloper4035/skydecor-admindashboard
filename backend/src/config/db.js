const mongoose = require("mongoose");

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DBNAME,
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: false,
    });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

async function closeDB() {
  await mongoose.connection.close();
  console.log("🔌 Mongoose connection closed");
}

module.exports = { ConnectDB, closeDB };
