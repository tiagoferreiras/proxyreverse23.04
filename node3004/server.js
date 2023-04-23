const { response } = require('express');
const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require ('cors');

app.use(express.json())
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

const upload = multer({ storage: storage });

app.use(cors())
const connection = mysql.createConnection({
  host: 'mysqldb',
  user: 'root',
  password: '123456',
  database: 'db'
});
connection.connect((err) => {
  if (err) throw err
  console.log('Banco conectado com sucesso')
});

app.get('/contatos/:parametro', (req, res) => {
  const parametro = req.params.parametro;

    connection.query('SELECT nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, t.tipo as tipo_cliente FROM cliente c inner join tipo_cliente t on t.id = c.tipo_cliente_id WHERE c.email = ?', [parametro], (err, rows) => {
      if (err) {
        console.error('Erro ao executar a query: ' + err.stack);
        res.status(500).send('Erro ao buscar contato pelo e-mail informado.');
        return;
      }
      const contato = rows[0];
      res.status(200).json({
        nome: contato.nome,
        telefone: contato.telefone,
        email: contato.email,
        logradouro: contato.logradouro,
        numero: contato.numero,
        complemento: contato.complemento,
        bairro: contato.bairro,
        cidade: contato.cidade,
        uf: contato.uf,
        cep: contato.cep,
        tipo_cliente_id: contato.tipo_cliente_id
      });
    });
});

app.listen(3004, function () {
  console.log('API rodando na porta 3004!');
});