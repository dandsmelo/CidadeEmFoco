import { ObjectId } from "mongodb";
import { client } from "../../../config/db";
import { UsuarioData } from "../interface/UsuarioData";

export class UsuarioRepository {
    private collectionName = "usuarios";
    
    private getCollection() {
        return client.db("CidadeEmFoco").collection<UsuarioData>(this.collectionName);
    }

    public async criarUsuario(data: UsuarioData): Promise<ObjectId> {
        const result = await this.getCollection().insertOne(data);
        return result.insertedId;
    }

    public async login(email: string): Promise<(UsuarioData & { _id: ObjectId }) | null> {
        const user = await this.getCollection().findOne({ email });
        if (!user) {
            return null;
        }
        return { ...user, _id: user._id } as UsuarioData & { _id: ObjectId };
    }

    public async atualizarSenha(id: ObjectId, senhaHash: string): Promise<boolean> {
        const resultado = await this.getCollection().updateOne(
        { _id: id },
        { $set: { senha: senhaHash } }
        );
        return resultado.modifiedCount > 0;
    }

    public async listarUsuarios(): Promise<(UsuarioData & { _id: ObjectId })[]> {
        const documents = await this.getCollection().find().toArray();
        return documents;
    }

    public async getUsuarioById(id: ObjectId): Promise<(UsuarioData & {_id: ObjectId}) | null> {
        const documents = await this.getCollection().findOne({_id: id });
        if (!documents) {
            return null;
        }
        return { ...documents, _id: id };
    }

    public async atualizarUsuario(id: ObjectId, dados: Partial<UsuarioData>): Promise<boolean> {
        const result = await this.getCollection().updateOne({ _id: id }, { $set: dados });
        return result.modifiedCount > 0;
    }

    public async deletarUsuario(id: ObjectId): Promise<boolean> {
        const result = await this.getCollection().deleteOne({ _id: id });
        return result.deletedCount > 0;
    }

    public async getByEmail(email: string): Promise<(UsuarioData & { _id: ObjectId }) | null> {
    return await this.getCollection().findOne({ email });
    }

    public async atualizarFoto(id: ObjectId, fotoPath: string): Promise<any | null> {
        
        console.log(`Tentando atualizar o usuário ID: ${id.toHexString()} com foto: ${fotoPath}`);
        
        const result = await this.getCollection().updateOne(
            { _id: id },
            { $set: { fotoPerfil: fotoPath } } 
        );

        if (result.modifiedCount > 0) {
            console.log(`Sucesso: Campo fotoPerfil atualizado para o usuário ID: ${id.toHexString()}`); 
            return await this.getUsuarioById(id);
        }
        
        console.log(`Falha: Nenhum documento atualizado para o ID: ${id.toHexString()}.`); 
        return null;
    }



}
