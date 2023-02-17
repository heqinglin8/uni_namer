import Request from '@/common/request/requset.js'
let request = new Request().http

//全局定义请求头 
export default {
	// 请求样式
	 async zhDictionary (data) {
		return request({
			url: "/convert/dictionary", //请求头
			method: "GET", //请求方式
			data:  {
				...data,
				app_id:'mzikrjgxzsgmqnoo',
				app_secret:'czV4MHV0Ym54RGFMWTRLQ2Z0YWc5Zz09'
			}, //请求数据
		})
	}
}
/*
请求样式：
	自定义名字: function(data) {
		return request({
			url: "/banner", //请求头
			method: "GET", //请求方式
			data: data,	//请求数据
			token: token, // 可传 
			hideLoading: false, //加载样式
		})
	},
页面请求方法样式 1 在请求页面中调用
	1.先导入本页面
		import api from '@/common/api.js'
		
	2.在methods 中 调用：
		api.classifyLeft().then((res) => {
			console.log(res);
		})
页面请求方法样式 2 全局调用
	1. 在main.js 中引入api.js
		import api from '@/common/api.js'
		
		Vue.prototype.$api = api
		
	2. 在页面中调用
	//不传参数
		this.$api.classifyLeft().then((res) => {
			console.log(res);
		})
	//传参
		this.$api.classifyLeft({参数}).then((res) => {
			console.log(res);
		})
*/
