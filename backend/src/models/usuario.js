const { USER_TYPES } = require('../config/enums');

module.exports = (sequelize, Sequelize)=>{
    const Usuario = sequelize.define("usuario",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true  
        },
        login: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tipo: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: USER_TYPES.VALUES,
            defaultValue: USER_TYPES.CLIENTE
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Usuario;
}