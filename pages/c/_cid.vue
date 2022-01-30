<template>
  <section class="container">
      <chemsearch-body :cid="cid" />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ChemsearchBody from '~/components/ChemsearchBody.vue';

export default {
  data: () => ({}),
  computed: {
    cid() {
      return parseInt(this.$route.params.cid);
    },
    ...mapState('cache', ['cachedCdata']),
  },
  components: {
    ChemsearchBody,
  }
}

</script>

<style scoped>
.media { 
  margin-top: 1rem;
}
</style>