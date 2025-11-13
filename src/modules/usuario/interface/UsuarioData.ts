export type Tipo = "Cidadão" | "Servidor Público";

export interface UsuarioData {
    nome: string;
    telefone: string;
    email: string;
    senha: string;
    fotoPerfil?: string;
    tipo: Tipo;
    cidade: string;
    estado: string;
}