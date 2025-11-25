const { USER_TYPES } = require('../config/enums');

module.exports = {
    authorization: (authorization)=>(req, res, next)=>{
        const hierarquia={
            [USER_TYPES.ADMIN]: 3,
            [USER_TYPES.FUNCIONARIO]: 2,
            [USER_TYPES.CLIENTE]: 1,
            'GUEST': 0
        }
        
        req.user.tipo = req.user ? req.user.tipo : 'GUEST';

        if (hierarquia[req.user.tipo] >= hierarquia[authorization]){
            next();
        }else{
            return res.status(403).json({ error: 'Permissão negada' });
        }
    }
}