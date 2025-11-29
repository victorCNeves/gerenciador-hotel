const db = require('../config/db');
const { USER_TYPES } = require('../config/enums');
const { Op } = require('sequelize');

module.exports = {
    async postReserva(req, res){
        try {
            const {id_usuario, id_quarto, data_checkin, data_checkout} = req.body;

            if (req.user.tipo == USER_TYPES.CLIENTE && req.user.id != id_usuario) return res.status(403).json({error: "Permissão negada"});
            if (data_checkout < data_checkin) return res.status(400).json({error: "A data de checkout não pode ser anterior à data de checkin"});

            const usuario = db.Usuario.findByPk(id_usuario, {raw: true});
            if (!usuario) return res.status(404).json({error: "Usuário nao encontrado"});

            const quarto = db.Quarto.findByPk(id_quarto, {raw: true});
            if (!quarto) return res.status(404).json({error: "Quarto nao encontrado"});

            const reservas = await db.Reserva.findOne({
              where: {
                id_quarto: id_quarto,
                [Op.and]: [
                  { data_checkin: {[Op.lt]: data_checkout}},
                  { data_checkout: {[Op.gt]: data_checkin}}
                ]
              }
            });

            if (reservas != null) return res.status(400).json({error: "Quarto indisponivel"});

            req.body.valor_total = calcularDiarias(data_checkin, data_checkout) * quarto.preco;

            const reserva = await db.Reserva.create(req.body);
            res.status(201).json(reserva.toJSON());
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Erro ao criar reserva"});
        }
    },

    async getReservas(req, res){
        try {
            const options = {};
            if (req.query.include==='true'){
                options.include = [{model: db.Cliente, as: 'cliente'}, {model: db.Quarto, as: 'quarto'}];
            }
            const reservas = await db.Reserva.findAll(options);
            res.status(200).json(reservas.map(r=>(r.toJSON())));
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Erro ao buscar reservas"});
        }
    },

    async getReservaById(req, res){
        try{
            const options = {};
            if (req.query.include==='true'){
                options.include = [{model: db.Cliente, as: 'cliente'}, {model: db.Quarto, as: 'quarto'}];
            }
            const reserva = await db.Reserva.findByPk(req.params.id, options);
            if(reserva){
                res.status(200).json(reserva.toJSON());
            }else{
                res.status(404).json({error: "Reserva nao encontrada"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao buscar reserva"});
        }
    },

    async putReserva(req, res){
        try{
            const {id_usuario, id_quarto, data_checkin, data_checkout} = req.body;

            if (req.user.tipo == USER_TYPES.CLIENTE && req.user.id != id_usuario) return res.status(403).json({error: "Permissão negada"});
            if (data_checkout < data_checkin) return res.status(400).json({error: "A data de checkout não pode ser anterior à data de checkin"});

            const usuario = db.Usuario.findByPk(id_usuario, {raw: true});
            if (!usuario) return res.status(404).json({error: "Usuário nao encontrado"});

            const quarto = db.Quarto.findByPk(id_quarto, {raw: true});
            if (!quarto) return res.status(404).json({error: "Quarto nao encontrado"});

            const reservas = await db.Reserva.findOne({
              where: {
                id_quarto: id_quarto,
                [Op.and]: [
                  { data_checkin: {[Op.lt]: data_checkout}},
                  { data_checkout: {[Op.gt]: data_checkin}}
                ]
              }
            });

            if (reservas != null) return res.status(400).json({error: "Quarto indisponivel"});

            req.body.valor_total = calcularDiarias(data_checkin, data_checkout) * quarto.preco;
            const [linhas, [updatedReserva]] = await db.Reserva.update(req.body, {where: {id: req.params.id}, returning: true});
            if(linhas>0 && updatedReserva){
                res.status(200).json(updatedReserva.toJSON());
            }else{
                res.status(404).json({error: "Reserva nao encontrada"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao atualizar reserva"});
        }
    },

    async deleteReserva(req, res){
        try{
            const deleted = await db.Reserva.destroy({where: {id: req.params.id}});
            if(deleted){
                res.status(204).json();
            }else{
                res.status(404).json({error: "Reserva nao encontrada"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao deletar reserva"});
        }
    }
}

function calcularDiarias(data_checkin, data_checkout){
    const msDia = 24*60*60*1000;
    const checkinDia = new Date(data_checkin.getTime()).setHours(0,0,0,0);
    const checkoutDia = new Date(data_checkout.getTime()).setHours(0,0,0,0);
    const checkoutHora = data_checkout.getHours();
    const checkoutMinuto = data_checkout.getMinutes();

    let dias = Math.floor((checkoutDia - checkinDia) / msDia);

    if (checkoutHora > 12 || (checkoutHora === 12 && checkoutMinuto > 0)) return dias + 1;
    
    return dias > 0 ? dias : 1;
}