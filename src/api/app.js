import express from 'express';
import rotas from './routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
const { router } = rotas;
app.use(cors()); // Middleware para permitir requisições de diferentes origens.
app.use(express.json()); // Middleware para interpretar requisições com corpo no formato JSON.
app.use(bodyParser.json());
app.use(router); // Adiciona as rotas da aplicação.

export default app;