module.exports = (sequelize, Sequelize) =>{
    const Quarto = sequelize.define("quarto",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        numero: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        tipo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        preco: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false,
            validate:{
                min:{
                    args: [0],
                    msg: "O valor não pode ser negativo."
                }
            }
        }
    });
    return Quarto;
}