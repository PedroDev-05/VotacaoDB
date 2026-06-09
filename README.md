# Sistema de Votação Eletrônica - Banco de Dados

## Sobre o projeto
Este projeto foi desenvolvido como parte de uma atividade prática de Banco de Dados ministrada pelo **Professor Gabriel M. de Carvalho**. Originalmente planejado para MariaDB e adaptado para o **Supabase**.

---

## Cenário do Sistema & Regras de Negócio

Conforme o enunciado proposto pelo Professor Gabriel M. de Carvalho, o sistema atende aos seguintes critérios:
* Existem eleitores, candidatos, partidos e eleições
* Cada candidato pertence a um único partido
* Uma eleição possui vários candidatos
* **Regra:** O eleitor pode votar apenas uma vez por eleição

### Relacionamentos (Cardinalidade)
* Um partido possui vários candidatos (1:N).
* Um candidato pertence a um partido (1:1).
* Um eleitor realiza um voto (1:1).
* Uma eleição possui vários votos (1:N).
* Um candidato recebe vários votos (1:N).

Para uma melhor visualização,segue abaixo o DER contendo a modelagem conceitual e lógica dos Dados.

<img width="1021" height="780" alt="image" src="https://github.com/user-attachments/assets/faa6d183-a756-4a64-877a-c12ea383f425" />

<img width="1873" height="959" alt="image" src="https://github.com/user-attachments/assets/c891eeac-b59e-428c-9c89-a1880c06ea79" />

## 🛠️ Tecnologias Utilizadas

* **Banco de Dados de Origem:** MariaDB
* **Banco de Dados Adaptado:** Supabase (PostgreSQL)

---

### Criação das Tabelas e Inserção de Dados

```sql
-- Criando as tabelas --
CREATE TABLE partido (
    id_partido INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome TEXT NOT NULL,
    sigla TEXT NOT NULL
);


CREATE TABLE eleitor (
    id_eleitor INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,          
    titulo_eleitor TEXT UNIQUE NOT NULL
);

CREATE TABLE eleicao (
    id_eleicao INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descricao TEXT NOT NULL,
    data_eleicao DATE NOT NULL
);

CREATE TABLE candidato (
    id_candidato INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome TEXT NOT NULL,
    numero INT NOT NULL,
    cargo TEXT NOT NULL,
    id_partido INT NOT NULL,
    CONSTRAINT fk_partido FOREIGN KEY(id_partido) REFERENCES partido(id_partido) ON DELETE CASCADE
);

CREATE TABLE voto (
    id_voto INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_eleitor INT NOT NULL,
    id_candidato INT NOT NULL,
    id_eleicao INT NOT NULL,
    data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_eleitor FOREIGN KEY(id_eleitor) REFERENCES eleitor(id_eleitor) ON DELETE CASCADE,
    CONSTRAINT fk_candidato FOREIGN KEY(id_candidato) REFERENCES candidato(id_candidato) ON DELETE CASCADE,
    CONSTRAINT fk_eleicao FOREIGN KEY(id_eleicao) REFERENCES eleicao(id_eleicao) ON DELETE CASCADE,
    
    -- O eleitor pode votar apenas uma vez por eleição --
    CONSTRAINT eleitor_vota_uma_vez UNIQUE (id_eleitor, id_eleicao)
);

-- Inserindo os 10 registros obrigatórios por tabela --

INSERT INTO partido (nome, sigla) VALUES 
('Partido da Renovação Democrática', 'PRD'), ('União Pelo Progresso Social', 'UPS'), 
('Partido da Igualdade e Liberdade', 'PIL'), ('Aliança Democrática Nacional', 'ADN'), 
('Partido Verde Ecológico', 'PVE'), ('Frente Cidadã Unida', 'FCU'), 
('Partido do Desenvolvimento Humano', 'PDH'), ('Movimento de Ação Popular', 'MAP'), 
('União Republicana Nacional', 'URN'), ('Frente de Inovação Social', 'FIS');

INSERT INTO eleitor (nome, cpf, titulo_eleitor) VALUES 
('Ana Silva', '111.111.111-11', '123456789001'), ('Bruno Souza', '222.222.222-22', '123456789002'),
('Carlos Lima', '333.333.333-33', '123456789003'), ('Daniela Oliveira', '444.444.444-44', '123456789004'),
('Eduardo Costa', '555.555.555-55', '123456789005'), ('Fernanda Alves', '666.666.666-66', '123456789006'),
('Gabriel Santos', '777.777.777-77', '123456789007'), ('Amanda Rocha', '888.888.888-88', '123456789008'),
('Igor Gomes', '999.999.999-99', '123456789009'), ('Julia Martins', '000.000.000-00', '123456789010');

INSERT INTO eleicao (descricao, data_eleicao) VALUES 
('Eleição Presidencial 2026', '2026-10-04'), ('Eleição Estadual 2026', '2026-10-04'),
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

-- Registrar Votos --
INSERT INTO voto (id_eleitor, id_candidato, id_eleicao, data_hora) VALUES
(1, 4, 1, '2026-10-04 08:15:00'), (2, 4, 1, '2026-10-04 09:30:00'),
(3, 5, 1, '2026-10-04 10:22:00'), (4, 6, 1, '2026-10-04 11:05:00'),
(5, 4, 1, '2026-10-04 13:45:00'), (6, 5, 1, '2026-10-04 14:12:00'),
(7, 4, 1, '2026-10-04 15:20:00'), (8, 6, 1, '2026-10-04 16:02:00'),
(9, 4, 1, '2026-10-04 16:55:00'), (10, 5, 1, '2026-10-04 17:00:00');
```

