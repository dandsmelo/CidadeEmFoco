import { ObjectId } from "mongodb";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { UsuarioData } from "../interface/UsuarioData";
import { Usuario } from "../Usuario";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export class UsuarioService {
    private repository = new UsuarioRepository();

    public async criarUsuario(usuario: Usuario): Promise<ObjectId> {
        return await this.repository.criarUsuario(usuario.toObject());
    }

    public async listarUsuarios(): Promise<(UsuarioData & { _id: ObjectId })[]> {
        return await this.repository.listarUsuarios();
    }

    public async login(email: string, senha: string): Promise<string | null> {
        const user = await this.repository.login(email);
        if (user && await compare(senha, user.senha)) {
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );
            return token;
        }
        return null;
    }

    public async getUsuarioById(id: string): Promise<(UsuarioData & { _id: ObjectId }) | null> {
        return await this.repository.getUsuarioById(new ObjectId(id));
    }

    public async atualizarUsuario(id: string, dadosAtualizados: Partial<UsuarioData>): Promise<boolean> {
        return await this.repository.atualizarUsuario(new ObjectId(id), dadosAtualizados);
    }

    public async deletarUsuario(id: string): Promise<boolean> {
        return await this.repository.deletarUsuario(new ObjectId(id));
    }
}
