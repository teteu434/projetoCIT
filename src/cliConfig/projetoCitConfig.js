import readline from 'readline-sync';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Arquivo responsável pelas funções que fazem a interação com o usuário.
 */


// Rotas principais da API

const urlPonto = `http://localhost:${process.env.API_PORT}/pontos`;
const urlPesquisador = `http://localhost:${process.env.API_PORT}/pesquisadores`;

/**
 * Em função do servidor ser mais lento, esta função aguarda a inicialização do servidor antes de realizar requisições.
 * 
 * Esta função faz requisições periódicas a um endpoint da API para verificar se o servidor já está pronto para receber 
 * requisições. Se o servidor não estiver pronto, ela aguarda alguns segundos e tenta novamente até um número máximo de tentativas.
 * 
 * @returns O retorno é apenas para parar a o while antes da hora.
 */

async function aguardarServidor() {
    let tentativas = 5; // numero de tentativas
    while (tentativas > 0) {
        try {
            const resposta = await fetch(urlPonto); // Apenas um endpoint válido, somente para testes de conexão.
            if (resposta.ok) {
                console.log("Servidor está pronto!");
                return;
            }
        } catch (error) {
            console.log("Aguardando servidor iniciar...");
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de tentar de novo
        tentativas--;
    }
    console.log("O servidor pode não estar pronto.");
}



/**
 * Exibe o menu de opções para gerenciar pesquisadores.
 * @returns {number} - Opção escolhida pelo usuário.
 */

async function menu (){
    console.log("-------------------------------------------------------")
    console.log('Seja bem vindo ao sistema de catalogação de escavações!')
    console.log('-------------------------------------------------------\n')
    console.log('Digite a opção desejada!')
    console.log('1. Pontos de escavação')
    console.log('2. Pesquisadores')
    console.log('3. Sair')
    return readline.questionInt();
}

/**
 * Exibe o menu de opções para gerenciar pesquisadores.
 * @returns {number} - Opção escolhida pelo usuário.
 */

async function menu1() {
    console.log("\n----------------------------------")
    console.log("          Menu dos pontos     ")
    console.log("----------------------------------\n")
    console.log("1. Cadastrar um novo ponto");
    console.log("2. Listar todos os pontos");
    console.log('3. Buscar um ponto específico')
    console.log("4. Atualizar um ponto");
    console.log("5. Remover um ponto");
    console.log("6. Menu Anterior\n");
  
    return readline.questionInt("Escolha uma opção: ");

}

/**
 * Exibe o menu de opções para gerenciar pesquisadores.
 * @returns {number} - Opção escolhida pelo usuário.
 */

async function menu2() {
    console.log("\n----------------------------------")
    console.log("      Menu dos pesquisadores!     ")
    console.log("----------------------------------\n")
    console.log("1. Cadastrar um novo pesquisador");
    console.log("2. Listar todos os pesquisadores");
    console.log('3. Buscar um pesquisador específico')
    console.log("4. Atualizar um pesquisador");
    console.log("5. Remover um pesquisador");
    console.log("6. Menu Anterior\n");
  
    return readline.questionInt("Escolha uma opção: ");
}

/**
 * Cadastra um novo ponto de escavação, solicitando informações ao usuário.
 */

async function cadastrarPonto() {
    const id = readline.questionInt("\nDigite o ID: ")
    const tipo = readline.question("Tipo do ponto: ");
    const latitude = readline.question("Latitude: ");
    const longitude = readline.question("Longitude: ");
    const altitude = readline.questionFloat("Altitude (Metros): ");
    const descricao = readline.question("Descrição: ");
    const responsavel = readline.question("Responsável: ");
    const data = readline.question("Data da Escavação (formato DD/MM/YYYY): ")

    // No PostGre, a data é aceita apenas no padrão dos EUA, que é YYYY-MM-DD. Nessa parte, estou convertendo a data no padrão do Brasil para esse padrão dos EUA, para 
    // o banco de dados aceitar.

    const [dia, mes, ano] = data.split("/") 
    const dataDescoberta = `${ano}-${mes}-${dia}`;
    const ponto = {id, tipo, latitude, longitude, altitude, responsavel, dataDescoberta, descricao}

    // Fetch para registrar um novo ponto
        try{
            await aguardarServidor()
            const resposta = await fetch(urlPonto, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(ponto)
                
            });
                            
                const resultado = await resposta.json();
                
                console.log(resultado.message)


                
                if(resultado.cadastrado){

                    // Novo fetch para conferir se o responsável registrado já está no banco de dados.

                    try {
                        const response = await fetch(`${urlPesquisador}/${responsavel}`, {
                            method: 'GET',
                            headers: {'Content-Type': 'application/json'}
                        });              
                        const result = await response.json();   
                        // Se o responsável já constar no banco, o código só continua e volta para o menu. Se ele não estiver, cadastra seus dados no banco de dados.

                        if(!result.busca){
                            console.log('Pesquisador não registrado em nosso banco de dados. Digite sobre os dados do mesmo!')
                            const email = readline.question("Email: ")
                            const instituicao = readline.question("Instituição: ")
                            const especialidade = readline.question("Especialidade: ")
                            const nome = responsavel;
                            const pesquisador = {nome, email, instituicao, especialidade}

                            try {
                                await aguardarServidor()
                                const resp = await fetch(urlPesquisador, {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify(pesquisador)
                                });
                                
                                
                                const textoResposta = await resp.text();
                                console.log(textoResposta);
                                
                                

                            } catch (error) {
                                console.log(error) 
                            }
                        }

                    } catch (error) {
                        console.log(error)
                    }
                }
    
        } catch(error){
            console.log(error)
        }
}

