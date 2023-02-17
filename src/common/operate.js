/* 
 用来放置一些全局方法的
在main 中全局调用
	import operate from "common/operate.js" 
	Vue.prototype.$operate = operate
*/

export default {
	//接口
	api: function() {
		// #ifdef MP-WEIXIN 
		let version = wx.getAccountInfoSync().miniProgram.envVersion;
		switch (version) {
			case "develop": //开发预览版
				return "https://www.mxnzp.com/api"
				break;
			case 'trial': //体验版
				return "https://www.mxnzp.com/api"
				break;
				// break;
			case 'release': //正式版
				return "https://www.mxnzp.com/api"
				break;
			default: //未知,默认调用正式版
				return "https://www.mxnzp.com/api"
				break;
		}
		// #endif
		// #ifdef H5
		if (process.env.NODE_ENV === 'development') {
			console.log('开发环境')
			return 'https://www.mxnzp.com/api'
		} else {
			console.log('生产环境')
			return 'https://www.mxnzp.com/api'
		}
		// #endif
		// #ifdef APP-PLUS
		return "https://www.mxnzp.com/api"
		// #endif
	},

	//吐司
	toast: function(options) {
		let {
			title,
			duration,
			icon,
			mask
		} = options;
		uni.showToast({
			title: title,
			duration: 2000,
			icon: icon || "none",
			mask: mask || false
		});
	},

	// 绘制图片  获取图片信息
	getImageInfo: async (imgSrc) => {
		return new Promise((resolve, errs) => {
			uni.getImageInfo({
				src: imgSrc,
				success: function(image) {
					resolve(image);
				},
				fail(err) {
					errs(err);
				}
			});
		});
	},
}
