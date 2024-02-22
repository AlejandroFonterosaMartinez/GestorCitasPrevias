const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Cargar las variables de entorno desde el archivo .env.development.local
require('dotenv').config({ path: '.env.development.local' });

// Configura la conexión
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(express.json());
app.use(cors());

// GETS
app.get('/citas-dia/:fecha', (req, res) => {
    const fecha = req.params.fecha;

    pool.query("SELECT * FROM citas WHERE fecha = $1 AND terminada = false ORDER BY hora ASC", [fecha], (error, results) => {
        if (error) {
            console.error('Error al obtener citas del día:', error);
            return res.status(500).json({ error: 'Error al obtener citas del día' });
        }
        res.json(results.rows);
    });
});

app.get('/all-citas', (req, res) => {
    pool.query("SELECT * FROM citas WHERE terminada = false ORDER BY hora ASC", (error, results) => {
        if (error) {
            console.error('Error al obtener todas las citas:', error);
            return res.status(500).json({ error: 'Error al obtener todas las citas' });
        }
        res.json(results.rows);
    });
});

// POSTS
app.post('/citas', (req, res) => {
    console.log('Datos de cita recibidos:', req.body);
    const { name, telefono, treatment, date, time, price } = req.body;
    const telefonoValue = telefono ? telefono : null;
    const terminado = false;

    pool.query("INSERT INTO citas (nombre, telefono, tratamiento, precio, fecha, hora, terminada) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, telefonoValue, treatment, price, date, time, terminado], (error, results) => {
        if (error) {
            console.error('Error al agregar cita:', error);
            return res.status(500).json({ error: 'Error al agregar cita' });
        }
        console.log('Cita agregada correctamente');
        res.json(results.rows[0]);
    });
});
// PUTS
app.put('/citas-save/:id', (req, res) => {
    const id = req.params.id;
    const { terminada } = req.body;

    pool.query("UPDATE citas SET terminada = $1 WHERE id = $2", [terminada, id], (error, results) => {
        if (error) {
            console.error('Error al guardar cita:', error);
            return res.status(500).json({ error: 'Error al guardar cita' });
        }
        res.json({ message: 'Cita finalizada correctamente' });
    });
});

// DELETES
app.delete('/citas/:id', (req, res) => {
    const citaId = req.params.id;

    pool.query("DELETE FROM citas WHERE id = $1", [citaId], (error, results) => {
        if (error) {
            console.error('Error al eliminar la cita:', error);
            return res.status(500).json({ error: 'Error al eliminar la cita' });
        }
        res.json({ message: 'Cita eliminada correctamente' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend iniciado en http://localhost:${port}`);
});
