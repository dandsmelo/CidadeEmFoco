import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDb = async () => {
    try {
      const uri = process.env.MONGO_URI as string;
      await mongoose.connect(uri);
      console.log("MongoDb conectado");
    } catch (error) {
      console.error("Erro ao conectar ao MongoDB:", error);
      process.exit(1);
    }
  };