const puppeteer = require("puppeteer-extra");
const fs = require('fs');
const rp = require('request-promise');
const request = require('request');

(async () => {
    try {
        await puppeteer.use(require("puppeteer-extra-plugin-stealth")());

        const browser = await puppeteer.launch({
            args: [
                '--disable-web-security', '--incognito', '--no-sandbox'],
            slowMo: 10,
            // executablePath: '/usr/bin/chromium-browser',
            headless: false,
        });
    
        const context = await browser.createIncognitoBrowserContext();
    
        const page = await context.newPage();
        await novo(page)
        await adcionarRegistro(page)
    } catch(e) {    
        console.log('erro', e)
    }
    
})()

const novo = async (page) => {
    try {
        // const navigationPromise = page.waitForNavigation();

        await page.goto('https://www.allianznet.com.br/drlf01/web/allianznet');
        await page.type('#usuario', 'BA565270');
        await page.type('#password', 'Galry19#');
        await page.click('#_58_login_button');
        await page.waitFor(10000)
        await page.click('#newUser');
        await page.waitFor(10000)
        await page.waitForSelector('#buttonCollapse2');
        await page.click('#buttonCollapse2');
        await page.click('#collapse2 > div > a:nth-child(1)');
    } catch(e) {
        console.log('error', e)
        throw {
            message: 'Erro ao logar'
        }
    }

}
const adcionarRegistro = async (page) => {
    try {
        // await frame.waitFor(20000);
        let frames = await page.frames()

        const formFrame = await carregarIframe(frames, page)
        await carregarConteudoFrame(formFrame, 'input[id*="nifTomador"]');
        await formFrame.evaluate((body) => {
            document.querySelector('input[id*="fechaEfecto"]').value = body.vigencia_inicio;
            document.querySelector('input[id*="fechaTerm"]').value = body.vigencia_fim;
            document.querySelector('input[id*="nifTomador"]').value = body.item.cnpj_cpf;
            document.querySelector('input[id*="colaborador"]').value = '22';
            document.querySelector('#btnAceptar').click();

        }, body)        
    } catch(e) {
        console.log(e)
        throw {
            message: 'Erro ao adcionar registro'
        }
    }

}

const carregarIframe = async (frames, page, timeout = null) => {
    try{
        if(timeout) {
            setTimeout(() => {
                throw 'Timeout error'
            }, timeout)
        }
        let formFrame = await page.frames().find(f => f.name() === 'appArea');
        while(!formFrame ) {
                console.log('esperando', formFrame)
                await page.waitFor(1000)
                formFrame = await page.frames().find(f => f.name() === 'appArea');
                
        }

        return formFrame
    }catch(e) {
        console.log(e)
        throw e
    }
}

const carregarConteudoFrame = async (frame, selector) => {

    let conteudo = await frame.evaluate((selector) => {
        return document.querySelector(selector)
    }, selector)

    while(!conteudo) {
        await frame.waitFor(1000)
        conteudo = await frame.evaluate((selector) => {
            return document.querySelector(selector)
        }, selector)
        console.log('conteudo:', conteudo)
    }
    return true
}


const body = {
    "tipo_vigencia": "1",
    "vigencia_inicio": "11\/30\/2019",
    "vigencia_fim": "11\/30\/2020",
    "orgao_publico": "0",
    "valida_cobertura": "0",
    "proponente_ddd": "19",
    "proponente_telefone": "23238989",
    "categoria_codigo": "2",
    "proponente_nome": "Condom\u00ednio Am\u00e9rica do Sul",
    "agencia_razao": "Zeladoria Adm Cond Neg\u00f3cios Imobili\u00e1rios EIRELI",
    "agencia_cnpj": "08613664000138",
    "agencia_email": "kevin@email.com",
    "agencia_ddd": "19",
    "telefone": "23238989",
    "agencia_cep": "",
    "agencia_conta": "",
    "agencia_banco": "",
    "agencia_agencia": "",
    "item": {
        "tipo_seguro": "11",
        "tipo_risco": "2",
        "possui_elevador": "31",
        "codigo_postal": "13874222",
        "periodo_indenitario": "-1",
        "codigo_vaga": "501",
        "total_funcionarios": "14",
        "codigo_experiencia": "401",
        "tipo_pessoa": "1",
        "tipo_estrutura": "1",
        "idade_condominio": "83",
        "quantidade_funcionarios": "14",
        "cnpj_cpf": "10802423000189",
        "endereco_numero": "08",
        "endereco": "teste",
        "bairro": "vila barbosa",
        "cidade": "campinas",
        "uf": "SP",
        "dat_vistoria": "09\/18\/2019"
    },
    "questionario": [{
            "pergunta_codigo": "9",
            "resposta_codigo": "-1",
            "resposta_descricao": "900",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "900",
            "tipo_objeto": "600"
        },
        {
            "pergunta_codigo": "1",
            "resposta_codigo": "0",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "10",
            "resposta_codigo": "1",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "7",
            "resposta_codigo": "0",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "8",
            "resposta_codigo": "0",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "12",
            "resposta_codigo": "14",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "11",
            "resposta_codigo": "11",
            "resposta_descricao": ".",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "4",
            "resposta_codigo": "1",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "3",
            "resposta_codigo": "1",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "5",
            "resposta_codigo": "0",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "6",
            "resposta_codigo": "0",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "2",
            "resposta_codigo": "0",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        },
        {
            "pergunta_codigo": "13",
            "resposta_codigo": "51",
            "resposta_descricao": "",
            "resposta_data": "09\/18\/2019",
            "resposta_texto": "0"
        }
    ],
    "cobertura": [{
            "codigo": "1",
            "valor_importancia_segurada": "2240000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        },
        {
            "codigo": "22",
            "valor_importancia_segurada": "80000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        },
        {
            "codigo": "23",
            "valor_importancia_segurada": "80000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        },
        {
            "codigo": "24",
            "valor_importancia_segurada": "20000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        },
        {
            "codigo": "2",
            "valor_importancia_segurada": "20000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        },
        {
            "codigo": "6",
            "valor_importancia_segurada": "20000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        },
        {
            "codigo": "30",
            "valor_importancia_segurada": "20000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        },
        {
            "codigo": "3",
            "valor_importancia_segurada": "20000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        },
      
        {
            "codigo": "34",
            "valor_importancia_segurada": "56000",
            "codigo_opcao": "1",
            "valor_premio_final": "0",
            "com_valor_de_novo": "0",
            "val_premio_anterior": "0"
        }
    ]
}