import { sequelize } from './models';
import app from './app';

// Verificar la conexión a la base de datos
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectToDatabase(); // Llamar a la función de conexión
});
