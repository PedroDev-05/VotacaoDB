-- Criando Banco de dados --

CREATE DATABASE votacao;
USE votacao;


-- Criando tabelas --

CREATE TABLE partido ( id_partido INT PRIMARY KEY AUTO_INCREMENT,
nome  VARCHAR(100) NOT NULL,
sigla VARCHAR(10) NOT NULL
);


CREATE TABLE eleitor ( id_eleitor INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
cpf  VARCHAR(14) UNIQUE NOT NULL,
titulo_eleitor VARCHAR(20) UNIQUE NOT NULL
);


CREATE TABLE eleicao (id_eleicao INT PRIMARY KEY AUTO_INCREMENT,
descricao VARCHAR(100),
data_eleicao DATE NOT NULL
);


CREATE TABLE candidato ( id_candidato INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
numero INT NOT NULL,
cargo VARCHAR(50) NOT NULL,
id_partido INT NOT NULL,
	FOREIGN KEY(id_partido) REFERENCES partido(id_partido)
);


CREATE TABLE voto (id_voto INT PRIMARY KEY AUTO_INCREMENT,
id_eleitor INT NOT NULL,
id_candidato INT NOT NULL,
id_eleicao INT NOT NULL,
data_hora TIMESTAMP NOT NULL,
	FOREIGN KEY(id_eleitor) REFERENCES eleitor(id_eleitor),
	FOREIGN KEY(id_candidato) REFERENCES candidato(id_candidato),
	FOREIGN KEY(id_eleicao) REFERENCES eleicao(id_eleicao)
);


-- Inserção de dados nas tabelas --

INSERT INTO partido (nome, sigla) VALUES ('Partido da Renovação Democrática', 'PRD'),
('União Pelo Progresso Social', 'UPS'), ('Partido da Igualdade e Liberdade', 'PIL'),
('Aliança Democrática Nacional', 'ADN'), ('Partido Verde Ecológico', 'PVE'),
('Frente Cidadã Unida', 'FCU'), ('Partido do Desenvolvimento Humano', 'PDH'),
('Movimento de Ação Popular', 'MAP'), ('União Republicana Nacional', 'URN'),
('Frente de Inovação Social', 'FIS');


INSERT INTO eleitor (nome, cpf, titulo_eleitor) VALUES ('Ana Silva', '111.111.111-11', '123456789001'), ('Bruno Souza', '222.222.222-22', '123456789002'),
('Carlos Lima', '333.333.333-33', '123456789003'), ('Daniela Oliveira', '444.444.444-44', '123456789004'),
('Eduardo Costa', '555.555.555-55', '123456789005'), ('Fernanda Alves', '666.666.666-66', '123456789006'),
('Gabriel Santos', '777.777.777-77', '123456789007'), ('Amanda Rocha', '888.888.888-88', '123456789008'),
('Igor Gomes', '999.999.999-99', '123456789009'), ('Julia Martins', '000.000.000-00', '123456789010');


INSERT INTO eleicao (descricao, data_eleicao) VALUES ('Eleição Presidencial 2026', '2026-10-04'), ('Eleição Estadual 2026', '2026-10-04'),
('Eleição Municipal 2024', '2024-10-06'), ('Eleição Suplementar 2025', '2025-05-18'),
('Eleição Interna Diretoria', '2026-01-15'), ('Eleição Conselho Fiscal', '2026-02-20'),
('Eleição Grêmio Estudantil', '2026-03-10'), ('Eleição Associação de Bairro', '2026-04-12'),
('Eleição Sindicato Geral', '2026-05-01'), ('Eleição Auditoria Federal', '2026-06-30');


INSERT INTO candidato (nome, numero, cargo, id_partido) VALUES
('Alice Guimarães', 42111, 'Deputado', 1), ('Roberto Jefferson', 42222, 'Deputado', 2),
('Carolina Ferraz', 42333, 'Deputado', 3), ('David Alencar', 11, 'Presidente', 1),
('Eva Pinheiro', 22, 'Presidente', 4), ('Franklin Roosevelt', 33, 'Presidente', 6),
('Grace Kelly', 55101, 'Vereador', 5), ('Henry Cavill', 55102, 'Vereador', 6),
('Ian Somerhalder', 77001, 'Governador', 7), ('Jack Sparrow', 88002, 'Governador', 8);


INSERT INTO voto (id_eleitor, id_candidato, id_eleicao, data_hora) VALUES
(1, 4, 1, '2026-10-04 08:15:00'), (2, 4, 1, '2026-10-04 09:30:00'),
(3, 5, 1, '2026-10-04 10:22:00'), (4, 6, 1, '2026-10-04 11:05:00'),
(5, 4, 1, '2026-10-04 13:45:00'), (6, 5, 1, '2026-10-04 14:12:00'),
(7, 4, 1, '2026-10-04 15:20:00'), (8, 6, 1, '2026-10-04 16:02:00'),
(9, 4, 1, '2026-10-04 16:55:00'), (10, 5, 1, '2026-10-04 17:00:00');


-- Usando o JOIN para Candidatos e Partidos --

SELECT
    c.id_candidato,
    c.nome AS nome_candidato,
    c.numero,
    c.cargo,
    p.nome AS nome_partido,
    p.sigla
FROM candidato c
INNER JOIN partido p ON c.id_partido = p.id_partido;


-- Usando SELECT para a contagem dos votos. Pode usar ORDER BY(se quiser) para especificar a ordem dos votos --

SELECT
    c.nome AS nome_candidato,
    c.numero,
    COUNT(v.id_voto) AS total_votos
FROM candidato c
LEFT JOIN voto v ON c.id_candidato = v.id_candidato
GROUP BY c.id_candidato, c.nome, c.numero
ORDER BY total_votos DESC;


INSERT INTO voto (id_eleitor, id_candidato, id_eleicao) VALUES
(1, 1, 1), (2, 2, 1),
(3, 3, 1), (4, 4, 1),
(5, 5, 1), (6, 6, 1),
(7, 7, 1), (8, 8, 1),
(9, 9, 1), (10, 10, 1);