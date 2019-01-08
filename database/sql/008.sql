ALTER TABLE `tce-mapa`.`escolas` 
ADD COLUMN `rede_id` INT(11) NOT NULL AFTER `sigla`,
ADD INDEX `fk_rede_id` (`rede_id` ASC);

CREATE TABLE IF NOT EXISTS `tce-mapa`.`rede` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

INSERT INTO `tce-mapa`.`rede` (`descricao`) VALUES ('Estadual');
INSERT INTO `tce-mapa`.`rede` (`descricao`) VALUES ('Federal');
INSERT INTO `tce-mapa`.`rede` (`descricao`) VALUES ('Municipal');
INSERT INTO `tce-mapa`.`rede` (`descricao`) VALUES ('Privada');
