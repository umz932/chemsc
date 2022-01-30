<template>
	<div>
		<b-loading is-full-page :active.sync="loading">
					<p><b-icon pack="fas" icon="spinner" size="is-large" custom-class="fa-spin" /></p>
					<p class="is-size-4-tablet has-text-weight-bold" style="padding-left: 0.75rem">Loading...</p>
		</b-loading>
	  	<client-only>
			<div :class="{hidden: loading}">
				<b-navbar type="is-light" :fixed-top="true">
				<template slot="brand">
					<b-navbar-item tag="router-link" to="/" id="brand">
					    &#x232c;
					</b-navbar-item>
					<b-navbar-item tag="div">
					  <chem-search placeholder="Name Search ..." />
					</b-navbar-item>
				</template>
				<template slot="start">
					<b-navbar-item tag="router-link" v-for="el in navitems" :key="el.label" :to="el.to">
					    {{el.label}}
					</b-navbar-item>
				</template>
				<template slot="end">
				  
				</template>
				</b-navbar>
				<div id="nuxt">
				  <nuxt/>
				</div>
				<hr />
			</div>
	  	</client-only>
	</div>
</template>

<script>

import { get } from 'axios';
import ChemSearch from '~/components/ChemSearch.vue';

export default {
  data: () => ({
    loading: true,
    navitems: [
            { to: "/", label: "名前検索" },
            { to: "/s", label: "構造検索" },
            //{ to: "/b", label: "Balancer" },
            { to: "/h", label: "履歴"},
            //{ to: "/m", label: "NMR Memo"},
            { to: "/about", label: "About"}      
    ],
  }),
  async mounted(){
    await this.$persist.wait();
    this.loading = false;
  },
  components: {
    ChemSearch,
  }
}
</script>

<style>
* {
  font-family: 'Ubuntu', sans-serif;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.hidden {
	display: none;
}
</style>

<style scoped>
hr { margin: 0.5rem 0; }
.navbar { box-shadow: 0 2px 2px rgba(0,0,0,0.2); }
.navbar-brand { border-right: 1px solid rgba(0,0,0,0.3); }
#brand { font-size: 2.5rem; }
#nuxt { margin-top: 2rem;}
</style>
