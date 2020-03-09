<template>
	<!-- 提现绑定微信OPENID用 -->
	<view class="wrap">
		<button type="primary" @click="verify">绑定微信</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openid: '',
				userid: ''
			}
		},
		onLoad(obj) {
			this.openid = uni.getStorageSync("wxOpenid")
			this.userid = obj.id
			// alert(this.openid)
		},
		methods: {
			verify(userid) {
				if (this.$userMsg.userid == null || this.userid != this.$userMsg.phone) {
					this.$store.commit('set_page_data', {
						page: '/pages/component/getWxUserId/getWxUserId',
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=' + this.userid,
						success: res => {
							uni.showToast({
								title: '请先登录后再绑定！',
								mask: false,
								icon: 'none',
								duration: 1500
							})
						},
						fail: () => {},
						complete: () => {}
					});
				} else {
					this.$base.szblPut('/api/user/my?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this.$base
						.getState(), {
							"id": this.$userMsg.userid,
							"kw10": this.openid
						}).then(res => {
						uni.showModal({
							content: '微信绑定成功，请关闭本页面后再次点击电脑页面上的“提现”按钮',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {

								}
							}
						});
					}).catch(msg => {
						uni.showModal({
							content: '微信绑定失败，请扫码重试',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {

								}
							}
						});
					})
				}
			}
		}
	}
</script>

<style>
	.wrap {
		display: flex;
	}

	.wrap button {
		margin-top: 50%;
	}
</style>
