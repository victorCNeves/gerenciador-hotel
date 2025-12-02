const { where } = require('sequelize');
const db = require('../config/db');
const { RESERVATION_STATUS } = require('../config/enums');

module.exports = { 
    async postCliente(req, res){
        try{
            const cliente = await db.Cliente.create(req.body);
            res.status(201).json(cliente.toJSON());
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao criar cliente"});
        }
    },

    async getClientes(req, res){
        try{
            const options = {};
            if(req.query.include==='true'){
                options.include = [{model: db.Reserva, as: 'reservas', where: {status: RESERVATION_STATUS.CONFIRMADA}, required: false}];
            }
            const clientes = await db.Cliente.findAll(options);
            res.status(200).json(clientes.map(c=>(c.toJSON())));
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao buscar clientes"});
        }
    },

    async getClienteById(req, res){
        try{
            const options = {};
            if(req.query.include==='true'){
                options.include = [{model: db.Reserva, as: 'reservas'}];
            }
            const cliente = await db.Cliente.findByPk(req.params.id, options);
            if(cliente){
                res.status(200).json(cliente.toJSON());
            }else{
                res.status(404).json({error: "Cliente nao encontrado"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao buscar cliente"});
        }
    },

    async putCliente(req, res){
        try{
            const [linhas, [updatedCliente]] = await db.Cliente.update(req.body, {where: {id: req.params.id}, returning: true});
            if(linhas>0 && updatedCliente){
                res.status(200).json(updatedCliente.toJSON());
            }else{
                res.status(404).json({error: "Cliente nao encontrado"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao atualizar cliente"});
        }
    },

    async deleteCliente(req, res){
        try{
            const deleted = await db.Cliente.destroy({where: {id: req.params.id}});
            if(deleted){
                res.status(204).json();
            }else{
                res.status(404).json({error: "Cliente nao encontrado"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao deletar cliente"});
        }
    }
}