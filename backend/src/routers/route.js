const express = require('express');
const userController = require('../controllers/usuario');
const clienteController = require('../controllers/cliente');
const quartoController = require('../controllers/quarto');
const reservaController = require('../controllers/reserva');
const authController = require('../controllers/auth');
const authToken = require('../middleware/auth-token');
const authorization = require('../middleware/authorization');

const router = express.Router();

/*const db = require('../config/db_sequelize');
db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
});*/
//db.Usuario.create({login:'admin', senha:'1234', tipo:2});



module.exports = router;