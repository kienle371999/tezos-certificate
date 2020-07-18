import Vue from 'vue'
import Toasted from 'vue-toasted'
import axios from 'axios'

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

export const EventBus = new Vue
window.EventBus = EventBus
Vue.use(Toasted)

EventBus.$on('SUCCESS', (message) => {
  Vue.toasted.success(message, { position: 'top-right', duration: '2000' })
})

EventBus.$on('ERROR', (message) => {
  EventBus.$data.disable = true
  Vue.toasted.error(message, { 
    position: 'top-right', 
    duration: '2000', 
    onComplete: (() => {
      EventBus.$data.disable = false
    }) }) 
})


