import { v4 as u4 } from 'uuid';
import * as shvl from 'shvl';
import Vue from 'vue';

export const state = () => ({
    sets: {
        /*setname*/default: {
            /*items: { [cid]: {purity, isliq, sg, quant, quantUnit} },
            std: one cid number to be set as standard,*/
        }
    },
});

export const getters = {
    cidmap: ($) => {
        const r = {};
        for(let set of Object.keys($.sets)) {
            for(let cid of Object.keys($.sets[set].items) )
                r[cid] = (r[cid] || []).concat(set);
        }
        return r;
    },
    uuidmap: ($) => {
        const r = {};
        for(let set of Object.keys($.sets)) {
            for(let cid of Object.keys($.sets[set].items))
                r[$.sets[set].items[cid].id] = [set, "items", cid];
        }
        return r;
    }
};

export const mutations = {
    create($, { sets = [ 'default' ], cid, purity = 100, isLiq = false, sg = 1, quant = 0.2, quantUnit = 0, std = false }) {
        if( (cid = parseInt(cid)) <= 0 || Number.isNaN(cid) ) return;
        for(let set of sets) {
            if(!shvl.get($.sets, [set, "items", cid]))
                shvl.set($.sets, [set, "items", cid], {purity, isLiq, sg, quant, quantUnit, id: u4() });
            shvl.set($.sets, [set, "std"], std ? cid : shvl.get($.sets, [set, "std"], cid));
        }
        $.sets.__ob__.dep.notify();
    },
    update($, { set = 'default', cid, key, val }) {
        if( !key || (cid = parseInt(cid)) <= 0 || Number.isNaN(cid) || !shvl.get($.sets, [set, "items", cid]) ) return; 
        $.sets = shvl.set($.sets, [set, "items" ,cid, key], val);
    },
    changeStd($, { set = 'default', cid }) {
        if( (cid = parseInt(cid)) <= 0 || Number.isNaN(cid) || !shvl.get($.sets,[set, "items", cid])) return;
        $.sets = shvl.set($.sets, [set, "std"], cid); 
    },
    remove($, { set = 'default', cid }) {
        if( (cid = parseInt(cid)) <= 0 || Number.isNaN(cid) || !shvl.get($.sets, [set, "items", cid]) ) return;
        delete $.sets[set].items[cid]; // delete from set
        $.sets.__ob__.dep.notify();
    },
    removeSet($, { set }) {
        if( !$.sets[set] ) return;
        Vue.delete($.sets, set);
    },
}

