<template>
        <b-field :label="label">
            <b-autocomplete :data="results" v-model="query" :placeholder="placeholder" :loading="pending" v-stream:typing="typing$" @select="i=>hit(i)" @keyup.enter.native="hit(query)"/>
        </b-field>
</template>

<script>
import VueSlideUpDown from 'vue-slide-up-down';
import { Subject, merge, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, mapTo, startWith } from 'rxjs/operators';
import { get } from 'axios';

export default {
    data: () => ({
        query: "",
    }),
    domStreams: [ 'typing$' ],
    subscriptions() {
        this.hit$ = new Subject();
        this.fetched$ = new Subject();
        return {
            results: merge(
                this.$watchAsObservable("query"),
                this.hit$
            ).pipe(
                map(d=>d?d.newValue:""),
                debounceTime(600),
                distinctUntilChanged(),
                switchMap(async(query)=>{
                    const res = query && query.length > 2 ? await get(`/_/search/${query}`) : {};
                    this.fetched$.next();
                    return res.data || [];
                }),
                startWith([])
            ),
            pending: merge(
                this.typing$.pipe( mapTo(true) ),
                merge(this.hit$, this.fetched$).pipe( mapTo(false) )
            ).pipe(startWith(false)),
        }
    },
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
        emitEvent: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        hit(item) {
            if(!item) return;
            this.hit$.next();
            if( this.emitEvent ) this.$emit("hit",item);
            else this.$router.push(`/n/${item}`);
        }
    }
}

</script>

<style scoped>
    .full { width: 100% }
    .list-item { padding: 0.1rem 1rem; }
    .res-list { position:absolute; z-index: 114514; }
</style>