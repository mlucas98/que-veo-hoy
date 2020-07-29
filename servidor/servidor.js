//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const controller = require('./controladores/controller');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//Cuando entre a la ruta, va a hacer el pedido al controlador
app.get('/peliculas', controller.getAllMovies);

app.get('/generos', controller.getAllGenres);

app.get('/peliculas/recomendacion', controller.getRecomendations);

app.get('/peliculas/:id', controller.getMovie);


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});


