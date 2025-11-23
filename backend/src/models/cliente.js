module.exports = (sequelize, Sequelize) => {
    const Cliente = sequelize.define("cliente",{
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        cpf:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        nome:{
            type: Sequelize.STRING,
            allowNull: false
        },
        telefone:{
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Cliente;
}