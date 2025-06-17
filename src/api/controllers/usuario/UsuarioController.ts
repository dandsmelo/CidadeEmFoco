import { Request, Response } from "express";
import { UsuarioService } from "../../../modules/usuario/service/UsuarioService";
import { Usuario } from "../../../modules/usuario/Usuario";
import bcrypt from "bcrypt";
import { sendVerificationCode, checkVerificationCode } from "../../../shared/twilio/twilioService";
import jwt from 'jsonwebtoken';


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
      // Aqui: buscar o telefone do usuário autenticado
      const usuario = await service.getUsuarioById(result.userId);
      if (!usuario || !usuario.telefone) {
        return res.status(400).json({ error: "Telefone não encontrado para o usuário" });
    }

    // Garante que o telefone tenha o +55 no começo
    const telefoneFormatado = usuario.telefone.startsWith('+')
    ? usuario.telefone
    : `+55${usuario.telefone}`;


    // Enviar código SMS
    await sendVerificationCode(telefoneFormatado);

    res.status(200).json({ 
      message: "Usuário logado. Código SMS enviado.", 
      needVerification: true, 
      token: result.token, 
      userId: result.userId,
      userType: result.userType,
      phoneNumber: usuario.telefone
    });
  } catch (error) {
  console.error("Erro no login:", error);
  res.status(500).json({ error: "Erro no login", details: error });
  }
  }

  public async verificarCodigoSMS(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Token não fornecido" });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "seuSegredo");

    const userId = decoded.id;

    const usuario = await service.getUsuarioById(userId);
    if (!usuario || !usuario.telefone) {
      return res.status(400).json({ success: false, message: "Telefone não encontrado" });
    }

    const { code } = req.body;

    const telefoneFormatado = usuario.telefone.startsWith('+')
    ? usuario.telefone
    : `+55${usuario.telefone}`;
    
    const validado = await checkVerificationCode(telefoneFormatado, code);


    if (validado) {
      // Gera o token final, se quiser
      const finalToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || "seuSegredo", {
        expiresIn: '7d'
      });

      res.status(200).json({ 
        success: true, 
        message: "Código verificado com sucesso",
        token: finalToken,
        userId: userId,
        userType: usuario.tipo
      });
    } else {
      res.status(400).json({ success: false, message: "Código inválido" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Erro ao verificar código" });
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

  public async enviarCodigoRedefinirSenha(req: Request, res: Response) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email é obrigatório" });
        }

        const usuario = await service.getByEmail(email);

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        if (!usuario.telefone) {
            return res.status(400).json({ message: "Telefone não cadastrado para este usuário" });
        }

        const telefoneFormatado = usuario.telefone.startsWith('+') 
            ? usuario.telefone 
            : `+55${usuario.telefone}`;

        await sendVerificationCode(telefoneFormatado);

        res.status(200).json({ message: "Código enviado com sucesso" });
    } catch (err) {
        console.error("Erro ao enviar código de redefinição de senha:", err);
        res.status(500).json({ message: "Erro ao enviar código" });
    }
  }

  public async verificarCodigoRedefinirSenha(req: Request, res: Response) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email e código são obrigatórios" });
        }

        const usuario = await service.getByEmail(email);

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        if (!usuario.telefone) {
            return res.status(400).json({ message: "Telefone não cadastrado para este usuário" });
        }

        const telefoneFormatado = usuario.telefone.startsWith('+') 
            ? usuario.telefone 
            : `+55${usuario.telefone}`;

        const validado = await checkVerificationCode(telefoneFormatado, code);

        if (validado) {
          res.status(200).json({ success: true, message: "Código verificado com sucesso" });
        } else {
          res.status(400).json({ success: false, message: "Código inválido" });
        }
    } catch (err) {
      console.error("Erro ao verificar código de redefinição de senha:", err);
      res.status(500).json({ message: "Erro ao verificar código" });
    }
  }

    public async redefinirSenha(req: Request, res: Response) {
    try {
      const { email, novaSenha } = req.body;

      const usuario = await service.getByEmail(email);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const senhaCriptografada = await bcrypt.hash(novaSenha, 5);
      const atualizado = await service.atualizarUsuario(usuario._id.toString(), {
        senha: senhaCriptografada,
      });

      if (atualizado) {
        res.status(200).json({ message: "Senha redefinida com sucesso" });
      } else {
        res.status(500).json({ message: "Erro ao atualizar senha" });
      }
    } catch (error) {
      console.error("Erro na redefinição de senha:", error);
      res.status(500).json({ message: "Erro interno" });
    }
  }


}




