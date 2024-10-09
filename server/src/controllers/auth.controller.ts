import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../models";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { UserAttributes } from "../types/custom.types";

const secret = process.env.JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
  user?: UserAttributes;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (to: string, subject: string, text: string) => {
  console.log("sending email");
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

const generateToken = (user: UserAttributes): string => {
  // Asegúrate de no incluir información sensible en el payload
  const payload = {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
    requierecambiocontrasena: user.requierecambiocontrasena,
  };

  return jwt.sign(payload, secret, { expiresIn: "8h" });
};

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(403).json({ error: "A token is required for authentication" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as UserAttributes; // Asegúrate de que el tipo sea User
    req.user = decoded;
    res.status(200).json({ message: "Token is valid" });
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
    return;
  }

  next();
};

export const authenticate =
  (roles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Verifica que el usuario tiene un rol permitido para acceder a la ruta
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!roles.includes(req.user.rol)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    next();
  };

export class AuthController {
  static async login(req: Request, res: Response): Promise<any> {
    console.log("Calling login");
    const { usuario, contrasena } = req.body;
    try {
      const userResult = await db.User.findOne({ where: { usuario } });
      if (!userResult) {
        return res
          .status(401)
          .json({ message: "Usuario y/o contraseña invalidos" });
      }

      const user = userResult.dataValues;

      if (bcrypt.compareSync(contrasena, user.contrasena)) {
        const token = generateToken(user);
        res.json({ token });
      } else {
        res
          .status(401)
          .json({ error: "El usuario y la contraseña no coinciden" });
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión: ", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async register(req: Request, res: Response): Promise<any> {
    const { usuario, rol, nombre, apellido, correo } = req.body;
    const tempPassword = crypto.randomBytes(4).toString("hex"); // Generar una contraseña temporal
    const hashedPassword = bcrypt.hashSync(tempPassword, 10);

    try {
      // Verificar que el usuario no exista ya en la base de datos
      const existingUser = await db.Usuario.findOne({ where: { usuario } });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "El nombre de usuario ya existe" });
      }

      try {
        const newUser = await db.Usuario.create({
          usuario,
          nombre,
          apellido,
          correo,
          password: hashedPassword, // Guardar la contraseña hasheada
          rol,
          requierecambiocontrasena: true, // Asegurarse de que el usuario necesita cambiar su contraseña al iniciar sesión
        });

        if (!newUser) {
          return res.status(400).json({ message: "Error creating user" });
        }

        await sendEmail(
          correo,
          `Bienvenido - Su nueva cuenta`,
          `Su nombre de usuario es: ${usuario} \nSu contraseña temporal es: ${tempPassword}`
        );

        return res.status(201).json({ message: "User created successfully" });
      } catch (error: any) {
        console.error("Error creando usuario: ", error);
        res.status(500).json({ message: error.message });
      }
    } catch (error: any) {
      console.error("Error creando usuario: ", error);
      res.status(500).json({ message: error.message });
    }
  }
}
