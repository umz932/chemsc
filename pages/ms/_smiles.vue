<template>
  <section class="container">
    <b-loading v-model="pending"/>
    <client-only>
      <div class="box">
        <p><strong style="font-size:1.4rem">HRMS exact mass calculator(β)</strong></p>
        <b-notification type="is-danger is-light" v-if="err">{{err}}</b-notification>
        <canvas id="molecule" width="360" height="240"></canvas>

        <div class="content">
          <p v-if="!pending"><strong>分子式: </strong><span v-html="(formula||'').replace(/\d+/g,i=>`<sub>${i}</sub>`)"></span></p>
          <p v-if="!pending"><strong>精密質量</strong></p>
          <ul v-if="!pending">
            <li><b-radio v-model="mstype" name="mstype" native-value="M"><strong>[M]:    </strong>{{tofixed(exact_ms)}}</b-radio></li>
            <li><b-radio v-model="mstype" name="mstype" native-value="M+H"><strong>[M+H]:  </strong>{{tofixed(exact_ms + 1.00783)}}</b-radio></li>
            <li><b-radio v-model="mstype" name="mstype" native-value="M+Na"><strong>[M+Na]: </strong>{{tofixed(exact_ms + 22.98977)}}</b-radio></li>
            <li><b-radio v-model="mstype" name="mstype" native-value="M-H"><strong>[M-H]: </strong>{{tofixed(exact_ms - 1.00783)}}</b-radio></li>
          </ul>
          <toggle-slider v-if="!pending" title="誤差計算">
            <b-field grouped>
              <p class="control">m/z </p>
              <b-input v-model="measured" @focus="placehold" custom-class="has-text-centered" style="width: 7rem;"/>
              <p class="control">([{{mstype}}]<sup>+</sup>); Calcd. for <span v-html="(formula||'').replace(/\d+/g,i=>`<sub>${i}</sub>`)"></span>({{mstype.slice(1)}}): {{tofixed(calcd)}}</p>
            </b-field>
            <p><strong>Error:</strong> <span :class="{'has-text-weight-bold': abs_mserr >= 5, 'has-text-danger': abs_mserr >= 10, 'has-text-warning': abs_mserr >= 5 && abs_mserr < 10, 'has-text-success': abs_mserr <= 3 }">{{mserr}}</span> ppm</p>
          </toggle-slider>
        </div>
        <button @click="$router.go(-1)" class="button is-primary">戻る</button>
        <button @click="$router.push('/s/' + $route.params.smiles)" class="button">構造検索</button>
      </div>
    </client-only>
  </section>
</template>

<script>
import ToggleSlider from "~/components/ToggleSlider.vue";
import base64url from "base64-url";

export default {
  data: () => ({
    pending: true,
    mstype: "M+H",
    measured: "",
    err: "",
    exact_ms: "",
    formula: "",

    mscoeff: {
      "M": 0,
      "M+H": 1.00783,
      "M+Na": 22.98977,
      "M-H": -1.00783
    },
  }),
  head: {
    title: "HRMS information calculator (β)",
    script: [
      {
        src: "/rdkit/RDKit_minimal.js"
      }
    ],
  },
  computed: {
    calcd() {
      return this.exact_ms + this.mscoeff[this.mstype];
    },
    mserr() {
      return this.measured > 0 ? (1).toFixed.call((this.measured - this.calcd)*1000000/this.calcd, 2) : "--";
    },
    abs_mserr() {
      return Math.abs(this.mserr);
    }
  },
  methods: {
    placehold() {
      if( !(this.measured > 0) )
        this.measured = Math.floor(this.calcd) + ".";
    },
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
  },

  components: {
    ToggleSlider
  }
  
}

</script>

<style scoped>
.media { 
  margin-top: 1rem;
}
</style>