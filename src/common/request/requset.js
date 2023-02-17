//请求头 放置地址
import operate from '@/common/operate.js'

/*
	协作者： 萨楚荣贵
	修改请求方式
*/
export default class Request {
	http(param) {
		var url = param.url,
			method = param.method,
			header = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'*', 'Access-Control-Max-Age':86400},
			data = param.data || {},
			token = param.token || "",
			hideLoading = param.hideLoading || false;
		//拼接完整请求地址
		var requestUrl = operate.api() + url;
		//请求方式
		if (!method) {
			method = "GET"
		} else {
			method = method.toUpperCase();
			if (method == "POST" || method == "PUT") {
				header = {
					'content-type': "application/x-www-form-urlencoded"
				};
			} else {
				header = {
					'content-type': "application/json"
				};
			}
		}
		//配置 登录token
		if (token) {
			header = {
				'Authorization': "Bearer " + token
			};
		}
		//加载圈
		if (!hideLoading) {
			uni.showLoading({
				title: '加载中...'
			});
		}
		//开始请求
		return new Promise((resolve, reject) => {
			uni.request({
				url: requestUrl,
				data: data,
				method: method,
				header: header,
				success: (res) => {
					// 判断 请求api 格式是否正确
					if (res.statusCode && res.statusCode != 200) {
						uni.showToast({
							title: "api错误" + res.errMsg,
							icon: 'none'
						});
						return;
					}
					// 将结果抛出
					resolve(res.data)
				},
				//请求失败
				fail: (e) => {
					uni.showToast({
						title: "" + e.data.msg,
						icon: 'none'
					});
					resolve(e.data);
				},
				complete() {
					// 隐藏加载
					if (!hideLoading) {
						uni.hideLoading();
					}
					return;
				}
			})
		})
	}
}
