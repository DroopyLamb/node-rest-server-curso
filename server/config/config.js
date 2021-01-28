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
//          BASE DE DATOS
// ================================

let urlDB;

if (process.env.Node_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = "mongodb+srv://saulHiram1:Yr9F1IlHqaGAFFTr@cluster0.ziikx.mongodb.net/cafe";
}

process.env.URLDB = urlDB;


