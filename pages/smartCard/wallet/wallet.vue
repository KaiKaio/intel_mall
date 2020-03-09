<template>
	<!-- 卡包 -->
	<view>
		<view class="page-wrap-binding" v-if="user.kw10">
			<view class="wallet-list" @click="toCardInfo">
				卡片信息
				<text class="font-icon">&#xe79a;</text>
			</view>
			<view class="wallet-list" @click="toRecharge">
				充值
				<text class="font-icon">&#xe79a;</text>
			</view>
			<view class="wallet-list" @click="toChange">
				修改密码
				<text class="font-icon">&#xe79a;</text>
			</view>
		</view>
		<view class="page-wrap-unbinding" v-else="" @click="toBinding">
			点击绑定智慧卡
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '' //用户信息
			}
		},
		onLoad() {
			
		},
		onShow() {
			// console.log(global.$userDetail)
			this.user = global.$userDetail
		},
		methods: {
			toBinding(){
				uni.navigateTo({
					url: '/pages/smartCard/binding/binding?m=s',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			toRecharge(){
				uni.navigateTo({
					url: '/pages/smartCard/recharge/recharge',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			toCardInfo(){
				uni.navigateTo({
					url: '/pages/smartCard/cardInfo/cardInfo',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			toChange(){
				uni.navigateTo({
					url: '/pages/smartCard/changePwd/changePwd',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
		}
	}
</script>

<style>
	.page-wrap-binding {
		background: #FFFFFF;
	}
	
	.page-wrap-unbinding{
		width: 750upx;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40upx;
		color: #737373;
	}
	
	.wallet-list{
		height: 80upx;
		position: relative;
		line-height: 80upx;
		padding: 0 20upx;
	}
	
	.wallet-list text{
		float: right;
	}
</style>
