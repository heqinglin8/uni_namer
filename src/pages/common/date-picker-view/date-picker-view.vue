<template>
    <view class="content-warp">
        <view class="uni-padding-wrap top-wrap">
            <text class="left-rignt-btn" @click="onLeft" >取消</text>
            <view class="uni-title">
				時間：{{year}}年{{month}}月{{day}}日{{hour}}時{{minute}}分
			</view>
            <text class="left-rignt-btn uni-right" @click="onRight">确定</text>
		</view>
        <picker-view v-if="visible" :indicator-style="indicatorStyle" :mask-style="maskStyle" :value="value" @change="bindChange">
            <picker-view-column>
                <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
            </picker-view-column>
            <picker-view-column>
                <view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
            </picker-view-column>
            <picker-view-column>
                <view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
            </picker-view-column>
            <picker-view-column>
                <view class="item" v-for="(item,index) in hours" :key="index">{{item}}时</view>
            </picker-view-column>
            <picker-view-column>
                <view class="item" v-for="(item,index) in minutes" :key="index">{{item}}分</view>
            </picker-view-column>
        </picker-view>
    </view>
</template>

<script>
    export default {
        emits: ['onCancel', 'onOk'],
        data () {
            const date = new Date()
            const years = []
            const year = date.getFullYear()
            const months = []
            const month = date.getMonth() + 1
            const days = []
            const day = date.getDate()
            const hours = []
            const hour = date.getHours()
            const minutes = []
            const minute = date.getMinutes()
            console.log('hql data hour = '+ hour + '，minute = ' + minute)

            for (let i = 1990; i <= date.getFullYear(); i++) {
                years.push(i)
            }

            for (let i = 1; i <= 12; i++) {
                months.push(i)
            }

            for (let i = 1; i <= 31; i++) {
                days.push(i)
            }

            for (let i = 1; i <= 24; i++) {
                hours.push(i)
            }
            
            for (let i = 1; i <= 60; i++) {
                minutes.push(i)
            }
            
            return {
                title: 'picker-view',
                years,
                year,
                months,
                month,
                days,
                day,
                hours,
                hour,
                minutes,
                minute,
                value: [9999, month - 1, day - 1, hour - 1, minute - 1],
				/**
				 * 解决动态设置indicator-style不生效的问题
				 */
                visible: true,
                // indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
                indicatorStyle: `height: 42px;border-top: 2rpx solid deepskyblue;border-bottom: 2rpx solid deepskyblue;`,
				// #ifdef MP-KUAISHOU
				maskStyle: "padding:10px 0;"
				// #endif
				// #ifndef MP-KUAISHOU
				maskStyle: ""
				// #endif
            }
        },
        methods: {
            bindChange (e) {
                const val = e.detail.value
                console.log("bindChange val = "+val)
                this.year = this.years[val[0]]
                this.month = this.months[val[1]]
                this.day = this.days[val[2]]
                this.hour = this.hours[val[3]]
                this.minute = this.minutes[val[4]]
            }
            ,
            onLeft(){
                console.log('hql onLeft')
                this.$emit('onCancel');
            }
            ,
            onRight(){
                console.log('hql onRight')
                this.$emit('onResult', [
                    this.year,
                    this.month,
                    this.day,
                    this.hour,
                    this.minute,
            ]);
            this.$emit('onCancel');
           }
        }
    }
</script>

<style>
@import '../../../common/uni.css';
    picker-view {
        width: 100%;
        height: 300rpx;
        margin-top: 16rpx;
    }

    .item {
        line-height: 42rpx;
        text-align: center;
        justify-content: center;
    }
    .top-wrap{
        /* width: 100%; */
        display: flex;
	    flex-direction: row;
        align-items: center;
    }
    .uni-title{
        width: 68%;
        text-align: center;
        font-size:28rpx;
    }
    .left-rignt-btn{
        width: 16%;
        color: deepskyblue;
    }
    .content-warp{
        width: 100%;
    }
</style>
