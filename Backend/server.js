const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let fornecedores = [
    { id: 1, nome: 'Fornecedor 1', endereco: 'Endereço 1' },
    { id: 2, nome: 'Fornecedor 2', endereco: 'Endereço 2' },
    // Mais fornecedores
];

let clientes = [
    { id: 1, usuario: 'cliente1', senha: 'senha1', assinatura: true },
    { id: 2, usuario: 'cliente2', senha: 'senha2', assinatura: false },
    // Mais clientes
];

// Rota para buscar fornecedores
app.get('/api/fornecedores', (req, res) => {
    const { query } = req.query;
    const resultados = fornecedores.filter(fornecedor => fornecedor.nome.toLowerCase().includes(query.toLowerCase()));
    res.json(resultados);
});

// Rota para login
app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;
    const cliente = clientes.find(c => c.usuario === usuario && c.senha === senha);
    if (cliente) {
        res.json({ mensagem: 'Bem-vindo, ' + usuario, assinatura: cliente.assinatura });
    } else {
        res.status(401).json({ mensagem: 'Usuário ou senha incorretos.' });
    }
});

// Rota para cadastrar fornecedores
app.post('/api/fornecedores', (req, res) => {
    const { nome, endereco } = req.body;
    const novoFornecedor = { id: fornecedores.length + 1, nome, endereco };
    fornecedores.push(novoFornecedor);
    res.json({ mensagem: 'Fornecedor cadastrado com sucesso!', fornecedor: novoFornecedor });
});



// Rota para cadastrar clientes com criptografia de senha
app.post('/api/clientes', async (req, res) => {
    const { usuario, senha, assinatura } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10); // Criptografa a senha com um salt de fator 10
    const novoCliente = { id: clientes.length + 1, usuario, senha: hashedSenha, assinatura };
    clientes.push(novoCliente);
    res.json({ mensagem: 'Cliente cadastrado com sucesso!', cliente: novoCliente });
});

// Rota para login com verificação de senha criptografada
app.post('/api/login', async (req, res) => {
    const { usuario, senha } = req.body;
    const cliente = clientes.find(c => c.usuario === usuario);
    if (cliente && await bcrypt.compare(senha, cliente.senha)) { // Verifica a senha criptografada
        const token = jwt.sign({ id: cliente.id, usuario: cliente.usuario }, secret, { expiresIn: '1h' });
        res.json({ mensagem: 'Bem-vindo, ' + usuario, token });
    } else {
        res.status(401).json({ mensagem: 'Usuário ou senha incorretos.' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
