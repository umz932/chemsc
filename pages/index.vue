<template>
  <section class="container">
    <div class="box">
      <b-field>
        <chem-search label="名前検索:" :emitEvent="directMode" @hit="trighit" :initial-value="$route.params.name" placeholder="Compound Name"/>
      </b-field>
      <article class="media">
        <div class="media-content">
          <div class="content">
            <b-field>
              <b-switch v-model="directMode">
                <p><span :class="{direct:directMode}">{{ directMode ? "試薬検索モード(β)":"通常モード"}}</span><span v-if="directMode" style="color:gray"> (直接試薬検索ページへ飛びます)</span></p>
              </b-switch>
            </b-field>
            <b-loading v-model="pending" :is-full-page="true"/>
            <p v-if="err">error: {{err}}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import ChemSearch from '~/components/ChemSearch.vue';
import { mapActions } from 'vuex';


export default {
  data: () => ({
    directMode: false,
    err: "",
    pending: false,
  }),
  head: {
    title: 'ChemSC - Name Search'
  },
  methods: {
    async trighit(item) {
      this.pending = true;
      await this.$persist.wait();
      let cdata = await this.solveQuery(`/_/name/${item}`);
      this.err = cdata.err || "";
      if(cdata.cas) window.location.href=`/cas/${cdata.cas}`;
    },
    ...mapActions("cache", [ "solveQuery" ]),
  },
  components: {
    ChemSearch,
  }
}

</script>

<style scoped>
.media { 
  margin-top: 1rem;
  flex-wrap: wrap;
}

sup, .direct {
  color: red;
  font-weight: bolder;
}

</style>
