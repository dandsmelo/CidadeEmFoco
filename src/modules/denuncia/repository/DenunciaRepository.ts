import { ObjectId } from "mongodb";
import DenunciaData from "../interfaces/DenunciaData";
import { client } from "../../../config/db";
import { DenunciaFilter } from "../interfaces/DenunciaFilter";

export class DenunciaRepository {
  private collectionName = "denuncias";

  private getCollection() {
    return client.db("CidadeEmFoco").collection<DenunciaData>(this.collectionName);
  }

  public async criarDenuncia(data: DenunciaData): Promise<ObjectId> {
    const result = await this.getCollection().insertOne(data);
    return result.insertedId;
  }

  public async listarDenuncias(filtros: DenunciaFilter): Promise<(DenunciaData & { _id: ObjectId })[]> {
    const query: any = {};

    if (filtros.categoria?.length) query.categoria = { $in: filtros.categoria };
    if (filtros.status?.length) query.status = { $in: filtros.status };

    if (filtros.dataInicio || filtros.dataFim) {
      query.data = {};
      if (filtros.dataInicio) query.data.$gte = new Date(filtros.dataInicio);
      if (filtros.dataFim) query.data.$lte = new Date(filtros.dataFim);
    }

    const sort = this.getOrder(filtros.ordem);

    return await this.getCollection().find(query).sort(sort).toArray();
  }

  public async getDenunciaById(id: ObjectId): Promise<(DenunciaData & { _id: ObjectId }) | null> {
    const doc = await this.getCollection().findOne({ _id: id });
    if (!doc) {
      return null;
    }
    return { ...doc, _id: id };
  }

  public async getDenunciasByUsuarioId(usuarioId: ObjectId, filtros: DenunciaFilter): Promise<(DenunciaData & { _id: ObjectId })[]> {
    const query: any = { usuarioId };

    if (filtros.categoria?.length) query.categoria = { $in: filtros.categoria };
    if (filtros.status?.length) query.status = { $in: filtros.status };

    if (filtros.dataInicio || filtros.dataFim) {
      query.data = {};
      if (filtros.dataInicio) query.data.$gte = new Date(filtros.dataInicio);
      if (filtros.dataFim) query.data.$lte = new Date(filtros.dataFim);
    }

    const sort = this.getOrder(filtros.ordem);

    return await this.getCollection().find(query).sort(sort).toArray();
  }

  public async atualizarDenuncia(id: ObjectId, dados: Partial<DenunciaData>): Promise<boolean> {
    const result = await this.getCollection().updateOne({ _id: id }, { $set: dados });
    return result.modifiedCount > 0;
  }

  public async deletarDenuncia(id: ObjectId): Promise<boolean> {
    const result = await this.getCollection().deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  public async getDenunciaCountByUsuarioId(usuarioId: ObjectId) {
    const collection = this.getCollection();

    const resultado = await collection.aggregate([
      { $match: { usuarioId } },
      { $group: { _id: "$status", total: { $sum: 1 } } }
    ]).toArray();

    const contagemPadrao: any = {
      pendente: 0,
      em_analise: 0,
      em_andamento: 0,
      resolvida: 0,
      rejeitada: 0
    };

    for (const item of resultado) {
      const key = item._id.toLowerCase().replace(" ", "_");
      contagemPadrao[key] = item.total;
    }

    const total = resultado.reduce((sum, item) => sum + item.total, 0);

    return {
      total,
      porStatus: contagemPadrao
    };
  }

  public async getResumoGeral() {
    const collection = this.getCollection();

    const totalDenuncias = await collection.countDocuments();

    const categoriaMaisComumAgg = await collection.aggregate([
      { $group: { _id: "$categoria", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]).toArray();

    const categoriaMaisComum = categoriaMaisComumAgg[0]
      ? {
          categoria: categoriaMaisComumAgg[0]._id,
          total: categoriaMaisComumAgg[0].total
        }
      : {
          categoria: null,
          total: 0
        };

    const resolvidas = await collection.countDocuments({ status: "resolvida" });

    return {
      totalDenuncias,
      categoriaMaisComum,
      resolvidas
    };
  }

  private getOrder(ordem?: string): Record<string, 1 | -1> {
    switch (ordem) {
      case "categoria": return { categoria: 1 };
      case "status": return { status: 1 };
      case "data_recente": return { data: -1 };
      case "data_antiga": return { data: 1 };
      case "titulo": return { titulo: 1 };
      default: return {};
    }
  }
}
