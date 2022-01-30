import localforage from 'localforage';
import { merge } from 'lodash';

const storage_name = 'chemsc';
const exclude = [
    'prev',
];

async function StorageToVuex(store, storage) {
    const savedState = await storage.getItem('_store');
    store.replaceState( merge({}, store.state, savedState));
}

async function VuexToStorage($, storage) {
    let _$ = exclude.length === 0 ? $ : Object.keys($).reduce((s, key) => {
        if( !~exclude.indexOf(key) ) s[key] = $[key];
        return s;
    }, {});
    await storage.setItem('_store', _$);
    localStorage.setItem(`_store_${storage_name}_timestamp`, Date.now());
}

export default ({ store, isDev }, inject) => {
    const storage = localforage.createInstance({ name: storage_name });

    let state_loaded = false;
    inject('persist', {
        storage: isDev ? storage : null,
        flush: () => { if(isDev) storage.removeItem('_store') },
        wait: () => state_loaded ? Promise.resolve() : new Promise(o => {
            const id = setInterval(()=>{
                if( state_loaded ) {
                    o();
                    clearInterval(id);    
                }
            }, 0);
        }),
    });
    window.onNuxtReady(async () => {
        try {
            // storage -> vuex
            await StorageToVuex( store, storage);
            window.addEventListener("storage", ({ key })=>{
                if( key === `_store_${storage_name}_timestamp` ) 
                    StorageToVuex( store, storage);
            },false);

            // vuex -> storage
            store.subscribe((mut, $) => {
                VuexToStorage($, storage);
            });
            state_loaded = true;
        } catch(e) {}
    });
}