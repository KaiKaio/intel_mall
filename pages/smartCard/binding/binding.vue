<template>
	<!-- 智慧卡绑定充值的银行卡 -->
	<view class="binding">
		<view class="outer-wrap" v-if="mark == 's'">
			<view class="input-wrap">
				<text>姓名</text>
				<input type="text" placeholder="请输入持卡人姓名" placeholder-style="color:#777777" value="" v-model="uName" />
			</view>
			<view class="input-wrap">
				<text>手机号</text>
				<input type="number" placeholder="请输入手机号" placeholder-style="color:#777777" maxlength="11" value="" v-model="uPhone" />
			</view>
			<view class="input-wrap">
				<text>身份证</text>
				<input type="idcard" placeholder="请输入身份证" placeholder-style="color:#777777" maxlength="18" value="" v-model="uId" />
			</view>
			<view class="input-wrap">
				<text>智慧卡卡号</text>
				<input type="number" placeholder="请输入智慧卡卡号" placeholder-style="color:#777777" value="" v-model="acc" />
			</view>
			<!-- <view class="input-wrap">
				<text>交易</text>
				<input type="text" password="true" placeholder="请输入查询密码" placeholder-style="color:#777777" value="" v-model="pwd" />
			</view> -->
		</view>
		<view class="outer-wrap" v-else-if="mark == 'b'">
			<view class="input-wrap">
				<text>银行卡卡号</text>
				<input type="number" placeholder="请输入银行卡卡号" placeholder-style="color:#777777" value="" v-model="acc" />
			</view>
			<view class="input-wrap">
				<text>姓名</text>
				<input type="text" placeholder="请输入持卡人姓名" placeholder-style="color:#777777" value="" v-model="uName" />
			</view>
			<view class="input-wrap">
				<text>手机号</text>
				<input type="number" placeholder="请输入持卡人手机号" placeholder-style="color:#777777" maxlength="11" value="" v-model="uPhone" />
			</view>
			<view class="input-wrap">
				<text>身份证</text>
				<input type="idcard" placeholder="请输入持卡人身份证" placeholder-style="color:#777777" maxlength="18" value="" v-model="uId" />
			</view>
			<view class="input-wrap">
				<text>智慧卡交易密码</text>
				<input type="text" password="true" placeholder="请输入智慧卡交易密码" placeholder-style="color:#777777" value="" v-model="pwd" />
			</view>
		</view>
		<view @click="bindingS" class="binding-btn-wrap" v-if="mark == 's'">
			<view class="binding-btn">
				绑定智慧卡
			</view>
		</view>
		<view @click="bindingB" class="binding-btn-wrap" v-else-if="mark == 'b'">
			<view class="binding-btn">
				绑定银行卡
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mark: '', //绑定标识，b-绑定银行卡，s-绑定智慧卡
				uName: '', //持卡人姓名（通用）
				uPhone: '', //持卡人手机号（通用）
				uId: '', //持卡人身份证号（通用）
				acc: '', //卡号（通用）
				pwd: '', //智慧卡交易密码（银行卡绑定时用）
			}
		},
		onLoad(obj){
			this.mark = obj.m
		},
		methods: {
			// 绑定智慧卡
			bindingS() {
				if (this.uName == '') {
					uni.showToast({
						title: '请输入持卡人姓名',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.uPhone == '') {
					uni.showToast({
						title: '请输入持卡人手机号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.uId == '') {
					uni.showToast({
						title: '请输入持卡人身份证号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.acc == '') {
					uni.showToast({
						title: '请输入智慧卡卡号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				// if (this.pwd == '') {
				// 	uni.showToast({
				// 		title: '请输入查询密码',
				// 		icon: 'none',
				// 		mask: false,
				// 		duration: 1500
				// 	});
				// }
				this.$base.szblPost('/api/iccard/2001?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&custname=' + this.uName + '&credType=01&credNo=' +
					this.uId + '&mobileNo=' + this.uPhone + '&cardId=' + this.acc).then((res) => {
						let resData = this.$base.strResToJson(res.data)
						// console.log(resData)
						// if (resData.postScript == '承兑或交易处理成功') {
						this.$base.szblPut('/api/user/my?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this.$base
							.getState(), {
								"id": this.$userMsg.userid,
								"kw10": this.acc
							}).then((res) => {
							uni.showToast({
								title: '绑定成功',
								icon: 'none',
								mask: false,
								duration: 1500
							});
							global.$userDetail.kw10 = this.acc;
							uni.navigateBack({
								delta: 1
							});
						}).catch((err) => {
							console.log(err)
						})
						// }

					}).catch((msg) => {
					uni.showToast({
						icon: "none",
						mask: false,
						title: "卡号或密码错误",
						duration: 1000
					})
					console.log(msg)
				})
			},
			// 绑定银行卡
			bindingB() {
				if (this.uName == '') {
					uni.showToast({
						title: '请输入持卡人姓名',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.uPhone == '') {
					uni.showToast({
						title: '请输入持卡人手机号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.uId == '') {
					uni.showToast({
						title: '请输入持卡人身份证号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.acc == '') {
					uni.showToast({
						title: '请输入银行卡卡号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.pwd == '') {
					uni.showToast({
						title: '请输入智慧卡交易密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
				}
				let pjson = {
					cardId: global.$userDetail.kw10, //智慧卡卡号
					pwd: this.pwd, //智慧卡支付密码
					setStyle: 2, //绑定的方式：0-解绑； 1-绑定； 2-设置默认并绑定； 3-设置默认； 4-重绑
					userName: this.uName, //用户姓名
					idCard: this.uId, //身份证
					phoneNum: this.uPhone, //手机号
					bankAcct: this.acc, //绑定的银行账户
					bankAcctType: 0, //银行账户类型（0：对私银行卡(默认) ， 1：对公银行账户）
					// credNo: '', //证件编号
					// credType: 01, //证件类型：01 –身份证(默认) 02 –护照 03 –驾驶证 04 –回乡证 05 –军官证 06-户口本 09 –其他
				}
				// 银行卡绑定/解绑/默认卡
				this.$base.szblPost('/api/iccard/9003?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid ,pjson).then((res) => {
						let resData = this.$base.strResToJson(res.data)
						// console.log(resData)
						// if (resData.postScript == '承兑或交易处理成功') {
						this.$base.szblPut('/api/user/my?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this.$base
							.getState(), {
								"id": this.$userMsg.userid,
								"kw5": this.acc
							}).then((res) => {
							uni.showToast({
								title: '绑定成功',
								icon: 'none',
								mask: false,
								duration: 1500
							});
							global.$userDetail.kw5 = this.acc;
							uni.navigateBack({
								delta: 1
							});
						}).catch((err) => {
							console.log(err)
						})
						// }
			
					}).catch((msg) => {
					uni.showToast({
						icon: "none",
						mask: false,
						title: "卡号或密码错误",
						duration: 1000
					})
					console.log(msg)
				})
			}
		}
	}
</script>

<style>
	.binding {}

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
		width: 66%;
		color: ;
	}

	.binding .input-wrap text {
		width: 34%;
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
