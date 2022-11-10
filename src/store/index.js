import Vue from 'vue'
import Vuex from 'vuex'
import Namer from '../namer/namer.js';

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		userName: "",
		univerifyErrorMsg: "",
		hideUniverify: true,
		namer:new Namer()
	},
	mutations: {
		login(state, userName) {
			state.userName = userName || '新用户';
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		setUniverifyErrorMsg(state, payload = '') {
			state.univerifyErrorMsg = payload
		},
		setHideUniverify(state, payload = false) {
			state.hideUniverify = payload
		},
		loadBook(state, id){
			state.namer.loadBook(id,(data)=>{
				// console.log('loadBook SUCCESS data = '+JSON.stringify(data))
			});
		}
	}
})

export default store
