const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Joi = require('joi');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'redapoyo',
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

const userSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

app.post('/register', (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nombre, email, password } = req.body;

  // Primero verificamos si el email ya existe
  const checkEmailSql =
    'SELECT COUNT(*) as count FROM usuarios WHERE email = ?';
  db.query(checkEmailSql, [email], (err, result) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({
        success: false,
        message: 'Error en el servidor',
      });
    }

    if (result[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado',
      });
    }
    const insertSql =
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    db.query(insertSql, [nombre, email, password], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({
          success: false,
          message: 'Error en el registro',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Usuario registrado exitosamente',
      });
    });
  });
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
