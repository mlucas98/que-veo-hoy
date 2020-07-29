CREATE DATABASE que_veo_hoy;

USE que_veo_hoy;

CREATE TABLE pelicula (
	id int NOT NULL auto_increment,
	titulo VARCHAR(100) NOT NULL,
	duracion INT(5) NOT NULL,
	director VARCHAR(400) NOT NULL, 
	anio INT(5) NOT NULL,
	fecha_lanzamiento DATE NOT NULL,
	poster VARCHAR(300),
	trama VARCHAR(700),
	PRIMARY KEY (id)
);

CREATE TABLE genero (
	id int NOT NULL auto_increment,
    nombre VARCHAR(30),
    PRIMARY KEY (id)
);

ALTER TABLE pelicula ADD (
	genero_id INT NOT NULL
);

ALTER TABLE `que_veo_hoy`.`pelicula` 
ADD INDEX `genre_id_idx` (`genero_id` ASC) VISIBLE;
ALTER TABLE `que_veo_hoy`.`pelicula` 
ADD CONSTRAINT `genre_id`
  FOREIGN KEY (`genero_id`)
  REFERENCES `que_veo_hoy`.`genero` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE actor (
	id int NOT NULL auto_increment,
    nomber VARCHAR(70),
    primary key (id)
);

CREATE TABLE actor_pelicula (
	id int NOT NULL auto_increment,
    actor_id int NOT NULL,
    pelicula_id int NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE `que_veo_hoy`.`actor_pelicula` 
ADD INDEX `id_actor_idx` (`actor_id` ASC) VISIBLE,
ADD INDEX `id_pelicula_idx` (`pelicula_id` ASC) VISIBLE;
;
ALTER TABLE `que_veo_hoy`.`actor_pelicula` 
ADD CONSTRAINT `id_actor`
  FOREIGN KEY (`actor_id`)
  REFERENCES `que_veo_hoy`.`actor` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `id_pelicula`
  FOREIGN KEY (`pelicula_id`)
  REFERENCES `que_veo_hoy`.`pelicula` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;