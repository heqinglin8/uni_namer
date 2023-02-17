<template>

<view class="page-wrap">
    <scroll-view enableBackToTop="true" scroll-y>
        <view class="uni-padding-wrap uni-common-mt">
                <form @submit="formSubmit" @reset="formReset">
                    <view class="uni-form-item uni-flex">
                        <view class="title">姓氏</view>
                        <input class="uni-input uni-form-item-r uni-end" name="surname" placeholder="请输入姓名" />
                    </view>
                    <view class="uni-form-item uni-flex">
                        <view class="title">性别</view>
                        <radio-group name="gender" class="uni-flex uni-form-item-r uni-end">
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
                        <radio-group name="onetwo" class="uni-flex uni-form-item-r uni-end">
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
                        <text class="title uni-form-item-r uni-end" @click="toggle('bottom')">{{birthdate}}</text>
                    </view>
                    <view class="uni-btn-v">
                        <button type="primary" form-type="submit">开始起名</button>
                    </view>
                </form>
        </view>	
    </scroll-view>

       <!-- 普通弹窗 -->
			<uni-popup ref="popup" :type="type" background-color="#fff" @change="change">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
                    <date-picker-view @onResult="onResult" @onCancel="onCancel"/>
                </view>
			</uni-popup>

            <view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		    </view>
</view>


</template>

<script>
 import DatePickerView from "../../common/date-picker-view/date-picker-view.vue";
 import uniPopupMessage from "../../../components/uni-popup-message/uni-popup-message.vue"
export default {
    emits: ['onGenNames'],
    props: {
			tab: {
                id:String,
                name:String,
            }
		},
    components: {
			DatePickerView
    },
    data() {
        // console.log('tab = '+JSON.stringify(this.tab))
        const date = new Date();
			return {
				type: 'center',
                msgType: 'success',
                messageText:'成功！',
                birthdate:date.getFullYear()+'年'
                         +date.getMonth()+'月'
                         +date.getDate()+'日 '
                         +date.getHours()+'時'
                         +date.getMinutes()+'分'
			}
		},
    methods: {
			change(e) {
				console.log('当前模式：' + e.type + ',状态：' + e.show);
			},
            onCancel() {
				console.log('hql onCancel ');
                this.$refs.popup.close()
			},
            onResult(r) {
				console.log('hql onResult '+ r);
                this.birthdate = r['year']+'年'
                         +r['month']+'月'
                         +r['day']+'日 '
                         +r['hour']+'時'
                         +r['minute']+'分'
			},
			toggle(type) {
                console.log('toggle type = ' + type);
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},

            formSubmit: function (event) {
                const {
					errors,
					value
				} = event.detail
                const{
                    surname,
                    gender,
                    onetwo
                } = value
                console.log('formSubmit aaa tab = '+JSON.stringify(this.tab)+
                ',surname = '+surname+
                ',gender = '+gender+
                ",onetwo = "+onetwo+
                ',birthdate = '+this.birthdate
                );
                if(surname == '' || surname == undefined){
                this.messageToggle('error','请输入姓氏');
                   return
                }

                if(surname.length > 1){
                this.messageToggle('error','目前只支持单姓');
                   return
                }
                var birthdate = this.birthdate
                this.$emit('onGenNames',{
                    'tab':this.tab,
                    surname,
                    gender,
                    onetwo,
                    birthdate
                });
		},

        messageToggle(type, msg) {
				this.msgType = type
				this.messageText = msg
				this.$refs.message.open()
        },
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

    .page-wrap {
		width: 100%;
	}
    .uni-form-item-r{
        width: 100%;
    }
</style>
