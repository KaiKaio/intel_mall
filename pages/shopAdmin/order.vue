<template>
	<!-- 订单列表 -->
	<view>
		<view class="type-cont" style="box-shadow: 2upx 20upx 40upx #eee;">
			<view class="flex-cont order-tab">
				<view
					class="item" 
					v-for="(x,index) in actType" 
					:key="index" 
					:class="{'tab-ac-hdsh':index == actTypeIndex}" 
					@click="tabChange(x,index)">{{ x.name }}</view>
			</view>
		</view>
		
		<view class="loginFalse" v-if="loginFlag === false">
			<view class="login-button bg-hdsh" @click="toLogin">登录</view>
			<text style="margin-top: 24upx;">您还没有登录，请登录后查看菜单</text> 
			<text class="font-icon">&#xe8ac;</text>
		</view>
		
		<view class="orders-item daifu" v-for="(oItem,oIndex) in order_list" :key="oIndex">
			<view class="item-top-block">
				<view class="mall-name">
					<text class="font-icon">&#xe651;</text>
					<text>订单号: {{ oItem.id }}</text>
					<span @click="toStore(oItem)" class="mall-name-text">{{oItem.name}}</span>
					<p class="order-status" v-if="oItem.status == 0">
						待付款
					</p>
					<p class="order-status" v-if="oItem.status == 1" style="color: #F56C6C;">
						待发货
					</p>
					<p class="order-status" v-if="oItem.status == 2" style="color: #B3944D;">
						待收货
					</p>
					<p class="order-status" v-if="oItem.status == 3">
						待评价
					</p>
					<p class="order-status" v-if="oItem.status == 4" style="color: #09BB07;">
						交易成功
					</p>
					<p class="order-status" v-if="oItem.status == 5" style="color: #605E5E;">
						交易关闭
					</p>
				</view>
			</view>
			
			<!-- 商品 -->
			<view v-if="oItem.gid == 3" class="item-goods" @click="toDetail(oItem)" v-for="(gItem, gIndex) in oItem.jsondata.splb"
			 :key="gIndex">
				<image class="goods-img" :src="gItem.photo != '' ? $base.urlPrex + gItem.photo : default_photo" mode="aspectFill"></image>
				<view class="goods-name">
					<p>{{gItem.name}}</p>
				</view>
				<p class="spec">规格：{{gItem.kw0}}</p>
				<view class="price-and-num">
					<view class="goods-price"><span>¥</span>{{gItem.kw2}}</view>
					<view class="goods-number">x {{gItem.kw1}}</view>
				</view>
			</view>
			

			<view class="currency-block">
				<p class="time">下单时间：{{oItem.createtime}}</p>
			</view>
			
			<view class="currency-block">
				<p class="kd" v-if="oItem.gid == 3 && oItem.kw18 == '0'">（免运费）</p>
				<p class="kd" v-if="oItem.gid == 3 && oItem.kw18 != '0'">{{"(含配送费" + oItem.kw9 + "元)"}}</p>
				<p v-if="oItem.gid != 9" class="currency-amount">{{oItem.kw4}}</p>
				<p v-if="oItem.gid != 9" class="currency-head">实付<span>:</span>¥</p>
			</view>
			
			<view class="button-block" style="display: flex; justify-content: flex-end;" v-if="oItem.status == 1">
				<view class="orders-button">
					<a class="go-pay color-white bg-hdsh" @click="confirmDelivery(oItem, oIndex)">确认发货</a>
				</view>
				
				<view class="orders-button">
					<a class="go-pay" @click="refundOrder(oItem, oIndex)">退款</a>
				</view>
			</view>
			
			<view class="button-block" v-if="oItem.status == 2">
				<view class="orders-button">
					<a class="cancel wl" @click.stop="wlClick(oIndex)">配送信息
						<view class="wl-msg-box" v-if="oIndex === windex">
							<p>配送员电话：{{oItem.jsondata.psydh}}</p>
							<p>配送员姓名：{{oItem.jsondata.psyxm}}</p>
						</view>
					</a>
				</view>
			</view>
			
			<view class="button-block" v-if="oItem.gid == 7 && (oItem.status == 4 || oItem.status == 1)">
				<view class="orders-button">
					<a class="cancel" @click="sqClick(oItem,oIndex)">申请退款</a>
				</view>
			</view>
			
			<view class="button-block" v-if="oItem.status==6">
				<view class="orders-button">
					<a class="go-pay color-white bg-hdsh" @click="toComment(oItem)">立即评价</a>
				</view>
			</view>

		</view>
		<view class="bottom-hint" v-show="loginFlag === true">
			{{b_hint}}
		</view>
		
		<uni-popup class="sku-list" ref="delivery_pop" type="center">
			<view style="display: flex;">
				<view @click="peisongTab = 0" :style="{'backgroundColor': peisongTab === 0 ? 'rgb(235, 84, 77)' : '', 'color': peisongTab === 0 ? '#fff' : ''}" style="width: 50%; text-align:center; color: #000; font-size: 30upx; margin-bottom: 20upx;">配送员</view>
				<view @click="peisongTab = 1" :style="{'backgroundColor': peisongTab === 1 ? 'rgb(235, 84, 77)' : '', 'color': peisongTab === 1 ? '#fff' : ''}" style="width: 50%; text-align:center; color: #000; font-size: 30upx; margin-bottom: 20upx;">本店配送</view>
			</view>
			
			
			
			<ul class="list" v-if="peisongTab === 0" style="height: 70vh;">
				<template v-for="(item, index) in personList" >
					<li class="list-item" :key="item.id" style="justify-content: space-between; align-items: center; display: flex; font-size: 24upx; margin-bottom: 20upx; box-shadow: 0px 0px 2u0px #eee; padding: 24upx 8upx;">
							
						<view style="border-radius: 4%; margin-right: 8upx; width: 120upx; height: 120upx; background-repeat: no-repeat; background-size: contain;" v-if="item.kw16.indexOf('http') === 0" class="avatar" :style="{ backgroundImage: `url(${ item.kw16 })` }"></view>
						<view style="border-radius: 4%; margin-right: 8upx; width: 120upx; height: 120upx; background-repeat: no-repeat; background-size: contain;" v-else class="avatar" :style="{ backgroundImage: `url(${ $base.urlPrex + item.kw16 })` }"></view>
						
						<view class="person-info" style="width: 50%; line-height: 40upx;">
							<view>
								<text>手机号：{{ item.kw1 }}</text>
							</view>
							
							<view>
								<text>真实姓名：{{ item.kw0 }}</text>
							</view>
							
							<view style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
								<text>昵称：{{ item.kw12 }}</text>
							</view>
							
							<view>
								<text v-if="item.kw3 !== '' ">性别：{{ item.kw3 }}</text>
								<text v-else>性别：暂无</text>
							</view>
						</view>
						
						
						
						<view class="button-wrapper" style="background-color: #EB544D;
							border-radius: 6px;
							color: #fff;
							padding: 1px 2px;">
							<view @click="handleDelive(item, index)" class="function-botton">安排配送</view>
						</view>
					</li>
				</template>
			</ul>
			
			<view v-if="peisongTab === 1">
				<view style="margin-bottom: 24upx;">本店配送将使用当前登录的账号信息</view>
				<view>姓名：{{ shopInfo.kw0 ? shopInfo.kw0 : '暂无' }}</view>
				<view style="margin-bottom: 24upx;">手机号：{{ shopInfo.kw1 }}</view>
				
				<view class="button-wrapper" 
					style="background-color: #EB544D;
					text-align: center;
					width: 30%;
					margin-left: auto;
					border-radius: 6px;
					color: #fff;
					padding: 1px 2px;">
					<view @click="selfDelive" class="function-botton">配送</view>
				</view>
			</view>
		</uni-popup>
		
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		name: 'orderList',
		data() {
			return {
				order_list: [],
				windex: '',
				b_hint: '到底啦~',
				actType: [
					{
						name: '全部',
						status: ''
					},
					{
						name: '待付款',
						status: 0
					},
					{
						name: '待发货',
						status: 1
					},
					{
						name: '待收货',
						status: 2
					},
					// {
					// 	name: '待评价',
					// 	status: 3
					// },
					{
						name: '交易完成',
						status: 4
					},
				], //当前正在使用的tab
				actTypeIndex: 0, //当前tab下正在使用的下标
				default_photo: require('@/static/icon/default.png'),
				// typeIndex: '',
				page_num: 0, //当前页数
				pnum: 1,
				
				loginFlag: false,
				
				searchPhone: '',
				personList: [],
				
				selOrderItem: {}, // 发货选中的订单
				
				peisongTab: 0,
			};
		},
		computed: {
			...mapState({
			    unit_data: state => state.zhsq.unit_data
			})
		},
		
		mounted () {
			if (this.$userMsg.userid === null) { // 判断是否已登录
				this.loginFlag = false
			} else {
				this.loginFlag = true
				
				let status = this.$store.state.zhsq.orderStatus
				
				for(let i = 0; i < this.actType.length; i++) {
					if(this.actType[i].status === status) {
						this.tabChange(this.actType[i], i)
					}
				}
				
			}
			
			
			
			let status = this.actType[this.actTypeIndex].status
			
			
			// 获取个人信息，用于个人配送
			this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
				m: this.$userMsg.userid,
				tk: this.$userMsg.token,
				state: this.$base.getState(),
			}).then((res) => {
				this.shopInfo = this.$base.strResToJson(res.data);
			})
		},
		onReachBottom() {
			let status = this.actType[this.actTypeIndex].status
			
			// 上拉加载
			this.pnum++;
			if (this.pnum > this.page_num) {
				return
			} else {
				this.getList(status, true)
			}
		},
		methods: {
			// 退款
			refundOrder(item, index) {
				uni.showModal({
					content: `确认将此订单的金额退款吗？`,
					showCancel: true,
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							this.$base.wxPayRefund(
								this.$userMsg.userid,
								this.$userMsg.token,
								this.$DEVELOPER.wxPayMarkPUBLIC,
								item.kw2
							).then(res => {
								return this.$base.szblPut(
									"/api/orders/" + item.id + 
									"?m=" + this.$userMsg.userid + 
									"&tk=" + this.$userMsg.token +
									"&state=" + this.$base.getState() + 
									"&appid=" + this.$DEVELOPER.szblid, {
										'appid': this.$DEVELOPER.szblid,
										'id': item.id,
										'status': '5'
									})
							}).then(res => {
								uni.showToast({
									title: '退款成功'
								})
								this.tabChange(this.actType[0] ,0)
							}).catch(err => {
								console.log(err)
							})
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			
			selfDelive() { // 本店配送
				
				if(this.shopInfo.kw0 === '' || 
					this.shopInfo.kw0 === null || 
					this.shopInfo.kw0 === 'null' || 
					this.shopInfo.kw0 === undefined) {
						uni.showToast({
							title: '未填写真实姓名  请先完善个人信息'
						})
						
						return
					}
				
				
				uni.showModal({
					content: `确认自己进行配送？`,
					showCancel: true,
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						
						this.selOrderItem.item.jsondata.psydh = this.shopInfo.kw1 // 配送员手机号码
						this.selOrderItem.item.jsondata.psyxm = this.shopInfo.kw0 // 配送员真实姓名
						
						if (res.confirm) {
							this.$base.szblPut(
								"/api/orders/" + this.selOrderItem.item.id + 
								"?m=" + this.$userMsg.userid + 
								"&tk=" + this.$userMsg.token +
								"&state=" + this.$base.getState() + 
								"&appid=" + this.$DEVELOPER.szblid, {
									'appid': this.$DEVELOPER.szblid,
									'id': this.selOrderItem.item.id,
									'status': '2', // 修改订单为 `待发货` 状态
									'kw10': this.$userMsg.userid, // 配送员用户ID
									'jsondata': this.selOrderItem.item.jsondata
								},
							).then(res => {
								uni.showToast({
									title: '已安排配送',
									icon: 'success'
								})
								this.$refs.delivery_pop.close()
								this.tabChange(this.actType[3], 3) // 订单 Tab 改为待收货
							}).catch(err => {
								console.log(err)
							})
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			
			handleDelive(item, index) {
				uni.showModal({
					content: `确认安排${item.kw0}进行此货物的配送？`,
					showCancel: true,
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						
						this.selOrderItem.item.jsondata.psydh = item.kw1 // 配送员手机号码
						this.selOrderItem.item.jsondata.psyxm = item.kw0 // 配送员真实姓名  
						// 'psyxm': item.kw0 // 配送员真实姓名  
						
						if (res.confirm) {
							this.$base.szblPut(
								"/api/orders/" + this.selOrderItem.item.id + 
								"?m=" + this.$userMsg.userid + 
								"&tk=" + this.$userMsg.token +
								"&state=" + this.$base.getState() + 
								"&appid=" + this.$DEVELOPER.szblid, {
									'appid': this.$DEVELOPER.szblid,
									'id': this.selOrderItem.item.id,
									'status': '2', // 修改订单为 `待发货` 状态
									'kw10': item.id, // 配送员用户ID
									'jsondata': this.selOrderItem.item.jsondata
								},
							).then(res => {
								uni.showToast({
									title: '已安排配送',
									icon: 'success'
								})
								this.$refs.delivery_pop.close()
								this.tabChange(this.actType[3], 3) // 订单 Tab 改为待收货
							}).catch(err => {
								console.log(err)
							})
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			
			confirmDelivery(item, index) {
				this.selOrderItem = {item: item, index: index}
				
				this.$base.szblGet('/api/users/br', {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
					appid: this.$DEVELOPER.szblid,
					rpflag: this.$DEVELOPER.cid,
					areacode: this.$areaMsg.id,
					pnum: '1',
					psize: '1000',
					rid: '15844996086031044545059', // 角色ID
					oid: '15844978590081769957231', // 组织ID
					gid: 1
				}).then(res => {
					this.personList = this.$base.strResToJson(res.data)
					this.$refs.delivery_pop.open()
				}).catch(err => { 
					console.log(err)
				})
			},
			
			// 绑定配送员
			bindPerson() {
				console.log('绑定配送员')
				this.$base.szblGet('/api/user/bp', {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
					appid: this.$DEVELOPER.szblid,
					rpflag: this.$DEVELOPER.cid,
					username: this.searchPhone, // 手机号码
					gid: '1'
				}).then(res => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			
			toLogin() {
				this.$store.commit('set_page_data', {
					page: '/pages/order/orderList/orderList',
				})
				uni.navigateTo({
					url: '/pages/component/login/login?m=null'
				});
			},
			/**
			 * 获取订单列表
			 * @param {Object} isRb 是否上滑加载，true-是，false或不传-不是
			 */
			getList(pstatus, isRb) {
				uni.showLoading()
				let pjson = {
					"m": this.$userMsg.userid,
					"tk": this.$userMsg.token,
					"state": this.$base.getState(),
					"pnum": this.pnum,
					"psize": 8,
					"rpflag": this.$DEVELOPER.cid,
					"appid": this.$DEVELOPER.szblid,
					"unit": this.unit_data.id
				}
				
				let status = pstatus
				
				if(status !== '') {
					pjson.status = status
				}
				
				this.$base.szblGet('/api/orders', pjson).then(res => {
					this.page_num = res.pages
					let r = this.$base.strResToJson(res.data)
					
					if (JSON.stringify(r) === '{}') {
						this.b_hint = '暂无此类型订单~';
					}
					
					if(isRb === true) {
						r.map(item => {
							this.order_list.push(item)
						})
					} else {
						this.order_list = r
					}
					
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
					console.log(err);
				});
			},
			/**
			 * tab切换
			 * @param {object} item 切换后tab的实体
			 * @param {number} index 切换后的tab下标
			 */
			tabChange(item, index) {
				//重置查询返回的数组及页数
				// this.order_list = []
				// this.order_obj.pnum = 1
				this.pnum = 1
				//订单类型切换
				this.actTypeIndex = index;
				// this.order_obj.status = item.status
				
				this.getList(item.status)
			},
			/**
			 * 取消订单方法
			 * @param {Object} x 订单
			 * @param {Object} index 订单下标
			 */
			orderDel(x, index) {
				uni.showModal({
					title: '您确定要取消该订单吗？',
					content: ' ',
					showCancel: true,
					cancelText: '不',
					confirmText: '确定',
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							this.$base.szblPut(
								"/api/orders/" + x.id + 
								"?m=" + this.$userMsg.userid + 
								"&tk=" + this.$userMsg.token + 
								"&state=" + this.$base.getState() + 
								"&appid=" + this.$DEVELOPER.szblid, {
									'appid': this.$DEVELOPER.szblid,
									'id': x.id,
									'status': '5',
									'kw5': '',
									'cid': ''
								}
							).then(dataJson1 => {
								this.order_list[index].status = 5
								uni.showToast({
									title: '取消订单成功',
									icon: 'none',
									mask: false,
									duration: 1000
								});
							}).catch(msg => {
								console.log(msg, '修改订单状态失败原因')
								uni.showToast({
									title: '取消失败',
									icon: 'none',
									mask: false,
									duration: 1000
								});
							})
						} else if (res.cancel) {
							return
						}

					},
					fail: (res) => {
						// console.log(2)
					},
					complete: (res) => {
						// console.log(3)
					}
				});
				// console.log(4)
			},
			/**
			 * 调起支付的方法
			 * @param {Object} x 订单
			 * @param {Object} index 订单下标 
			 */
			goPay(x, index) {
				// #ifdef H5
				this.$base.getWxPay(
					this.$userMsg.userid, 
					this.$userMsg.token, 
					x.kw2, 
					this.$DEVELOPER.wxPayMarkPUBLIC,
					uni.getStorageSync("wxOpenid")
				).then(res => {
					return this.$base.szblPut(
					"/api/orders/" + x.id + 
					"?m=" + this.$userMsg.userid + 
					"&tk=" + this.$userMsg.token +
					"&state=" + this.$base.getState() + 
					"&appid=" + this.$DEVELOPER.szblid, {
						'appid': this.$DEVELOPER.szblid,
						'id': x.id,
						'status': '1'
					})
				}).then(res => {
					// 删除已经购买的商品
					// x.jsondata.splb.map(item => {
					// 	return this.$base.szblDel(`/api/carts
					// 		?m=${this.$userMsg.userid}
					// 		&tk=${this.$userMsg.token}
					// 		&state=${this.$base.getState()}`, item
					// 	)
					// })
					uni.showToast({
						icon: 'none',
						mask: false,
						title: '付款成功',
						duration: 1500
					})
					uni.reLaunch({
						url:'/pages/tabBar/member/member'
					})
				}).catch(msg => {
					uni.showToast({
						icon: 'none',
						mask: false,
						title: err,
						duration: 1500
					})
				});
				// #endif
			},
			/**
			 * 跳转到评论
			 * @param {Object} x 订单
			 */
			toComment(x) {
				this.$store.commit('set_comment_data', x)
				uni.navigateTo({
					url: '/pages/component/comment/comment',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			/**
			 * 跳转到店铺页 to do
			 * @param {Object} x 订单
			 */
			toStore(x) {
				return
				var sort = '';
				switch (x.gid) {
					case '1':
						sort = '/hotel';
						break;
					case '2':
						sort = '/cate';
						break;
					case '3':
						sort = '/shop'
						break;
					default:
						break;
				}
			},
			/**
			 * 跳转到订单详情
			 * @param {Object} x 订单
			 */
			toDetail(x) {
				uni.navigateTo({
					url: '/pages/tabBar/order/orderDetail/orderDetail?g=' + x.gid + '&id=' + x.id + '&status=' + x.status,
				});
			},
			/**
			 * 确认收货方法
			 * @param {Object} x 订单
			 * @param {Object} index 订单下标
			 */
			clickOk(x, index) {
				uni.showModal({
					title: '您确认收到货物了吗？(确认收货,订单完成交易)',
					content: ' ',
					showCancel: true,
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							this.$base.szblPut(
								"/api/orders/" + x.id + 
								"?m=" + this.$userMsg.userid + 
								"&tk=" + this.$userMsg.token + 
								"&state=" + this.$base.getState() + 
								"&appid=" + this.$DEVELOPER.szblid, {
									'appid': this.$DEVELOPER.szblid,
									'id': x.id,
									'status': '4',
									'kw5': '',
									'cid': ''
								}
							).then(dataJson1 => {
								this.order_list[index].status = 4
								uni.showToast({
									icon: 'none',
									title: '确认收货成功',
									mask: false,
									duration: 1000
								})
							}).catch(msg => {
								console.log(msg, '修改订单状态失败原因')
							})
						}
						if (res.cancel) {
							return
						}
					},
				});
			},
			/**
			 * 商品、套票申请退款方法
			 * @param {Object} x 订单
			 * @param {Object} index 订单在列表中的下标
			 */
			sqClick(x, index) {
				
				let msg_obj = {
					"phones": x.kw1,
					"smsid": "1566462939231915455699",
					"appid": this.$DEVELOPER.szblid,
					"cn_1": x.name,
					"cn_2": this.order_obj.gid == 3 ? "退款" : "套票退款",
					"cn_3": '',
					"cn_4": x.id
				}
				if(this.order_obj.gid == 3){
					msg_obj.cn_3 = x.kw6 + "要求退" + (x.jsondata.length == 1 ? x.jsondata[0].spuname.replace(/【/g, " ").replace(/】/g, " ") : "多款商品")
				}else if(this.order_obj.gid == 7){
					msg_obj.cn_3 = x.kw6 + "要求退" + x.kw0.replace(/【/g, " ").replace(/】/g, " ")
				}
				uni.showModal({
					title: '您确定要申请退款吗？',
					content: ' ',
					showCancel: true,
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							this.$base.szblPut("/api/sciorder/tuikuan/" + x.id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg
								.token + "&state=" + this.$base.getState()).then(dataJson => {
								this.order_list[index].status = 8
								uni.showToast({
									icon: 'none',
									title: '申请退款成功，待商家同意',
									mask: false,
									duration: 1000
								})

								//退款后通知商家
								this.$base.szblPost("/api/sms/notice?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" +
									this.$base.getState(), msg_obj).then(res2 => {}).catch(msg => {
									console.log(msg);
								})
							}).catch(msg => {
								console.log(msg)
							})
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			
			wlClick(index) {
				if (this.windex !== index) {
					this.windex = index;
				} else {
					this.windex = '';
				}
			},
			/**
			 * 退款失败后回退订单状态
			 * @param {Object} id 订单id
			 */
			reStatus(id) {
				this.$base.szblPut("/api/sciorder/restatus/" + id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token +
					"&state=" + this.$base.getState()).then(res => {

				}).catch(msg => {
					uni.showToast({
						icon: "none",
						mask: false,
						title: msg
					})
					console.log(msg);
				})
			}
		}
	}
</script>

<style>
	.loginFalse {
		height: calc(100vh - 188upx);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		flex-direction: column-reverse;
	}
	
	.loginFalse  .login-button {
		margin-top: 24upx;
		padding: 12upx 24upx;
		color: #fff;
		border-radius: 8upx;
	}
	
	.currency-block .time {
		float: left;
		font-size: 24upx;
		/* padding-left: 14upx; */
	}

	.currency-block .kd {
		float: right;
		font-size: 20upx;
	}

	.wl-msg-box {
		width: 350upx;
		font-size: 20upx;
		background: #888;
		color: #fff;
		text-align: left;
		padding: 20upx;
		line-height: 40upx;
		border-radius: 10upx;
		top: 90upx;
		position: absolute;
		z-index: 1;
		right: 0upx;
	}

	.wl-msg-box p {
		line-height: 30upx;
		padding-top: 10upx;
	}

	.wl-msg-box p:first-child {
		padding: 0;
	}

	.wl-msg-box:after {
		position: absolute;
		content: '';
		border-left: 15upx solid transparent;
		border-right: 15upx solid transparent;
		border-bottom: 15upx solid #888;
		top: -15upx;
		left: 80%;
	}

	.orders-item {
		width: 94%;
		position: relative;
		padding: 12upx 12upx;
		margin: 0 auto 18upx;
		background-color: #fff;
		border-radius: 12upx;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0
	}

	.item-top-block {
		padding: 16upx 12upx;
	}

	.item-top-block .mall-icon {
		position: absolute;
		top: 10upx;
		height: 20upx;
		width: 20upx;
		left: 10upx
	}

	.item-top-block .mall-name {
		font-size: 28upx;
		top: 28upx;
		left: 14upx;
		color: #151516;
		z-index: 1;
		line-height: 30upx;
	}

	.item-top-block .mall-name .mall-name-text {
		display: inline-block;
		overflow-x: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 488upx;
		vertical-align: middle;
		height: 30upx;
		line-height: 34upx
	}

	.item-top-block .mall-name .mall-arrow:after {
		content: "\E617";
		font-size: 9upx;
		color: #5f5f5f;
		font-family: icomoon;
		line-height: 1;
		font-weight: 400;
		-webkit-font-smoothing: antialiased;
		display: inline-block;
		margin-left: 5upx;
		position: absolute;
		top: 50%;
		margin-top: -4.5upx
	}

	.item-top-block .mall-name .order-status {
		font-size: 26upx;
		color: #e02e24;
		float: right;
		max-width: 318upx;
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
		height: 30upx;
		line-height: 30upx
	}

	.item-goods {
		height: 180upx;
		position: relative;
		padding: 14upx 0;
		background-color: #fff;
		overflow: hidden
	}

	.item-goods .goods-img {
		height: 154upx;
		width: 154upx;
		float: left;
		margin-right: 24upx;
		margin-left: 24upx;
		border-radius: 12upx;
	}

	.item-goods .goods-name {
		position: relative;
		font-size: 26upx;
		margin-right: 150upx;
		max-height: 114upx;
		overflow: hidden
	}

	.item-goods .goods-name p {
		color: #151516;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		line-height: 38upx;
		font-size: 26upx;
	}

	.item-goods .goods-name .goods-pre-sale {
		-webkit-line-clamp: 3
	}

	.item-goods .spec {
		color: #9c9c9c;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 440upx;
		font-size: 24upx
	}

	.item-goods .price-and-num {
		position: absolute;
		right: 11upx;
		top: 10upx;
		z-index: 1;
		text-align: right;
		font-size: 0
	}

	.item-goods .price-and-num .goods-price {
		font-size: 28.000000000000004upx;
		color: #151516;
		margin-bottom: 12upx
	}

	.item-goods .price-and-num .goods-price span {
		font-size: 13upx;
		line-height: 1
	}

	.item-goods .price-and-num .goods-number {
		font-size: 24upx;
		color: #9c9c9c
	}

	.currency-block {
		position: relative;
		/* width: 100%; */
		height: 80upx;
		line-height: 80upx;
		/* padding-right: 20upx; */
		margin: 0 20upx 0 14upx;
		text-align: right;
		color: #151516;
		font-size: 0
	}

	.currency-block:after {
		content: "";
		border-bottom: 1px solid #ededed;
		position: absolute;
		left: 0;
		width: 200%;
		height: 200%;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scale(.5);
		transform: scale(.5);
		box-sizing: border-box
	}

	.currency-block .coupon-icon {
		width: 11upx;
		height: 10upx;
		float: right;
		margin: 15upx 4upx 0 0;
		background: url(/assets/img/orders_sprites_v2.png) no-repeat;
		background-size: 196upx 190upx;
		background-position: 0 -50upx
	}

	.currency-block .currency-head {
		float: right;
		font-size: 24upx;
		margin-right: 4upx
	}

	.currency-block .currency-head span {
		margin: 0 2upx
	}

	.currency-block .currency-amount {
		float: right;
		font-size: 30upx;
		margin-right: 8upx
	}

	.currency-block .unpayed {
		color: #e02e24
	}

	.currency-block .currency-free {
		float: right;
		font-size: 24upx
	}

	.item-top-block .mall-name text {
		vertical-align: middle;
		color: #999;
		font-size: 26upx;
	}

	/* .button-block { */
	/* height: 90upx;改 */
	/* padding-top: 14upx */
	/* padding: 14upx 0;
	} */

	/* .orders-button {
		display:flex;
		flex-direction: row-reverse;
		justify-content: flex-start; */

	/* float: right;改 */
	/* font-size: 13upx
	} */

	/* .orders-button a {
		width: 150upx;
		height: 60upx;
		line-height: 60upx;
		color: #151516;
		background-color: #fff;
		margin-right: 20upx;
		border-radius: 8upx;
		position: relative; */
	/* float: right;改 */
	/* font-size: 28.000000000000004upx;
		text-align: center;
	} */

	.orders-button a:before {
		content: "";
		text-align: center;
		line-height: 60upx;

		border: 1px solid #9c9c9c;
		border-radius: 8upx;
		position: absolute;
		width: 200%;
		height: 200%;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scale(.5);
		transform: scale(.5);
		box-sizing: border-box;
		left: 0
	}

	.orders-button .timeout {
		background-color: #e0e0e0 !important
	}

	.orders-button .button-red {
		color: #fff;
		background-color: #e02e24
	}

	.orders-button .button-red:before {
		border: 0
	}

	/* .orders-button .button-blue {
		color: #fff; */
	/* background-color: #7bbefa; */
	/* background-color: #00A0EA;
	} */

	.orders-button .button-blue:before {
		border: 0
	}

	.type-cont .item {
		width: 18.93%;
		text-align: center;
		border-bottom: 4upx solid #fff;
		color: #999;
		padding: 12upx 0px;
	}
	
	.type-cont .item:first-child {
		border-top-left-radius: 24upx;
		border-bottom-left-radius:24upx;
	}
	
	.type-cont .item:last-child {
		border-top-right-radius: 24upx;
		border-bottom-right-radius: 24upx;
	}

	.type-cont .order-tab {
		width: 97%;
		margin: 0px auto 12upx;
		background: #fff;
		justify-content: space-around;
		border-radius: 20upx;
	}

	.type-cont .ac {
		/* border-color: #7bbfea; */
		border-color: #00a0ea;
		color: #333;
	}
</style>
