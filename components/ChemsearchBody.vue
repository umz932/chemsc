<template>
  <div class="box">
    <article class="message is-danger" v-if="error">
      <p class="message-body">{{ error }}</p>
    </article>
    <article class="media">
          <b-loading :is-full-page="false" :active.sync="pending"/>
          <div class="media-left is-hidden-mobile">
            <figure class="image is-300x300" v-if="!!cdata.cid">
              <chimg :cid="cdata.cid" width="300px" height="300px" />
            </figure>
            <p class="has-text-centered" v-html="(cdata.formula||'').replace(/\d+/g,i=>`<sub>${i}</sub>`)"></p>
          </div>
          <div class="media-content">
            <div class="content" v-if="!!cdata.cid">
              <p>
                <strong v-if="cdata.name">
                  <b-tooltip :label="cdata.iupac || 'N/A'" :multilined="true" position="is-bottom" size="is-large">
                    {{ cdata.name }}
                  </b-tooltip>
                </strong>
                <!--
                <b-tooltip :label="sets.length?'Balancerに追加':'setが選択されていません'" position="is-bottom">
                  <a @click="addBalancer"><b-icon pack="fas" icon="balance-scale" :class="{'has-text-grey':!sets.length}"/></a>
                </b-tooltip>
                -->  
              </p>
              <p class="is-visible-mobile-only">分子式: 
                <b-dropdown>              
                  <a slot="trigger" v-html="(cdata.formula||'').replace(/\d+/g,i=>`<sub>${i}</sub>`)" />

                  <b-dropdown-item custom><chimg :cid="cdata.cid" width="270px" height="270px" /></b-dropdown-item>
                </b-dropdown>
              </p>
              <p v-if="!cdata.cas" class="has-text-grey">CAS番号が登録されていないので試薬検索は利用できません
              <p v-if="!!cdata.cas"><strong>CAS:</strong> {{ cdata.cas }}
                  <b-dropdown hoverable>
                    <a slot="trigger"><b-icon pack="fas" icon="search" /></a>

                    <b-dropdown-item @click="open()">試薬検索</b-dropdown-item>
                    <b-dropdown-item @click="$router.push(`/cas/${cdata.cas}`)"><strong>試薬検索β</strong> (ポップアップなし)</b-dropdown-item>
                    <hr class="dropdown-divider"/>
                    <b-dropdown-item custom class="has-text-grey is-size-7">特定の試薬会社で検索</b-dropdown-item>
                    <b-dropdown-item @click="open(i)" v-for="(item, i) in rdlist" :key="i">{{item[0]}}</b-dropdown-item>
                  </b-dropdown>
                <b-tooltip :label="cdata.is_msds_avail?'MSDSを見る':'MSDS情報はありません'" position="is-bottom">
                  <a @click="openMsds"><b-icon pack="fas" icon="info-circle" :class="{'has-text-grey':!cdata.is_msds_avail}"/></a>
                </b-tooltip>
              </p>
              <p><strong>分子量:</strong> {{ cdata.mw || '' }}</p>
              <b-field v-if="cdata.mw">
                <b-field grouped>
                  <p class="control"><strong>重量計算:</strong>&nbsp;</p>
                  <b-numberinput v-model="quant" style="width:4rem;" :controls="0" step="0.01" min="0.01"/>
                  <p class="control">mmol= {{ mass }}mg <span v-if="isLiq">({{ Math.round(mass/sg*100)/100 }}μL)</span></p>
                </b-field>
              </b-field>
              <p v-if="!!mp"><strong>融点:</strong> {{mp}}</p>
              <p v-if="!!bp"><strong>沸点:</strong> {{bp}}</p>
              <p v-if="!!storeAt"><strong>保存条件(TCI):</strong> {{storeAt}}</p>
              <p v-if="!!unstableUnder"><strong>避けるべき条件(TCI):</strong> {{unstableUnder}}</p>
              <p v-if="!!sdbs"><a :href="`https://sdbs.db.aist.go.jp/sdbs/cgi-bin/direct_frame_disp.cgi?sdbsno=${sdbs}`" target="_blank">SDBS<b-icon pack="fas" icon="external-link-alt"/></a></p>
              <p><a :href="`https://pubchem.ncbi.nlm.nih.gov/compound/${cdata.cid}`" target="_blank">PubChem<b-icon pack="fas" icon="external-link-alt"/></a></p>
              <p><a @click="optionsVisible=!optionsVisible">重量計算オプション<b-icon pack="fas" :icon="optionsVisible?'angle-double-up':'angle-double-down'"/></a></p>
              <vue-slide-up-down :active="optionsVisible" :duration="300">
                <div class="box">
                  <b-field label="有効含量 (%):" horizontal>
                      <b-numberinput step="0.01" min="0.1" max="100" v-model="purity"/>
                  </b-field>
                  <b-field label="μL単位で秤量する:" horizontal>
                    <b-checkbox v-model="isLiq"></b-checkbox>
                  </b-field>
                  <b-field label="密度 (g/mL):" horizontal>
                      <b-numberinput step="0.001" min="0.1" max="4.0" v-model="sg" :disabled="!isLiq"/>
                  </b-field>
                  <!--
                  <b-field label="基質:" horizontal>
                    <b-checkbox v-model="std"/>
                  </b-field>
                  <b-field label="単位:" horizontal>
                    <b-field>
                      <b-radio-button v-model="quantUnit" :native-value="0" :disabled="std"><span>eq</span></b-radio-button>
                      <b-radio-button v-model="quantUnit" :native-value="1" :disabled="std"><span>mol%</span></b-radio-button>
                    </b-field> 
                  </b-field>
                  <b-field label="追加するset:" horizontal>
                    <b-dropdown v-model="sets" multiple>
                      <b-button slot="trigger" icon-right="chevron-down" icon-pack="fas">{{ sets.slice(0,3).join(", ") }}</b-button>

                      <b-dropdown-item v-for="(el, i) in setnames_av" :key="i" :value="el">
                        <span>{{el}}</span>
                      </b-dropdown-item>
                      <b-dropdown-item custom>
                        <div class="control has-icons-right">
                          <input class="input" v-model="setname_new" type="text" placeholder="Add set" @keyup.enter="addSetname"/>
                          <b-icon pack="fas" icon="plus-circle" class="is-right is-clickable" @click="addSetname"/>
                        </div> 
                        <b-input v-model="setname_new" placeholder="Add set" icon-pack="fas" icon-right="plus-circle" icon-right-clickable @keyup.enter="addSetname" @icon-right-click="addSetname"/>
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-field>
                  <b-field horizontal>
                    <b-button :disabled="!sets.length" class="control" @click="addBalancer" type="is-primary" icon-left="balance-scale" icon-pack="fas">Balancerに追加</b-button>
                  </b-field>
                  -->
                </div>
              </vue-slide-up-down>
            </div>
          </div>
       </article>
    </div>