/**
 * Lista todos os pontos de escavação, com o usuário podendo ou não ordenar de acordo com um parâmetro de preferência.
 */

async function listarPonto() {
    console.log('\nGostaria que fosse ordenado?\n1. Sim\n2. Não')
    const opcao = readline.questionInt();
    if(opcao == 1){

        // Os nomes das colunas no banco de dados estão um pouco diferentes do nome real, visto que as colunas nao aceitam nomes com acentos, e por padrão começam com letra minúscula.
        // O vetor foi criado para relacionar cada nome de cada coluna com o nome real escolhido pelo usuário.

        const vetor = ['tipo', 'latitude', 'longitude', 'altitude', 'responsavel', 'dataDescoberta', 'descricao', 'id']
        console.log("Digite o número para qual parametro que deseja ordenar:\n0. Tipo\n1. Latitude\n2. Longitude\n3. Altitude\n4. Responsável\n5. Data da Descoberta\n6. Descrição\n7. ID")
        const coluna = readline.questionInt()
        if(coluna > 7 || coluna < 0) console.log('Valor inválido.')

        // O fetch muda de acordo com o que a pessoa escolher. Se ela quiser ordenado, já vem ordenado do banco de dados com o comando ORDER BY. 
        // Caso contrário, vem apenas um SELECT.

        else {
            await aguardarServidor()
            const resposta = await fetch(`${urlPonto}/ordenado/${vetor[coluna]}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });

            const resultado = await resposta.json()

            if(resultado){
                
                

                var cont = 1;
                resultado.resultado.forEach(ponto => {
                    const data = new Date(ponto.datadescoberta)
                    const dataFormatada = data.toLocaleDateString("pt-BR")
                    console.log(`Ponto ${cont}:`)
                    console.log(`ID: ${ponto.id}. Tipo: ${ponto.tipo}`)
                    console.log(`Latitude: ${ponto.latitude}. Longitude: ${ponto.longitude}. Altitude: ${ponto.altitude}.`)
                    console.log(`Responsável: ${ponto.responsavel}. Data da Descoberta: ${dataFormatada}`)
                    console.log(`Descrição: ${ponto.descricao}\n\n`)
                    cont++;
                });
            }

        }
    } else if (opcao == 2){
        await aguardarServidor()
        const resposta = await fetch(urlPonto, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        const resultado = await resposta.json()

        if(resultado){
    
            var cont = 1;
            resultado.resultado.forEach(ponto => {
                const data = new Date(ponto.datadescoberta)
                const dataFormatada = data.toLocaleDateString("pt-BR")
                console.log(`Ponto ${cont}:`)
                console.log(`ID: ${ponto.id}. Tipo: ${ponto.tipo}`)
                console.log(`Latitude: ${ponto.latitude}. Longitude: ${ponto.longitude}. Altitude: ${ponto.altitude}.`)
                console.log(`Responsável: ${ponto.responsavel}. Data da Descoberta: ${dataFormatada}`)
                console.log(`Descrição: ${ponto.descricao}\n\n`)
                cont++;
            });
        }

    } else {
        console.log("Valor errado, digite novamente.")
        return;
    }



}

/**
 * Atualiza um ponto de escavação, com o usuário podendo escolher um parâmetro de preferência para realizar tal atualização.
 */

async function atualizarPonto() {

    // Mesma lógica de vetor implantada

    const vetor = ['tipo', 'latitude', 'longitude', 'altitude', 'responsavel', 'dataDescoberta', 'descricao'];
    const id = readline.questionInt("Digite o ID: ")
    console.log("Digite o número parametro que deseja mudar:\n0. Tipo\n1. Latitude\n2. Longitude\n3. Altitude\n4. Responsável\n5. Data da Descoberta\n6. Descrição")
    const coluna = readline.questionInt()
    var valor = readline.question(`Digite o(a) novo(a) ${vetor[coluna]}: `)
    if(coluna > 6 || coluna < 0) console.log('Valor inválido.')
        else{

            // Se por acaso o parâmetro escolhido for a data, precisa-se fazer o ajuste para o PostGre.

            if(coluna == 5){
                const [dia, mes, ano] = valor.split("/")
                valor = `${ano}-${mes}-${dia}`;
            }

            const atualizacao = {coluna: vetor[coluna], valor}
            try {
                await aguardarServidor()
                const resposta = await fetch (`${urlPonto}/${id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(atualizacao),
                    credentials: 'include'
                })
                
                const textoResposta = await resposta.text()
                console.log(textoResposta);

        
            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        }

}

/**
 * Busca um ponto de escavação específico, de acordo com seu ID.
 */

async function buscarPonto(){
    const id = readline.questionInt("Digite o ID: ")
    try {
        await aguardarServidor()
        const resposta = await fetch (`${urlPonto}/${id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })

        const resultado = await resposta.json();

        // Extrai a data no formato dos EUA, e transforma de volta para o formato do Brasil


        if(resultado.busca){
            const data = new Date(resultado.ponto[0].datadescoberta)
            const dataFormatada = data.toLocaleDateString("pt-BR")
            console.log("Ponto encontrado com sucesso!\n")
            console.log(`ID: ${resultado.ponto[0].id}. Tipo: ${resultado.ponto[0].tipo}`)
            console.log(`Latitude: ${resultado.ponto[0].latitude}. Longitude: ${resultado.ponto[0].longitude}. Altitude: ${resultado.ponto[0].altitude}.`)
            console.log(`Responsável: ${resultado.ponto[0].responsavel}. Data da Descoberta: ${dataFormatada}`)
            console.log(`Descrição: ${resultado.ponto[0].descricao}\n\n`)

            // Opção de ver sobre o pesquisador relacionado à esse ponto de escavação

            console.log("Gostaria de saber sobre o pesquisador também?\n1. Sim\n2. Não")
            const opcao = readline.questionInt()
            if(opcao == 1){
                const nome = resultado.ponto[0].responsavel;
                await aguardarServidor();
                const response = await fetch(`${urlPesquisador}/${nome}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                })

                const result = await response.json()

                if(result.busca){
                    console.log("Busca realizada com sucesso!\n")
                    console.log(`Nome: ${result.pesquisador[0].nome}. Email: ${result.pesquisador[0].email}`)
                    console.log(`Instituição: ${result.pesquisador[0].instituicao}. Especialidade: ${result.pesquisador[0].especialidade}\n\n`)
                }else console.log(result.message)

            } 
            else if(opcao == 2) console.log("OK!")
            else console.log("Valor Inválido")
        } else console.log(resultado.message)



    } catch (error) {
        console.log(error)
    }

}

