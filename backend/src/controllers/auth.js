const jwt = require('jsonwebtoken');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const secretKey = 'your_secret_key';

module.exports = {
    async login(req, res) {
        try {
            const { login, senha } = req.body;
            const usuario = await db.Usuario.findOne({ where: { login: login }, raw: true});

            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            if (!bcrypt.compareSync(senha, usuario.senha)) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            const token = generateToken(usuario);
            res.status(200).json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
};

function generateToken(usuario) {
    const payload = {
        id: usuario.id,
        tipo: usuario.tipo
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}