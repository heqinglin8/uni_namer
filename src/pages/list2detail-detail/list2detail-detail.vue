<template>
	<view class="detail-wrap">
		<view class="banner">
			<image class="banner-img" src="@/static/img/bg.png"></image>
			<view class="banner-front">
				<view class="name-group uni-row">
					<text class="name">{{detailData.surname}}</text>
					<text class="name margin-left-10">{{detailData.nameGrop[0]}}</text>
					<text class="name margin-left-10" v-if="detailData.nameGrop.length>1">{{detailData.nameGrop[1]}}</text>
				</view>
				<text class="name-desc">当前名字得分：89.9(最高120)</text>
				<text class="name-desc">【五行相配】</text>
			</view>
			<view class="banner-title">{{detailData.surname}}{{detailData.name}}</view>
		</view>
		<view class="article-meta">
			<text class="article-author">{{detailData.author_name}}</text>
			<text class="article-text">发表于</text>
			<text class="article-time">{{detailData.published_at}}</text>
		</view>
		<view class="article-content">
			<rich-text :nodes="htmlNodes"></rich-text>
		</view>
		<!-- #ifdef MP-WEIXIN || MP-QQ -->
		<ad v-if="htmlNodes.length > 0" unit-id="adunit-01b7a010bf53d74e"></ad>
		<!-- #endif -->
	</view>
</template>

<script>
	const DETAIL_PAGE_PATH = '/pages/template/list2detail-detail/list2detail-detail';

	import htmlParser from '@/common/html-parser.js'

	function _handleShareChannels(provider) {
		let channels = [];
		for (let i = 0, len = provider.length; i < len; i++) {
			switch (provider[i]) {
				case 'weixin':
					channels.push({
						text: '分享到微信好友',
						id: 'weixin',
						sort: 0
					});
					channels.push({
						text: '分享到微信朋友圈',
						id: 'weixin',
						sort: 1
					});
					break;
				default:
					break;
			}
		}
		channels.sort(function(x, y) {
			return x.sort - y.sort;
		});
		return channels;
	}

	export default {
		data() {
			return {
				title: '',
				nameDictionary:{},
				detailData: {},
				htmlNodes: []
			}
		},
		onLoad(event) {
			// TODO 后面把参数名替换成 payload
			const payload = event.detailDate || event.payload;
			// 目前在某些平台参数会被主动 decode，暂时这样处理。
			try {
				this.detailData = JSON.parse(decodeURIComponent(payload));
			} catch (error) {
				this.detailData = JSON.parse(payload);
			}
			uni.setNavigationBarTitle({
				title: this.detailData.title
			});
			this.htmlNodes =  this.detailData.content
			this.getDetail();
		},
		onShareAppMessage() {
			return {
				title: this.detailData.title,
				path: DETAIL_PAGE_PATH + '?detailDate=' + JSON.stringify(this.detailData)
			}
		},
		onNavigationBarButtonTap(event) {
			const buttonIndex = event.index;
			if (buttonIndex === 0) {
				// 分享 H5 的页面
				const shareProviders = [];
				uni.getProvider({
					service: 'share',
					success: (result) => {
						// 目前仅考虑分享到微信
						if (result.provider && result.provider.length && ~result.provider.indexOf('weixin')) {
							const channels = _handleShareChannels(result.provider);
							uni.showActionSheet({
								itemList: channels.map(channel => {
									return channel.text;
								}),
								success: (result) => {
									const tapIndex = result.tapIndex;
									uni.share({
										provider: 'weixin',
										type: 0,
										title: this.detailData.title,
										scene: tapIndex === 0 ? 'WXSceneSession' : 'WXSceneTimeline',
										href: 'https://uniapp.dcloud.io/h5' + DETAIL_PAGE_PATH + '?detailDate=' + JSON.stringify(this.detailData),
										imageUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b6304f00-5168-11eb-bd01-97bc1429a9ff.png'
									});
								}
							});
						} else {
							uni.showToast({
								title: '未检测到可用的微信分享服务'
							});
						}
					},
					fail: (error) => {
						uni.showToast({
							title: '获取分享服务失败'
						});
					}
				});
			}
		},
		methods: {
			getDetail() {
				// uni.request({
				// 	url: 'https://unidemo.dcloud.net.cn/api/news/36kr/' + this.detailData.post_id,
				// 	success: (data) => {
				// 		if (data.statusCode == 200) {
				// 			var htmlString = data.data.content.replace(/\\/g, "").replace(/<img/g, "<img style=\"display:none;\"");
				// 			this.htmlNodes = htmlParser(htmlString);
				// 		}
				// 	},
				// 	fail: () => {
				// 		console.log('fail');
				// 	}
				// });
				const key1 = this.detailData.surname
				this.nameDictionary[key1] = this.zhDictionary(key1);
				const key2 = this.detailData.nameGrop[0]
				this.nameDictionary[key2] = this.zhDictionary(key2);

				const key3 = this.detailData.nameGrop[1]
				this.nameDictionary[key3] = this.zhDictionary(key3);
				// console.log('getDetail ,nameDictionary='+JSON.stringify(this.nameDictionary));
			},

			async zhDictionary(ch){
				const result = await this.$api.zhDictionary({content:ch})
					console.log('zhDictionary success  ch=' + ch + ', result = '+JSON.stringify(result));
				return result
			}
		}
	}
</script>

<style>
    .detail-wrap{
		width: 100%;
	}
	.banner {
		margin-top: 25rpx;
		height: 480rpx;
		overflow: hidden;
		position: relative;
	}

	.banner-img {
		width: 100%;
	}

	.banner-front {
		height: 480rpx;
		width: 100%;
		overflow: hidden;
		position: absolute;
		left: 0rpx;
		top: 0rpx;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.banner-front .name-group{
		display: flex;
		flex-direction: row;
		padding-bottom: 20rpx;
	}

	.banner-front .name-desc{
		color: #a43636;
		font-size: 34rpx;
		margin-top: 16rpx;
		font-weight: bold;
	}

	.name-group .name{
		width: 120rpx;
		height: 120rpx;
		background-image: url(@/static/img/tiange.png);
		background-size: cover;
		justify-content: center;
		align-items: center;
		display: flex;

		color: #262626;
		font-size: 80rpx;
		font-weight: bold;
		text-align: center;
	}

	.margin-left-10{
		margin-left: 50rpx;
	}

	.banner-title {
		max-height: 84rpx;
		overflow: hidden;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		width: 90%;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 42rpx;
		color: black;
		z-index: 11;
		font-weight: bold;
	}

	.article-meta {
		padding: 20rpx 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-text {
		font-size: 26rpx;
		line-height: 50rpx;
		margin: 0 20rpx;
	}

	.article-author,
	.article-time {
		font-size: 30rpx;
	}

	.article-content {
		padding: 0 30rpx;
		overflow: hidden;
		font-size: 30rpx;
		margin-bottom: 30rpx;
	}
</style>
