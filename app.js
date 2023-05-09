
class Despesa {
    constructor (ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia 
        this.tipo = tipo
        this.descricao = descricao 
        this.valor = valor
    }

    validarDesperas() {
        for(let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            } 
        }
        return true
    }
}

class Bd {

    constructor () {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId () {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar (d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id)

    }


    recuperarTodosOsRegistros () {
        // Criando um Array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        //Recuperando todas as despesas
        for (let i = 1; i <= id; i++) {
            //Recuperando a despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            // Verificando se existe indices que foram excluidos
            if (despesa == null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)

        }
        return  despesas
    }
    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosOsRegistros()
        //Aplicando filtros
        // ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes 
        if (despesa.mes != '') {  
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }   
        //descrição
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
       return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
        
    }
}

let bd = new Bd()


function cadastrarProduto() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')


    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value,    
        tipo.value, 
        descricao.value, 
        valor.value
        )
    if(despesa.validarDesperas()) { 
        // Se der certo
        bd.gravar(despesa)
        document.getElementById('modalTitulo').innerHTML = 'Registro inserido com sucesso!'
        document.getElementById('cor').className = 'modal-header text-success'
        document.getElementById('modalConteudo').className = 'modal-body text-success'
        document.getElementById('modalConteudo').innerHTML = 'Despesa foi registrada com sucesso!'
        document.getElementById('modalBotao').innerHTML = 'OK'
        document.getElementById('modalBotao').className = 'btn btn-success'
        $('#modalRegistrarGravacao').modal('show')
        // Zerando atributos
        ano.value = ''
        mes.value = ''
        dia.value = ''    
        tipo.value = '' 
        descricao.value = '' 
        valor.value = ''
    } else {
        // Se der errado
        document.getElementById('modalTitulo').innerHTML = '[ERROR] - Algo deu errado.'
        document.getElementById('cor').className = 'modal-header text-danger'
        document.getElementById('modalConteudo').className = 'modal-body text-danger'
        document.getElementById('modalConteudo').innerHTML = 'Todos os dados devem ser preenchidos corretamente!'
        document.getElementById('modalBotao').innerHTML = 'Voltar e corrigir'
        document.getElementById('modalBotao').className = 'btn btn-danger'
        $('#modalRegistrarGravacao').modal('show')
    }
    
}

function carregaListaDespesas (despesas = Array(), filtro = false) {
    
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosOsRegistros()
    }
    
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //Percorrendo o Array despesa
    despesas.forEach(function(d) {
        //Criando linha
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        // Ajustando o tipo
        switch(d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break
            case '2':
                d.tipo = 'Educação'
                break
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Saúde'
                break
            case '5':
                d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$${d.valor}`
        // Botão de exclusão

        let btn = document.createElement('button')
        btn.className = 'btn btn-outline-danger'
        btn.innerHTML = '<i class = "fas fa-times"></i>'
        // Removendo despesas
        btn.id = `idDespesas_${d.id}`
        
        btn.onclick = function () {
            let id = this.id.replace('idDespesas_', '')
            bd.remover(id)
            $('#itemExcluido').modal('show')
            
        }
        linha.insertCell(4).append(btn)
    })
    let total = 0
 
    //valida em despesas o total
    despesas.forEach(function(d){
 
        total += Number(d.valor)
        
    })
    document.getElementById('somaCompras').innerHTML = `Total ${total}`

}

function carregaListaDespesas2(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosOsRegistros()
    }


    let listaDespesas = document.getElementById("listaDespesas")
    despesas.forEach(function (d) {

        document.getElementById('totalItensCadastrados').innerHTML = `${d.id}`

        //gerar Total
        let total = 0

        //valida em despesas o total
        despesas.forEach(function (item) {

            total += Number(item.valor)
        })

        document.getElementById('somaCompras').innerHTML = `R$ ${total}.00`

    })

}

function filtrar () {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)

    

}






