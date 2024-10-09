import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";
import { UserAttributes } from "../types/custom.types";

// Define el modelo
export default (sequelize: Sequelize) => {
  class User
    extends Model<UserAttributes, Optional<UserAttributes, "id">>
    implements UserAttributes
  {
    public id!: number;
    public usuario!: string;
    public nombre!: string;
    public apellido!: string;
    public correo!: string;
    public rol!: string;
    public contrasena!: string;
    public createdat!: Date;
    public updatedat!: Date;
    public requierecambiocontrasena!: boolean;

    // Define la función associate
    static associate(models: { [key: string]: ModelStatic<Model> }) {
      // Aquí puedes definir las asociaciones, por ejemplo:
      // this.hasMany(models.Order);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      usuario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true, // Verifica que el campo tenga un formato de correo electrónico
        },
      },
      rol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdat: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedat: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      requierecambiocontrasena: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "usuarios",
      createdAt: "createdat",
      updatedAt: "updatedat",
      timestamps: false,
    }
  );

  return User;
};
