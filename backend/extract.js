function extrairTopicos(texto) {
  const linhas = texto.split('\n');
  const resultados = [];

  let topicoAtual = '';
  let subtituloAtual = '';
  let conteudoAtual = '';

  linhas.forEach((linha, index) => {
    const linhaLimpa = linha.trim();

    const regexTopico = /^\d+\.\s+.+/;         // Ex: 1. INTRODUÇÃO
    const regexSubtopico = /^\d+\.\d+\s.+/;     // Ex: 1.1 Objetivo

    if (regexTopico.test(linhaLimpa)) {
      if (conteudoAtual && topicoAtual) {
        resultados.push({
          topico: topicoAtual,
          subtitulo: subtituloAtual || null,
          conteudo: conteudoAtual.trim()
        });
      }
      topicoAtual = linhaLimpa;
      subtituloAtual = '';
      conteudoAtual = '';
    } else if (regexSubtopico.test(linhaLimpa)) {
      if (conteudoAtual && topicoAtual) {
        resultados.push({
          topico: topicoAtual,
          subtitulo: subtituloAtual || null,
          conteudo: conteudoAtual.trim()
        });
      }
      subtituloAtual = linhaLimpa;
      conteudoAtual = '';
    } else {
      conteudoAtual += linhaLimpa + ' ';
    }

    // Salvar o último
    if (index === linhas.length - 1 && (topicoAtual || subtituloAtual)) {
      resultados.push({
        topico: topicoAtual,
        subtitulo: subtituloAtual || null,
        conteudo: conteudoAtual.trim()
      });
    }
  });

  return resultados;
}

module.exports = extrairTopicos;
