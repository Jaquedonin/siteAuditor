ALTER TABLE `tce-mapa`.`videos`
ADD COLUMN `thumb` VARCHAR(255) NOT NULL AFTER `url`;
ADD COLUMN `descricao` LONGTEXT NOT NULL AFTER `thumb`;
ADD COLUMN `autor` VARCHAR(45) NOT NULL AFTER `categoria_id`;
ADD COLUMN `views` INT(11) NOT NULL AFTER `descricao`;
CHANGE COLUMN `url` `url` VARCHAR(255) NOT NULL AFTER `categoria_id`,
CHANGE COLUMN `professor_escola_id` `professor_id` INT(11) NOT NULL ,
CHANGE COLUMN `cidade` `cidade_id` VARCHAR(255) NULL DEFAULT NULL ,
ADD COLUMN `escola_id` VARCHAR(45) NULL AFTER `professor_id`;
