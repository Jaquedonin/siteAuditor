INSERT INTO categorias (descricao) VALUES ('destaques'), ('segurança'), ('saúde'), ('educação'), ('política');

ALTER TABLE videos ADD categoria_id INT;

ALTER TABLE `cidades` 
CHANGE COLUMN `codigo` `codigo` INT(11) NOT NULL ,
ADD PRIMARY KEY (`codigo`);



