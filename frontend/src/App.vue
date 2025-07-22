<template>
  <div>
    <h1>Sistema de Editais</h1>
    <PDFUploader />
    <hr />
    <BuscaTopicos />
  </div>
</template>

<script>
import PDFUploader from './components/PDFUploader.vue';
import BuscaTopicos from './components/BuscaTopicos.vue';

export default {
  components: {
    PDFUploader,
    BuscaTopicos
  }
};
</script>
