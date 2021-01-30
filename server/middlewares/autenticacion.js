const jwt = require('jsonwebtoken');



// ====================
// Verificar token
// ====================

let verificaToken = (req, res, next) => {
    // leemos el token
    let token = req.get('token');// entre paréntesis se pone el nombre del token que queremos

    // Comprobar que el token es válido 
    // jwt.verify(token, SEMILLA, (err, informacionDecodificada) =>{});
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        // Si algo sale mal, el token no es válido etc
        // manejamos el error
        if (err) {
            // status(401) = no autorizado
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        // Propiedades de ese usuario que se ha logueado
        req.usuario = decoded.usuario;

        console.log(token);
        // para que se ejecute lo que sigue en donde hayamos invocado a nuestro middleware
        // Si no ejecutamos el método next(), solo se ejecutará lo que es´te programado 
        // en nuestro iddleware
        next();

    });
}

// ====================
// Verificar token
// ====================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }


}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}