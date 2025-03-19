import projetoCitRepository from "../repository/projetoCitRepository.js";

/**
 * Controlador responsável por gerenciar operações relacionadas aos pontos de escavação.
 */

class projetoCitController {

        /**
     * Lista todos os pontos de escavação cadastrados.
     * @param {Object} req - Objeto de requisição do Express.
     * @param {Object} res - Objeto de resposta do Express.
     */

    // Todos os parâmetros das funções aqui serão os mesmos, então listarei apenas no primeiro.

    async createPonto(req, res){
        try {
            const {tipo, latitude, longitude, altitude, responsavel, dataDescoberta, descricao} = req.body;
            const resultado = await projetoCitRepository.createPonto(tipo, latitude, longitude, altitude, responsavel, dataDescoberta, descricao);
            if (resultado.correto) res.json({ message: 'Ponto cadastrado com sucesso!', cadastrado: true})
            else res.json({ message: resultado.message, cadastrado: false})
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Recebe todos os pontos registrados no banco de dados e retorna o json.
     */

    async readPonto(req, res){
        try {
            const resultado = await projetoCitRepository.readPonto();
            res.json(resultado)
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Recebe todos os pontos registrados e ordenados no banco de dados e retorna o json.
     */

    async readPontoOrdenado(req, res){
        try {
            const coluna = req.params.coluna
            const resultado = await projetoCitRepository.readPontoOrdenado(coluna);
            res.json(resultado)
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Recebe um ponto de acordo com o ID e retorna o json.
     */    

    async findByIDPonto(req, res){
        try {
            const id = req.params.id;
            const resultado = await projetoCitRepository.findByIDPonto(id);
            if (resultado.correto){

                // Confere se o resultado dá pesquisa não foi 0, pois se a pessoa digitar um ID que não tem no banco, o código não dá erro, somente não faz nada.
                // Então confere para ver se retornou algo, porque se não tiver retornado mostra que o ID não consta no banco.

                if(resultado.resultado.length > 0) res.json({ ponto: resultado.resultado, busca: true})
                else res.json({ message: 'ID não consta na base de dados', busca: false})
            } 
            else res.json({ message: resultado.message, busca: false})
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Recebe todos os pontos registrados de acordo com o responsável deles no banco de dados e retorna o json.
     */

    async findByResponsavelPonto(req,res){
        try {
            const responsavel = req.params.responsavel;
            const resultado = await projetoCitRepository.findByResponsavelPonto(responsavel);
            if (resultado.correto){
                if(resultado.resultado.length > 0) res.json({ pontos: resultado.resultado, busca: true})
                else res.json({ message: 'Responsável não consta na base de dados', busca: false})
            } 
            else res.json({ message: resultado.message, busca: false})
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Atualiza um parâmetro em uma row no banco de dados de acordo com um ID fornecido retorna o json.
     */

    async updatePonto(req, res){
        try {
            const id = req.params.id;
            const {coluna, valor} = req.body
            const resultado = await projetoCitRepository.updatePonto(id, coluna, valor);
            if (resultado.correto){

                // Confere Se houve alguma atualização, pois se tentar atualizar uma row que não existe no banco de dados, o código não dá erro, apenas não faz nada
                // Então, se por acaso o código não fizer nada, já retorna que não foi atualizado nada porque o ID fornecido não consta no banco.

                if(resultado.update > 0) res.json({ message: 'Atualizado com sucesso!', atualizacao: true})
                else res.json({ message: 'ID não consta na base de dados', atualizacao: false})
            } 
            else res.json({ message: resultado.message, atualizacao: false})
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Deleta uma row no banco de dados de acordo com um ID fornecido retorna o json.
     */

    async deletePonto(req,res){
        try {
            const id = req.params.id;
            const resultado = await projetoCitRepository.deletePonto(id);
            if (resultado.correto){

                // Mesma lógica da atualização

                if(resultado.update > 0) res.json({ message: 'Excluído com sucesso!', exclusao: true})
                else res.json({ message: 'ID não consta na base de dados', exclusao: false})
            } 
            else res.json({ message: resultado.message, exclusao: false})
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Cria um novo registro de pesquisador no banco de dados e retorna o json.
     */

    async createPesquisador(req, res){
        try {
            const {nome, email, instituicao, especialidade} = req.body;
            const resultado = await projetoCitRepository.createPesquisador(nome, email, instituicao, especialidade);
            if (resultado.correto) res.json({ message: 'Pesquisador cadastrado com sucesso!', cadastrado: true})
            else res.json({ message: resultado.message, cadastrado: false})
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Recebe todos os pesquisadores registrados no banco de dados e retorna o json.
     */

    async readPesquisador(req, res){
        const resultado = await projetoCitRepository.readPesquisador();
        res.json(resultado)
    }

    /**
     * Recebe todos os pesquisadores registrados e ordenados no banco de dados e retorna o json.
     */

    async readPesquisadorOrdenado(req, res){
        try {
            const coluna = req.params.coluna
            const resultado = await projetoCitRepository.readPesquisadorOrdenado(coluna);
            res.json(resultado)
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Recebe um pesquisador de acordo com o nome e retorna o json.
     */

    async findByNamePesquisador(req, res){
        try {
            const nome = req.params.nome;
            const resultado = await projetoCitRepository.findByNamePesquisador(nome);
            if (resultado.correto) {

                // Confere se o resultado dá pesquisa não foi 0, pois se a pessoa digitar um nome que não tem no banco, o código não dá erro, somente não faz nada.
                // Então confere para ver se retornou algo, porque se não tiver retornado mostra que o nome não consta no banco.
                
                if(resultado.resultado.length > 0) res.json({ pesquisador: resultado.resultado, busca: true})
                else res.json({ message: 'Nome não consta na base de dados', busca: false})
            } 
            else res.json({ message: resultado.message, busca: false})
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Atualiza um parâmetro em uma row no banco de dados de acordo com um nome fornecido retorna o json.
     */

    async updatePesquisador(req, res){
        try {
            const nome = req.params.nome;
            const {coluna, valor} = req.body
            const resultado = await projetoCitRepository.updatePesquisador(coluna, valor, nome);
            if (resultado.correto){

                // Confere Se houve alguma atualização, pois se tentar atualizar uma row que não existe no banco de dados, o código não dá erro, apenas não faz nada
                // Então, se por acaso o código não fizer nada, já retorna que não foi atualizado nada porque o nome fornecido não consta no banco.

                if(resultado.update > 0) res.json({ message: 'Atualizado com sucesso!', atualizacao: true})
                else res.json({ message: 'Nome não consta na base de dados', atualizacao: false})
            } 
            else res.json({ message: resultado.message, atualizacao: false})
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Deleta uma row no banco de dados de acordo com um nome fornecido retorna o json.
     */

    async deletePesquisador(req,res){
        try {
            const nome = req.params.nome;
            const resultado = await projetoCitRepository.deletePesquisador(nome);
            if (resultado.correto){

                // Mesma lógica da atualização

                if(resultado.update > 0) res.json({ message: 'Excluído com sucesso!', exclusao: true})
                else res.json({ message: 'Nome não consta na base de dados', exclusao: false})
            }
            else res.json({ message: resultado.message, exclusao: false})
        } catch (error) {
            console.log(error)
        }

    }

}

export default new projetoCitController();
