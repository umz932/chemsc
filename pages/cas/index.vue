<template>
    <section class="container">
        <div class="box">
            <validation-provider :rules="{ regex: /^\d+-\d{2}-\d$/ }" v-slot="{ invalid, errors }">
                <b-field label="Direct Reagent Search" :type="errors[0]?'is-danger':''" :message="errors[0]">
                    <b-input placeholder="CAS RN#" name="CAS RN" v-model="cas" />
                </b-field>
                <button @click="search" :disabled="cas.length===0||invalid" class="button is-primary">Search</button>
            </validation-provider>
        </div>
    </section>
</template>

<script>
export default {
    data: () => ({
        cas: ''
    }),
    head: {
        title: 'Direct Reagent Search (β)'
    },
    methods: {
        search() {
            
        }
    }
}
</script>