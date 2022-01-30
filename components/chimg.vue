<template>
    <img :src="src" :width="width||'300px'" :height="height||'300px'" />
</template>

<script>
import { mapActions } from 'vuex';

async function load() {
    await this.$persist.wait();
    if( this.cid ) this.src = await this.loadImg(this.cid);
}

export default {
    data: () => ({
        src: "/images/300x300.png",
    }),
    props: {
        cid: Number,
        width: String,
        height: String,
    },
    created: load,
    watch: {
        cid: load
    },
    methods: mapActions('cache', ['loadImg'])
}
</script>