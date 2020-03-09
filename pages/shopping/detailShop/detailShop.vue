<template>
	<!-- 商品详情 -->
	<view class="app-init">
		<!-- 购物车 -->
		<shop-cart-btn />
		<swiper :indicator-dots="true" :indicator-active-color="$PROP.hdsh_color" :autoplay="true" :interval="3000" :duration="500"
		 :circular="true">
			<swiper-item v-for="(x,index) in detail.photo" :key="index">
				<view class="swiper-item">
					<image :src="$base.urlPrex + x" mode="'widthFix'"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="shop-top">
			<view class="g-desc">
				<h2>{{detail.name}}</h2>
			</view>
			
			<view class="g-price" style="display: flex;">
				<text class="money" v-if="detail.kw4 == detail.kw1">¥{{detail.kw4}}</text>
				<text class="money" v-else>¥{{detail.kw1}} - {{detail.kw4}}</text>
			</view>
			
			<!-- <view class="g-delivery-cost-hint" v-if="freight"><span>{{freiRemarks}}</span>
			</view>
			
			<view class="g-delivery-cost-hint" v-else>
				<span>{{'免运费'}}</span>
			</view> -->
			
			<view class="shop-map" v-if="detail.address">
				<a style="display: block;">
					<h3>{{detail.address}}</h3>
				</a>
			</view>
		</view>
		<!-- 商店 -->
		<!-- <view class="store-wrap" @click="toStore()"> -->
		<view class="store-wrap">
			<view class="store-info">
				<image :src="store_photo" />{{detail.kw0}}
			</view>
			
			<view class="store-call">
				<text class="font-icon">&#xe79a;</text>
			</view>
		</view>
		<view id="goods-reviews-module" class="goods-reviews-container" v-if="comment_list.length">
			<view class="goods-reviews-header">
				<a>
					<view class="goods-reviews-title">
						<view class="goods-reviews-num">
							商品评价
							<span>({{comment_list.length}})</span>
						</view>
						
					</view>
				</a>
			</view>
			<!-- totest -->
			<view class="goods-reviews-list">
				<view class="reviews-item" v-for="(x,index) in comment_list" :key="index" v-if="index<4">
					<view class="reviews-item-title">
						<image :src="x.kw2 ? x.kw2 : default_img" :mode="'widthFix'"></image>
						<span class="reviews-item-name">{{x.name}}</span>
						<!-- <view class="" > -->
						<uni-icons type="star-filled" v-for="(star,sindex) in x.kw1" :key="sindex" size="24" :color="$PROP.hdsh_color"
						 class="reviews-stars"></uni-icons>
						<!-- </view> -->
						<span class="reviews-item-time">{{x.createtime}}</span>
					</view>
					<view class="reviews-item-content">{{x.kw3}}</view>
				</view>
			</view>
		</view>
		<view class="shop-detail" v-if="detail.htmldata">
			<h3>商品详情</h3>
			<!-- <text class="goods-details-desc" :selectable="false" :space="'nbsp'">{{detail.remarks}}</text> -->
			<!-- <rich-text class="goods-details-desc" :nodes="detail.remarks"></rich-text> -->
			<!-- <rich-text class="detail-html" :nodes="detail.htmldata"></rich-text> -->
			<!-- #ifdef H5 -->
			<view class="detail-html" v-html="detail.htmldata"></view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<u-parse :content="detail.htmldata"></u-parse>
			<!-- #endif -->
		</view>
		<view class="bottom-hint">
			到底啦~
		</view>
		<view class="fix-mall-btn">
			<view class="fix-mall-index fl">
				<a @click="backToIndex">
					<text class="font-icon">&#xe68a;</text>
					<text>主页</text>
				</a>
				<a @click="customer">
					<text class="font-icon">&#xe604;</text>
					<text>客服</text>
				</a>
			</view>
				<view class="fix-buy-btn-wrap fr">
				<view class="bg-hdsh-light btn" @click="skuPupToggle(true)">
					添加购物车
				</view>
			<!-- 	<view class="bg-hdsh btn" @click="skuPupToggle(false)">
					立即购买
				</view> -->
			</view>
		</view>
		<view class="sku-selector-bg" v-show="skuPup" @click="skuPupToggle">
			<view class="sku-selector-main sku-selector-main-show">
				<view class="sku-selector-container" @click.stop>
					<view class="sku-selector-head">
						<image :src="$base.urlPrex + sku_photo"></image>
						<view class="sku-selector-head-content">
							<view class="sku-selector-price">
								¥{{price}}
								<span class="origin-price" v-if="act_type != ''">¥{{origin_price}}</span>
							</view>
							<view class="sku-selector-desc">库存剩余：{{sku_kw2}}</view>
						</view>
						<view class="sku-selector-close-btn" @click="skuPupToggle"></view>
					</view>
					<view id="sku-selector-body" class="">
						<view class="sku-specs"><span class="sku-specs-key">规格</span>
							<view class="sku-spec-value-list">
								<span class="sku-spec-value" v-for="(x,index) in sku" :key="index" @click="skuClick(x,index)" :class="{'bg-hdsh color-white':index == sku_index}">{{x.name}}</span>
							</view>
						</view>
		
						<view class="sku-selector-number change-number">
							<span>数量</span>
							<uni-number-box @change="numChange($event)" :min="1" :max="max_shop"></uni-number-box>
						</view>
						<text v-if="detail.kw10 == 1">本商品支持线下自提</text>
					</view>
					<view class="sku-selector-bottom bg-hdsh" @click="confirm"><a>添加</a></view>
				</view>
			</view>
		</view>
		
		
		
		<view @click="cancel" class="shop-cart-shadow" v-show="shopCartShow === true" ></view>
		<view class="bottom-pop" :class="{ 'show': shopCartShow === true  }">
			<shopCartModel />
		</view>
	</view>
