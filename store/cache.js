import Vue from 'vue';
import { get } from 'axios'; 
import { merge } from 'lodash';

export const state = () => ({
    cachedImgs: {},
    cachedCdata: {},
    cachedQuery: {},
    cachedProp: {},
});

export const mutations = {
    // never called directly
    cache($, [r,n,d]) {
        Vue.set($["cached"+ r], n, d);
    }
};

export const actions = {
    async loadImg({ state, commit }, cid) {
        if( state.cachedImgs[cid] ) return state.cachedImgs[cid];
        let res = await get(`/_/png/${cid}`).catch(()=>null);
        if( !res ) throw "invalid given cid";
        commit("cache",["Imgs", cid, res.data]);
        return res.data;
    },
    async solveQuery({ state, commit }, query, cid) {
        if( (cid = state.cachedQuery[ query ]) && state.cachedCdata[ cid ] )
            return state.cachedCdata[ cid ];
            
        const res = await get(query).then(d=>d.data).catch(o=>({
                err: o.response.data.Fault.Message || "原因不明のエラー"
        }));
        if( !res.err ) {
            commit('cache', ["Cdata", res.cid, res]);
            commit('cache', ["Query", query, res.cid]);
        }
        return res;
        
    },
    async getProp({ state, commit }, cdata) {
        const cid = cdata.cid;
        if( state.cachedProp[ cid ] )
            return state.cachedProp[ cid ];

        const res = await get("/_/props/"+ cdata.cas).then(d=>d.data).catch(o=>({
            err: o.response.data.Fault.Message
        }));
        if( res ) commit("cache", ["Prop", cid, res]);
        return res;
    }
}