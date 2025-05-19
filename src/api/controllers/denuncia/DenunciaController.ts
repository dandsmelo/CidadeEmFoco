import { Request, Response } from "express";
import { Denuncia } from "../../../modules/denuncia/Denuncia";
import { DenunciaService } from "../../../modules/denuncia/service/DenunciaService";

const service = new DenunciaService();

export class DenunciaController {
  public async criarDenuncia(req: Request, res: Response) {
    try {
      const { titulo, data, status, imagem, descricao, categoria, local } = req.body;

      const denuncia = new Denuncia(titulo, new Date(data), status, imagem, descricao, categoria, local);

      const id = await service.criarDenuncia(denuncia);
      res.status(201).json({ message: "Denúncia criada com sucesso", id });
    } catch (err) {
      res.status(500).json({ message: "Erro ao criar denúncia", error: err });
    }
  }

  public async listarDenuncias(req: Request, res: Response) {
    try {
      const denuncias = await service.listarDenuncias();
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

  public async atualizarDenuncia(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const denuncia = await service.atualizarDenuncia(id, req.body);
      if (!denuncia) {
        return res.status(404).json({ message: "Denúncia não encontrada" });
      }
      res.status(200).json({ message: "Denúncia atualizada com sucesso" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao atualizar denúncia", error: err });
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
}
