import { compare } from "bcrypt";
import { prisma } from "../../../database/prismaClient";
import { sign } from "jsonwebtoken"

interface IAuthenticateDeliveryman {
  username: string;
  password: string;
}

export class AuthenticateDeliverymanUseCase {
  async execute({ username, password }: IAuthenticateDeliveryman) {
    const deliveryman = await prisma.clients.findFirst({
      where: {
        username: {
          mode: "insensitive"
        }
      }
    });

    if(!deliveryman){
      throw new Error("Username or password invalid!");
    }

    const passwordMatch = await compare(password, deliveryman.password);

    if(!passwordMatch) {
      throw new Error("Username or password invalid!");
    }

    const token = sign({ username }, "b8a6b091a77c3beaf4c7478ee06ab747", {
      subject: deliveryman.id,
      expiresIn: "1d"
    });

    return token;
  }
}