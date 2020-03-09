<template>
	<!-- 为了支持早先打印的商品详情二维码而保留的跳转页 -->
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
				url: '/pages/shopping/detailShop/detailShop?id=' + obj.id,
			});
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
