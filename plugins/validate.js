import Vue from 'vue';
import {
    extend,
    ValidationProvider,
    ValidationObserver
} from 'vee-validate';
import { required, regex } from 'vee-validate/dist/rules';

extend('required', required);
extend('regex', regex);

Vue.component('validation-provider', ValidationProvider);
Vue.component('validation-observer', ValidationObserver);

