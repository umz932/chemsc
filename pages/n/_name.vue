<template>
  <section class="container">
    <chemsearch-body :query="`/_/name/${$route.params.name}`"/>
  </section>
</template>

<script>
import ChemsearchBody from '~/components/ChemsearchBody.vue';

export default {
  components: {
    ChemsearchBody
  }
}

</script>

<style scoped>
.media { 
  margin-top: 1rem;
}
</style>