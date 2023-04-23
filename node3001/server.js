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

  // Verifica se o parâmetro é um número (id) ou um e-mail
  if (!isNaN(parametro)) {
    // Busca pelo id
    const id = parseInt(parametro);
    const result = connection.query('SELECT nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, t.tipo as tipo_cliente FROM cliente c inner join tipo_cliente t on t.id = c.tipo_cliente_id WHERE t.id = ?', [id], (err, rows) => {
      if (err) {
        console.error('Erro ao executar a query: ' + err.stack);
        res.status(500).send('Erro ao buscar contato pelo ID informado.');
        return;
      }
      let contato = [];

      if(rows){
        rows.forEach(row => {
          contato.push({
          nome: row.nome,
          telefone: row.telefone,
          email: row.email,
          logradouro: row.logradouro,
          numero: row.mumero,
          complemento: row.complemento,
          bairro: row.bairro,
          cidade: row.cidade,
          uf: row.uf,
          cep: row.cep,
          tipo_cliente_id: row.tipo_cliente_id
          })
        });
      }
      
      res.status(200).json({
        contato
      });
    });
  } 
});

app.listen(3001, function () {
  console.log('API rodando na porta 3001!');
});