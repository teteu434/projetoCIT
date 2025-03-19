import {menu, menu1, menu2, cadastrarPonto, listarPonto, buscarPonto, atualizarPonto, deletarPonto, 
    cadastrarPesquisador, listarPesquisador, buscarPesquisador, atualizarPesquisador, deletarPesquisador} from './src/cliConfig/projetoCitConfig.js';

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

await menuPrincipal(); // Chama o Menu.