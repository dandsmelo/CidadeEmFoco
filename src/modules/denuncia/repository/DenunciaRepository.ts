import { ObjectId } from "mongodb";
import DenunciaData from "../interfaces/DenunciaData";
import { client } from "../../../config/db";

export class DenunciaRepository {
  private collectionName = "denuncias";

  private getCollection() {
    return client.db("CidadeEmFoco").collection<DenunciaData>(this.collectionName);
  }

  public async criarDenuncia(data: DenunciaData): Promise<ObjectId> {
    const result = await this.getCollection().insertOne(data);
    return result.insertedId;
  }

  public async listarDenuncias(): Promise<(DenunciaData & { _id: ObjectId })[]> {
    const docs = await this.getCollection().find().toArray();
    return docs;
  }

  public async getDenunciaById(id: ObjectId): Promise<(DenunciaData & { _id: ObjectId }) | null> {
    const doc = await this.getCollection().findOne({ _id: id });
    if (!doc) {
      return null;
    }
    return { ...doc, _id: id };
  }

  public async atualizarDenuncia(id: ObjectId, dados: Partial<DenunciaData>): Promise<boolean> {
    const result = await this.getCollection().updateOne({ _id: id }, { $set: dados });
    return result.modifiedCount > 0;
  }

  public async deletarDenuncia(id: ObjectId): Promise<boolean> {
    const result = await this.getCollection().deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
