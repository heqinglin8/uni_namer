import { loader } from '@dcloudio/uni-cli-shared/lib/url-loader'
import Vue from 'vue'
import App from './App'

import store from './store'
import api from '@/common/api.js'

Vue.config.productionTip = false

Vue.prototype.$store = store

console.log('main api='+JSON.stringify(api))
Vue.prototype.$api = api

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
