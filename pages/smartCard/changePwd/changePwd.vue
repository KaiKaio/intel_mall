<template>
	<!-- 修改智慧卡密码 -->
	<view class="binding">
		<view class="outer-wrap">
			<view class="input-wrap">
				<text>旧密码</text>
				<input type="text" password="true" placeholder="请输入旧交易密码" placeholder-style="color:#777777" value="" v-model="oldPwd" maxlength="6" />
			</view>
			<view class="input-wrap">
				<text>新密码</text>
				<input type="text" password="true" placeholder="请输入新交易密码" placeholder-style="color:#777777" value="" v-model="newPwd" maxlength="6" />
			</view>
			<view class="input-wrap">
				<text>确认密码</text>
				<input type="text" password="true" placeholder="请确认新密码" placeholder-style="color:#777777" value="" v-model="verifyPwd" maxlength="6" />
			</view>
		</view>
		<view @click="change" class="binding-btn-wrap">
			<view class="binding-btn">
				修改密码
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPwd: '',
				newPwd: '',
				verifyPwd: '',
			}
		},
		methods: {
			change(){
				if(this.oldPwd == ''){
					uni.showToast({
						title: '请输入旧交易密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if(this.newPwd == ''){
					uni.showToast({
						title: '请输入新交易密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if(this.verifyPwd == '' || this.verifyPwd != this.newPwd){
					uni.showToast({
						title: '两次密码不同，请重新输入',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					this.verifyPwd = ''
					return
				}
				uni.showLoading({
					title: '',
					mask: true
				})
				this.$base.szblPost('/api/iccard/2103?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&cardId=' + global.$userDetail.kw10 + '&oldPwd=' + this.oldPwd +
					'&newPwd=' + this.newPwd).then((res) => {
					let resData = this.$base.strResToJson(res.data)
					// console.log(resData)
					uni.hideLoading()
					if (resData.postScript == "WS修改密码成功") {
						uni.showToast({
							title: '密码修改成功!',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						uni.navigateBack({
							delta: 1
						});
					}
				}).catch((msg) => {
					uni.hideLoading()
					uni.showToast({
						title: '旧密码错误',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					console.log(msg)
				})
			}
		}
	}
</script>

<style>
	.outer-wrap {
		background: #fff;
		position: relative;
		padding: 0 20upx;
	}

	.binding .input-wrap {
		height: 80upx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 2upx solid #f7f7f7;
		/* background: #FFFFFF; */
	}

	.binding .input-wrap input {
		width: 75%;
		color: ;
	}

	.binding .input-wrap text {
		width: 25%;
	}

	.binding-btn-wrap {
		display: flex;
		justify-content: center;
		margin-top: 20upx;
	}

	.binding-btn {
		background: #00AFEA;
		color: #fff;
		width: 90%;
		height: 56upx;
		border-radius: 12upx;
		text-align: center;
		line-height: 56upx;
	}
</style>
