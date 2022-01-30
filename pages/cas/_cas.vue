<template>
    <section class="container">
        <div class="box">
            <article class="message is-danger" v-if="invalid">
                <p class="message-body">Given CAS No. is invalid.</p>
            </article>
            <b-tabs v-model="active" v-if="cas">
                <b-tab-item v-for="rd in rdlist" :key="rd[0]" :label="rd[0]">
                    <iframe v-if="rd[2]" :src="rd[1](cas)" />
                    <p v-else>The inner-frame view is unavailable on this supplier's website: <br><button class="button" @click="visit">Visit website</button></p>
                </b-tab-item>
            </b-tabs>
        </div>
    </section>
</template>

<script>
import reagent_dist from '~/reagent-dist.js'

export default {
    data: () => ({
        rdlist: reagent_dist,
        cas: '',
        invalid: false,
        active: 0,
    }),
    head() {
        return { title: this.cas }
    },
    beforeMount() {
        // Validate given CAS No.
        const _cas = this.$route.params.cas;
        if( /^\d+-\d{2}-\d$/.test(_cas) ) this.cas = _cas;
        else this.invalid = true;
    },
    methods: {
        visit() {
            open( this.rdlist[this.active][1](this.cas) );
        }
    }
}
</script>
<style scoped>
iframe {
    width: 90vw; height: 75vh;
}
</style>