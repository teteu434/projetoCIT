import app from "./src/app.js";

/**
 * Rodar o servidor!
 */

app.listen(process.env.API_PORT, '0.0.0.0', function(){
    console.log(`SITE rodando na porta ${process.env.API_PORT}!`);
});