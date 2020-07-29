var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3307,
  user     : 'root',
  password : 'Yosoyluky98',
  database : 'que_veo_hoy'
});

module.exports = connection;

