import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../config/db'; // Tu instancia de sequelize

const basename = path.basename(__filename);

// Definir una interfaz que extiende ModelStatic para incluir associate
interface ModelStaticWithAssociations extends ModelStatic<Model> {
  associate?(models: { [key: string]: ModelStatic<Model> }): void;
}

const db: { [key: string]: ModelStaticWithAssociations } = {};

// Leer los archivos en la carpeta de modelos
fs.readdirSync(__dirname)
  .filter((file) => {
    // Filtrar archivos que no son índices y que terminan en .ts
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts';
  })
  .forEach((file) => {
    // Importar el modelo y llamarlo con la conexión de Sequelize
    const model = require(path.join(__dirname, file)).default(sequelize, DataTypes) as ModelStaticWithAssociations;
    db[model.name] = model;
    console.log(`Modelo ${model.name} importado`);
  });

// Establecer asociaciones si el modelo tiene la función associate
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export { db, sequelize }; // Exportar los modelos y la instancia de sequelize por separado
