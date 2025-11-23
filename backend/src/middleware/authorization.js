module.exports = {
    authorization: (authorization)=>(req, res, next)=>{
        if (req.user.tipo==authorization){
            next();
        }else{
            return res.status(403).json({ error: 'Permissão negada' });
        }
    }
}