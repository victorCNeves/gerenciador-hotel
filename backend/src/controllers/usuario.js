const db = require('../config/db');
const bcrypt = require('bcrypt');
const { USER_TYPES } = require('../config/enums');

module.exports = {
    async postUser(req, res){
        try {
            const {login, senha, nome, tipo} = req.body;
            const temp = {login, nome, tipo, senha: await bcrypt.hash(senha, 10)};
            const users = await db.Usuario.create(temp);
            res.status(201).json(users.toJSON());
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Erro ao criar usuário"});
        }
    },

    async getUsers(req, res){
        try{
            const users = await db.Usuario.findAll({raw: true});
            res.status(200).json(users);
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao buscar usuários"});
        }
    },

    async getUsersById(req, res){
        try {
            if(req.user.tipo==USER_TYPES.CLIENTE && req.user.id != req.params.id) return res.status(403).json({error: "Permissão negada"});
            const user = await db.Usuario.findByPk(req.params.id, {raw: true});
            if(user){
                res.status(200).json(user);
            }else{
                res.status(404).json({error: "Usuário nao encontrado"});
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Erro ao buscar usuário"});
        }
    },

    async putUser(req, res){
        try{
            const {login, senha, nome, tipo} = req.body;
            const temp = {login, nome, tipo, senha: await bcrypt.hash(senha, 10)};
            const [linhas, [updatedUser]] = await db.Usuario.update(temp, {where: {id: req.params.id}, returning: true});
            if(linhas>0 && updatedUser){
                res.status(200).json(updatedUser.toJSON());
            }else{
                res.status(404).json({error: "Usuário nao encontrado"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao atualizar usuário"});
        }
    },

    async deleteUser(req, res){
        try{
            const deleted = await db.Usuario.destroy({where: {id: req.params.id}});
            if(deleted){
                res.status(204).json();
            }else{
                res.status(404).json({error: "Usuário nao encontrado"});
            }
        }catch(err){
            console.error(err);
            res.status(500).json({error: "Erro ao deletar usuário"});
        }
    }
}