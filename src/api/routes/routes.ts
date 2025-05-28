import express from "express";
import denunciaRoutes from "./denuncia/DenunciaRotas";
import usuarioRoutes from "./usuario/UsuarioRotas";

const router = express.Router();

router.use("/denuncia", denunciaRoutes);
router.use("/usuario", usuarioRoutes);

export default router;
