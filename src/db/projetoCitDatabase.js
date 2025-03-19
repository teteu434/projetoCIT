import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

/**
 * Configuração da conexão com o banco de dados PostgreSQL.
 * As credenciais e configurações são carregadas a partir de variáveis de ambiente.
 */

const config = {
    user: process.env.DB_USER, // Usuário do banco de dados
    password: process.env.DB_PASSWORD, // Senha do banco de dados
    host: process.env.DB_HOST, // Host do banco de dados
    port: process.env.DB_PORT, // Porta do banco de dados
    database: process.env.DB, // Nome do banco de dados
    ssl: {
        rejectUnauthorized: false // Permite conexões SSL inseguras (útil para certos ambientes)
    },
};

const banco = new Pool(config);

/**
 * Testa a conexão com o banco de dados.
 */
(async () => {
    try {
        const client = await banco.connect();
        console.log('Conectado ao banco com sucesso!');
        client.release();
    } catch (err) {
        console.error('Erro ao conectar ao banco: ', err);
    }
})();

// Listener para capturar erros na conexão
banco.on('error', (err) => {
    console.error('Erro no banco de dados: ', err);
});

/**
 * Executa uma consulta SQL simples no banco de dados.
 * @param {string} sql - A consulta SQL a ser executada.
 * @param {Array|*} valor - Valores a serem inseridos na consulta (se necessário).
 * @param {string} mensagem - Mensagem de erro personalizada caso a consulta falhe.
 * @returns {Promise<{update: number, resultado: Object[], correto: boolean}>} - Retorna uma promessa com o resultado da consulta.
 */


function consultaSimples(sql, valor, mensagem) {
    return new Promise(async (resolve, reject) => {
        try {
            let result;

            if (valor === '') {
                result = await banco.query(sql);
            } else {
                const valores = Array.isArray(valor) ? valor : [valor];
                result = await banco.query(sql, valores);
            }

            resolve({
                update: result.rowCount, // Número de linhas afetadas
                resultado: result.rows, // Dados retornados pela consulta
                correto: true
            });
        } catch (error) {
            reject({
                erro: error,
                message: mensagem,
                correto: false
            });
        }
    });
}

export default consultaSimples;
