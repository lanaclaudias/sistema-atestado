<template>
  <div>
    <h2>Upload de Edital</h2>
    <input type="file" @change="handleFile" accept="application/pdf" />
    <button @click="enviarPDF" :disabled="!arquivo">Enviar</button>
    <p v-if="mensagem">{{ mensagem }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      arquivo: null,
      mensagem: ''
    };
  },
  methods: {
    handleFile(event) {
      this.arquivo = event.target.files[0];
    },
    async enviarPDF() {
      const formData = new FormData();
      formData.append('pdf', this.arquivo);

      try {
        const resposta = await axios.post('http://localhost:3000/api/upload', formData);
        this.mensagem = resposta.data;
        this.arquivo = null;
      } catch (erro) {
        this.mensagem = 'Erro ao enviar o PDF.';
      }
    }
  }
};
</script>

<style scoped>
/* Adicione estilos aqui se necessário */
</style>
