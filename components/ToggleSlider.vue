<template>
    <div>
        <p><a @click="vis=!vis">{{title}}<b-icon pack="fas" :icon="vis?'angle-double-up':'angle-double-down'"/></a></p>
        <vue-slide-up-down :active="vis" :duration="duration||300">
            <div class="box">
                <slot></slot>
            </div>
        </vue-slide-up-down>
    </div>
</template>

<script>
import VueSlideUpDown from "vue-slide-up-down";

export default {
    data: () => ({
        vis: false,
    }),
    props: {
        title: String,
        duration: Number,
    },
    components: {
        VueSlideUpDown
    }
}
</script>