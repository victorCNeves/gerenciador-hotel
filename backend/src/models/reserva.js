const { RESERVATION_STATUS } = require('../config/enums');

module.exports = (sequelize, Sequelize)=>{
    const Reserva = sequelize.define("reserva", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        data_checkin: {
            type: Sequelize.DATE,
            allowNull: false
        },
        data_checkout: {
            type: Sequelize.DATE,
            allowNull: false
        },
        valor_total: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false,
            validate:{
                min:{
                    args: [0],
                    msg: "O valor não pode ser negativo."
                }
            }
        },
        status: {
            type: Sequelize.ENUM,
            values: RESERVATION_STATUS.VALUES,
            defaultValue: RESERVATION_STATUS.PENDENTE
        }
    });
    return Reserva;
}