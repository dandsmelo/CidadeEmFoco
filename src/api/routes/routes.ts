import express from "express";
import denunciaRoutes from "./denuncia/DenunciaRotas";
import usuarioRoutes from "./usuario/UsuarioRotas";

const app = express();
app.use(express.json());

app.use("/denuncia", denunciaRoutes);
app.use("/usuario", usuarioRoutes);

export default app;
