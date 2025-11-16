import { Router } from "express";
import { DenunciaController } from "../../controllers/denuncia/DenunciaController";
import { autenticarToken } from "../../middlewares/authMiddleware";
import { upload } from "../../../config/multerConfig";

const denunciaController = new DenunciaController();
const denunciaRoutes = Router();

denunciaRoutes.post(
  "/",
  autenticarToken,
  upload.single("imagem"),
  async (req, res, next) => {
    try {
      await denunciaController.criarDenuncia(req, res);
    } catch (err) {
      next(err);
    }
  }
);

denunciaRoutes.get(
  "/",
  autenticarToken,
  async (req, res, next) => {
    try {
      await denunciaController.listarDenuncias(req, res);
    } catch (err) {
      next(err);
    }
  }
);

denunciaRoutes.get(
  "/usuario/:userId",
  autenticarToken,
  async (req, res, next) => {
    try {
      await denunciaController.getDenunciasByUsuarioId(req, res);
    } catch (err) {
      next(err);
    }
  }
);

denunciaRoutes.get(
  "/:id",
  autenticarToken,
  async (req, res, next) => {
    try {
      await denunciaController.getDenunciaById(req, res);
    } catch (err) {
      next(err);
    }
  }
);


denunciaRoutes.put(
  "/:id",
  autenticarToken,
  upload.single("imagem"),
  async (req, res, next) => {
    try {
      await denunciaController.atualizarDenuncia(req, res);
    } catch (err) {
      next(err);
    }
  }
);

denunciaRoutes.delete(
  "/:id",
  autenticarToken,
  async (req, res, next) => {
    try {
      await denunciaController.deletarDenuncia(req, res);
    } catch (err) {
      next(err);
    }
  }
);

export default denunciaRoutes;
