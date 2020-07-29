const connection = require('../lib/conexionbd');

function getAllMovies(req, res){
    let anio = req.query.anio;
    let titulo = req.query.titulo;
    let genero = req.query.genero;
    let count = 3;

    let orderBy = req.query.columna_orden;
    let pagina = req.query.pagina;
    
    let query = `SELECT * FROM pelicula WHERE anio LIKE ${anio} AND titulo LIKE "%${titulo}%" AND genero_id = ${genero}`;
    
    if(!genero){
        query = query.replace('AND genero_id = ' + genero, "");
        count--;
    }
    if(!titulo){
        query = query.replace('AND titulo LIKE "%' + titulo + '%"', "");
        count--;
    }
    if(!anio){
        query = query.replace('anio LIKE ' + anio, "");
        count--;
    }
    if(count >= 1 && !anio){
        query = query.replace('AND ', "");
    }
    // Si no hay parámetros, el WHERE está de más
    if (count === 0) {
        query = query.replace('WHERE ', "")
    };

    let total_query = query.replace('*', 'count(*) as total ');

    switch(orderBy){
        case 'titulo':
            query += ' ORDER BY titulo';
            break;
        case 'anio':
            query += ' ORDER BY anio';
            break;
        case 'puntuacion':
            query += ' ORDER BY puntuacion';
            break;
    }

    query += " LIMIT 52"
    if(pagina != 1){
        query += " OFFSET " + (parseInt(pagina * 51) + parseInt(pagina));
    }
    
    
    connection.query(query,function(error, result, fields){
        if(error){
            console.log('Error en la consulta: '+ error);
            res.status(404).send('Se ha producido un error.')
        }
        respuesta = {
            peliculas: result,
        };
        connection.query(total_query, function(error, result, fields) {
            if(error){
                console.log('Error en la consulta anidada: '+ error);
                res.status(404).send('Se ha producido un error');
            }
            respuesta.total = result[0].total;
            res.json(respuesta);
        });
    });    
};

function getAllGenres(req, res){
    let query = 'SELECT * FROM genero';

    connection.query(query, function(error, result, fields){
        if(error){
            console.log('Error en la consulta: '+ error);
            res.status(404).send('Se ha producido en error al intentar recuperar los géneros. Por favor intentelo más tarde');
        }
        let respuesta = {
            generos: result,
        };
        res.json(respuesta);
    });
}

function getMovie(req, res){
    let id = req.params.id;
    let query = `SELECT * FROM pelicula WHERE id = ${id}`;
    connection.query(query, function(error, result, fields){
        if(error){
            console.log("Error al buscar película por id "+ id + ". Error "+error);
            res.status(404).send("Se ha producido un error al intentar encontrar la película. Por favor intentelo más tarde.")
        }
        let respuesta = {
            pelicula : result[0]
        }
        let query_actores = `SELECT a.nombre FROM actor AS a INNER JOIN actor_pelicula AS ap ON a.id = ap.actor_id INNER JOIN pelicula AS p ON ap.pelicula_id = p.id WHERE p.id = ${id}`;
        connection.query(query_actores, function(error, result, fields){
            if(error){
                console.log("Error al buscar película por id "+ id + " en la parte actoral. Error "+error);
                res.status(404).send("Se ha producido un error al intentar encontrar la película. Por favor intentelo más tarde.")
            }
            respuesta.actores = result;
            let query_genero = `SELECT g.nombre FROM genero AS g INNER JOIN pelicula AS p ON g.id = p.genero_id WHERE p.id = ${id}`;
            connection.query(query_genero, function(error, result, fields){
                if(error){
                    console.log("Error al buscar película por id "+ id + " en la parte de género. Error "+error);
                    res.status(404).send("Se ha producido un error al intentar encontrar la película. Por favor intentelo más tarde.")
                }
                respuesta.genero = result;
                res.json(respuesta);
            });

        })
    });
}

function getRecomendations(req, res){
    //la query manda genero y algo mas depende lo que se cliquee. En base a eso deberíamos armar la consulta
    let genero = req.query.genero;
    let query = genero ?  `SELECT * FROM pelicula AS p INNER JOIN genero AS g ON p.genero_id = g.id WHERE g.nombre LIKE "${genero}"`: `SELECT * FROM pelicula AS p "`;
    
    //buscar si existen otros parametros y si lo hacen, insertarlos entre el g.id y el where
    let anio_inicio = req.query.anio_inicio;
    let anio_fin = req.query.anio_fin;
    if(anio_inicio && anio_fin){
        query += `AND p.anio BETWEEN ${anio_inicio} AND ${anio_fin}`;
    }
    let puntuacion = req.query.puntuacion;
    if(puntuacion){
        query += `AND p.puntuacion >= ${puntuacion}`
    }
    if (!genero && !anio_inicio && !anio_fin && !puntuacion){
        query = "SELECT * FROM pelicula WHERE id = FLOOR(1 + RAND() * 742)"

    }
    connection.query(query, function(error, result, fields){
        if(error){
            console.log("Error al buscar película por recomendación. Error "+error);
            res.status(404).send("Se ha producido un error al intentar recomendar una película. Por favor intentelo más tarde.")
        }
        let peliculas = {
            peliculas: result
        }
        res.json(peliculas);
    });
};

module.exports = {
    getAllMovies : getAllMovies,
    getAllGenres : getAllGenres,
    getMovie: getMovie,
    getRecomendations: getRecomendations,
}