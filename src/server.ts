/// <reference path="./types/index.d.ts" />
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectDb } from "./config/db";
import routes from "./api/routes/routes";
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path'; 
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    console.log(`Criando diretório de uploads em: ${UPLOAD_DIR}`);
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors({
  origin: 'http://localhost:8081',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());

app.use('/uploads', express.static(UPLOAD_DIR));

app.use("/", routes);

connectDb();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
