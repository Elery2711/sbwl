export interface UserAttributes {
    id: number;
    usuario: string;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    contrasena: string;
    createdat: Date;
    updatedat: Date;
    requierecambiocontrasena: boolean;
}