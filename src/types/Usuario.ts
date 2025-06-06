import { ObjectId } from "mongodb";
import { Tipo } from "../modules/usuario/interface/UsuarioData";

export interface Usuario {
    id: ObjectId
    nome: string;
    telefone: string;
    email: string;
    senha: string;
    tipo: Tipo;
}