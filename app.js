import pkg from 'pg';
import readline from 'readline';

const { Client } = pkg;
const connectionString = 'postgresql://postgres:jp26865011.@db.zibwuxvykmxtskxenytn.supabase.co:5432/postgres';

const client = new Client({
    connectionString: connectionString
});

// Inicializa a interface de leitura do terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const perguntar = (texto) => new Promise((resolve) => rl.question(texto, resolve));

// ==========================================
// OPERACOES DO CRUD (BANCO DE DADOS)
// ==========================================

// C - CREATE (Criar Candidato)
async function criarCandidato() {
    console.log('\n--- CADASTRAR NOVO CANDIDATO ---');
    const nome = await perguntar('Nome do candidato: ');
    const numero = parseInt(await perguntar('Numero do candidato: '));
    const cargo = await perguntar('Cargo (ex: Presidente, Deputado): ');
    const id_partido = parseInt(await perguntar('ID do Partido (1 a 10): '));

    const query = 'INSERT INTO candidato (nome, numero, cargo, id_partido) VALUES ($1, $2, $3, $4) RETURNING *;';
    try {
        const res = await client.query(query, [nome, numero, cargo, id_partido]);
        console.log('\nCandidato cadastrado com sucesso!', res.rows[0]);
    } catch (err) {
        console.error('\nErro ao cadastrar candidato:', err.message);
    }
}

// R - READ (Listar com o INNER JOIN)
async function listarCandidatosComPartido() {
    console.log('\n--- LISTA DE CANDIDATOS E PARTIDOS (INNER JOIN) ---');
    const query = `
        SELECT
            c.id_candidato,
            c.nome AS nome_candidato,
            c.numero,
            c.cargo,
            p.nome AS nome_partido,
            p.sigla
        FROM candidato c
        INNER JOIN partido p ON c.id_partido = p.id_partido;
    `;
    try {
        const res = await client.query(query);
        if (res.rows.length === 0) console.log('Nenhum candidato encontrado.');
        else console.table(res.rows);
    } catch (err) {
        console.error('\nErro ao buscar dados:', err.message);
    }
}

// R - READ (Query de Contagem de Votos)
async function relatorioContagemVotos() {
    console.log('\n--- RELATORIO DE VOTOS (RANKING) ---');
    const query = `
        SELECT
            c.nome AS nome_candidato,
            c.numero,
            COUNT(v.id_voto) AS total_votos
        FROM candidato c
        LEFT JOIN voto v ON c.id_candidato = v.id_candidato
        GROUP BY c.id_candidato, c.nome, c.numero
        ORDER BY total_votos DESC;
    `;
    try {
        const res = await client.query(query);
        console.table(res.rows);
    } catch (err) {
        console.error('\nErro ao gerar relatorio:', err.message);
    }
}

// U - UPDATE (Atualizar Candidato)
async function atualizarCandidato() {
    console.log('\n--- ATUALIZAR NOME DO CANDIDATO ---');
    const id_candidato = parseInt(await perguntar('Digite o ID do candidato que deseja alterar: '));
    const novoNome = await perguntar('Digite o novo nome para este candidato: ');

    const query = 'UPDATE candidato SET nome = $1 WHERE id_candidato = $2 RETURNING *;';
    try {
        const res = await client.query(query, [novoNome, id_candidato]);
        if (res.rowCount === 0) {
            console.log('\nAviso: Nenhum candidato encontrado com esse ID.');
        } else {
            console.log('\nCandidato atualizado com sucesso:', res.rows[0]);
        }
    } catch (err) {
        console.error('\nErro ao atualizar:', err.message);
    }
}

// D - DELETE (Deletar Candidato)
async function deletarCandidato() {
    console.log('\n--- EXCLUIR CANDIDATO ---');
    const id_candidato = parseInt(await perguntar('Digite o ID do candidato que deseja REMOVER: '));
    
    console.log('Aviso: Remover o candidato apagara seus votos associados (ON DELETE CASCADE).');
    const confirmar = await perguntar(`Tem certeza que deseja apagar o ID ${id_candidato}? (s/n): `);

    if (confirmar.toLowerCase() !== 's') {
        console.log('Operacao cancelada.');
        return;
    }

    const query = 'DELETE FROM candidato WHERE id_candidato = $1;';
    try {
        const res = await client.query(query, [id_candidato]);
        if (res.rowCount === 0) {
            console.log('\nAviso: Nenhum candidato encontrado com esse ID.');
        } else {
            console.log(`\nCandidato com ID ${id_candidato} removido com sucesso.`);
        }
    } catch (err) {
        console.error('\nErro ao deletar:', err.message);
    }
}

// ==========================================
// FLUXO PRINCIPAL COM MENU INTERATIVO
// ==========================================
async function iniciarPainel() {
    try {
        await client.connect();
        
        let continuar = true;
        while (continuar) {
            console.log('\n====================================');
            console.log('   SISTEMA ELEITORAL LOCALHOST      ');
            console.log('====================================');
            console.log('1. [CREATE] Inserir Novo Candidato');
            console.log('2. [READ]   Listar Candidatos (Com Partidos)');
            console.log('3. [READ]   Ver Relatorio/Ranking de Votos');
            console.log('4. [UPDATE] Atualizar Nome de Candidato');
            console.log('5. [DELETE] Remover um Candidato');
            console.log('6. Sair do Sistema');
            console.log('====================================');
            
            const opcao = await perguntar('Escolha uma opcao (1-6): ');

            switch (opcao) {
                case '1':
                    await criarCandidato();
                    break;
                case '2':
                    await listarCandidatosComPartido();
                    break;
                case '3':
                    await relatorioContagemVotos();
                    break;
                case '4':
                    await atualizarCandidato();
                    break;
                case '5':
                    await deletarCandidato();
                    break;
                case '6':
                    console.log('\nFechando conexoes e saindo...');
                    continuar = false;
                    break;
                default:
                    console.log('\nOpcao invalida! Digite um numero de 1 a 6.');
            }
            
            if (continuar) {
                await perguntar('\nPressione ENTER para voltar au menu principal...');
            }
        }
    } catch (error) {
        console.error('Erro critico no sistema:', error.message);
    } finally {
        rl.close();
        await client.end();
        console.log('Sistema encerrado com sucesso.');
    }
}

// Executa o programa
iniciarPainel();