import express from "express";
import denunciaRoutes from "./denuncia";

const app = express();
app.use(express.json());

app.use("/denuncia", denunciaRoutes)

export default app;