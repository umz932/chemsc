<template>
  <section class="container">
    <div class="box">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <b-field v-if="history.length>10">
              <b-input placeholder="Search" icon="search" icon-pack="fas" v-model="query"/>
            </b-field>
            <article v-if="history.length===0" class="message is-info">
              <p class="message-body">No history</p>
            </article>
            <article v-else-if="history_queried.length===0" class="message is-danger">
              <p class="message-body">Not found</p>
            </article>
            <b-table v-else 
                            :data="history_queried" 
                            :paginated="true" 
                            :pagination-simple="true" 
                            :per-page="10" 
                            pagination-position="bottom" 
                            default-sort="last_viewed"
                            default-sort-direction="desc"
                            sort-icon="chevron-up"
                            >
                <b-table-column field="name" label="Compound Name" sortable v-slot="{ row }">
                  <b-dropdown hoverable>
                    <nuxt-link :to="`/c/${row.cid}`" slot="trigger">{{row.name}}</nuxt-link>

                    <b-dropdown-item custom><chimg :cid="row.cid" width="200px" height="200px" /></b-dropdown-item>
                  </b-dropdown>
                </b-table-column>
                <b-table-column field="mw" label="MW" sortable v-slot="{ row }">
                  {{row.mw}}
                </b-table-column>
                <b-table-column field="cas" label="CAS RN" v-slot="{ row }">
                  <b-dropdown v-if="row.cas">
                    <a slot="trigger">{{row.cas}}</a>

                    <b-dropdown-item @click="open(row.cas)">試薬検索</b-dropdown-item>
                    <b-dropdown-item @click="$router.push(`/cas/${row.cas}`)"><strong>試薬検索β</strong> (ポップアップなし)</b-dropdown-item>
                    <b-dropdown-item :custom="!row.is_msds_avail" :class="{'has-text-grey':!row.is_msds_avail}">{{row.is_msds_avail?'MSDSを見る':'MSDS情報はありません'}}</b-dropdown-item>
                    <hr class="dropdown-divider"/>
                    <b-dropdown-item custom class="has-text-grey is-size-7">特定の試薬会社で検索</b-dropdown-item>
                    <b-dropdown-item @click="open(row.cas,i)" :key="item[0]" v-for="(item, i) in rdlist">{{item[0]}}</b-dropdown-item>
                  </b-dropdown>
                </b-table-column>
                <b-table-column field="count" label="View count" sortable v-slot="{ row }">
                  {{row.count}}
                </b-table-column>
                <b-table-column field="last_viewed" label="Last Viewed" sortable v-slot="{ row }">
                  {{parseDate(row.last_viewed)}}
                </b-table-column>
            </b-table>
            <span class="button" @click="clear">Clear</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import reagent_list from '~/reagent-dist.js';

import chimg from '~/components/chimg.vue';
import { mapState,  mapMutations } from 'vuex';

export default {
    data: () => ({
      rdlist: reagent_list,
      query: '',
    }),
    head: {
      title: 'History'
    },
    computed: mapState({
      history: $ => Object.values($.history.items),
      history_queried() {
        let hist = this.history, qur = this.query;
        return hist.length > 10 && qur.length > 0 ? hist.filter(v=>(new RegExp(`^${qur}`, 'i')).test(v.name)) : hist;
      }
    }),
    methods: {
      parseDate(date) {
        let d = new Date(date);
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${('00'+d.getHours()).slice(-2)}:${('00'+d.getMinutes()).slice(-2)}:${('00'+d.getSeconds()).slice(-2)}`;
      },
      open(cas,ind) {
      // all supplier
      if( ind == null ) this.rdlist.forEach(el => open(el[1](cas)));
      else open(this.rdlist[ind][1](cas)); 
      },
      openMsds() {
        if( this.cdata.is_msds_avail )
        open(`http://anzeninfo.mhlw.go.jp/anzen/gmsds/${this.cdata.cas}.html`);
      },
      ...mapMutations('history', ['clear'])
    },
    components: {
      chimg
    }
}
</script>