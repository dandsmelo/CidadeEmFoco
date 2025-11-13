import { ObjectId } from "mongodb";
import { Tipo, UsuarioData } from "./interface/UsuarioData";

export class Usuario {
    private id?: ObjectId;
    private nome: string;
    private telefone: string;
    private email: string;
    private senha: string;
    private tipo: Tipo;
    private cidade: string;
    private estado: string;
    private fotoPerfil?: string;

    constructor(
        nome: string,
        telefone: string,
        email: string,
        senha: string,
        tipo: Tipo,
        cidade: string,
        estado: string,
        fotoPerfil?: string,
        id?: ObjectId,
    ) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
        this.cidade = cidade;
        this.estado = estado;
        this.fotoPerfil = fotoPerfil;
    }

    public getId(): ObjectId | undefined {
        return this.id;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getTelefone(): string {
        return this.telefone;
    }

    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getSenha(): string {
        return this.senha;
    }

    public setSenha(senha: string): void {
        this.senha = senha;
    }

    public getTipo(): Tipo {
        return this.tipo;
    }

    public setTipo(tipo: Tipo): void {
        this.tipo = tipo;
    }

    public getCidade(): string {
        return this.cidade;
    }

    public setCidade(cidade: string): void {
        this.cidade = cidade;
    }

    public getEstado(): string {
        return this.estado;
    }

    public setEstado(estado: string): void {
        this.estado = estado;
    }

    public getFotoPerfil(): string | undefined {
        return this.fotoPerfil;
    }

    public setFotoPerfil(fotoPerfil?: string): void {
        this.fotoPerfil = fotoPerfil;
    }

    public toObject(): UsuarioData {
        return {
            nome: this.nome,
            telefone: this.telefone,
            email: this.email,
            senha: this.senha,
            tipo: this.tipo,
            cidade: this.cidade,
            estado: this.estado,
            fotoPerfil: this.fotoPerfil,
        };
    }
}
