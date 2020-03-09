<template>
	<!-- 智慧卡信息 -->
	<view>
		<view class="list-wrap">
			<text>卡号</text>
			<text>{{cardId}}</text>
		</view>
		<view class="list-wrap">
			<text>余额</text>
			<text>{{balance}}元</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardId: global.$userDetail.kw10, //智慧卡id
				balance: 0.00 //余额
			}
		},
		onShow() {
			this.getBalance()
		},
		methods: {
			// 获取余额
			getBalance(){
				this.$base.szblPost('/api/iccard/0003?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' + this.$base.getState() + '&cardId=' + this.cardId, {
					}).then((res) => {
						this.balance = res.data
				}).catch((msg) => {
					console.log(msg)
				})
			}
		}
	}
</script>

<style>
.list-wrap{
	height: 80upx;
	position: relative;
	line-height: 80upx;
	padding: 0 20upx;
	background: #FFFFFF;
}

.list-wrap text:nth-child(1){
	
}

.list-wrap text:nth-child(2){
	float: right;
}
</style>
