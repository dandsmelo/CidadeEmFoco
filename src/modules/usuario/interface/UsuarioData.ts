export type Tipo = "Cidadão" | "Servidor Público";

export interface UsuarioData {
    nome: string;
    telefone: string;
    email: string;
    senha: string;
    tipo: Tipo;
}