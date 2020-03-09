<template>
	<!-- 选择城市页面 -->
	<view>
		<top-placeholder />
		<search-bar :isFull="true"></search-bar>
		<!-- <view class="choose-locat">
			<span>定位：</span>
			<span class="color-hdsh">{{area}}</span>
		</view> -->

		<view class="choose-comm">
			<p>地区选择</p>
			<ul>
				<li v-for="(x,index) in town" :key="index" @click="toIndex(2,x)">
					{{x.name}}
				</li>
			</ul>
		</view>
		<locat @success="locatSucc" @error="locatErr"></locat>
	</view>
</template>

<script>
	import topPlaceholder from '@/components/top-placeholder.vue';
	export default {
		components: {
			topPlaceholder
		},
		data() {
			return {
				town: [
					{
						id: '460105',
						name: '五源河',
						shortname: '五源河',
					},
				],
				// sign: 'choose',
				// area: '定位中...',
			};
		},
		methods: {
			toIndex(index, x) {
				if (index == 2) {
					this.$areaMsg.id = x.id
					this.$areaMsg.name = x.name
					this.$areaMsg.shortname = x.shortname
					// console.log(this.$areaMsg)
				}
				// this.back();
				uni.reLaunch({
					url:'/pages/tabBar/index/index'
				})
			},
			back() {
				uni.reLaunch({
					url:'/pages/tabBar/index/index'
				})
			},
			locatSucc(msg){
				this.area = msg;
			},
			locatErr(msg){
				uni.showToast({
					title: msg,
					mask: false,
					duration: 1500
				});
			}
		},
		onLoad() {
			// console.log(this.$areaMsg)
		}
	}
</script>

<style>
.status-bar {
		height: var(--status-bar-height);
		width: 100%;
		background: #F7F7F7;
	}

	.top-wrap {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #F8F8F8;
		top: 0;
		z-index: 999;
	}
</style>
