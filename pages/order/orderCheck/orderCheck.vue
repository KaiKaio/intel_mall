<template>
	<!-- 扫码后核销美食订单的页面。其中门票核销未完成 -->
	<view class="app-init order-list" @click="windex=''">
		<view class="cate-pay">
			<!-- <ul class="address-sec" v-if="!msg" style="margin-top: 0;">
		    	<li id="address-btn" class="address-btn" @click="$router.openPage('/address')">
		    		<span v-if="type&&show_mark"><i class="iconfont icon-bianji"></i>新建收货地址</span>
		    	    <i class="iconfont icon-youbian"></i>
		    	</li>
		    </ul> -->
			<!-- <view class="address" v-if="msg" @click="$router.openPage('/address')" style="margin-top: 0;">
				<h3>收货人：{{show_msg.name}}<b>{{show_msg.tel}}</b></h3>
				<p v-show="show_mark" class="detail">收货地址：{{show_msg.prov}} {{show_msg.city}} {{show_msg.district}} {{show_msg.address}}</p>
			</view> -->
			<view class="name">{{order.name}}</view>
			<!-- <view>用餐人数</view> -->
			<!-- 预览 -->
			<view class="od-list">
				<view class="od-item" v-for="(item,index) in msList" :key="index" :style="{borderBottom : index == msList.length-1 ? '' : '1px solid #eee'}">
					<image :src="item.photo" mode="aspectFit"></image>
					<view class="od-name">
						<text>{{item.name}}</text>
						<text>¥{{item.kw0}}</text>
					</view>
					<view class="od-num">
						x{{num[index]}}
					</view>
				</view>
			</view>
			<!-- <ul>
				<li v-for="(item,index) in msList" :key="index">
					<view class="cate-pay-img">
						<img :src="item.photo" alt="">
					</view>
					<view class="cate-pay-name">
						{{item.name}}
						<p>¥{{item.kw0}}</p>
					</view>
					<view class="cate-pay-num">
						x{{num[index]}}
					</view>
				</li>
			</ul> -->
			<!-- <view class="num" v-if="show_mark">
				<span class="fl">数量</span>
				<view class="num-box">
					<b @click="cutNum" :class="{disabled:shop_num<2}">-</b>
					<input type="text" v-model="shop_num" @blur="inputBlur" :readonly="order_num ? true : false"/>
					<b @click="addNum" :class="{disabled:shop_num>=get_pay_data.kw3}">+</b>
				</view>
			</view> -->
		</view>
		<view v-if="!YData.qr" class="new-btn" @click="okPay">确认消费</view>
		<!-- <view class="bottom-hint">
			{{b_hint}}
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderid: '',
				order_list: '',
				windex: '',
				b_hint: '到底啦~',
				type: ['待使用', '已使用'],
				YData: {
					tIndex: '',
					qr: false
				},
				default_photo: "/static/icon/default.png",
				store: {},
				msList: [],
				num: [],
				order: {}
			}
		},
		onShow() {
			this.isLogin()
		},
		onLoad(obj) {
			this.orderid = obj.id
		},
		methods: {
			getOrderDetail(){
				let arr = [];
				this.msList.length = 0
				uni.showLoading({
					mask: true
				})
				this.$base.szblGet("/api/scorder/" + this.orderid, {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState()
				}).then(res => {
					this.order = this.$base.strResToJson(res.data);
					arr = this.$base.strResToJson(res.data).htmldata.split('----');
					arr.forEach((item, index) => {
						this.num.push(item.split(',')[1])
						this.$base.szblGet("/api/scstyle/" + item.split(',')[0], {
							m: this.$userMsg.userid,
							tk: this.$userMsg.token,
							state: this.$base.getState()
						}).then(retData => {
							let rd = this.$base.strResToJson(retData.data)
							if (rd.photo != null && rd.photo != '' && rd.photo != '[]') {
								rd.photo = this.$base.urlPrex + rd.photo[0]
							}
							this.msList.push(rd);
						}).catch(msg => {
							console.log(msg);
							return
						})
					})
					uni.hideLoading()
				}).catch((msg) => {
					console.log(msg);
					uni.hideLoading()
					return;
				});
			},
			okPay() {
				uni.showModal({
					title: '是否需要核销？',
					content: ' ',
					confirmColor: this.$PROP.hdsh_color,
					showCancel: true,
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								mask: true
							})
							this.$base.szblPut("/api/orders/" + this.orderid + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token +
								"&state=" + this.$base.getState() + "&kw3=",{}).then(dataJson => {
								//给商家发送短信

								// this.$base.szblPost("/api/sms/notice?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" +
								// 	this.$base.getState(), msg_obj).then(res => {
								// 	uni.hideLoading()
								// 	uni.reLaunch({
								// 		url: '/pages/tabBar/member/member'
								// 	})
								// 	this.detail.status = 4
								// }).catch(msg => {
								// 	console.log(msg);
								// })

								// this.$base.ajaxGet('/api/sciorder/sendMessage?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token +
								// 	'&state=' + this.$base.getState(), {
								// 		"contentVar": JSON.stringify({
								// 			"name": this.order.kw0,
								// 			"status": "成功确认了的美食",
								// 			"remarks": this.order.kw6 + "成功确认了一份美食订单",
								// 			"id": this.order.id
								// 		}),
								// 		"phone": this.order.kw1,
								// 	}).then((res) => {

								// }).catch((msg) => {
								// 	return;
								// });
								
								uni.showToast({
									title: '确认消费成功',
									mask: false,
									icon: 'none',
									duration: 1500
								})
								this.YData.qr = true;
							}).catch((msg) => {
								uni.showToast({
									title: '这不是您店铺的订单！',
									mask: false,
									icon: 'none',
									duration: 1500
								})
								uni.hideLoading()
								return;
							})
						}
					}
				})

			},
			// 判断是否登录
			isLogin() {
				this.$base.autoLogin(this.$DEVELOPER.szblid).then(res => {
					this.getOrderDetail()
				}).catch(msg => {
					console.log(msg);
					this.$store.commit('set_page_data', {
						page: '/pages/order/orderCheck/orderCheck?id=' + this.orderid
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				})
			},
		}
	}
</script>

<style>
	.new-btn {
		width: 80%;
		margin: 83upx auto 0;
		line-height: 74upx;
		color: #fff;
		font-size: 28upx;
		text-align: center;
		background: #00a0ea;
	}

	.cate-pay ul li {
		border-top: 1px solid #ededed;
	}

	.cate-pay-name {
		padding-left: 20upx;
	}

	.cate-pay ul li:first-child {
		border: none;
	}

	.od-list {}

	.od-item {
		position: relative;
		/* border-bottom: 2upx solid #999; */
		padding: 20upx 0;
	}

	.od-item image {
		width: 230upx;
		height: 230upx;
	}

	.od-item .od-name {
		position: absolute;
		right: 2upx;
		top: 20upx;
		display: inline-flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.od-item .od-name text:first-child {}

	.od-item .od-name text:last-child {
		font-size: 32upx;
		color: #e02e24;
		margin-top: 20upx;
	}

	.od-item .od-num {
		position: absolute;
		right: 2upx;
		bottom: 20upx;
	}
</style>