</template>

<script>
import reagent_list from '~/reagent-dist.js';
import VueSlideUpDown from 'vue-slide-up-down';
import { decode } from 'base64-url';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { get, head } from 'axios';
import chimg from '~/components/chimg.vue';

export default {
  data: () => ({
    error: "",
    pending: true,
    setnames_av: [],
    setname_new: "",
    sets: ['default'],
    cdata: {},
    quant: 0.2,
    optionsVisible: false,
    // properties
    mp: "",
    bp: "",
    sdbs: "",
    storeAt: "",
    unstableUnder: "",
    // balancer options
    std: false,
    purity: 100,
    isLiq: false,
    sg: 1,
    quantUnit: 0,

    rdlist: reagent_list,
  }),
  props: {
      query: String,
      cid: Number,
  },
  head() {
    return {
      title: this.pending ? 'Now retrieving...' : this.cdata.name || this.cdata.iupac || "",
    }
  },
  async created() {
    await this.$persist.wait();
    this.setnames_av = Object.keys(this.balancer.sets);
    if( this.query ) {
        let res = this.cdata = await this.solveQuery(this.query);
        if( res.err ) //this.$emit("error", res.err);
          this.error = res.err;
        else {
          this.push(res);
          if(res.smiles) this.update(res.smiles);
        }
        this.pending = false;
        // 20220130 TCIから物性情報を獲得 goto: methods::applyProps
        this.applyProps(res);
    } else if( this.cid > 0 ){
      // history (deserialization) mode
      const res = this.cdata = this.cache.cachedCdata[this.cid] || {};
      if(res) this.push(res);
      if(res.smiles) this.update(res.smiles);
      this.pending = false;
      // 20220130 TCIから物性情報を獲得
      this.applyProps(res);
    } else this.pending = false;


  },
  computed: {
    purity_safe() {
      let purity = this.purity;
      return Number.isNaN(purity) || purity <= 0 || purity > 100 ? 100 : purity;
    },
    mass() {
      return Math.round(this.cdata.mw * this.quant * 10/ (this.purity_safe/100)) / 10;
    },
    ...mapState([ 'cache', 'balancer' ]),
  },
  methods: {
    open(ind) {
      // all supplier
      if( ind == null ) this.rdlist.forEach(el => open(el[1](this.cdata.cas)));
      else open(this.rdlist[ind][1](this.cdata.cas)); 
    },
    openMsds() {
      if( this.cdata.is_msds_avail )
      open(`http://anzeninfo.mhlw.go.jp/anzen/gmsds/${this.cdata.cas}.html`);
    },
    addBalancer() {
      if(!this.sets.length) return;
      this.$buefy.toast.open("not implemented");
    },
    addSetname() {
      if( this.setname_new.trim().length === 0 || this.setnames_av.includes(this.setname_new) ) return;
      this.setnames_av.push(this.setname_new);
    },
    // 20220130 propsをgetしuiに適用
    async applyProps(cdata) {
      if( !cdata.cas ) return;
      const res = await this.getProp(cdata);
      if( res.err ) return;
      this.mp = res.mp;
      this.bp = res.bp;
      this.storeAt = res["store_at"];
      this.unstableUnder = res["unstable_under"];
      this.sdbs = res.sdbs;
      this.sg = parseFloat(res.density || 1);
      if( ~res.state.indexOf("液体") ) this.isLiq = true;
    },
    ...mapMutations({
      push: 'history/push',
      update: 'prev/update',
      add: 'balancer/add',
    }),
    ...mapActions('cache', ['solveQuery', 'getProp']),
  },
  components: {
    VueSlideUpDown,
    chimg,
  }
}

</script>

<style scoped>
.media { 
  margin-top: 1rem;
}
.is-size-8 {
  font-size: 0.6rem;
}

@media (min-width: 769px) {
  .is-visible-mobile-only {
    display: none !important;
  }
}
</style>