/**
 * Deleta um ponto de escavação específico, de acordo com seu ID.
 */

async function deletarPonto() {
    const id = readline.questionInt("Digite o ID: ")
    try {
        await aguardarServidor()
        const resposta = await fetch (`${urlPonto}/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        })

        const resultado = await resposta.json();
        
        console.log(resultado.message)

    } catch (error) {
        console.log(error)
    }
}

/**
 * Cadastra um novo pesquisador de ponto de escavação, solicitando informações ao usuário.
 */

async function cadastrarPesquisador() {
    const nome = readline.question("Nome: ");
    const email = readline.question("Email: ");
    const instituicao = readline.question("Instituição: ");
    const especialidade = readline.question("Especialidade: ");

    const pesquisador = {nome, email, instituicao, especialidade}
    
        try{
            await aguardarServidor()
            const resposta = await fetch(urlPesquisador, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(pesquisador)
                
            });
                            
            const textoResposta = await resposta.text();
            console.log(textoResposta);
                
    
        } catch(error){
            console.log(error)
        }
}

/**
 * Lista todos os pesquisadores registrados no banco de dados.
 */

async function listarPesquisador() {

    console.log('\nGostaria que fosse ordenado?\n1. Sim\n2. Não')
    const opcao = readline.questionInt();
    if(opcao == 1){

        // Mesma lógica do vetor

        const vetor = ['nome', 'email', 'instituicao', 'especialidade'];
        console.log("Digite o número do parametro para qual deseja ordenar:\n0. Nome\n1. Email\n2. Instituição\n3. Especialidade")
        const coluna = readline.questionInt()
        if(coluna > 3 || coluna < 0) console.log('Valor inválido.')

        // O fetch muda de acordo com o que a pessoa escolher. Se ela quiser ordenado, já vem ordenado do banco de dados com o comando ORDER BY. 
        // Caso contrário, vem apenas um SELECT.

        else {
            await aguardarServidor()
            const resposta = await fetch(`${urlPesquisador}/ordenado/${vetor[coluna]}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });

            const resultado = await resposta.json()

            if(resultado){
                
                var cont = 1
                resultado.resultado.forEach(pesquisador => {
                    console.log(`Pesquisador ${cont}:`)
                    console.log(`Nome: ${pesquisador.nome}. Email: ${pesquisador.email}`)
                    console.log(`Instituição: ${pesquisador.instituicao}. Especialidade: ${pesquisador.especialidade}\n\n`)
                    cont++;
                });
            }

        }
    } else if (opcao == 2){
        await aguardarServidor()
        const resposta = await fetch(urlPesquisador, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        const resultado = await resposta.json()

        if(resultado){
    
            var cont = 1
            resultado.resultado.forEach(pesquisador => {
                console.log(`Pesquisador ${cont}:`)
                console.log(`Nome: ${pesquisador.nome}. Email: ${pesquisador.email}`)
                console.log(`Instituição: ${pesquisador.instituicao}. Especialidade: ${pesquisador.especialidade}\n\n`)
                cont++;
            });
        }

    } else {
        console.log("Valor errado, digite novamente.")
        return;
    }

}

