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
app.post('/contatos/gravar', upload.single('avatar'), function (req, res) {
  var nome = req.body.nome;
  var telefone = req.body.telefone;
  var email = req.body.email;
  var logradouro = req.body.logradouro;
  var numero = req.body.numero;
  var complemento = req.body.complemento;
  var bairro = req.body.bairro;
  var cidade = req.body.cidade;
  var uf = req.body.uf;
  var cep = req.body.cep;
  var tipo_cliente_id = req.body.tipo_cliente_id;

  var sql = `INSERT INTO cliente (nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, tipo_cliente_id) VALUES ("${nome}", "${telefone}", "${email}", "${logradouro}", "${numero}", "${complemento}", "${bairro}", "${cidade}", "${uf}", "${cep}", "${tipo_cliente_id}")`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log('Foi pra nuvem');
    res.status(200).send("Adicionado!")
  });
});

app.listen(3002, function () {
  console.log('API rodando na porta 3002!');
});