</template>

<script>
	import {
		mapMutations, mapActions
	} from "vuex";
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uParse from "@/components/gaoyia-parse/parse.vue"
	import uniIcons from '@/components/uni-icon/uni-icon.vue'
	
	import shopCartBtn from '@/components/shop-cart-btn.vue'
	import shopCartModel from '@/components/shop-cart-model.vue'
	
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniNumberBox,
			uParse,
			uniIcons,
			shopCartBtn,
			uniPopup,
			shopCartModel
		},
		data() {
			return {
				shopCartShow: false,
				id: '', //商品id
				detail: {},
				comment_list: [],
				default_img: require('@/static/icon/default.png'),
				skuPup: false, //规格选择框弹出状态
				photo: "", //轮播图
				store: "", //店铺
				store_photo: require("@/static/icon/default.png"),
				sku: "",
				price_arr: [], //现价列表
				origin_price_arr: [], //原价列表
				price: "", //当前显示的现价
				origin_price: "", //当前显示的原价
				sku_cont: "请选择 规格", //规格名
				sku_photo: "", //规格图
				sku_id: '',
				sku_index: -1, //规格下标
				sku_kw2: '',
				shop_num: 1, //购买数量
				max_shop: 10, //最大购买量
				// stime: "", //认购时间,已废弃
				collect: false,
				store_name: "",
				discount: '0.', //折扣
				cheapen: 0, //减价
				surplus: 0, //剩余量
				retData: {}, //店铺详情
				act: {}, //活动
				act_type: '', //活动类型
				act_list: [], //活动列表
				act_choosed: '', //当前选中活动
				freight: false, //运费模板
				freiRemarks: '', //运费模板简介 
				actCouponList: [], //正在被显示的优惠券列表
				couponIndex: 0, //正在被显示的优惠券的下标
				hackReset: true, //用于强制刷新子组件的状态
			};
		},
		onLoad(obj) {
			this.loadShopDetial(obj.id);
			
			this.id = obj.id;
		},
		methods: {
			...mapActions({
			    getCartList: "getCartList"
			}),
			
			cancel() {
				this.shopCartShow = false
				document.getElementsByTagName('body')[0].style.overflow = ''
				uni.showTabBar({
					animation: true
				})
			},
			
			/**
			 * 商品数量
			 * @param {Number} value 数量
			 */
			numChange(value) {
				this.shop_num = value;
			},
			
			//查商品
			loadShopDetial(id) {
				this.$base.szblGet("/api/spus/" + id, {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState()
				}).then(res => {
					this.detail = this.$base.strResToJson(res.data)
					this.sku_photo = this.detail.photo[0]
					
					//查运费模板
					// this.$base.szblGet("/api/templates/", {
					// 	"m": this.$DEVELOPER.szblid,
					// 	"tk": this.$DEVELOPER.token,
					// 	"state": this.$base.getState(),
					// 	"pnum": 1,
					// 	"psize": 1,
					// 	"appid": this.$DEVELOPER.szblid,
					// 	"id": this.detail.kw5,
					// 	rpflag: this.$DEVELOPER.cid,
					// 	"areacode": '460100',
					// }).then(freiRes => {
					// 	let r = this.$base.strResToJson(freiRes.data)
					// }).catch((msg) => {
					// 	console.log(msg, '运费查询报错')
					// 	return
					// })
					
					// 查商品规格
					return this.$base.szblGet("/api/skus", {
						m: this.$DEVELOPER.szblid,
						tk: this.$DEVELOPER.token,
						state: this.$base.getState(),
						fid: this.detail.id,
						psize: '7',
						pnum: '1',
						rpflag: this.$DEVELOPER.cid,
						labelid: '1010001',
						"areacode": this.$areaMsg.id,
					})
					
				}).then(res => {
					let sku = this.$base.strResToJson(res.data)
					this.sku = sku
				}).catch((msg) => {
					console.log(msg);
				})
			},
			/**
			 * 查评论
			 * @param {String} id 商品id
			 */
			loadComm(id) {
				this.$base.szblGet("/api/scctc", {
						m: this.$DEVELOPER.szblid,
						tk: this.$DEVELOPER.token,
						state: this.$base.getState(),
						fid: id,
						status: 0,
						psize: 10,
						pnum: 1,
						rpflag: this.$DEVELOPER.cid,
						// areacode: this.$base.getQueryAreaCode(this.$areaMsg.id)
					}).then(res => {
						if (res.data) {
							this.comment_list = this.$base.strResToJson(res.data);
							// console.log(this.comment_list);
							for (var i = 0; i < this.comment_list.length; i++) {
								if (this.comment_list[i].name.length == 11) {
									this.comment_list[i].name = this.comment_list[i].name.substr(0, 2) + "***" + this.comment_list[i].name.substr(
										10, 3);
								}
								this.comment_list[i].createtime = this.comment_list[i].createtime.substr(0, 10)
								this.comment_list[i].kw1 = parseInt(this.comment_list[i].kw1)
								if (this.comment_list[i].kw3 == '') {
									this.comment_list[i].kw3 = '买家未及时作出评价，系统默认好评！'
								}
								if (this.comment_list[i].kw2 == '' || this.comment_list[i].kw2 == []) {
									this.comment_list[i].kw2 = ''
								} else {
									this.comment_list[i].kw2 = this.comment_list[i].kw2[0]
								}
							}
						} else {

						}
					})
					.catch((err) => {
						console.log(err);
						return;
					});
			},
			// 查店铺
			loadShop() {
				this.$base.szblGet("/api/scshop/" + this.detail.unit, {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState()
				}).then(dataJson => {
					this.retData = this.$base.strResToJson(dataJson.data);
					if (this.retData.kw6 != "" && this.retData.kw6.indexOf('失败') == -1) {
						var temp_photo = this.$base.strResToJson(this.retData.kw6);
						this.store_photo = this.$base.urlPrex + temp_photo[0];
					}
					this.store_name = this.retData.name;
					this.store = this.retData;
				}).catch((msg) => {
					console.log(msg);
					return;
				});
			},
			/**
			 * 修改规格弹出框显示状态
			 * @param {Boolean} bool
			 */
			skuPupToggle(bool) {
				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/detailShop/detailShop?id=' + this.id,
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
					return false;
				}
				this.isAddCart = bool;
				!this.skuPup ? (this.skuPup = true) : (this.skuPup = false);
			},
			/**
			 * 规格点击方法
			 * @param {Object} x 规格
			 * @param {Number} index 规格下标
			 */
			skuClick(x, index) {
				this.price = x.kw0
				this.sku_cont = x.name;
				this.sku_photo = x.photo[0];
				this.sku_index = index;
				this.sku_id = x.id
				this.sku_kw2 = x.kw2
			},
			//原价显示
			noActPrice() {
				if (this.origin_price_arr.length > 1) {
					this.origin_price_arr.sort((a, b) => a - b)
					if (this.origin_price_arr[0] < this.origin_price_arr[this.origin_price_arr.length - 1]) {
						// console.log(1);
						this.price = this.origin_price_arr[0] + "-" + this.origin_price_arr[this.origin_price_arr.length - 1];
					} else {
						// console.log(2);
						this.price = this.origin_price_arr[this.origin_price_arr.length - 1] + "-" + this.origin_price_arr[0];
					}
				} else {
					this.price = this.sku[0].kw0;
				}
			},
			
			// 添加进入购物车
			confirm() {
				if (this.isAddCart) {
					if (this.sku_id == '') {
						uni.showToast({
							mask: false,
							duration: 1500,
							title: '请选择规格！',
							icon: 'none'
						})
						return
					}
					let obj = {
						name: this.detail.name, //商品名
						fid: this.sku_id, //规格id
						cid: this.detail.id, //商品id
						kw0: this.sku_cont,
						kw1: this.shop_num, //数量
						kw2: this.price, //加入时规格的价钱
						kw3: 0, // 运费
						photo: `["${this.sku_photo}"]`, //图片
						createuserid: this.$userMsg.userid, //用户id
						rpflag: this.$DEVELOPER.cid,
						appid: this.$DEVELOPER.szblid,
						areacode: this.$areaMsg.id,
						areaname: this.$areaMsg.name,
						labelid: '1014002',
					}
					
					this.$base.szblGet('/api/carts', {
						m: this.$userMsg.userid,
						tk: this.$userMsg.token,
						pnum: 1,
						psize: 99,
						state: this.$base.getState(),
						createuserid: this.$userMsg.userid,
						rpflag: this.$DEVELOPER.cid,
						appid: this.$DEVELOPER.szblid,
						areacode: this.$areaMsg.id,
						labelid: '1014002'
					}).then(res => {
						if(res.data !== null) {
							let cartList = this.$base.strResToJson(res.data)
							
							for(let i = 0; i < cartList.length; i++) {
								if(cartList[i].fid === this.sku_id) {
									
									cartList[i].kw1 = parseInt(cartList[i].kw1) + this.shop_num
									
									// 发送修改购物车数量接口
									this.$base.szblPut(`/api/carts/${cartList[i].id}
										?m=${this.$userMsg.userid}
										&tk=${this.$userMsg.token}
										&state=${this.$base.getState()}
										&appid=${this.$DEVELOPER.szblid}`, cartList[i]
									).then(
										res => {
											uni.showToast({
												icon: 'none',
												mask: false,
												title: '添加成功！'
											});
											!this.skuPup ? (this.skuPup = true) : (this.skuPup = false);
											this.getCartList()
											
											this.$refs.sku_pop.close()
											uni.hideLoading()
										err => {
											console.log(err)
										}
									})
									return
								}
							}
							
							this.$base.szblPost(
								"/api/carts?m=" + this.$userMsg.userid + 
								"&tk=" + this.$userMsg.token + 
								"&state=" + this.$base.getState(), obj
							).then(res => {
								uni.showToast({
									icon: 'none',
									mask: false,
									title: '添加成功！'
								});
								!this.skuPup ? (this.skuPup = true) : (this.skuPup = false);
								this.getCartList()
								
								uni.hideLoading()
								this.$refs.sku_pop.close()
							})
						} else {
							this.$base.szblPost(
								"/api/carts?m=" + this.$userMsg.userid + 
								"&tk=" + this.$userMsg.token + 
								"&state=" + this.$base.getState(), obj
							).then(res => {
								uni.showToast({
									icon: 'none',
									mask: false,
									title: '添加成功！'
								});
								!this.skuPup ? (this.skuPup = true) : (this.skuPup = false);
								this.getCartList()
								
								uni.hideLoading()
								this.$refs.sku_pop.close()
							})
						}
					}).catch(err => {
						uni.hideLoading()
						console.log(err, '请求错误')
					})
				}
			},
			// 到支付页
			goPay() {
				// todo
				// if (this.stime == "已结束") {
				//   this.$layer.msg("商品认购时间已结束");
				//   return false;
				// } else 
				//登录提示
				if (this.detail.kw3 < 1) {
					uni.showToast({
						title: '商品已购完 , 请选择其他商品',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				} else if (this.detail.kw3 < this.shop_num) {
					uni.showToast({
						title: '该商品最多购买' + this.shop_num + this.detail.kw7,
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				if (this.sku_cont == "请选择 规格") {
					uni.showToast({
						title: '请选择规格',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				
				// 筛选已选择的优惠券
				let coupon = []
				this.actCouponList.forEach(item =>{
					if(item.isGet){
						coupon.push(item)
					}
				})

				this.$store.commit('set_pay_data', {
					origin_price: this.origin_price, //所购买规格的原价
					price: this.price, //所购买规格的现价
					coupon: coupon, //所购买规格参加的所有优惠券
					act_choosed: this.act_choosed, //现选中的活动
					shop_num: this.shop_num,
					sku_cont: this.sku_cont,
					sku_photo: this.sku_photo.slice(this.sku_photo.indexOf("/Media")),
					shop: this.detail.kw0,
					name: this.detail.name,
					kw10: this.detail.kw10, //是否支持自提
					kw7: this.detail.kw7,
					kw3: parseInt(this.detail.kw3),
					kw1: this.store.kw2,
					id: this.detail.id,
					kw0: this.detail.kw0,
					unit: this.detail.unit,
					store_name: this.store_name,
					mark: "shop", //标记位
					// freight: this.detail.kw18 ? this.detail.kw18 : 0,
					freight_id: this.detail.kw18 ? this.detail.kw18 : '', //运费模板id
					store_phone: this.retData.kw2,
					store_id: this.retData.id,
					jsondata: this.sku_id
				});

				uni.navigateTo({
					url: '/pages/shopping/payShop/payShop'
				})

			},
			// 返回首页
			backToIndex() {
				uni.switchTab({
					url: "/pages/tabBar/index/index"
				})
			},
			// 修改收藏状态
			toggleCollect() {
				//登录判断
				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						// page: '/pages/shopping/detailShop/detailShop?id=' + this.id,
						page: '/pages/shopping/detailShop/detailShop?id=' + this.id,
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
					return false;
				}
				// console.log(this.collect)
				if (this.collect == false) {
					this.addCollect();
				} else {
					this.delCollect();
				}
			},
			addCollect() {
				var data = {
					fid: this.$userMsg.userid,
					cid: this.id,
					gid: "0",
					status: "2",
					rpflag: this.$DEVELOPER.cid,
					// appid: this.$base.appid
				};
				this.$base.szblPost("/api/scpace?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" + this.$base
					.getState(), data).then(res => {
						this.collect = true;
					}).catch((msg) => {
					console.log(msg);
					return;
				});
			},
			delCollect() {
				this.$base.szblDel("/api/scpace/" + this.id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token +
					"&state=" + this.$base.getState(), null).then(res => {
					this.collect = false;
				}).catch((msg) => {
					console.log(msg);
					return;
				});
			},
			// 客服
			customer() {
				// uni.navigateTo({
				// 	url: '/pages/shopping/userService/userService'
				// })
				
				uni.showModal({
					content: "请拨打电话 " + this.detail.kw8 + " 联系我们",
					showCancel: true,
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if(res.cancel === true) {
							return
						} else {
							uni.makePhoneCall({
							    phoneNumber: this.detail.kw8 //仅为示例
							});
						}
					}
				})
				
				// uni.showToast({
				// 	title: '请关注“海岛生活”微信公众号联系人工客服~',
				// 	mask: false,
				// 	duration: 1500,
				// 	icon: 'none'
				// })
			},
			toStore() {
				uni.navigateTo({
					url: '/pages/shopping/store/store?id=' + this.detail.unit + '&m=1',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 控制弹出层的弹出
			openCouponPopup() {
				this.$refs.popup.open()
			},
			/**
			 * 领取优惠券
			 * @param {String} id 优惠券id
			 * @param {Number} index 下标
			 */
			getCoupon(coupon, index) {
				if (coupon.isGet) {
					return
				}
				uni.showLoading({
					mask: true
				})
				this.$base.szblPost('/api/screla?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this.$base
					.getState(), {
						objectid: this.$userMsg.userid,
						relationid: coupon.id,
						gid: 2
					}).then(res => {
					console.log(this.$base.strResToJson(res.data));
					this.hackReset = false
					this.$nextTick(() => {
						this.$set(this.actCouponList[index], 'isGet', true)
						this.hackReset = true
					})
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '领取成功！',
						duration: 1500,
						mask: false
					})
				}).catch(msg => {
					uni.hideLoading()
					console.log(msg);
					if (msg == '该关联关系已经添加过了!!') {
						uni.showToast({
							icon: 'none',
							title: '您已领取过此优惠券了',
							duration: 1500,
							mask: false
						})
					}
				})
			},
			/**
			 * 查询该优惠券是否被领取过
			 * @param {Object} list 被选中规格的优惠券数组
			 * @param {Number} index 下标
			 */
			checkCoupon(list, index) {
				list.forEach((item, index) => {
					if(index == 0){ // 在一开始就展示Loading
						uni.showLoading({
							mask: true
						})
					}
					this.$base.szblGet('/api/screla/listCoupon', {
						m: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState(),
						objectid: this.$userMsg.userid,
						relationid: item.id,
						status: 0,
						psize: 100,
						pnum: 1
					}).then(res => {
						if (this.$base.strResToJson(res.data).length != 0) {
							item.isGet = true
						} else {
							item.isGet = false
						}
						
						if(index == list.length - 1){
							uni.hideLoading()
							this.actCouponList = list
						}
					}).catch(msg => {
						uni.hideLoading()
						console.log(msg);
					})
				})
			}
			// 			// #ifndef APP-PLUS
			// 			...mapMutations(["set_pay_data"])
			// 			// #endif
		},
		// 		computed:{
		// 			...mapMutations(["set_pay_data"])
		// 		}
	}
</script>

<style scoped>
	.shop-cart-shadow {
		background-color: rgba(0,0,0,.4);
		height: 100vh;
		width: 100vw;
		position: fixed;
		z-index: 1;
		bottom: 0px;
	}
	.bottom-pop {
		transform: translateY(100vh);
		position: fixed;
		bottom: 0px;
		z-index: 2;
		transition: all .3s;
		width: 100vw;
	}
	.bottom-pop.show {
		transform: translateY(0);
		display: block;
		width: 100vw;
	}
	
	swiper {
		/* width: 100%; */
		width: 750upx;
		/* height: auto; */
		/* min-height: upx; */
		/* height: 480upx; */
		height: 750upx;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		background: #F7F7F7;
	}

	.swiper-item image {
		width: 100%;
		height: auto;
	}

	.app-init {
		min-height: 100vh;
		width: 100%;
		/* border: 1upx solid #000000; */
		display: flex;
		flex-direction: column;
		position: absolute;
	}

	.g-price text {
		float: right;
	}

	.g-delivery-cost-hint {
		display: flex;
		color: #999;
		font-size: 24upx;
		margin-bottom: 2upx;
		line-height: 1;
		padding: 0 24upx 20upx;
		justify-content: space-between;
	}

	.shop-top .g-desc h2 {
		font-weight: normal;
		font-size: 28upx;
		padding: 0;
		margin-top: 25upx;
	}

	.g-price {
		margin: 10upx 0 40upx;
	}

	.g-price {
		padding: 0 40upx 10upx 20upx;
	}

	.g-price .money {
		font-size: 36upx;
		color: #e02e24;
		font-family: arial;
	}

	.store-call {
		border: none;
	}

	.store-call i {
		font-size: 30upx;
		font-weight: bold;
		color: #999;
	}

	.store-info {
		font-size: 28upx;
	}

	.change-number {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.coupon-detail {
		background: #00a0ea6E;
		color: #fff;
		padding: 10upx 10upx 10upx 20upx;
	}

	/* .coupon-list {}

	.coupon-item {}

	.coupon {
		width: 670upx;
		height: 168upx;
		border-radius: 10upx;
		display: flex;
		position: relative;
		background: #7bbfea6E;
		overflow: hidden;
	}

	.coupon:after,
	.coupon:before {
		content: '';
		position: absolute;
		height: 20upx;
		width: 20upx;
		background: #fff;
		border-radius: 10upx;
		right: 168upx;
	}

	.coupon:before {
		top: -10upx
	}

	.coupon:after {
		bottom: -10upx
	}

	.tear-line {
		width: 2upx;
		height: 100%;
		background-image: linear-gradient(to bottom, #000 0%, #000 50%, transparent 50%);
		background-size: 2upx 12upx;
		background-repeat: repeat-y;
	}

	.coupon-left {
		width: 504upx;
		display: flex;
		flex-direction: column;
		padding-left: 20upx;
		justify-content: center;
	}

	.coupon-left text:nth-child(2) {
		color: #999;
		font-size: 26upx;
	}

	.coupon-left text:last-child {
		font-size: 16upx;
	}

	.coupon-right {
		width: 180upx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.coupon-right text {
		position: absolute;
		display: block;
		padding: 4upx 20upx;
		border: solid 2upx #00a0ea;
		border-radius: 40upx;
		color: #00a0ea;
	}

	.m-t-10 {
		margin-top: 20upx;
	} */

	/* rich-text{
		width: 50%;
	} */

	/* .fix-mall-index a {
		padding: 0;
		line-height: 60upx;
		height: 60upx;
		margin: 20upx 0;
	}
	
	.fix-mall-btn {
		line-height: 10upx;
		height: 10upx;
	} */

	/* .fix-mall-index i {
		display: inline-block;
		vertical-align: middle;
		background: none;
		width: auto;
		height: auto;
		color: #666;
		font-size: 40upx;
	}
	
	.fix-buy-btn {
		height: calc(10upx + 2upx);
		line-height: inherit;
	} */
</style>
