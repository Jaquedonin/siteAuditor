-- MySQL Workbench Synchronization
-- Generated: 2018-07-20 22:24
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Marianna

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

ALTER TABLE `tce-mapa`.`alunos` 
DROP FOREIGN KEY `fk_alunos_professor_escolas1`;

ALTER TABLE `tce-mapa`.`escolas` 
DROP FOREIGN KEY `fk_escolas_cidades`;

ALTER TABLE `tce-mapa`.`videos` 
DROP FOREIGN KEY `fk_videos_professor_escolas1`;

ALTER TABLE `tce-mapa`.`professores_escolas` 
DROP FOREIGN KEY `fk_professor_escolas_escolas1`,
DROP FOREIGN KEY `fk_professor_escolas_professores1`;

ALTER TABLE `tce-mapa`.`alunos` 
DROP COLUMN `professor_escola_id`,
ADD COLUMN `professor_escola_id` INT(11) NOT NULL AFTER `id`,
ADD INDEX `fk_alunos_professores_escolas_idx` (`professor_escola_id` ASC),
DROP INDEX `fk_alunos_professores_escolas_idx` ;

ALTER TABLE `tce-mapa`.`escolas` 
DROP COLUMN `cidade_id`,
ADD COLUMN `cidade_id` INT(11) NOT NULL AFTER `id`,
ADD INDEX `fk_escolas_cidades_idx` (`cidade_id` ASC),
DROP INDEX `fk_escolas_cidades_idx` ;

ALTER TABLE `tce-mapa`.`videos` 
DROP COLUMN `professor_escola_id`,
ADD COLUMN `professor_escola_id` INT(11) NOT NULL AFTER `id`,
ADD INDEX `fk_videos_professor_escolas1_idx` (`professor_escola_id` ASC),
DROP INDEX `fk_videos_professor_escolas1_idx` ;

ALTER TABLE `tce-mapa`.`professores_escolas` 
DROP COLUMN `professor_id`,
DROP COLUMN `escola_id`,
ADD COLUMN `escola_id` INT(11) NOT NULL AFTER `id`,
ADD COLUMN `professor_id` INT(10) UNSIGNED NOT NULL AFTER `escola_id`,
ADD INDEX `fk_professores_escolas_escola_id` (`escola_id` ASC),
ADD INDEX `fk_professores_escolas_professor_id` (`professor_id` ASC),
DROP INDEX `fk_professores_escolas_professor_id` ,
DROP INDEX `fk_professores_escolas_escola_id` ;

CREATE TABLE IF NOT EXISTS `tce-mapa`.`visitas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `data_hora` DATETIME NOT NULL,
  `turma` VARCHAR(45) NOT NULL,
  `professores_escolas_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_visitas_professores_escolas1_idx` (`professores_escolas_id` ASC),
  CONSTRAINT `fk_visitas_professores_escolas1`
    FOREIGN KEY (`professores_escolas_id`)
    REFERENCES `tce-mapa`.`professores_escolas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce-mapa`.`categorias` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(45) NULL DEFAULT NULL,
  `tipo` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce-mapa`.`acervo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `arquivo` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce-mapa`.`categoria_acervo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `categorias_id` INT(11) NOT NULL,
  `acervo_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_categoria_acervo_categorias1_idx` (`categorias_id` ASC),
  INDEX `fk_categoria_acervo_acervo1_idx` (`acervo_id` ASC),
  CONSTRAINT `fk_categoria_acervo_categorias1`
    FOREIGN KEY (`categorias_id`)
    REFERENCES `tce-mapa`.`categorias` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_categoria_acervo_acervo1`
    FOREIGN KEY (`acervo_id`)
    REFERENCES `tce-mapa`.`acervo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce-mapa`.`categoria_visita` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `visitas_id` INT(11) NOT NULL,
  `categorias_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_categoria_visita_visitas1_idx` (`visitas_id` ASC),
  INDEX `fk_categoria_visita_categorias1_idx` (`categorias_id` ASC),
  CONSTRAINT `fk_categoria_visita_visitas1`
    FOREIGN KEY (`visitas_id`)
    REFERENCES `tce-mapa`.`visitas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_categoria_visita_categorias1`
    FOREIGN KEY (`categorias_id`)
    REFERENCES `tce-mapa`.`categorias` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce-mapa`.`categoria_video` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `videos_id` INT(11) NOT NULL,
  `categorias_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_categoria_video_videos1_idx` (`videos_id` ASC),
  INDEX `fk_categoria_video_categorias1_idx` (`categorias_id` ASC),
  CONSTRAINT `fk_categoria_video_videos1`
    FOREIGN KEY (`videos_id`)
    REFERENCES `tce-mapa`.`videos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_categoria_video_categorias1`
    FOREIGN KEY (`categorias_id`)
    REFERENCES `tce-mapa`.`categorias` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

ALTER TABLE `tce-mapa`.`alunos` 
ADD CONSTRAINT `fk_alunos_professor_escolas1`
  FOREIGN KEY (`professor_escola_id`)
  REFERENCES `tce-mapa`.`professores_escolas` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `tce-mapa`.`escolas` 
ADD CONSTRAINT `fk_escolas_cidades`
  FOREIGN KEY (`cidade_id`)
  REFERENCES `tce-mapa`.`cidades` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `tce-mapa`.`videos` 
ADD CONSTRAINT `fk_videos_professor_escolas1`
  FOREIGN KEY (`professor_escola_id`)
  REFERENCES `tce-mapa`.`professores_escolas` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `tce-mapa`.`professores_escolas` 
ADD CONSTRAINT `fk_professor_escolas_escolas1`
  FOREIGN KEY (`escola_id`)
  REFERENCES `tce-mapa`.`escolas` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_professor_escolas_professores1`
  FOREIGN KEY (`professor_id`)
  REFERENCES `tce-mapa`.`professores` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
