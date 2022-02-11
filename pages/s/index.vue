<template>
  <section class="container">
      <div class="box">
        <p><strong>構造検索</strong></p>
        <div id="structure"></div>
        
        <button @click="search" class="button is-primary">検索</button>
        <button @click="msearch" class="button"><strong>HRMS mass calculator(β)</strong></button>
        <button @click="nsOpen=!0" class="button">名前から構造検索</button>
      </div>

      <b-modal :active.sync="nsOpen">
        <div style="height: 350px">
         <chem-search placeholder="Structure from name..." :emit-event="true" @hit="nsHit"/>
        </div>
      </b-modal>
  </section>
</template>

<script>

import { mapState, mapActions } from 'vuex';
import ChemSearch from '~/components/ChemSearch.vue';

export default {
  data: () => ({
    nsOpen: false,
  }),
  head: {
    title: 'Structure Search',
    script: [
      { src: "/jsme/jsme.nocache.js", type: "text/javascript", async: true, defer: true }
    ],
  },
  created() {
    const _preload = this.smiles || "";

    window.jsmeOnLoad = () => {
      window.jsmeApplet = new JSApplet.JSME("structure", "480px", "360px", {
          options: "norbutton"
      });

      if( _preload ) jsmeApplet.readGenericMolecularInput(_preload);
    }
  },
  computed: mapState('prev', [ 'smiles' ]),
  methods: {
    search() {
        let smiles = jsmeApplet.smiles();

        if( smiles ) this.$router.push(`/s/${btoa(smiles).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}`);
    },
    msearch() {
        let smiles = jsmeApplet.smiles();

        if( smiles ) this.$router.push(`/ms/${btoa(smiles).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}`);
    },
    async nsHit(q) {
      this.nsOpen = false;
      let res = await this.solveQuery(`/_/name/${q}`);
      if( res.err ) this.$buefy.toast.open(res.err);
      else if( !res.smiles ) this.$buefy.toast.open("No available SMILES in PubChem DB");
      else jsmeApplet.readGenericMolecularInput(res.smiles);
    },
    ...mapActions('cache', [ 'solveQuery' ]),
  },
  components: {
    ChemSearch,
  }
}
</script>

<style scoped>
#ketcher { min-width: 670px; min-height: 420px; }
#lic { font-size: 0.7rem; text-align: right; color: grey; }

</style>