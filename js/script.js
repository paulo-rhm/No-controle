const modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },

    close(){
        // Fechar modal
        // Remover class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}
// salvamdo o localstorage
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("finances:transactions",JSON.stringify(transactions))
    }
}
// realisando as somas para enviar ao updateBalance
const Transaction = {
     
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        app.reload ()
    },

    remove (index) {
        Transaction.all.splice (index, 1)

        app.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount > 0 ) {
                income += transaction.amount;
            }
        })       
        return income;
    },

    expenses() {
        
            let expense = 0;
            // pegar todas as transacoes
            // para cada transacao, 
            Transaction.all.forEach(transaction => {
                 // se for menor que 0
                if( transaction.amount < 0 ) {
                    // somar a uma variavel eretornar a varivel
                    expense += transaction.amount;
            }
            })
            
            
            return expense
        
    },
    total(){
        // entrad - saídas
        return  Transaction.incomes() + Transaction.expenses();
    }
}
// Substituir os dados do html com os dados do js

const DOM = {

    transactionsContainer: document.querySelector('#data-base tbody'),

    addTransaction(transaction, index) {
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHtmlTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHtmlTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `                   
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td> 
        <img onclick="Transaction.remove(${index})" src="img/remover.png" alt="remover transação"> </td>
    
        `
        return html
    },

// subistituindo  os valores dos card no html e formataçao
    updateBalance() {
        document
                .getElementById('incomeDisplay')
                .innerHTML = Utils.formatCurrency(Transaction.incomes())
        
        document
                .getElementById('expenseDisplay')
                .innerHTML = Utils.formatCurrency(Transaction.expenses())
        
        document
                .getElementById('totalDisplay')
                .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions () {
        DOM.transactionsContainer.innerHTML = ""

    }
}
// formatando a moeda 
const Utils = {

    formatAmount(value){

        value = Number(value) * 100
        
        return Math.round(value)
    },

    formatDate(date){

        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        //colocando o sinal de monos
       const signal = Number(value) < 0 ? "-" : ""
        // removendo caracteres especiais
       value = String(value).replace(/\D/g, "")
        //dividindo por 100 colocamdo as virgolas casas decimais
       value = Number(value) / 100
        // convertendo para moeda brasileira
       value = value.toLocaleString("pt-BR", {
           style: "currency",
           currency: "BRL"
       })

        return signal + value
    }
   
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        if(
            description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")

        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date

        }
    },
    saveTransaction(transaction) {
        Transaction.add(transaction) // poderia ter posto direto no 1

    },
    clearFilds() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    
    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields() 
            // formatar dados 
            const transaction = Form.formatValues()   
            //salvar
            Form.saveTransaction(transaction) // aqui o 1
            //apagas os dados do form
            Form.clearFilds()
            // fechar modal
            modal.close()
            // atualizar
            
        } catch (error) {
            alert(error.message)
        }


        
    
    }
}

const app = {
    init() {
        Transaction.all.forEach((transaction, index) =>{
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload () {
        DOM.clearTransactions ()
        app.init()
    },


}

app.init()

// todo list

const texto = document.querySelector('input')
const btnInsert = document.querySelector('.divInsert button')
const btnDeleteAll = document.querySelector('.header button')
const ul = document.querySelector('ul')

var itensDB = []

btnDeleteAll.onclick = () => {
  itensDB = []
  updateDB()
}

texto.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    setItemDB()
  }
})

btnInsert.onclick = () => {
  if (texto.value != '') {
    setItemDB()
  }
}

function setItemDB() {
  if (itensDB.length >= 20) {
    alert('Limite máximo de 20 itens atingido!')
    return
  }

  itensDB.push({ 'item': texto.value, 'status': '' })
  updateDB()
}

function updateDB() {
  localStorage.setItem('todolist', JSON.stringify(itensDB))
  loadItens()
}

function loadItens() {
  ul.innerHTML = "";
  itensDB = JSON.parse(localStorage.getItem('todolist')) ?? []
  itensDB.forEach((item, i) => {
    insertItemTela(item.item, item.status, i)
  })
}

function insertItemTela(text, status, i) {
  const li = document.createElement('li')
  
  li.innerHTML = `
    <div class="divLi">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span data-si=${i}>${text}</span>
      <button onclick="removeItem(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    `
  ul.appendChild(li)

  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through')
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through')
  }

  texto.value = ''
}

function done(chk, i) {

  if (chk.checked) {
    itensDB[i].status = 'checked' 
  } else {
    itensDB[i].status = '' 
  }

  updateDB()
}

function removeItem(i) {
  itensDB.splice(i, 1)
  updateDB()
}

loadItens()