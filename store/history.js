import Vue from 'vue';

export default {
    state: () => ({
        items: {}
    }),
    getters: {
        //five_most_viewed: ($) => Object.values($.items).sort((a,b)=>b.count-a.count).slice(0,5),
        five_latest_viewed: ($) => Object.values($.items).sort((a,b)=>b.last_viewed-a.last_viewed).slice(0,5),
    },
    mutations: {
        push($, cdata) {
            if( !cdata.cid ) return;
            const count = $.items[cdata.cid] ? $.items[cdata.cid].count + 1 : 1;
            Vue.set($.items, cdata.cid, Object.assign({last_viewed: new Date(), count}, cdata));
        },
        clear($) {
            $.items = {};
        }
    },
}