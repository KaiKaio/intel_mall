<template>
	<!-- 为了支持早先生成的订单确认二维码而保留的跳转页 -->
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(obj) {
			uni.redirectTo({
				url: '/pages/order/orderCheck/orderCheck?id=' + obj.id,
			});
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
