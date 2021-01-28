require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

// Importamos las rutas
app.use(require('./routes/usuario'));

// Conexión a la base de datos
mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw new err;
        console.log('Base de datos ONLINE');
    });
/* --------> solución a estos warnings
    (node:7248) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
    (Use `node --trace-deprecation ...` to show where the warning was created)
*/

/* mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true); */

// Iniciamos el servidor
app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}\n${process.env.URLDB}`);
});