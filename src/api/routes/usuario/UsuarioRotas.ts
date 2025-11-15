import { Router } from "express";
import { UsuarioController } from "../../controllers/usuario/UsuarioController";
import { autenticarToken } from "../../middlewares/authMiddleware";
import { upload } from "../../../config/multerConfig";

const usuarioController = new UsuarioController();
const usuarioRoutes = Router();

usuarioRoutes.post("/", upload.single("fotoPerfil"),async (req, res) => {
    await usuarioController.criarUsuario(req, res);
});

usuarioRoutes.post("/login", async (req, res) => {
    await usuarioController.login(req, res);
});

usuarioRoutes.get("/", autenticarToken, async (req, res) => {
    await usuarioController.listarUsuarios(req, res);
})

usuarioRoutes.put("/:id/senha", autenticarToken, async (req, res) => {
    await usuarioController.atualizarSenha(req, res);
});

usuarioRoutes.get("/:id", autenticarToken, async (req, res) => {
    await usuarioController.getUsuarioById(req, res);
});

usuarioRoutes.put("/:id", autenticarToken, async (req, res) => {
    await usuarioController.atualizarUsuario(req, res);
});

usuarioRoutes.delete("/:id", autenticarToken, async (req, res) => {
    await usuarioController.deletarUsuario(req, res);
})

usuarioRoutes.post("/verificar-sms", async (req, res) => {
  await usuarioController.verificarCodigoSMS(req, res);
});

usuarioRoutes.post("/enviarCodigoRedefinirSenha", async (req, res) => {
  await usuarioController.enviarCodigoRedefinirSenha(req, res);
});

usuarioRoutes.post("/verificar-sms-redefinirSenha", async (req, res) => {
  await usuarioController.verificarCodigoRedefinirSenha(req, res);
});

usuarioRoutes.post("/redefinir-senha", async (req, res) => {
  await usuarioController.redefinirSenha(req, res);
});

usuarioRoutes.put("/:id/foto", autenticarToken, upload.single("fotoPerfil"), async (req, res) => {
    await usuarioController.atualizarFotoPerfil(req, res);
});

export default usuarioRoutes;
