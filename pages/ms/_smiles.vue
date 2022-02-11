<template>
  <section class="container">
    <b-loading v-model="pending"/>
    <div class="box">
      <p><strong style="font-size:1.4rem">HRMS exact mass calculator(β)</strong></p>
      <b-notification type="is-danger is-light" v-if="err">{{err}}</b-notification>
      <canvas id="molecule" width="360" height="240"></canvas>

      <div class="content">
        <p v-if="!pending"><strong>分子式: </strong><span v-html="(formula||'').replace(/\d+/g,i=>`<sub>${i}</sub>`)"></span></p>
        <p v-if="!pending"><strong>精密質量</strong></p>
        <ul v-if="!pending">
          <li><strong>[M]:    </strong>{{tofixed(exact_ms)}}</li>
          <li><strong>[M+H]:  </strong>{{tofixed(exact_ms + 1.00783)}}</li>
          <li><strong>[M+Na]: </strong>{{tofixed(exact_ms + 22.98977)}}</li>
          <li><strong>[M-H]: </strong>{{tofixed(exact_ms - 1.00783)}}</li>
        </ul>
      </div>
      <button @click="$router.go(-1)" class="button is-primary">戻る</button>
    </div>
  </section>
</template>

<script>
import ChemsearchBody from '~/components/ChemsearchBody.vue';
import base64url from "base64-url";

export default {
  data: () => ({
    pending: true,
    err: "",
    exact_ms: "",
    formula: "",
  }),
  head: {
    title: "HRMS information calculator (β)",
  },
  methods: {
    tofixed: (val) => { try { return (1).toFixed.call(val,5) } catch(e) { return "" } }
  },
  async mounted() {
    const _smile = base64url.decode(this.$route.params.smiles),
          _self = this;

    const rd_tag = document.createElement("script");
    rd_tag.setAttribute("src","/rdkit/RDKit_minimal.js");
    rd_tag.addEventListener("load", async()=>{
      await window.initRDKitModule().then(async rd => {
        let mol = rd.get_mol(_smile)
        if(!mol.is_valid()) return (_self.err = "invalid SMILES was given");
        mol.draw_to_canvas( document.getElementById("molecule"), -1, -1);
        let desc = JSON.parse(mol.get_descriptors());
        _self.exact_ms = desc.exactmw;
        _self.formula = mol.get_inchi().match(/\/([^\/]+)\//)[1];
      });
      _self.pending = false;
    });
    document.head.appendChild(rd_tag);
  }
  
}

</script>

<style scoped>
.media { 
  margin-top: 1rem;
}
</style>