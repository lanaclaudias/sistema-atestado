<template>
  <div>
    <h2>Buscar por Tópico/Subtópico</h2>
    <input v-model="termo" @input="buscar" placeholder="Digite algo como 'Requisitos'" />
    
    <div v-if="resultados.length">
      <h3>Resultados:</h3>
      <div v-for="(r, i) in resultados" :key="i" style="margin-bottom: 10px">
        <strong>Edital:</strong> {{ r.edital }}<br />
        <strong>Tópico:</strong> {{ r.topico }}<br />
        <strong>Subtópico:</strong> {{ r.subtitulo }}<br />
        <strong>Conteúdo:</strong> {{ r.conteudo }}<br />
        <hr />
      </div>
    </div>
    <p v-else-if="termo">Nenhum resultado encontrado.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      termo: '',
      resultados: []
    };
  },
  methods: {
    async buscar() {
      if (this.termo.length < 2) {
        this.resultados = [];
        return;
      }

      try {
        const resposta = await axios.get('http://localhost:3000/api/buscar?q=' + this.termo);
        this.resultados = resposta.data;
      } catch (erro) {
        console.error('Erro ao buscar:', erro);
      }
    }
  }
};
</script>
