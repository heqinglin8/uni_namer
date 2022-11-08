<template>
	<view class="uni-list-wrap">
		<!-- <view class="banner" @click="goDetail(banner)">
			<image class="banner-img" :src="banner.cover"></image>
			<view class="banner-title">{{ banner.title }}</view>
		</view> -->
		<view class="uni-list">
			<block v-for="(value, index) in nameListData" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="goDetail(value)">
					<view class="uni-media-list">
						<view class="uni-media-list-name">
							<view class="name-group uni-row">
								<text class="name">{{surname}}</text>
								<text class="name margin-left-10">{{value.nameGrop[0]}}</text>
								<text class="name margin-left-10" v-if="value.nameGrop.length>1">{{value.nameGrop[1]}}</text>
							</view>
                            <text class="name-desc">评分：89.9</text>
							<text class="name-desc">【五行相配】</text>
						</view>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">
								<text class="title">「{{ value.sentence }}」</text>
							</view>
							<view class="uni-media-list-text-bottom">
								<text>{{value.book}}诗经 • {{value.title}}</text>
								<text>[{{value.dynasty}}] {{value.author}}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="ad-view" v-if="(index > 0 && (index+1) % 10 == 0)">
					<ad :adpid="adpid" @error="aderror"></ad>
				</view>
				<!-- #endif -->
			</block>
		</view>
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>
	import { dateUtils } from  '../../common/util.js';
	import Namer from '../../common/namer/namer.js';

	export default {
		data() {
		const namer = new Namer();
			return {
				banner: {},
				listData: [],
				nameListData: [],
				last_id: '',
				reload: false,
				status: 'more',
				adpid: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				namer:  namer,
				surname:''
			};
		},
		onLoad(event) {
			const payload = event.payload;
			// 目前在某些平台参数会被主动 decode，暂时这样处理。
		    var formData = {}
			// console.log('onLoad payload = '+payload)
			try {
				formData = JSON.parse(decodeURIComponent(payload));
			} catch (error) {
				formData = JSON.parse(payload);
			}
			const {tab, surname} = formData
			this.surname = surname
			this.namer.loadBook(tab.id,(data)=>{
            // console.log('loadBook SUCCESS data = '+JSON.stringify(data))
				this.nameListData = this.namer.getNames(10)
            });

			// console.log('onLoad nameListData = '+ JSON.stringify(this.nameListData))
			// this.adpid = this.$adpid;
			// this.getBanner();
			// this.getList();
		},
		onPullDownRefresh() {
			this.reload = true;
			this.last_id = '';
			this.getBanner();
			this.getList();
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		methods: {
			getBanner() {
				let data = {
					column: 'id,post_id,title,author_name,cover,published_at' //需要的字段名
				};
				uni.request({
					url: 'https://unidemo.dcloud.net.cn/api/banner/36kr',
					data: data,
					success: data => {
						uni.stopPullDownRefresh();
						if (data.statusCode == 200) {
							this.banner = data.data;
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				});
			},
			getList() {
				// var data = {
				// 	column: 'id,post_id,title,author_name,cover,published_at' //需要的字段名
				// };
				// if (this.last_id) {
				// 	//说明已有数据，目前处于上拉加载
				// 	this.status = 'loading';
				// 	data.minId = this.last_id;
				// 	data.time = new Date().getTime() + '';
				// 	data.pageSize = 10;
				// }
				// uni.request({
				// 	url: 'https://unidemo.dcloud.net.cn/api/news',
				// 	data: data,
				// 	success: data => {
				// 		if (data.statusCode == 200) {
				// 			let list = this.setTime(data.data);
				// 			this.listData = this.reload ? list : this.listData.concat(list);
				// 			this.last_id = list[list.length - 1].id;
				// 			this.reload = false;
				// 		}
				// 	},
				// 	fail: (data, code) => {
				// 		console.log('fail' + JSON.stringify(data));
				// 	}
				// });

				this.nameListData = this.nameListData.concat(this.namer.getNames(10))
			},
			goDetail: function(e) {
				// 				if (!/前|刚刚/.test(e.published_at)) {
				// 					e.published_at = dateUtils.format(e.published_at);
				// 				}
				let detail = {
					author_name: e.author_name,
					cover: e.cover,
					id: e.id,
					post_id: e.post_id,
					published_at: e.published_at,
					title: e.title
				};
				uni.navigateTo({
					url: '../list2detail-detail/list2detail-detail?detailDate=' + encodeURIComponent(JSON.stringify(detail))
				});
			},
			setTime: function(items) {
				var newItems = [];
				items.forEach(e => {
					newItems.push({
						author_name: e.author_name,
						cover: e.cover,
						id: e.id,
						post_id: e.post_id,
						published_at: dateUtils.format(e.published_at),
						title: e.title
					});
				});
				return newItems;
			},
			aderror(e) {
				console.log("aderror: " + JSON.stringify(e.detail));
			}
		}
	};
</script>

<style>
	.banner {
		height: 360rpx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
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
		color: white;
		z-index: 11;
	}

	.uni-media-list-name {
		width: 280rpx;
		height: 140rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.uni-media-list-name .name-group{
		display: flex;
		flex-direction: row;
	}

	.uni-media-list-name .name-desc{
		color: #a43636;
		font-size: 14rpx;
		margin-top: 16rpx;
		font-weight: bold;
	}

	

	.name-group .name{
        background-color: #fff9f9;
		color: #262626;
		font-size: 36rpx;
		font-weight: bold;
		width: 60rpx;
		height: 56rpx;
		text-align: center;
		padding-top: 3rpx;
		border-width: 0.1rpx;
		border-style: solid;
		border-color:  #a43636;
	}

	

	.margin-left-10{
		margin-left: 10rpx;
	}

	.uni-media-list-logo {
		width: 180rpx;
		height: 140rpx;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}

	.uni-media-list-text-top {
		height: 74rpx;
		overflow: hidden;
	}

	.uni-media-list-text-top .title {
		font-size: 22rpx;
		color: #313131;
	}

	.uni-media-list-text-top .title i{
		font-weight: bold;
		font-size: 28rpx;
		color: #F30C0C;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.uni-list-wrap{
		width: 100%;
	}

</style>
