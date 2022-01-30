<template>
    <b-field>
    </b-field>
</template>

<script>
export default {
    props: {
        /* b-field */
        defaultType: { type: String },
        label: { type: String },
        labelFor: { type: String },
        grouped: { type: Boolean, default: false },
        groupMultiline: { type: Boolean, default: false },
        position: { type: String },
        horizontal: { type: Boolean, default: false },
        labelPosition: { type: String },
        
    }
}
</script>