/**
 * Atualiza os registros do pesquisador, de acordo com o parâmetro escolhido pelo usuário.
 */

async function atualizarPesquisador() {
    const vetor = ['nome', 'email', 'instituicao', 'especialidade'];
    const nome = readline.question("Digite o nome: ")
    console.log("Digite o número parametro que deseja mudar:\n0. Nome\n1. Email\n2. Instituição\n3. Especialidade")
    const coluna = readline.questionInt()
    const valor = readline.question(`Digite o(a) novo(a) ${vetor[coluna]}: `)
    const atualizacao = {coluna: vetor[coluna], valor}
    if(coluna > 3) console.log('Valor inválido.')
    else{
        try {
            await aguardarServidor()
            const resposta = await fetch (`${urlPesquisador}/${nome}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(atualizacao)
            })
    
                const textoResposta = await resposta.text();
                console.log(textoResposta);
    
        } catch (error) {
            console.log(error.message)
        }
    }


}

/**
 * Busca um pesquisador de acordo com um ID.
 */

async function buscarPesquisador(){
    const nome = readline.question("Digite o nome: ")
    try {
        await aguardarServidor()
        const resposta = await fetch (`${urlPesquisador}/${nome}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })

        const resultado = await resposta.json();

        if(resultado.busca){

            // Busca todos os pontos que esse pesquisador é responsável.

            console.log("Busca realizada com sucesso!\n")
            console.log(`Nome: ${resultado.pesquisador[0].nome}. Email: ${resultado.pesquisador[0].email}`)
            console.log(`Instituição: ${resultado.pesquisador[0].instituicao}. Especialidade: ${resultado.pesquisador[0].especialidade}\n\n`)
            console.log("Gostaria de saber sobre os pontos de escavação desse pesquisador também?\n1. Sim\n2. Não")
            const opcao = readline.questionInt()
            if(opcao == 1){
                const responsavel = resultado.pesquisador[0].nome;
                await aguardarServidor()
                const response = await fetch(`${urlPonto}/pesquisador/${responsavel}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                })
                const result = await response.json();
                if(result.busca){
                    var cont = 1
                    result.pontos.forEach(ponto => {
                        const data = new Date(ponto.datadescoberta)
                        const dataFormatada = data.toLocaleDateString("pt-BR")
                        console.log(`Ponto ${cont}:`)
                        console.log(`ID: ${ponto.id}. Tipo: ${ponto.tipo}`)
                        console.log(`Latitude: ${ponto.latitude}. Longitude: ${ponto.longitude}. Altitude: ${ponto.altitude}.`)
                        console.log(`Responsável: ${ponto.responsavel}. Data da Descoberta: ${dataFormatada}`)
                        console.log(`Descrição: ${ponto.descricao}\n\n`)
                    });

                } else console.log(result.message)

            } 
            else if(opcao == 2) console.log("OK!")
            else console.log("Valor Inválido")
        } else console.log(resultado.message)

    } catch (error) {
        console.log(error.message, error.erro)
    }

}

/**
 * Deleta um pesquisador de acordo com um ID.
 */

async function deletarPesquisador() {
    const nome = readline.question("Digite o nome: ")
    try {
        await aguardarServidor()
        const resposta = await fetch (`${urlPesquisador}/${nome}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        })

        const resultado = await resposta.json();
        
        console.log(resultado.message)

    } catch (error) {
        console.log(error)
    }
}


/**
 * Menu principal, que chama as outras funções e menus de acordo com a escolha do usuário
 */

async function menuPrincipal() {
    while(true){
        const opcao = await menu()
        if(opcao == 1){
            const opcao1 = await menu1()
            switch (opcao1) {
                case 1:
                    await cadastrarPonto()
                    break;
                case 2:
                    await listarPonto()
                    break;
                case 3:
                    await buscarPonto()
                    break;
                case 4:
                    await atualizarPonto()
                    break;
                case 5:
                    await deletarPonto()
                    break;
                case 6: 
                    break;
                default:
                    console.log("Opção inválida!")
                    break;
            }
        }else if(opcao == 2){
            const opcao2 = await menu2()
            switch (opcao2) {
                case 1:
                    await cadastrarPesquisador()
                    break;
                case 2:
                    await listarPesquisador()
                    break;
                case 3:
                    await buscarPesquisador()
                    break;
                case 4:
                    await atualizarPesquisador()
                    break;
                case 5:
                    await deletarPesquisador()
                    break;
                case 6: 
                    break;
                default:
                    console.log("Opção inválida!")
                    break;
            }
        }else if (opcao == 3){
            console.log('Saindo...')
            break;
        }else{
            console.log('Opção inválida')
        }
    }
    

}

export default {menuPrincipal};