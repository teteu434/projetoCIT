import { Router } from 'express';
import projetoCitController from './controller/projetoCitController.js';

const router = Router();

/**
 * Rotas para manipulação de pontos de escavação.
 */

router.get('/pontos', projetoCitController.readPonto); // Lista todos os pontos de escavação
router.get('/pontos/ordenado/:coluna', projetoCitController.readPontoOrdenado); // Lista pontos ordenados por uma coluna específica
router.get('/pontos/:id', projetoCitController.findByIDPonto); // Busca um ponto pelo ID
router.get('/pontos/pesquisador/:responsavel', projetoCitController.findByResponsavelPonto); // Busca pontos por responsável
router.post('/pontos', projetoCitController.createPonto); // Cadastra um novo ponto de escavação
router.put('/pontos/:id', projetoCitController.updatePonto); // Atualiza um ponto de escavação pelo ID
router.delete('/pontos/:id', projetoCitController.deletePonto); // Remove um ponto de escavação pelo ID

/**
 * Rotas para manipulação de pesquisadores.
 */

router.get('/pesquisadores', projetoCitController.readPesquisador); // Lista todos os pesquisadores
router.get('/pesquisadores/:nome', projetoCitController.findByNamePesquisador); // Busca um pesquisador pelo nome
router.get('/pesquisadores/ordenado/:coluna', projetoCitController.readPesquisadorOrdenado); // Lista pesquisadores ordenados por uma coluna específica
router.post('/pesquisadores', projetoCitController.createPesquisador); // Cadastra um novo pesquisador
router.put('/pesquisadores/:nome', projetoCitController.updatePesquisador); // Atualiza os dados de um pesquisador pelo nome
router.delete('/pesquisadores/:nome', projetoCitController.deletePesquisador); // Remove um pesquisador pelo nome

export default { router };