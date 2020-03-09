<template>
	<!-- 智慧卡充值\修改密码 -->
	<view class="unbinding" v-if="bankAcct == ''" @click="toBinding">
		点击绑定银行卡
	</view>
	<view class="page-wrap" v-else>
		<neil-modal :show="show" @close="show = !show" title="请输入智慧卡密码" @confirm="recharge">
			<view class="input-wrap">
				<text>密码</text>
				<input type="text" password="true" focus='true' placeholder="请输入智慧卡交易密码" placeholder-style="color:#777777" v-model="pwd" maxlength="6"/>
			</view>
		</neil-modal>
		<!-- <view class="" @click="bindBankCard()">
			绑银行卡
		</view> -->
		<view class="card-wrap">
			<image src="/static/images/smartcard.png" mode="widthFix"></image>
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
				<!-- <view class="pay-choice" @click="changePay('UnionPay')">
					<text class="iconfont font-icon">&#xe6a4;</text>
					<text>银联支付</text>
					<text class="iconfont font-icon checked" v-if="payChoice == 'UnionPay'">&#xe67e;</text>
				</view> -->

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
			<!-- <view class="bottom-right" @click="recharge()"> -->
			<view class="bottom-right" @click="show = !show">
				确认充值
			</view>
		</view>
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: {
			neilModal
		},
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
				choosedIndex: -1, //选择充值金额的下标
				price: '', //充值金额
				customPrice: '', //自定义金额
				balance: 0, //智慧卡余额
				// payChoice: [{
				// 	name: '银行卡支付',
				// 	icon: '\ue63b',
				// 	isChecked: true
				// },{
				// 	name: '银联支付',
				// 	icon: '\ue6a4',
				// 	isChecked: false
				// }],
				payChoice: 'BankCard', //支付标识
				cardId: '', //智慧卡id
				pwd: '', //智慧卡交易密码
				oldPwd: '', //智慧卡旧密码
				newPwd: '', //智慧卡新密码
				payPwd: '111111', //智慧卡支付密码
				bankAcct: '', //银行账号
				show: false, //控制某个奇怪的东西的显示状态
			}
		},
		onShow() {
			this.bankAcct = global.$userDetail.kw5
			this.cardId = global.$userDetail.kw10
			this.getBalance()
		},
		methods: {
			toBinding() {
				uni.navigateTo({
					url: '/pages/smartCard/binding/binding?m=b',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
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
			 * 绑智慧卡
			 */
			bindCard() {
				// 持卡人登录认证
				this.$base.szblPost('/api/iccard/2001?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&cardId=' + this.cardId + '&pwd=' + this.pwd).then((res) => {
						let resData = this.$base.strResToJson(res.data)
						// console.log(resData)
						if (resData.postScript == '承兑或交易处理成功') {
							this.$base.szblPut('/api/user/my?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this.$base
								.getState(), {
									"id": this.$userMsg.userid,
									"kw10": this.cardId
								}).then((res) => {
								uni.showToast({
									title: '绑定成功',
									icon: 'none',
									mask: false,
									duration: 1500
								});
							}).catch((err) => {
								console.log(err)
							})
						}

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
			//绑默认银行卡
			bindBankCard() {
				let pjson = {
					// m: this.$DEVELOPER.szblid,
					// tk: this.$DEVELOPER.token,
					// state: this.$base.getState(),
					// rpflag: this.$DEVELOPER.cid,
					cardId: this.cardId,
					pwd: this.pwd,
					setStyle: 2, //绑定的方式：0-解绑； 1-绑定； 2-设置默认并绑定； 3-设置默认； 4-重绑
					userName: '胡二二', //用户姓名
					idCard: '36043019890326214X', //身份证
					phoneNum: '18664720566', //手机号
					bankAcct: '6217851700000901800', //绑定的银行账户
					bankAcctType: 0, //银行账户类型（0：对私银行卡(默认) ， 1：对公银行账户）
					// credNo: '', //证件编号
					// credType: 01, //证件类型：01 –身份证(默认) 02 –护照 03 –驾驶证 04 –回乡证 05 –军官证 06-户口本 09 –其他
				}
				// 银行卡绑定/解绑/默认卡
				this.$base.szblPost('/api/iccard/9003?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid, pjson).then((res) => {
					let resData = this.$base.strResToJson(res.data)
					// console.log(resData)
					// if (resData.postScript == '承兑或交易处理成功') {
					// 	this.$base.szblPut('/api/c2cu?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this.$base
					// 		.getState(), {
					// 			"id": this.$userMsg.userid,
					// 			"kw10": this.cardId
					// 		}).then((res) => {
					// 		uni.showToast({
					// 			title: '绑定成功',
					// 			icon: 'none',
					// 			mask: false,
					// 			duration: 1500
					// 		});
					// 	}).catch((err) => {
					// 		console.log(err)
					// 	})
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
				// 充值
				this.$base.szblPost('/api/iccard/0002?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
					this.$base.getState() + '&rpflag=' + this.$DEVELOPER.cid + '&cardId=' + this.cardId + '&bankAcct=' + this.bankAcct +
					'&incrType=1&pwd=' + this.pwd + '&amt=' + this.price).then((res) => {
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
					uni.showToast({
						title: msg,
						icon: 'none',
						mask: false,
						duration: 1500
					});
					this.pwd = ''
				})
			},
			/**
			 * 获取余额
			 */
			getBalance() {
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
			 * @param {Object} x 数组的某一项
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
			queryDetails() {
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
			queryCardForSC() {
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
	.unbinding {
		width: 750upx;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40upx;
		color: #737373;
	}

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
	
	.input-wrap{
		display: flex;
		padding: 0 10upx;
		align-items: center;
	}
	
	.input-wrap text{
		width: 25%;
		text-align: center;
	}
	
	.input-wrap input{
		width: 75%;
	}
</style>
