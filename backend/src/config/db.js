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
db.Cliente.belongsTo(db.Usuario);
db.Cliente.hasMany(db.Reserva, {foreignKey: 'id_cliente', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
db.Reserva.belongsTo(db.Cliente);
db.Quarto.hasMany(db.Reserva, {foreignKey: 'id_quarto', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
db.Reserva.belongsTo(db.Quarto);