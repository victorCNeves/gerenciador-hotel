const db = require('../config/db');
const { RESERVATION_STATUS } = require('../config/enums');

module.exports = {
    async postQuarto(req, res){
        try{
            const quarto = await db.Quarto.create(req.body);
            res.status(201).json(quarto.toJSON());
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao criar quarto"});
        }
    },

    async getQuartos(req, res){
        try{
            const options = {}
            if(req.query.include==='true'){
                options.include = [{model: db.Reserva, as: 'reservas', where: {status: RESERVATION_STATUS.CONFIRMADA}, required: false}];
            }
            const quartos = await db.Quarto.findAll(options);
            res.status(200).json(quartos.map(q=>(q.toJSON())));
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao buscar quartos"});
        }
    },

    async getQuartoById(req, res){
        try {
            const options = {}
            if(req.query.include==='true'){
                options.include = [{model: db.Reserva, as: 'reservas', required: false}];
            }
            const quarto = await db.Quarto.findByPk(req.params.id, options);
            if(quarto){
                res.status(200).json(quarto.toJSON());
            }else{
                res.status(404).json({error: "Quarto nao encontrado"});
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Erro ao buscar quartos"});
        }
    },

    async putQuarto(req, res){
        try{
            const [linhas, [updatedQuarto]] = await db.Quarto.update(req.body, {where: {id: req.params.id}, returning: true});
            if(linhas>0 && updatedQuarto){
                res.status(200).json(updatedQuarto.toJSON());
            }else{
                res.status(404).json({error: "Quarto nao encontrado"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao atualizar quarto"});
        }
    },

    async deleteQuarto(req, res){
        try{
            const deleted = await db.Quarto.destroy({where: {id: req.params.id}});
            if(deleted){
                res.status(204).json();
            }else{
                res.status(404).json({error: "Quarto nao encontrado"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao deletar quarto"});
        }
    }
}