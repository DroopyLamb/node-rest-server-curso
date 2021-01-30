// Contiene configuracioens globales


// ===================================
//      CONFIGURACIÓN DEL PUERTO 
//      PARA QUE ESTÉ LISTO PARA 
//      PRODUCCIÓN Y PARA LA BASE DE
//      DATOS GLOBAL
// ===================================

process.env.PORT = process.env.PORT || 3000;


// ================================
//          ENTORNO
// ================================
// Si la variable proccss.env.NODE_ENV no existe, estamos en
// el ambiente de desarrollo
process.env.Node_ENV = process.env.Node_ENV || 'dev';

// ================================
//      Vencimiento del token
// ================================

// 60 Segundos
// 30 Minutos
// 24 Horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// ================================
//          SEED de autenticación
// ================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

// ================================
//          BASE DE DATOS
// ================================

let urlDB;

if (process.env.Node_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