### Consulta dos Dados

Esta consulta vincula a tabela de candidatos ao seu respectivo partido e exibe a legenda com a sigla partidária:

```sql
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
```

Esta consulta realiza a contagem total de votos de cada candidato:

```sql
-- Usando SELECT para contagem dos votos. Pode usar ORDER BY(se quiser) para especificar a ordem dos votos --
SELECT
    c.nome AS nome_candidato,
    c.numero,
    COUNT(v.id_voto) AS total_votos
FROM candidato c
LEFT JOIN voto v ON c.id_candidato = v.id_candidato
GROUP BY c.id_candidato, c.nome, c.numero
ORDER BY total_votos DESC;
```

<img width="1918" height="959" alt="image" src="https://github.com/user-attachments/assets/316f8892-7fcc-4909-bb86-f2c7715accb9" />

<img width="1880" height="960" alt="image" src="https://github.com/user-attachments/assets/c1048710-8bb5-439a-bfac-ce791285ff65" />

<img width="1876" height="958" alt="image" src="https://github.com/user-attachments/assets/2c9a5506-4a49-4318-9b7c-575276e44911" />

<img width="1874" height="954" alt="image" src="https://github.com/user-attachments/assets/84294031-5f29-41a5-acf6-980f6363022b" />

---

Como a sintaxe das linguagens diferem entre **MariaDB** e **Supabase**, precisei realizar algumas mudanças no código.

## CRUD

Pensando em deixar este projeto mais "completo", decidi realizar um **CRUD** para o Sistema de Votação Eletrônica. Usei o VScode(Visual Studio Code) para implementar uma interface interativa usando **JavaScript**. OBS: Usei como auxílio a **CLAUDE IA** na criação deste CRUD.

Como Executar e Testar:

Certifique-se de ter o Node.js instalado.
Clone este repositório.
Instale o driver do banco de dados executando: npm install
Configure a variável connectionString no arquivo app.js informando a URI de conexão do seu banco PostgreSQL.
Inicie o painel interativo: node app.js

### Demonstração do Fluxo do Sistema

Ao iniciar a aplicação com o comando `node app.js`, o usuário tem acesso ao painel gerencial:

```text
====================================
   SISTEMA ELEITORAL LOCALHOST      
====================================
1. [CREATE] Inserir Novo Candidato
2. [READ]   Listar Candidatos (Com Partidos)
3. [READ]   Ver Relatorio/Ranking de Votos
4. [UPDATE] Atualizar Nome de Candidato
5. [DELETE] Remover um Candidato
6. Sair do Sistema
====================================
Escolha uma opcao (1-6):
```
Irei demonstrar como funciona a partir da criação de um candidato aleatório.

<img width="1262" height="262" alt="image" src="https://github.com/user-attachments/assets/ab194527-7d25-402e-b1a2-331a33369dc3" />

<img width="1245" height="294" alt="image" src="https://github.com/user-attachments/assets/cafa28f6-d579-4e31-ad4d-8142d45f4431" />

<img width="1012" height="310" alt="image" src="https://github.com/user-attachments/assets/2508e633-9287-465c-be2e-3c3a24b667fa" />

<img width="465" height="309" alt="image" src="https://github.com/user-attachments/assets/ae669f72-2699-4bfd-bf41-383e83c03d54" />

<img width="973" height="904" alt="image" src="https://github.com/user-attachments/assets/48da2b91-9ee1-4c30-a7b9-fb4271843909" />

<img width="621" height="336" alt="image" src="https://github.com/user-attachments/assets/b254d364-6f7b-44f2-8d76-f893b848b493" />

<img width="964" height="474" alt="image" src="https://github.com/user-attachments/assets/c03291c6-828d-4c92-b80d-51c876b35bfb" />

<img width="378" height="257" alt="image" src="https://github.com/user-attachments/assets/a5f9049b-3e11-4c74-888c-efe1814cbf17" />

## 🛠️ Tecnologias Utilizadas

* **Banco de Dados de Origem:** MariaDB
* **Banco de Dados Adaptado:** Supabase (PostgreSQL)
* **Linguagem:** JavaScript
* **Driver de Conexão:** `pg` (PostgreSQL Client)
* **Interface CLI:** Módulo nativo `readline` para captura de dados em fluxo assíncrono.
* **Ferramenta de IA:** Claude IA.
