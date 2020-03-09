<template>
	<!-- 客服 todo-->
	<view>
		<web-view :src="userServiceURL" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userServiceURL: 'https://cschat-ccs.aliyun.com/index.htm?tntInstId=_1U1Klke&scene=SCE00005206#/',
				webviewStyles: {
					progress: {
						color: '#00a0ea'
					}
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
