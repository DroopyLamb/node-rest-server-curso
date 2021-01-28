// Creamos la colección de usuarios
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// Creamos un Schema
let Schema = mongoose.Schema;

// Para validar los tipos de roles
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

// Datos de nuestra colección
let usuarioSchema = new Schema({
    nombre: {
        type:String,
        require: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },
    img:{
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Modificamos el esquema para uqe no se imprima la contraseña
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} email debe de ser único'});
// Importamos el eschema
module.exports = mongoose.model('usuario', usuarioSchema);