import { ObjectId } from "mongodb";
import { Denuncia } from "../Denuncia";
import { DenunciaRepository } from "../repository/DenunciaRepository";
import DenunciaData from "../interfaces/DenunciaData";
import { DenunciaFilter } from "../interfaces/DenunciaFilter";

export class DenunciaService {
  private repository = new DenunciaRepository();

  public async criarDenuncia(denuncia: Denuncia): Promise<ObjectId> {
    return await this.repository.criarDenuncia(denuncia.toObject());
  }

  public async listarDenuncias(filtros: DenunciaFilter): Promise<(DenunciaData & { _id: ObjectId })[]> {
    return await this.repository.listarDenuncias(filtros);
  }

  public async getDenunciaById(id: string): Promise<(DenunciaData & { _id: ObjectId }) | null> {
    return await this.repository.getDenunciaById(new ObjectId(id));
  }

  public async getDenunciasByUsuarioId(usuarioId: string, filtros: DenunciaFilter): Promise<(DenunciaData & { _id: ObjectId })[]> {
    return await this.repository.getDenunciasByUsuarioId(new ObjectId(usuarioId), filtros);
  }

  public async atualizarDenuncia(id: string, dadosAtualizados: Partial<DenunciaData>): Promise<boolean> {
    const denunciaId = new ObjectId(id);

    const denunciaExistente = await this.repository.getDenunciaById(denunciaId);
    if (!denunciaExistente) {
      throw new Error("Denúncia não encontrada");
    }
    if (!dadosAtualizados.imagem) {
      dadosAtualizados.imagem = denunciaExistente.imagem;
    }

    return await this.repository.atualizarDenuncia(denunciaId, dadosAtualizados);
  }


  public async deletarDenuncia(id: string): Promise<boolean> {
    return await this.repository.deletarDenuncia(new ObjectId(id));
  }
}
