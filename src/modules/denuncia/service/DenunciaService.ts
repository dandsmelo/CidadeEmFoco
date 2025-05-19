import { ObjectId } from "mongodb";
import { Denuncia } from "../Denuncia";
import { DenunciaRepository } from "../repository/DenunciaRepository";
import DenunciaData from "../interfaces/DenunciaData";

export class DenunciaService {
  private repository = new DenunciaRepository();

  public async criarDenuncia(denuncia: Denuncia): Promise<ObjectId> {
    return await this.repository.criarDenuncia(denuncia.toObject());
  }

  public async listarDenuncias(): Promise<(DenunciaData & { _id: ObjectId })[]> {
    return await this.repository.listarDenuncias();
  }

  public async getDenunciaById(id: string): Promise<(DenunciaData & { _id: ObjectId }) | null> {
    return await this.repository.getDenunciaById(new ObjectId(id));
  }

  public async atualizarDenuncia(id: string, dadosAtualizados: Partial<DenunciaData>): Promise<boolean> {
    return await this.repository.atualizarDenuncia(new ObjectId(id), dadosAtualizados);
  }

  public async deletarDenuncia(id: string): Promise<boolean> {
    return await this.repository.deletarDenuncia(new ObjectId(id));
  }
}
