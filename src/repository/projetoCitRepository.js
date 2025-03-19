import consultaSimples from '../db/projetoCitDatabase.js'

/**
 * Classe responsável por gerenciar operações no banco de dados para os registros de escavação e pesquisadores.
 */
class projetoCitRepository {

    /**
     * Cria um novo ponto de escavação no banco de dados.
     * @param {string} tipo - Tipo do ponto de escavação.
     * @param {number} latitude - Latitude do ponto.
     * @param {number} longitude - Longitude do ponto.
     * @param {number} altitude - Altitude do ponto.
     * @param {string} responsavel - Nome do responsável pela escavação.
     * @param {string} dataDescoberta - Data da descoberta do ponto.
     * @param {string} descricao - Descrição detalhada da escavação.
     * @returns {Promise} - Retorna uma promessa que resolve se a inserção for bem-sucedida.
     */
    async createPonto(tipo, latitude, longitude, altitude, responsavel, dataDescoberta, descricao){
        return consultaSimples(
            'insert into escavacao (tipo, latitude, longitude, altitude, responsavel, descricao, dataDescoberta) values ($1, $2, $3, $4, $5, $6, $7)', 
            [tipo, latitude, longitude, altitude, responsavel, descricao, dataDescoberta], 
            'Falha na criação de registro'
        );
    }

    /**
     * Retorna todos os pontos de escavação cadastrados.
     * @returns {Promise} - Retorna uma promessa com os dados dos pontos de escavação.
     */
    async readPonto(){
        return consultaSimples('select * from escavacao', '', 'Falha na leitura dos dados');
    }

    /**
     * Retorna os pontos de escavação ordenados por uma determinada coluna.
     * @param {string} coluna - Nome da coluna pela qual a ordenação será feita.
     * @returns {Promise} - Retorna uma promessa com os dados ordenados.
     */
    async readPontoOrdenado(coluna){
        return consultaSimples(`select * from escavacao order by ${coluna}`, '', 'Falha na leitura dos dados');
    }

    /**
     * Busca um ponto de escavação pelo ID.
     * @param {number} id - ID do ponto.
     * @returns {Promise} - Retorna uma promessa com os dados do ponto encontrado.
     */
    async findByIDPonto(id){
        return consultaSimples('select * from escavacao where id = $1', id, 'Falha na leitura dos dados');
    }

    /**
     * Busca pontos de escavação por responsável.
     * @param {string} responsavel - Nome do responsável.
     * @returns {Promise} - Retorna uma promessa com os pontos de escavação encontrados.
     */
    async findByResponsavelPonto(responsavel){
        return consultaSimples('select * from escavacao where responsavel = $1', responsavel, 'Falha na busca dos projetos');
    }

    /**
     * Atualiza um campo específico de um ponto de escavação pelo ID.
     * @param {number} id - ID do ponto a ser atualizado.
     * @param {string} coluna - Nome da coluna a ser atualizada.
     * @param {*} valor - Novo valor a ser inserido.
     * @returns {Promise} - Retorna uma promessa indicando o sucesso ou falha da operação.
     */
    async updatePonto(id, coluna, valor){
        return consultaSimples(`update escavacao set ${coluna} = $1 where id = $2`, [valor, id], 'Falha na atualização dos dados');
    }

    /**
     * Exclui um ponto de escavação pelo ID.
     * @param {number} id - ID do ponto a ser excluído.
     * @returns {Promise} - Retorna uma promessa indicando o sucesso ou falha da operação.
     */
    async deletePonto(id){
        return consultaSimples('delete from escavacao where id = $1', id, 'Falha na exclusão dos dados');
    }

    /**
     * Cadastra um novo pesquisador no banco de dados.
     * @param {string} nome - Nome do pesquisador.
     * @param {string} email - Email do pesquisador.
     * @param {string} instituicao - Instituição do pesquisador.
     * @param {string} especialidade - Especialidade do pesquisador.
     * @returns {Promise} - Retorna uma promessa indicando sucesso ou falha.
     */
    async createPesquisador(nome, email, instituicao, especialidade){
        return consultaSimples('insert into pesquisador (nome, email, instituicao, especialidade) values ($1, $2, $3, $4)', 
        [nome, email, instituicao, especialidade], 'Falha na criação de registro');
    }

    /**
     * Retorna todos os pesquisadores cadastrados.
     * @returns {Promise} - Retorna uma promessa com os dados dos pesquisadores.
     */
    async readPesquisador(){
        return consultaSimples('select * from pesquisador', '', 'Falha na leitura dos dados');
    }

        /**
     * Retorna os pesquisadores ordenados por uma determinada coluna.
     * @param {string} coluna - Nome da coluna pela qual a ordenação será feita.
     * @returns {Promise} - Retorna uma promessa com os dados ordenados.
     */
        async readPesquisadorOrdenado(coluna){
            return consultaSimples(`select * from pesquisador order by ${coluna}`, '', 'Falha na leitura dos dados');
        }

    /**
     * Busca um pesquisador pelo nome.
     * @param {string} nome - Nome do pesquisador.
     * @returns {Promise} - Retorna uma promessa com os dados do pesquisador encontrado.
     */
    async findByNamePesquisador(nome){
        return consultaSimples('select * from pesquisador where nome = $1', nome, 'Falha na leitura dos dados');
    }

    /**
     * Atualiza um campo específico de um pesquisador pelo nome.
     * @param {string} coluna - Nome da coluna a ser atualizada.
     * @param {*} valor - Novo valor a ser inserido.
     * @param {string} nome - Nome do pesquisador.
     * @returns {Promise} - Retorna uma promessa indicando sucesso ou falha.
     */

    async updatePesquisador(coluna, valor, nome){
        return consultaSimples(`update pesquisador set ${coluna} = $1 where nome = $2`, [valor, nome], 'Falha na atualização dos dados');
    }

    /**
     * Exclui um pesquisador pelo nome.
     * @param {string} nome - Nome do pesquisador a ser excluído.
     * @returns {Promise} - Retorna uma promessa indicando sucesso ou falha.
     */
    async deletePesquisador(nome){
        return consultaSimples('delete from pesquisador where nome = $1', nome, 'Falha na exclusão dos dados');
    }
}

export default new projetoCitRepository();
