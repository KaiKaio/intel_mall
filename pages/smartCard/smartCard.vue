<template>
	<view class="page-wrap">
		<view class="" @click="bindCard()">
			绑定
		</view>
		<view class="">
			<view class="" @click="changePwd">
				改密码
			</view>
			<view class="">
				老密码：
				<input type="text" password="true" value="" v-model="oldPwd" />
			</view>
			<view class="">
				新密码：
				<input type="text" password="true" value="" v-model="newPwd" />
			</view>
		</view>

		<view class="" @click="queryDetails">
			查询明细
		</view>
		<view class="" @click="queryCardForSC">
			查询智慧卡绑定的银行卡
		</view>
		<view class="card-wrap">
			<image src="../../static/images/smartcard.png" mode="widthFix"></image>
		</view>
		<view class="balance">
			<text class="font-icon icon">&#xe607;</text>
			<text> 余额：{{balance}}元</text>
		</view>
		<view class="recharge-wrap">
			<view class="title">
				<text class="font-icon icon">&#xe63b;</text>
				<text> 充值金额</text>
			</view>
			<view class="recharge-choose-money">
				<view class="recharge-money-wrap">
					<view v-for="(x,index) in priceList" :key="index" :class="index == choosedIndex ? 'recharge-money-choosed' : 'recharge-money'"
					 @click="changePrice('d',x,index)">
						{{x.name}}
					</view>
				</view>
				<view class="recharge-input-money">
					<view class="recharge-input-wrap">
						<text>其他金额：</text>
						<input type="number" value="" v-model="customPrice" placeholder="请输入200以上的金额" @focus="changePrice('c')" @input="inputPrice"
						 maxlength="4" />
					</view>
				</view>
			</view>
			<view class="pay-choice-wrap">
				<view class="pay-choice-title">
					<text class="iconfont font-icon">&#xe64b;</text>
					<text>支付方式</text>
				</view>
				<view class="pay-choice" @click="changePay('BankCard')">
					<text class="iconfont font-icon">&#xe63b;</text>
					<text>银行卡支付</text>
					<text class="iconfont font-icon checked" v-if="payChoice == 'BankCard'">&#xe67e;</text>
				</view>
				<view class="pay-choice" @click="changePay('UnionPay')">
					<text class="iconfont font-icon">&#xe6a4;</text>
					<text>银联支付</text>
					<text class="iconfont font-icon checked" v-if="payChoice == 'UnionPay'">&#xe67e;</text>
				</view>

				<!-- <view class="pay-choice" v-for="(x,index) in payChoice" :key="index">
					<text class="iconfont font-icon">{{x.icon}}</text>
					<text>{{x.name}}</text>
					<text class="iconfont font-icon checked" v-if="x.isChecked">&#xe67e;</text>
				</view> -->
			</view>
		</view>

		<view class="bottom-wrap">
			<view class="bottom-left">
				合计：
				<text v-if="price != ''">￥{{price}}</text>
			</view>
			<view class="bottom-right" @click="recharge()">
				确认充值
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				priceList: [{
					name: '200元',
					price: 200,
				}, {
					name: '400元',
					price: 400,
				}, {
					name: '600元',
					price: 600,
				}, {
					name: '800元',
					price: 800,
				}, {
					name: '1000元',
					price: 1000,
				}, {
					name: '2000元',
					price: 2000,
				}],
				choosedIndex: -1,
				price: '',
				customPrice: '',
				balance: 0,
				// payChoice: [{
				// 	name: '银行卡支付',
				// 	icon: '\ue63b',
				// 	isChecked: true
				// },{
				// 	name: '银联支付',
				// 	icon: '\ue6a4',
				// 	isChecked: false
				// }],
				payChoice: 'BankCard',
				cardId: '2081110000100122824',
				pwd: '123456',
				oldPwd: '',
				newPwd: '',
				payPwd: '111111',
				bankAcct: '6217851700000901800',
			}
		},
		onShow() {
			this.getBalance()
		},
		methods: {
			/**
			 * @param {String} x 要改变的支付标识
			 * 改变支付方式
			 */
			changePay(x) {
				if (this.payChoice != x) {
					this.payChoice = x
				}
			},
			/**
			 * 绑卡
			 */
			bindCard() {
// 				this.$base.szblPost('/api/iccard/2001?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
// 					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&cardId=' + this.cardId + '&pwd=' + this.pwd).then(
// 					(res) => {
// 						let resData = this.$base.strResToJson(res.data)
// 						console.log(resData)
// 						if (resData.postScript == '承兑或交易处理成功') {
// 							this.$base.szblPut('/api/c2cu?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this.$base
// 								.getState(), {
// 									"id": this.$userMsg.userid,
// 									"kw10": this.cardId
// 								}).then((res) => {
// 								uni.showToast({
// 									title: '绑定成功',
// 									icon: 'none',
// 									mask: false,
// 									duration: 1500
// 								});
// 							}).catch((err) => {
// 								console.log(err)
// 							})
// 						}
// 
// 					}).catch((msg) => {
// 					uni.showToast({
// 						icon: "none",
// 						mask: false,
// 						title: "卡号或密码错误",
// 						duration: 1000
// 					})
// 					console.log(msg)
// 				})
				uni.navigateTo({
					url: 'wallet/wallet',
				});
			},
			/**
			 * 充值
			 */
			recharge() {
				if (this.price == '') {
					uni.showToast({
						title: '请选择要充值的金额',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.price < 200) {
					uni.showToast({
						title: '请输入200以上的金额',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				uni.showLoading({
					title: '',
					mask: true
				})
				this.$base.szblPost('/api/iccard/0002?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&cardId=' + this.cardId + '&bankAcct=' + this.bankAcct +
					'&pwd=111111' + '&amt=' + this.price).then((res) => {
					// console.log(this.$base.strResToJson(res.data))
					let retData = this.$base.strResToJson(res.data)
					uni.hideLoading()
					if (retData.postScript == "承兑或交易处理成功") {
						uni.showToast({
							title: '充值成功!',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						this.getBalance()
					}

					// console.log(res)
				}).catch((msg) => {
					uni.hideLoading()
					console.log(msg)
				})
			},
			/**
			 * 获取余额
			 */
			getBalance() {
				// console.log(this.$DEVELOPER)
				this.$base.szblPost('/api/iccard/0003?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&cardId=' + this.cardId, {
						// this.$base.szblPost('/api/iccard/0003', {
						// 	m: this.$DEVELOPER.szblid,
						// 	tk: this.$DEVELOPER.token,
						// 	state: this.$base.getState(),
						// 	cardId: '2081110000100122824'
						// }).then((res) =>{
					}).then((res) => {
					this.balance = res.data
				}).catch((msg) => {
					console.log(msg)
				})
			},
			/**
			 * @param {String} mark c-自定义金额 d-默认金额
			 * @param {Object,Number} x 数组的某一项
			 * @param {Number} index 数组下标
			 */
			changePrice(mark, x, index) {
				if (mark == 'c') {
					this.choosedIndex = -1
					// this.customPrice = 0
					this.price = this.customPrice
				} else if (mark == 'd') {
					// this.customPrice = '请输入200以上的金额'
					this.price = x.price
					this.choosedIndex = index
				}
			},
			inputPrice(event) {
				this.price = event.detail.value
			},
			/**
			 * 修改密码
			 */
			changePwd() {
				if (this.oldPwd == '') {
					uni.showToast({
						title: '请输入旧密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (this.newPwd == '') {
					uni.showToast({
						title: '请输入新密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return
				}
				uni.showLoading({
					title: '',
					mask: true
				})
				this.$base.szblPost('/api/iccard/2103?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&cardId=' + this.cardId + '&oldPwd=' + this.oldPwd +
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
			},
			/**
			 * 查询明细
			 */
			queryDetails(){
				this.$base.szblPost('/api/iccard/0004?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&cardId=' + this.cardId).then((res) => {
					let resData = this.$base.strResToJson(res.data)
					// console.log(resData)
					// uni.hideLoading()
					// if (resData.postScript == "WS修改密码成功") {
					// 	uni.showToast({
					// 		title: '密码修改成功!',
					// 		icon: 'none',
					// 		mask: false,
					// 		duration: 1500
					// 	});
					// }
				}).catch((msg) => {
					// uni.hideLoading()
					// uni.showToast({
					// 	title: '旧密码错误',
					// 	icon: 'none',
					// 	mask: false,
					// 	duration: 1500
					// });
					console.log(msg)
				})
			},
			queryCardForSC(){
				this.$base.szblPost('/api/iccard/9004?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&cardId=' + this.cardId).then((res) => {
					let resData = this.$base.strResToJson(res.data)
					// console.log(resData)
					// uni.hideLoading()
					// if (resData.postScript == "WS修改密码成功") {
					// 	uni.showToast({
					// 		title: '密码修改成功!',
					// 		icon: 'none',
					// 		mask: false,
					// 		duration: 1500
					// 	});
					// }
				}).catch((msg) => {
					// uni.hideLoading()
					// uni.showToast({
					// 	title: '旧密码错误',
					// 	icon: 'none',
					// 	mask: false,
					// 	duration: 1500
					// });
					console.log(msg)
				})
			}
		}
	}
</script>

<style>
	.page-wrap {
		background: #FFFFFF;
	}

	.card-wrap {
		width: 750upx;
		text-align: center;
		padding-top: 20upx;
	}

	.card-wrap image {
		width: 710upx;
	}

	.balance,
	.recharge-wrap .title,
	.pay-choice-title {
		margin: 0 20upx;
		font-size: 30upx;
		display: flex;
		align-items: center;
		height: 80upx;
		border-bottom: 2upx solid #F7F7F7;
	}

	.balance text:nth-child(2),
	.recharge-wrap .title text:nth-child(2),
	.pay-choice-title text:nth-child(2),
	.pay-choice text:nth-child(2) {
		margin: 0 20upx;
	}

	.recharge-choose-money {
		padding: 0 30upx;
	}

	.recharge-money-wrap {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.recharge-money,
	.recharge-money-choosed {
		height: 80upx;
		width: 200upx;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border-radius: 10upx;
		margin-top: 30upx;
	}

	.recharge-money {
		background: #f7f7f7;
	}

	.recharge-money-choosed {
		background: #00A0EA;
		color: #FFFFFF;
	}

	.recharge-input-money {
		display: flex;
		justify-content: center;
		padding-bottom: 25upx;
		align-items: center;
		border-bottom: 2upx solid #F7F7F7;
	}

	.recharge-input-wrap {
		width: 690upx;
		height: 80upx;
		background: #f7f7f7;
		margin-top: 30upx;
		padding: 25upx 50upx;
		display: flex;
		border-radius: 10upx;
		align-items: center;
	}

	.recharge-input-wrap text {}

	.recharge-input-wrap input {}

	.pay-choice-wrap {}

	.pay-choice-title,
	.pay-choice {
		margin: 0 20upx;
		height: 80upx;
	}

	.pay-choice {
		line-height: 80upx;
	}

	.pay-choice .checked {
		color: #00a0ea;
		float: right;
	}

	.bottom-wrap {
		position: fixed;
		bottom: 0;
		width: 750upx;
		display: flex;
		background: #fff;
		height: 98upx;
		z-index: 10;
	}

	.bottom-left,
	.bottom-right {
		width: 375upx;
		line-height: 98upx;
		text-align: center;
	}

	.bottom-left text {
		font-size: 36upx;
		color: #e60012;
	}

	.bottom-right {
		background: #00A0EA;
		color: #FFFFFF
	}
</style>
