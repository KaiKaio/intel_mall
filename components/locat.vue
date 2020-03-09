<template>
	<!-- 定位组件 -->
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude: '',
				longitude: '',
				city: ''
			};
		},
		created() {
			// #ifndef APP-PLUS
			uni.getLocation({
				type: "gcj02",
				success: (res) =>{
					// console.log(res);
					this.latitude = res.latitude;
					this.longitude = res.longitude;
// 					uni.openLocation({
// 						latitude: this.latitude,
// 						longitude: this.longitude,
// 						success: () =>{
// 							console.log(123)
// 						}
// 					})
				}
			})
			// #endif
			// #ifdef APP-PLUS
			plus.geolocation.getCurrentPosition((res) =>{
// 				var ss = JSON.stringify(res)
// 				console.log(ss)
				// this.city = ss.city
				this.$emit("success",res.address.city)
			}, (e) =>{
				this.$emit("error",e.message)
			},{provider:'amap'})
			// #endif
		}
	}
</script>

<style>

</style>
