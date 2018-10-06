-- MySQL Workbench Synchronization
-- Generated: 2018-07-15 20:34
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Marianna

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE TABLE IF NOT EXISTS `tce_mapa`.`professores` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fb_user` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UNIQUE` (`fb_user` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce_mapa`.`alunos` (
  `id` INT(11) NOT NULL,
  `professor_escola_id` INT(11) NOT NULL,
  `fb_user` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_alunos_professores_escolas_idx` (`professor_escola_id` ASC),
  CONSTRAINT `fk_alunos_professor_escolas1`
    FOREIGN KEY (`professor_escola_id`)
    REFERENCES `tce_mapa`.`professores_escolas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce_mapa`.`escolas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `cidade_codigo` VARCHAR(11) NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `sigla` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_escolas_cidades_codigo` (`cidade_codigo` ASC),
  CONSTRAINT `fk_escolas_cidades`
    FOREIGN KEY (`cidade_codigo`)
    REFERENCES `tce_mapa`.`cidades` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce_mapa`.`cidades` (
  `nome` VARCHAR(100) NULL DEFAULT NULL,
  `codigo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`codigo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce_mapa`.`videos` (
  `id` INT(11) NOT NULL,
  `professor_escola_id` INT(11) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_videos_professor_escolas1_idx` (`professor_escola_id` ASC),
  UNIQUE INDEX `url_UNIQUE` (`url` ASC),
  CONSTRAINT `fk_videos_professor_escolas1`
    FOREIGN KEY (`professor_escola_id`)
    REFERENCES `tce_mapa`.`professores_escolas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `tce_mapa`.`professores_escolas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `escola_id` INT(11) NOT NULL,
  `professor_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_professores_escolas_escola_id` (`escola_id` ASC),
  INDEX `fk_professores_escolas_professor_id` (`professor_id` ASC),
  CONSTRAINT `fk_professor_escolas_escolas1`
    FOREIGN KEY (`escola_id`)
    REFERENCES `tce_mapa`.`escolas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professor_escolas_professores1`
    FOREIGN KEY (`professor_id`)
    REFERENCES `tce_mapa`.`professores` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
