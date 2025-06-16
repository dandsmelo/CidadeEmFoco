import { Request, Response } from "express";
import { UsuarioService } from "../../../modules/usuario/service/UsuarioService";
import { Usuario } from "../../../modules/usuario/Usuario";
import bcrypt from "bcrypt";

const service = new UsuarioService();

export class UsuarioController {
  public async criarUsuario(req: Request, res: Response) {
    try {
      const { nome, telefone, email, senha, tipo } = req.body;

      const senhaCriptografada = await bcrypt.hash(senha, 5);

      const usuario = new Usuario(nome, telefone, email, senhaCriptografada, tipo);
      const id = await service.criarUsuario(usuario);
      res.status(201).json({ message: "Usuário criado", id });
    } catch (err) {
      res.status(500).json({ message: "Erro ao criar usuário", error: err });
    }
  }

  public async listarUsuarios(req: Request, res: Response) {
    try {
      const usuarios = await service.listarUsuarios();
      res.status(200).json(usuarios);
    } catch (err) {
      res.status(500).json({ message: "Erro ao listar usuários", error: err });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;
      const result = await service.login(email, senha);
      if (!result) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
      res.status(200).json({ 
        message: "Usuário logado", 
        token: result.token, 
        userId: result.userId,
        userType: result.userType
      });
    } catch (error) {
      res.status(500).json({ error: "Erro no login" });
    }
  }

  public async atualizarSenha(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ message: "Campos obrigatórios não fornecidos" });
      }

      const sucesso = await service.atualizarSenha(id, senhaAtual, novaSenha);
      if (!sucesso) {
        return res.status(401).json({ message: "Senha atual incorreta ou nova senha inválida" });
      }

      res.status(200).json({ message: "Senha atualizada com sucesso" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao atualizar senha", error: err });
    }
  }


  public async getUsuarioById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await service.getUsuarioById(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.status(200).json(usuario);
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar usuário", error: err });
    }
  }

  public async atualizarUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await service.atualizarUsuario(id, req.body);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao atualizar usuário", error: err });
    }
  }

  public async deletarUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sucesso = await service.deletarUsuario(id);
      if (!sucesso) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.status(204).json({ message: "Usuário deletado", id });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  }
}
