import { ObjectId } from "mongodb";
import DenunciaData from "./interfaces/DenunciaData";

export class Denuncia {
  private id?: ObjectId;
  private titulo: string;
  private data: Date;
  private status: string;
  private descricao: string;
  private categoria: string;
  private local: string;
  private usuarioId: ObjectId;
  private imagem?: string;
  private latitude?: number;
  private longitude?: number;

  constructor(
    titulo: string,
    data: Date,
    status: string,
    descricao: string,
    categoria: string,
    local: string,
    usuarioId: ObjectId,
    imagem?: string,
    latitude?: number,
    longitude?: number,
    id?: ObjectId
  ) {
    this.id = id;
    this.titulo = titulo;
    this.data = data;
    this.status = status;
    this.descricao = descricao;
    this.categoria = categoria;
    this.local = local;
    this.usuarioId = usuarioId;
    this.imagem = imagem;
    this.latitude = latitude;
    this.longitude = longitude;

  }

  public getId(): ObjectId | undefined {
    return this.id;
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public setTitulo(titulo: string): void {
    this.titulo = titulo;
  }

  public getData(): Date {
    return this.data;
  }

  public setData(data: Date): void {
    this.data = data;
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string): void {
    this.status = status;
  }

  public getImagem(): string | undefined {
    return this.imagem;
  }

  public setImagem(imagem?: string): void {
    this.imagem = imagem;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public setDescricao(descricao: string) {
    this.descricao = descricao;
  }

  public getCategoria(): string {
    return this.categoria;
  }

  public setCategoria(categoria: string): void {
    this.categoria = categoria;
  }

  public getLocal(): string {
    return this.local;
  }

  public setLocal(local: string): void {
    this.local = local;
  }

  public getLatitude(): number | undefined {
    return this.latitude;
  }

  public setLatitude(latitude?: number): void {
    this.latitude = latitude;
  }

  public getLongitude(): number | undefined {
    return this.longitude;
  }

  public setLongitude(longitude?: number): void {
    this.longitude = longitude;
  }

  public getUsuarioId(): ObjectId {
    return this.usuarioId;
  }

  public setUsuarioId(usuarioId: ObjectId) {
    this.usuarioId = usuarioId;
  }

  public toObject(): DenunciaData {
    return {
      titulo: this.titulo,
      data: this.data,
      status: this.status,
      descricao: this.descricao,
      categoria: this.categoria,
      local: this.local,
      usuarioId: this.usuarioId,
      imagem: this.imagem,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
