
module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: "",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "" },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:title', name: 'og:title', content: 'chemsc' },
      { hid: 'og:url', name: 'og:url', content:'https://chemsc.now.sh' },
      { hid: 'og:description', name: 'og:description', content:'Reagent Search & Chemical Information'},
      { name: "robots", content: "noindex,nofollow,noarchive"},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu:400,400i,700,700i&display=swap&subset=greek,greek-ext,latin-ext'},
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '@fortawesome/fontawesome-free',
    '@fortawesome/fontawesome-free/css/all.min.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/persist.js', mode: 'client' },
    { src: '~/plugins/vue-rx.js', mode: 'client' },
    { src: '~/plugins/validate.js' }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    /*'nuxt-helmet',*/
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'nuxt-buefy',
    '@nuxtjs/toast',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: ["vee-validate/dist/rules"],
    extend(config, ctx) {
    },
  },
  serverMiddleware: [ "~/server" ],
  toast: {
    position: 'top',
    duration: 2000,
  }
}
