<template>
	<view class="uni-list-wrap">
		<!-- <view class="banner" @click="goDetail(banner)">
			<image class="banner-img" :src="banner.cover"></image>
			<view class="banner-title">{{ banner.title }}</view>
		</view> -->
		<view class="uni-list">
			<block v-for="(value, index) in listData" :key="index">
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
								<sentence-html :htmlNodes = "value.sentenceNodes"/>
							</view>
							<view class="uni-media-list-text-bottom">
								<text>{{value.book}}•{{value.title}}</text>
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
    import sentenceHtml from './sentence-html.vue'
	import htmlParser from '@/common/html-parser.js'
	import {  
        mapState,  
        mapMutations  
    } from 'vuex'; 

	export default {
		computed: {  
            ...mapState(['namer'])  
        },  
        methods: {  
            ...mapMutations(['loadBook'])  
        },

		components: {
			sentenceHtml
		},
		data() {
			return {
				banner: {},
				listData: [],
				last_id: '',
				reload: false,
				status: 'more',
				adpid: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				surname:'',
				tab:{}
			};
		},
		onLoad(event) {
			const payload = event.payload;
			// 目前在某些平台参数会被主动 decode，暂时这样处理。
		    var formData = {}
			console.log('onLoad payload = '+payload)
			try {
				formData = JSON.parse(decodeURIComponent(payload));
			} catch (error) {
				formData = JSON.parse(payload);
			}
			const {tab, surname} = formData
			this.tab = tab
			this.surname = surname
			this.getList()
			// const names = this.namer.getNames(tab.id, 10);
			// this.listData = names.map(function(element){
			// 	const sentence = element.sentence;
			// 	const nameGrop = element.nameGrop;
			// 	var sentenceH5 = sentence.replace(nameGrop[0],"<i>"+nameGrop[0]+"</i>");
			// 	if(nameGrop.length > 1){
			// 		sentenceH5 = sentenceH5.replace(nameGrop[1],"<i>"+nameGrop[1]+"</i>");
			// 	}
			// 	const sentenceNodes = htmlParser(sentenceH5)
			// 	console.log('onLoad sentenceNodes='+JSON.stringify(sentenceNodes))
			// 		return {
			// 			...element,
			// 			sentenceNodes
			// 		};
			// })
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
				const names = this.namer.getNames(this.tab.id, 10);
				const listData = names.map(function(element){
					const sentence = element.sentence;
					const nameGrop = element.nameGrop;
					var sentenceH5 = sentence.replace(nameGrop[0],"<i>"+nameGrop[0]+"</i>");
					if(nameGrop.length > 1){
						sentenceH5 = sentenceH5.replace(nameGrop[1],"<i>"+nameGrop[1]+"</i>");
					}
					const sentenceNodes = htmlParser(sentenceH5)
					console.log('onLoad sentenceNodes='+JSON.stringify(sentenceNodes))
						return {
							...element,
							sentenceNodes
						};
				})
				if(this.listData){
						//说明已有数据，目前处于上拉加载
					this.status = 'loading';
					this.listData = this.listData.concat(listData)
				}else{
					this.listData = listData
				}
				
				this.reload = true;
				console.log('getList listData = '+ JSON.stringify(this.listData))
			},
			goDetail: function(e) {
				// 				if (!/前|刚刚/.test(e.published_at)) {
				// 					e.published_at = dateUtils.format(e.published_at);
				// 				}
				const surname = this.surname;
				let detail = {
					author_name: e.author,
					id: e.id,
					post_id: e.post_id,
					published_at: e.book+'•'+e.title,
					title: e.title,
					content: e.content,
					surname,
					name: e.name,
					nameGrop: e.nameGrop
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
			},

			getTextHtml(text){
                  return <i>{{text}}</i>
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
		width: 60rpx;
		height: 60rpx;
		background-image: url(@/static/img/tiange.png);
		background-size: cover;
		justify-content: center;
		align-items: center;
		display: flex;

		color: #262626;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
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
		font-size: 22rpx;
		color: #8f8f94;
	}

	.uni-list-wrap{
		width: 100%;
	}

</style>
