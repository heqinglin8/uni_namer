<template>

<scroll-view enableBackToTop="true" scroll-y>
        <view class="uni-padding-wrap uni-common-mt">
                <form @submit="formSubmit" @reset="formReset">
                    <view class="uni-form-item uni-flex">
                        <view class="title">姓名&nbsp;&nbsp;</view>
                        <input class="uni-input" name="nickname" placeholder="请输入姓名" />
                    </view>
                    <view class="uni-form-item uni-flex">
                        <view class="title">性别&nbsp;&nbsp;&nbsp;&nbsp;</view>
                        <radio-group name="gender" class="uni-flex">
                            <label>
                                <radio value="男" checked="true"/><text>男</text>
                            </label>
                            <label>
                                <radio value="女" /><text>女</text>
                            </label>
                        </radio-group>
                    </view>
                    <view class="uni-form-item uni-flex">
                        <view class="title">单双名</view>
                        <radio-group name="gender" class="uni-flex">
                            <label>
                                <radio value="0" checked="true"/><text>双</text>
                            </label>
                            <label>
                                <radio value="1" /><text>单</text>
                            </label>
                        </radio-group>
                    </view>
                    <view class="uni-form-item uni-flex">
                        <view class="title">出生时间</view>
                        <text class="title uni-flex-item" @click="toggle('bottom')">2022-10-22 22:20</text>
                    </view>
                    <view class="uni-btn-v">
                        <button type="primary" form-type="submit">开始起名</button>
                    </view>
                </form>
                <view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" :type="type" background-color="#fff" @change="change">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
                    <date-picker-view />
                </view>
			</uni-popup>
		</view>
        </view>		
    </scroll-view>

</template>

<script>
 import DatePickerView from "../../common/date-picker-view/date-picker-view.vue"
 
export default {
    components: {
			DatePickerView
    },
    data() {
			return {
				type: 'center'
			}
		},
    methods: {
			change(e) {
				console.log('当前模式：' + e.type + ',状态：' + e.show);
			},
			toggle(type) {
                console.log('toggle type = ' + type);
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			}
  }
}
  
</script>

<style lang="scss">
@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

@mixin height {
    /* #ifndef APP-NVUE */
    height: 100%;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex: 1;
    /* #endif */
}
@import '../../../common/uni.css';
    .uni-form-item .title {
		padding: 20rpx 0 15;
	}

    .popup-content {
		@include flex;
		align-items: center;
		justify-content: center;
		// padding: 15px;
		height: 260px;
		background-color: #fff;
	}

    .popup-height {
		@include height;
		width: 200px;
	}

	.text {
		font-size: 12px;
		color: #333;
	}
</style>
