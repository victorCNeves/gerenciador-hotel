const express = require('express');
const userController = require('../controllers/usuario');
const clienteController = require('../controllers/cliente');
const quartoController = require('../controllers/quarto');
const reservaController = require('../controllers/reserva');
const authController = require('../controllers/auth');
const authToken = require('../middleware/auth-token');
const authorization = require('../middleware/authorization');
const { USER_TYPES } = require('../config/enums');
const auth = require('../controllers/auth');

const router = express.Router();

/*const db = require('../config/db_sequelize');
db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
});*/
//db.Usuario.create({login:'admin', senha:'1234', tipo:2});

router.post('/login', authController.login)

router.get('/usuarios', authToken, authorization(USER_TYPES.ADMIN), userController.getUsers);
router.get('/usuarios/:id', authToken, authorization(USER_TYPES.ADMIN), userController.getUsersById);
router.post('/usuarios', authToken, authorization(USER_TYPES.ADMIN), userController.postUser);
router.put('/usuarios/:id', authToken, authorization(USER_TYPES.ADMIN), userController.putUser);
router.delete('/usuarios/:id', authToken, authorization(USER_TYPES.ADMIN), userController.deleteUser);

router.get('/clientes?include', authToken, authorization(USER_TYPES.FUNCIONARIO), clienteController.getClientes);
router.get('/clientes/:id?include', authToken, authorization(USER_TYPES.CLIENTE), clienteController.getClienteById);
router.post('/clientes', authToken, authorization(USER_TYPES.FUNCIONARIO), clienteController.postCliente);
router.put('/clientes/:id', authToken, authorization(USER_TYPES.CLIENTE), clienteController.putCliente);
router.delete('/clientes/:id', authToken, authorization(USER_TYPES.CLIENTE), clienteController.deleteCliente);

router.get('/quartos?include', authToken, quartoController.getQuartos);
router.get('/quartos/:id?include', authToken, quartoController.getQuartoById);
router.post('/quartos', authToken, authorization(USER_TYPES.FUNCIONARIO), quartoController.postQuarto);
router.put('/quartos/:id', authToken, authorization(USER_TYPES.FUNCIONARIO), quartoController.putQuarto);
router.delete('/quartos/:id', authToken, authorization(USER_TYPES.FUNCIONARIO), quartoController.deleteQuarto);

router.get('/reservas?include', authToken, authorization(USER_TYPES.CLIENTE), reservaController.getReservas);
router.get('/reservas/:id?include', authToken, authorization(USER_TYPES.CLIENTE), reservaController.getReservaById);
router.post('/reservas', authToken, authorization(USER_TYPES.FUNCIONARIO), reservaController.postReserva);
router.put('/reservas/:id', authToken, authorization(USER_TYPES.FUNCIONARIO), reservaController.putReserva);
router.delete('/reservas/:id', authToken, authorization(USER_TYPES.FUNCIONARIO), reservaController.deleteReserva);

module.exports = router;