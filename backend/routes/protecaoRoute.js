
// PROTEÇÃO DAS ROTAS
const jwt = require('jsonwebtoken');

const protecao = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token não fornecido');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido');
        req.userId = decoded.id;
        next();
    });
}

module.exports = protecao;
