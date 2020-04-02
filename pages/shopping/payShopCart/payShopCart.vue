<template>
	<view style="padding-bottom: 120upx;">
		<ul class="address-sec" v-if="addre_list.length == 0" style="margin-top: 0;">
			<li id="address-btn" class="address-btn" @click="toAddressList('pay')">
				<span v-if="type"><i class="iconfont icon-bianji"></i>新建收货地址</span>
				<i class="iconfont icon-youbian"></i>
			</li>
		</ul>
		<view class="address" v-else @click="toAddressList('pay')" style="margin-top: 0;">
			<h3>
				收货人：{{default_addre.name}}
				<text>{{default_addre.phone}}</text>
			</h3>
			<p class="detail">
				收货地址：{{default_addre.areaname}}
				{{default_addre.address}}
			</p>
		</view>

		<view class="middle-wrap">
			<view class="cart-wrapper">
				<view class="list-item" v-for="item in shopList" :key="item.id">
					<image class="item-image" :src="$base.urlPrex + item.photo[0]" mode=""></image>
					<view class="item-info">
						<view>{{ item.name }}</view>
						<view class="sku-name">{{ item.kw0 }}</view>
						<view class="bottom-wrapper">
							<text>￥{{ item.kw2 }}</text>
							<text>x {{ item.kw1 }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="list">
			<view class="list-item" style="margin-bottom: 8upx;">
				<text>商品总额</text>
				<text class="price">¥{{ parseFloat(totalPrice - YunFei).toFixed(2) }}</text>
			</view>
			<view class="list-item">
				<text>运费</text>
				<text class="price" >+ ¥{{ YunFei }}</text>
			</view>
		</view>

		<view class="total-price">
			<view style="padding: 28upx 16upx;">实付金额：<text class="price-red">¥{{ totalPrice }}</text></view>
			<view class="shopcart-pay-btn bg-hdsh" @click="paySubmit">
				支付
			</view>
		</view>

		
	</view>
</template>

<script>
	import {
		mapGetters, mapActions, mapState
	} from 'vuex'
	export default {
		// 优惠券检测办法：1.在前端页面对每个规格、每个优惠券进行判断，2.把下单数据先传到后台去，由后台来判断哪个优惠券可以使用，哪个不行
		data() {
			return {
				type: true,
				isSL: false, //是否自提
				current: 0, //自提点的下标
				SLPoint: [{
					value: '海岛生活商城总部（海垦国际金融中心）',
					name: '海岛生活商城总部（海垦国际金融中心）'
				}, {
					value: '石山火山风情旅游小镇旅游服务中心',
					name: '石山火山风情旅游小镇旅游服务中心'
				}, {
					value: '文昌东郊互联网农业小镇服务中心',
					name: '文昌东郊互联网农业小镇服务中心'
				}], //自提点
				addre_list: [], //地址列表
				default_addre: {}, //默认收货地址
				default_addre_index: '', //默认收货地址的下标
				payment: 'wx',
				payChoice: "微信",
				isFreight: false,
				freightMode: '',
				totalFreiPrice: "0.00", //总运费
				
				amount: 0, //总价
				shopList: [], //展示用的列表
				orderList: [], //订单列表(提交用)
				rOrderList: [], //返回的订单列表
				order_num: '', //聚合id
				timeAfter: 0,
				timeNow: 0,
				coupon: '' ,//优惠券
				isUseCoupon: false ,//是否使用了优惠券,
				
				totalPrice: 0, //总价
				
				addInfo: [], // 运费模板数组
				YunfeiInfo: {}, // 匹配到的运费信息
				YunFei: 0
			}
		},
		computed: {
			...mapGetters(['get_shopcart_data', 'get_address_data']),
			...mapState({
			    unit_data: state => state.zhsq.unit_data
			})
		},
		watch: {
			payment() {
				if (this.payment == 'wx') {
					this.payChoice = "微信"
				}
				if (this.payment == 'ali') {
					this.payChoice = "支付宝"
				}
				
			},
			
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.unit_data.name
			})
		},
		async onShow() {
			this.shopList = this.get_shopcart_data.shopArr
			this.totalPrice = this.get_shopcart_data.price
			
			if(this.addInfo.length === 0) {
				await this.initAddressTem() // 查询模板
			}
			
			
			
			if(this.get_address_data.changeIndex === undefined) {
				await this.getUserAddress()
			} else {
				await this.getUserAddress()
				let index = this.get_address_data.changeIndex
				this.default_addre = this.addre_list[index]
			}
			
			this.computedYunFei()
		},
		methods: {
			...mapActions({
			    getCartList: "getCartList"
			}),
			// 查询用户收货地址
			getUserAddress() {
				return new Promise((resolve, reject) => {
					this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
						m: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState(),
						rpflag: this.$DEVELOPER.cid
					}).then(resData => {
						if (resData.data == null) {
							uni.showToast({
								icon: "none",
								mask: false,
								title: "账号信息有误，请联系至微信留言",
								duration: 1000
							})
						} else {
							let res = this.$base.strResToJson(resData.data).address
							if (res == "" || res == "[]" || res == null) {
								//没有收货地址
								this.addre_list = []
								resolve('成功')
							} else {
								//有
								this.addre_list = res
								for(let i = 0; i < this.addre_list.length; i++) {
									if(this.addre_list[i].isDefault === true) {
										this.default_addre = this.addre_list[i]
										break;
									}
								}
								resolve('成功')
							}
						}
					}).catch((msg) => {
						console.log(msg)
						reject(msg)
					})
				})
			},
		
			// 到地址列表
			toAddressList(mark) {
				uni.navigateTo({
					url: '/pages/component/addressList/addressList?m=' + mark,
				});
			},
			
			// 加载运费模板
			initAddressTem() {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '加载收货地址..',
						mask: true
					});
					
					this.$base.szblGet('/api/templates', {
						m: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState(),
						appid: this.$DEVELOPER.szblid,
						rpflag: this.$DEVELOPER.cid,
						unit: this.unit_data.id,
						// areacode: this.$areaMsg.id,
						fid: '0',
						labelid: '1006006',
						pnum: 1,
						psize: 99
					}).then(res => {
						return this.$base.szblGet('/api/templates', {
							m: this.$userMsg.userid,
							tk: this.$userMsg.token,
							state: this.$base.getState(),
							appid: this.$DEVELOPER.szblid,
							rpflag: this.$DEVELOPER.cid,
							// areacode: this.$areaMsg.id,
							fid: this.$base.strResToJson(res.data)[0].id,
							labelid: '1006006',
							pnum: 1,
							psize: 99
						})
					}).then(res => {
						this.addInfo = this.$base.strResToJson(res.data)
						resolve('Success')
						uni.hideLoading()
					}).catch(msg => {
						uni.hideLoading()
						uni.showToast({
							title: '网络延迟，请稍后再试',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						reject(msg)
					})
				})
			},
			
			// 计算运费
			computedYunFei() {
				// 先匹配地址
				for(let i = 0; i < this.addInfo.length; i++) {
					if(this.addInfo[i].name === this.default_addre.areaname) {
						// 开始选择
						this.YunfeiInfo = this.addInfo[i]
						break;
					}
					// 如果都没有，跳出
					
				}
				
				// 开始计算一共买了几件
				let total = 0
				for(let i = 0; i < this.shopList.length; i++) {
					total += new Number(this.shopList[i].kw1)
				}
				
				if(total < new Number(this.YunfeiInfo.kw4) || total === (this.YunfeiInfo.kw4 / 1)  ) { // 如果小于初始计数
					this.YunFei = parseFloat(this.YunfeiInfo.kw5) // 初始运费
					this.totalPrice = parseFloat(this.totalPrice) + this.YunFei // 初始总价
					this.totalPrice = this.totalPrice.toFixed(2) // 格式化价格小数点
					this.YunFei = this.YunFei.toFixed(2) // 展示运费格式化小数点
				
				} else if (total > new Number(this.YunfeiInfo.kw4)) { // 如果大于初始计数
				
					this.YunFei = parseFloat(this.YunfeiInfo.kw5) // 初始运费
					
					// console.log(this.YunFei, '=> 1')
					
					let addGoods = total - new Number(this.YunfeiInfo.kw4) // 总件数减去初始件数 等于 多出件数
					
					// console.log(addGoods, '=> addGoods2')
					
					let addCount = addGoods / (new Number(this.YunfeiInfo.kw6)) // 多出件数 除以 Kw6 等于 要加多少次钱
					
					// console.log(addCount, '=> addCount3')
					
					let addPrice = addCount * (new Number(this.YunfeiInfo.kw7)) // 要加多少次钱 乘以 Kw7 等于 加的总价
					
					// console.log(addPrice, '=> addPrice4')
					
					this.YunFei += addPrice
					
					this.totalPrice = parseFloat(this.totalPrice) + this.YunFei // 初始总价
					
					this.totalPrice = this.totalPrice.toFixed(2)
					this.YunFei = this.YunFei.toFixed(2)
				}
				
			},
						
			// 下单并调起支付
			paySubmit() {
				
				if (JSON.stringify(this.default_addre) == "{}") {
					uni.showToast({
						icon: 'none',
						mask: false,
						title: '请填写收货信息',
						duration: 1500
					})
					return false;
				}
				
				uni.showLoading({
					title: '正在调起支付',
					mask: true
				})
				
				let _this = this
				let delayTime = 1500
				this.timeNow = Date.now()
				if (this.timeNow - this.timeAfter >= 1500) {
					this.timeAfter = this.timeNow
				} else {
					uni.showToast({
						mask: false,
						title: '请勿重复下单',
						duration: 1000,
						icon: "none"
					})
					return
				}
				
				let order_msg = {
					"createuserid": this.$userMsg.userid, //创建人id
					"gid": '3', //订单类型
					"kw4": this.$base.getRSAEncryptStr(parseFloat(this.totalPrice) * 100), //总金额
					"kw9": this.$base.getRSAEncryptStr(parseFloat(this.YunFei) * 100), // 运费
					"payremarks": this.$DEVELOPER.name + "商品消费订单",
					"address": this.default_addre.areadetail + this.default_addre.address,
					"appid": this.$DEVELOPER.szblid,
					"querykeyword": '', //快速搜索
					"rpflag": this.$DEVELOPER.cid,
					"unit": this.unit_data.id,
					// "labelid": '1011004',
					"labelid": '',
					"jsondata": '' // 后续拼接JSONDATA
				}
				
				
				let jsonArr = []
				let labelID = ''
				this.shopList.map(item => {
					jsonArr.push({
						name: item.name,//商品名称
						cid: item.cid,//商品ID
						fid: item.fid,//规格ID
						kw0: item.kw0,//规格名称
						kw1: item.kw1, //数量
						kw2: item.kw2,//商品总价
						photo: item.photo[0]//商品图片
					})
					
					labelID += item.gid + ',' // 拼接商品LabelID
				})
				
				let jsondata = {
					shr: this.default_addre.name, // 收货人
					shdh: this.default_addre.phone, // 收货电话
					fkfs: '微信', // 付款方式
					splb: []// 购买商品集合
				}
				
				jsondata.splb = jsonArr
				order_msg.jsondata = jsondata
				order_msg.labelid = labelID
				
				let strOrder = this.$base.jsonResToStr(order_msg)
				
				this.$base.szblPost(
					'/api/orders?m=' + this.$userMsg.userid + 
					'&tk=' + this.$userMsg.token + 
					'&state=' + this.$base.getState(), strOrder
				).then(res => {
					if (res.data === null) {
						uni.showToast({
							icon: "none",
							mask: false,
							title: res.msg,
							duration: 1000
						})
					} else {
						let r = this.$base.strResToJson(res.data)
						
						this.order_num = r.kw2;
						this.order_id = r.id;
						
						return this.$base.getWxPay(
							this.$userMsg.userid, 
							this.$userMsg.token, 
							this.order_num, 
							this.$DEVELOPER.wxPayMarkPUBLIC,
							uni.getStorageSync("wxOpenid")
						)
					}
				}).then((res) => { // 付款成功后修改订单状态
					return this.$base.szblPut(
					"/api/orders/" + this.order_id + 
					"?m=" + this.$userMsg.userid + 
					"&tk=" + this.$userMsg.token +
					"&state=" + this.$base.getState() + 
					"&appid=" + this.$DEVELOPER.szblid, {
						'appid': this.$DEVELOPER.szblid,
						'id': this.order_id,
						'status': '1'
					})
				}).then(res => {
					// 删除已经购买的商品
					this.shopList.map(item => {
						return this.$base.szblDel(`/api/carts
							?m=${this.$userMsg.userid}
							&tk=${this.$userMsg.token}
							&state=${this.$base.getState()}`, item
						)
					})
					
					this.getCartList()
						
					uni.showToast({
						icon: 'none',
						mask: false,
						title: '付款成功',
						duration: 1500
					})
					
					uni.hideLoading()
				}).then(res => {
					uni.reLaunch({
						url:'/pages/tabBar/member/member'
					})
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					uni.showToast({
						icon: 'none',
						mask: false,
						title: err,
						duration: 1500
					})
					uni.reLaunch({
						url:'/pages/tabBar/member/member'
					})
				})
			}
		}
	}
