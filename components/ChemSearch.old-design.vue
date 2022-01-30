<template>
    <div>
        <p v-if="label"><strong>{{label}}</strong></p>
        <b-input class="full" :placeholder="placeholder" ref="query_input" v-model="query" :loading="pending" @input="change" @keyup.enter.native="hit(query)"/>
        <!-- result list -->
        <vue-slide-up-down :active="results.length!==0&&!pending" :duration="300" class="full res-list">
            <div class="list is-hoverable">
                <a class="list-item" v-for="(item, i) in results" :key="i" @click="hit(item)">{{ item }}</a>
            </div>
        </vue-slide-up-down>
    </div>
</template>

<script>
import VueSlideUpDown from 'vue-slide-up-down';
import { debounce } from 'lodash';
import { get } from 'axios';

export default {
    data: () => ({
        debounceFn: debounce(async function(){
                this.pending = true;
                let res = await get(`/_/search/${this.query}`);
                if( this.pending ) {
                    this.pending = false;
                    this.results = res.data;
                }
            }, 600),
        pending: false,
        query: "",
        results: [],
    }),
    created() {
        this.query = this.initialValue;
    },
    components: {
        VueSlideUpDown,
    },
    props: {
        label: String,
        initialValue: String,
        placeholder: String,
    },
    methods: {
        change() { 
            this.debounceFn();
        },
        hit( item ) {
            this.debounceFn.cancel();
            this.pending = false;
            this.query = item;
            this.results = [];
            this.$router.push(`/n/${item}`);
        },
    }
}

</script>

<style scoped>
    .full { width: 100% }
    .list-item { padding: 0.1rem 1rem; }
    .res-list { position:absolute; z-index: 114514; }
</style>