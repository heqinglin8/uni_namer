<template>
<text class="title">
    <block class="title" v-for="(item, index) in htmlNodes" :key="'node-'+index">
			<block :v-if="item.type='text'">{{ item.text }}</block>
			<block :v-else-if="item.name">
			
				<i v-for="(child, index) in item.children" >
					{{child.text}}
				</i>
				
			</block>
    </block>
</text>
</template>

<script>
	export default {
		props: {
			htmlNodes: {
				type: Array,
				default () {
					return []
				}
			},
		},

		onLoad(){
			console.log('htmlNodes = '+JSON.stringify(this.htmlNodes));
		}
		
	};
</script>

<style>

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

</style>
