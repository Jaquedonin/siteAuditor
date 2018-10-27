ALTER TABLE `tce-mapa`.`videos` 
ADD COLUMN `thumb` VARCHAR(255) NOT NULL AFTER `url`;
ADD COLUMN `descricao` LONGTEXT NOT NULL AFTER `thumb`;
ADD COLUMN `autor` VARCHAR(45) NOT NULL AFTER `categoria_id`;
ADD COLUMN `views` INT(11) NOT NULL AFTER `descricao`;

