import { Router } from "express";
import { DenunciaController } from "../../controllers/denuncia";

const denunciaController = new DenunciaController();
const denunciaRoutes = Router();

denunciaRoutes.post("/", async (req, res) => {
    await denunciaController.criarDenuncia(req, res);
});
  
denunciaRoutes.get("/", async (req, res) => {
    await denunciaController.listarDenuncias(req, res);
});
  
denunciaRoutes.get("/:id", async (req, res) => {
    await denunciaController.getDenunciaById(req, res);
});
  
denunciaRoutes.put("/:id", async (req, res) => {
    await denunciaController.atualizarDenuncia(req, res);
});
  
denunciaRoutes.delete("/:id", async (req, res) => {
    await denunciaController.deletarDenuncia(req, res);
});


export default denunciaRoutes;
