import Vue from 'vue'
import App from './App.vue'

// css 
import './stylesheets/all.css'
// require('./stylesheets/all.css');

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
