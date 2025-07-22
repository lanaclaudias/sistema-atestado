const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Verificando e criando tabelas...');

    // Criar tabela editais
    await client.query(`
      CREATE TABLE IF NOT EXISTS editais (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabela "editais" criada/verificada');

    // Criar tabela topicos
    await client.query(`
      CREATE TABLE IF NOT EXISTS topicos (
        id SERIAL PRIMARY KEY,
        edital_id INTEGER REFERENCES editais(id) ON DELETE CASCADE,
        topico TEXT,
        subtitulo TEXT,
        conteudo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabela "topicos" criada/verificada');

    // Verificar se as tabelas foram criadas
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\nTabelas existentes no banco:');
    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
