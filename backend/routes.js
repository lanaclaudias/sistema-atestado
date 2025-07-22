const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const pool = require('./database');
const extrairTopicos = require('./extract');

const router = express.Router();
router.use(fileUpload());

router.post('/upload', async (req, res) => {
  if (!req.files || !req.files.pdf) {
    return res.status(400).send('Nenhum PDF enviado.');
  }

  const pdf = req.files.pdf;
  const nomeArquivo = pdf.name;
  const client = await pool.connect();

  try {
    const data = await pdfParse(pdf.data);
    const texto = data.text;

    // Inserir o edital
    const result = await client.query('INSERT INTO editais (nome) VALUES ($1) RETURNING id', [nomeArquivo]);
    const editalId = result.rows[0].id;
    
    const topicos = extrairTopicos(texto);

    // Inserir os tópicos
    for (const topico of topicos) {
      await client.query(
        'INSERT INTO topicos (edital_id, topico, subtitulo, conteudo) VALUES ($1, $2, $3, $4)',
        [editalId, topico.topico, topico.subtitulo, topico.conteudo]
      );
    }

    res.send('PDF processado e dados salvos com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao processar o PDF.');
  } finally {
    client.release();
  }
});

router.get('/buscar', async (req, res) => {
  const termo = `%${req.query.q || ''}%`;
  const client = await pool.connect();

  try {
    const sql = `
      SELECT e.nome AS edital, t.topico, t.subtitulo, t.conteudo
      FROM topicos t
      JOIN editais e ON e.id = t.edital_id
      WHERE t.topico ILIKE $1 OR t.subtitulo ILIKE $2
    `;

    const result = await client.query(sql, [termo, termo]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar dados.');
  } finally {
    client.release();
  }
});

module.exports = router;
