import { compare } from "bcrypt";
import { prisma } from "../../../database/prismaClient";
import { sign } from "jsonwebtoken"

interface IAuthenticateClient {
  username: string;
  password: string;
}

export class AuthenticateClientUseCase {
  async execute({ username, password }: IAuthenticateClient) {
    const client = await prisma.clients.findFirst({
      where: {
        username: {
          mode: "insensitive"
        }
      }
    });

    if(!client){
      throw new Error("Username or password invalid!");
    }

    const passwordMatch = await compare(password, client.password);

    if(!passwordMatch) {
      throw new Error("Username or password invalid!");
    }

    const token = sign({ username }, "b8a6b091a98c3beaf4c7478ee06ab747", {
      subject: client.id,
      expiresIn: "1d"
    });

    return token;
  }
}