</script>

<style>
	@import "../../../common/shop-cart.css";

	.address {
		padding: 2% 13.33% 3%;
		line-height: 60upx;
	}

	.address h3 b {
		padding: 0 36upx;
	}

	.address h3 {
		font-size: 30upx;
	}

	.address .detail {
		font-size: 26upx;
		padding-left: 50upx;
		margin-left: -50upx;
	}

	.address:after {
		right: 5%;
	}

	.address-btn {
		padding: 0 6%;
		line-height: 160upx;
	}

	.address-sec .icon-youbian {
		font-size: 28upx;
	}

	.address-sec .icon-bianji {
		font-size: 50upx;
		padding-right: 25upx;
	}

	.address-sec li {
		border: none;
	}

	.middle-wrap {
		margin-bottom: 16upx;
	}

	.good-middle {
		width: 718upx;
	}

	.good-middle .right {
		width: 498upx;
	}

	.paymoney .money span.sec {
		font-size: 24upx;
	}

	.pay-unbtn {
		background: #8a8a8a !important;
	}

	.list {
		padding: 20upx;
		background: #fff;
		margin-top: 16upx;
		overflow: hidden;
	}

	.list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.list-item .right {
		font-size: 28upx;
	}

	.list-item .price {
		color: #d81e06;
	}

	.total-price {
		background: #fff;
		margin-top: 10upx;
		display: flex;
		justify-content: space-between;
		position: absolute;
		bottom: 0px;
		width: 100%;
	}
	
	.shopcart-pay-btn {
		color: #fff;
		justify-content: center;
		align-items: center;
		display: flex;
		font-size: 32upx;
		padding: 0upx 100upx;
	}
	
	.total-price .price-red {
		color: #d81e06;
	}

	
</style>
