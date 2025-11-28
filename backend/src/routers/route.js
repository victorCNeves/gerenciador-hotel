const express = require('express');
const db = require('../config/db');
const userController = require('../controllers/usuario');
const clienteController = require('../controllers/cliente');
const quartoController = require('../controllers/quarto');
const reservaController = require('../controllers/reserva');
const authController = require('../controllers/auth');
const authToken = require('../middleware/auth-token');
const { authorization } = require('../middleware/authorization');
const { USER_TYPES } = require('../config/enums');

const router = express.Router();

/*const db = require('../config/db');
db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
});*/
//db.Usuario.create({login:'admin', senha:'1234', tipo:USER_TYPES.ADMIN, nome:'Administrador'});

router.post('/login', authController.login)

router.get('/usuarios', authToken, authorization(USER_TYPES.ADMIN), userController.getUsers);
router.get('/usuarios/:id', authToken, authorization(USER_TYPES.CLIENTE), userController.getUsersById);
router.post('/usuarios', authToken, authorization(USER_TYPES.ADMIN), userController.postUser);
router.put('/usuarios/:id', authToken, authorization(USER_TYPES.CLIENTE), userController.putUser);
router.delete('/usuarios/:id', authToken, authorization(USER_TYPES.ADMIN), userController.deleteUser);

router.get('/clientes', authToken, authorization(USER_TYPES.FUNCIONARIO), clienteController.getClientes);
router.get('/clientes/:id', authToken, authorization(USER_TYPES.CLIENTE), clienteController.getClienteById);
router.post('/clientes', authToken, authorization(USER_TYPES.FUNCIONARIO), clienteController.postCliente);
router.put('/clientes/:id', authToken, authorization(USER_TYPES.CLIENTE), clienteController.putCliente);
router.delete('/clientes/:id', authToken, authorization(USER_TYPES.FUNCIONARIO), clienteController.deleteCliente);

router.get('/quartos', quartoController.getQuartos);
router.get('/quartos/:id', quartoController.getQuartoById);
router.post('/quartos', authToken, authorization(USER_TYPES.FUNCIONARIO), quartoController.postQuarto);
router.put('/quartos/:id', authToken, authorization(USER_TYPES.FUNCIONARIO), quartoController.putQuarto);
router.delete('/quartos/:id', authToken, authorization(USER_TYPES.FUNCIONARIO), quartoController.deleteQuarto);

router.get('/reservas', authToken, authorization(USER_TYPES.CLIENTE), reservaController.getReservas);
router.get('/reservas/:id', authToken, authorization(USER_TYPES.CLIENTE), reservaController.getReservaById);
router.post('/reservas', authToken, authorization(USER_TYPES.CLIENTE), reservaController.postReserva);
router.put('/reservas/:id', authToken, authorization(USER_TYPES.CLIENTE), reservaController.putReserva);
router.delete('/reservas/:id', authToken, authorization(USER_TYPES.FUNCIONARIO), reservaController.deleteReserva);

module.exports = router;