import { ObjectId } from "mongodb";

export default interface DenunciaData {
  titulo: string;
  data: Date;
  status: string;
  imagem?: string;
  descricao: string;
  categoria: string;
  local: string;
  usuarioId: ObjectId;
  feedback?: string;
  latitude?: number;
  longitude?: number;
}
  