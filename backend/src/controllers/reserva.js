const db = require('../config/db');

module.exports = {
    async postReserva(req, res){
        try {
            const {valor_total} = req.body;
            if (valor_total<0) return res.status(400).json({error: "O valor nao pode ser negativo"});
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
            const {valor_total} = req.body;
            if (valor_total<0) return res.status(400).json({error: "O valor nao pode ser negativo"});
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