const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const app = express();


app.post('/login', (req, res) => {

    //Capturamos correo y password
    let body = req.body;

    //Buscamos en la BD si hay algún documento que se identifica con ese email
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        //Manejamos el error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        //Si el usuario no existe, lanzamos una respuesta
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        // Si el usuario existe, desencriptamos y buscamos en la base de datos
        // Si la contraseña previamente escrita por el usuario, es la misma
        // Que está guardada en al base de datos
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });

        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
        // Respuesta en caso de que todo sea correcto
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;