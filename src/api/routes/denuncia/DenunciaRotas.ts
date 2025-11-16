import { Router } from "express";
import { DenunciaController } from "../../controllers/denuncia/DenunciaController";
import { autenticarToken } from "../../middlewares/authMiddleware";
import { upload } from "../../../config/multerConfig";

const denunciaController = new DenunciaController();
const denunciaRoutes = Router();

denunciaRoutes.post("/", autenticarToken, upload.single("imagem"), (req, res) => {
  denunciaController.criarDenuncia(req, res);
});

denunciaRoutes.get("/", autenticarToken, async (req, res) => {
    await denunciaController.listarDenuncias(req, res);
});
  
denunciaRoutes.get("/:id", autenticarToken, async (req, res) => {
    await denunciaController.getDenunciaById(req, res);
});

denunciaRoutes.get("/usuario/:userId", autenticarToken, async (req, res) => {
    await denunciaController.getDenunciasByUsuarioId(req, res);
})
  
denunciaRoutes.put("/:id", autenticarToken, upload.single("imagem"), (req, res) => {
  denunciaController.atualizarDenuncia(req, res);
});
  
denunciaRoutes.delete("/:id", autenticarToken, async (req, res) => {
    await denunciaController.deletarDenuncia(req, res);
});

export default denunciaRoutes;
