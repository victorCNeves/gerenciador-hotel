const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('web2db', 'postgres', process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: 'localhost'
});

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Usuario = require('../models/usuario')(sequelize,Sequelize);
db.Cliente = require('../models/cliente')(sequelize,Sequelize);
db.Quarto = require('../models/quarto')(sequelize,Sequelize);
db.Reserva = require('../models/reserva')(sequelize,Sequelize);

db.Usuario.hasOne(db.Cliente, {foreignKey: {name: 'id_usuario', allowNull: true, unique: true}, onDelete: 'CASCADE', onUpdate: 'CASCADE'});
db.Cliente.belongsTo(db.Usuario, {foreignKey: 'id_usuario'});
db.Cliente.hasMany(db.Reserva, {foreignKey: {name: 'id_cliente', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'});
db.Reserva.belongsTo(db.Cliente, {foreignKey: 'id_cliente'});
db.Quarto.hasMany(db.Reserva, {foreignKey: {name: 'id_quarto', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'});
db.Reserva.belongsTo(db.Quarto, {foreignKey: 'id_quarto'});

module.exports = db;