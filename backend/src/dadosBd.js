const { faker } = require('@faker-js/faker/locale/pt_BR');
const { USER_TYPES } = require('./config/enums');
const url = 'http://localhost:8081/api/';

module.exports = {

    preencher: async (req, res)=>{
        let tokenAdm = await fetch(url+'login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: 'admin', senha: '1234'})
        });
        tokenAdm = await tokenAdm.json();
        tokenAdm = tokenAdm.token;
        console.log(tokenAdm);
        const clientes=[];
        const quartos=[];
        let cliente;
        let funcionario;

        //usuarios
        console.log("\n\nusuarios:");
        for (let i = 0; i < 20; i++) {
            const user = {}
            user.login = faker.internet.username();
            user.senha = faker.internet.password();
            user.nome = faker.person.fullName();
            user.tipo = faker.helpers.arrayElement([USER_TYPES.FUNCIONARIO, USER_TYPES.CLIENTE]);
            
            if (!funcionario && user.tipo == USER_TYPES.FUNCIONARIO)
                funcionario = user;
            let response = await fetch(url+'usuarios',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAdm}`
                },
                body: JSON.stringify(user)
            });
            response = await response.json();
            console.log(response);
            if (user.tipo == USER_TYPES.CLIENTE){
                clientes.push(response);
                if(!cliente){
                    cliente = user;
                }
            }
        }

        //login cliente e func
        console.log("\n\nlogins:")
        let tokenCli = await fetch(url+'login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: cliente.login, senha: cliente.senha})
        });
        tokenCli = await tokenCli.json();
        tokenCli = tokenCli.token;
        console.log(tokenCli);
        let tokenFunc = await fetch(url+'login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: funcionario.login, senha: funcionario.senha})
        });
        tokenFunc = await tokenFunc.json();
        tokenFunc = tokenFunc.token;
        console.log(tokenFunc);
        

        //clientes
        const clientesAux = [];
        const tamanho = clientes.length+20;
        console.log("\n\nclientes:")
        for (let i=0; i<tamanho;i++){
            let cli = {};
            if(clientes.length>0){
                cli = clientes.pop();
                cli.id_usuario = cli.id;
                delete cli.id;
            }else{
                cli.nome = faker.person.fullName();
            }
                cli.cpf = faker.helpers.replaceSymbols('###.###.###-##');
                cli.telefone = faker.phone.number();
            let response = await fetch(url+'clientes',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+tokenFunc
                },
                body: JSON.stringify(cli)
            });
            response = await response.json();
            console.log(response);
            clientesAux.push(response);
        }

        //quartos
        console.log("\n\nquartos:");
        for (let i=0; i<50;i++){
            const quarto = {};
            quarto.numero = (Math.floor((i+10)/10) * 100) + i % 10 + 1;
            quarto.preco = faker.commerce.price({min: 100, max: 500, dec: 2});
            quarto.tipo = faker.helpers.arrayElement(['SIMPLES', 'LUXO', 'DELUXE']);
            let response = await fetch(url+'quartos',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+tokenFunc
                },
                body: JSON.stringify(quarto)
            });
            response = await response.json();
            console.log(response);
            quartos.push(response);
        }

        //reservas
        console.log("\n\nreservas:");
        let token;
        for(let i=0; i<clientesAux.length;i++){
            const reserva = {};
            reserva.id_cliente = clientesAux[i].id;
            if (i<1){
                token = tokenCli;
            }else{
                token = tokenFunc;
            }
            reserva.id_quarto = faker.helpers.arrayElement(quartos).id;
            reserva.data_checkin = faker.date.soon({ days: 2*(i+1) });
            reserva.data_checkout = faker.date.between({from: reserva.data_checkin, to: reserva.data_checkin.getTime()+(3*24*60*60*1000)});

            const response = await fetch(url+'reservas',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(reserva)
            });
            console.log(await response.json());
        }
        
        res.send(200).json({status: 'sucesso'})
    }
}