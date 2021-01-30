const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

//Importación del middleware
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();



app.get('/usuario', verificaToken, (req, res) => {
    
    // Parámetros opcionales si el usuario manda una variable en el url llamada desde = número
    // Mostrará los registros a partir de ese registro
    //      --> localhost:3000/usuario?desde=10
    //      --> mostrará a partir del usuario 11

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    // manda todos los usuarios
    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)// Mostrará a partir de un número que le pasemos
        .limit(limite)// Para limitar el número de registros
        .exec((err, usuarios) => { //ejecuta el método find

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
            // Manejo del error
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        });

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Guardamos lo que el usuario nos envíe
    let body = req.body;

    // Creamos un objeto del tipo usuario con esos valores
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // Grabar en la base de datos
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Sacamos el ID
    let id = req.params.id;

    // Validaciones
    //  Si teenemos campos que no queremos actualizar, podemos eliminarlos
    //  pero eso sería poco eficiente
    //              delete body.password
    //              delete body.google
    // para validar usaremos una librería llamada:
    //          underscore.js

    // Crearemos un arreglo que guarde todos los datos que se encuentran en 
    // el arreglo que le pasamos
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    // Modificación
    // Recibe cuatro parámetros
    //      id 
    //      parámetros a modificar 
    //      Options 
    //              -> new:true --> true = mostratr información antes de ser actualizada  
    //                          --> false = después de ser actualizada
    //              -> runValidator --> corre las validaciones puestas en el archivo del esquema(modelo)
    //              -> context --> Si runValidators está en false y context en query, no hará nada
    //                         --> Si runValidators está en true, context nos ayuda a las validacioens personalizadas
    //                         --> por ejemplo arriba que usamos: 
    //                         -->  _.pick(req.body, ['nombre','email','img','role','estado']);
    //      callback



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });

    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // Recolectamos el Id del usuario mediante el URL
    let id = req.params.id;

    // Usamos el equema y el método findByIdAndRemove
    // para borrar
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        //Si hay un error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Usuario no encontrado
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        //Borrado exitoso
        res.json({
            ok: true,
            usuario: {
                message: 'Usuario borrado exitosamente',
                usuarioBorrado
            }
        });

    });
});

app.delete('/usuario/desactivar/:id', verificaToken, (req, res) => {
    // Recolectamos el Id del usuario mediante el URL
    let id = req.params.id;
    // Objeto a actualizar
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        //Si hay un error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Usuario no encontrado
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        //Borrado exitoso
        res.json({
            ok: true,
            usuario: {
                message: 'Usuario borrado exitosamente',
                usuarioBorrado
            }
        });

    });
});

module.exports = app;