import { ObjectId } from "mongodb";
import DenunciaData from "./interfaces/DenunciaData";

export class Denuncia {
  private id?: ObjectId;
  private titulo: string;
  private data: Date;
  private status: string;
  private imagem: string;
  private descricao: string;
  private categoria: string;
  private local: string;

  constructor(
    titulo: string,
    data: Date,
    status: string,
    imagem: string,
    descricao: string,
    categoria: string,
    local: string,
    id?: ObjectId
  ) {
    this.id = id;
    this.titulo = titulo;
    this.data = data;
    this.status = status;
    this.imagem = imagem;
    this.descricao = descricao;
    this.categoria = categoria;
    this.local = local;
  }

  public getId(): ObjectId | undefined {
    return this.id;
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public getData(): Date {
    return this.data;
  }

  public getStatus(): string {
    return this.status;
  }

  public getImagem(): string {
    return this.imagem;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public getCategoria(): string {
    return this.categoria;
  }

  public getLocal(): string {
    return this.local;
  }

  public toObject(): DenunciaData {
    return {
      titulo: this.titulo,
      data: this.data,
      status: this.status,
      imagem: this.imagem,
      descricao: this.descricao,
      categoria: this.categoria,
      local: this.local,
    };
  }
}
