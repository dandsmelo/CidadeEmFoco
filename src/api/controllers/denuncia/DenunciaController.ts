import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Denuncia } from "../../../modules/denuncia/Denuncia";
import { DenunciaService } from "../../../modules/denuncia/service/DenunciaService";
import { geocodeAddress } from "../../../modules/denuncia/service/geocodeAddress/geocodeAddress";

const service = new DenunciaService();

export class DenunciaController {
  
  public async criarDenuncia(req: Request, res: Response) {
    try {
      const { titulo, data, status, descricao, categoria, local, feedback } = req.body;
      const usuario = (req as any).user;

      if (!usuario?.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const imagem = req.file ? `/uploads/${req.file.filename}` : undefined;
      const usuarioId = new ObjectId(usuario.id);

      const { latitude, longitude } = await geocodeAddress(local);

      const denuncia = new Denuncia(
        titulo,
        new Date(data),
        status,
        descricao,
        categoria,
        local,
        usuarioId,
        imagem,
        feedback,
        latitude,
        longitude
      );

      const id = await service.criarDenuncia(denuncia);
      return res.status(201).json({ message: "Denúncia criada com sucesso", id });

    } catch (err) {
      return res.status(500).json({ message: "Erro ao criar denúncia", error: err });
    }
  }



  public async listarDenuncias(req: Request, res: Response) {
    try {
      const filtros = {
        categoria: req.query.categoria ? String(req.query.categoria).split(",") : undefined,
        status: req.query.status ? String(req.query.status).split(",") : undefined,
        dataInicio: req.query.dataInicio as string,
        dataFim: req.query.dataFim as string,
        ordem: req.query.ordem as string,
      };

      const denuncias = await service.listarDenuncias(filtros);
      res.status(200).json(denuncias);
    } catch (err) {
      res.status(500).json({ message: "Erro ao listar denúncias", error: err });
    }
  }

  public async getDenunciaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const denuncia = await service.getDenunciaById(id);
      if (!denuncia) {
        return res.status(404).json({ message: "Denúncia não encontrada" });
      }
      res.status(200).json(denuncia);
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar denúncia", error: err });
    }
  }

  public async getDenunciasByUsuarioId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const filtros = {
        categoria: req.query.categoria ? String(req.query.categoria).split(",") : undefined,
        status: req.query.status ? String(req.query.status).split(",") : undefined,
        dataInicio: req.query.dataInicio as string,
        dataFim: req.query.dataFim as string,
        ordem: req.query.ordem as string,
      };

      const denuncias = await service.getDenunciasByUsuarioId(userId, filtros);
      if (denuncias.length === 0) {
        return res.status(404).json({ message: "Nenhuma denúncia encontrada para este usuário." });
      }
      res.status(200).json(denuncias);
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar denúncias do usuário", error: err });
    }
  }

  public async atualizarDenuncia(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const dadosAtualizados: any = {
        ...req.body,
      };

      if (req.file) {
        dadosAtualizados.imagem = `/uploads/${req.file.filename}`;
      }

      if (dadosAtualizados.data) {
        dadosAtualizados.data = new Date(dadosAtualizados.data);
      }

      const atualizado = await service.atualizarDenuncia(id, dadosAtualizados);

      if (!atualizado) {
        return res.status(404).json({ message: "Denúncia não encontrada" });
      }

      return res.status(200).json({ message: "Denúncia atualizada com sucesso" });

    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar denúncia", error: err });
    }
  }



  public async deletarDenuncia(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const denuncia = await service.deletarDenuncia(id);
      if (!denuncia) {
        return res.status(404).json({ message: "Denúncia não encontrada" });
      }
      res.status(200).json({ message: "Denúncia deletada com sucesso" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao deletar denúncia", error: err });
    }
  }

  public async getDenunciaCountByUsuarioId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const denunciaCount = await service.getDenunciaCountByUsuarioId(userId);

      return res.status(200).json(denunciaCount);
    } catch (err) {
      return res.status(500).json({
        message: "Erro ao obter estatísticas do usuário",
        error: err
      });
    }
  }

  public async getResumoGeral(req: Request, res: Response) {
    try {
      const service = new DenunciaService();
      const resumo = await service.getResumoGeral();
      return res.status(200).json(resumo);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao gerar resumo geral" });
    }
  }
}
