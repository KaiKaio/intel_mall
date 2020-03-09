<template>
	<!-- 套票详情 -->
	<view class="app-init">
		<swiper :indicator-dots="true" :indicator-active-color="$PROP.hdsh_color" :autoplay="true" :interval="3000"
		 :duration="500" :circular="true">
			<swiper-item v-for="(x,index) in detail.photo" :key="index">
				<view class="swiper-item">
					<image :src="x" mode="'widthFix'"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="shop-top">
			<view class="g-desc">
				<h2>{{detail.name}}</h2>
			</view>
			<view class="g-price">
				<span class="fl money">¥{{detail.kw1}}</span>
				<span class="fl original">¥{{detail.kw4}}</span>
				<text v-if="!collect" class="font-icon" @click="toggleCollect">&#xe601;</text>
				<text v-else class="font-icon" style="color:#00A0EA" @click="toggleCollect">&#xe869;</text>
			</view>
			<!-- <view class="g-delivery-cost-hint" v-if="freight"><span>{{freiRemarks}}</span>
			</view> -->
			<!-- <view class="g-delivery-cost-hint" v-else><span>{{'免运费'}}</span> -->
			<!-- </view> -->
			<view class="shop-map" v-if="detail.address">
				<a style="display: block;">
					<h3>{{detail.address}}</h3>
				</a>
			</view>
		</view>
		<!-- 商店 -->
		<view class="store-wrap" @click="toStore()">
			<view class="store-info">
				<image :src="store_photo" />{{detail.kw0}}
			</view>
			<!-- <view class="store-call">
				<text class="font-icon">&#xe79a;</text>
			</view> -->
		</view>
		<view id="goods-reviews-module" class="goods-reviews-container" v-if="comment_list.length">
			<view class="goods-reviews-header">
				<a>
					<view class="goods-reviews-title">
						<view class="goods-reviews-num">
							商品评价
							<span>({{comment_list.length}})</span>
						</view>
						<!-- <span v-if="comment_list.length>2" @click="$router.openPage('/commentList/'+detail.id)" class="goods-reviews-more">查看全部</span> -->
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
							<uni-icons type="star-filled" v-for="(star,sindex) in x.kw1" :key="sindex"  size="24" :color="$PROP.hdsh_color" class="reviews-stars"></uni-icons>
						<!-- </view> -->
						<span class="reviews-item-time">{{x.createtime}}</span>
					</view>
					<view class="reviews-item-content">{{x.kw3}}</view>
				</view>
			</view>
		</view>
		<view class="shop-detail" v-if="detail.htmldata">
			<h3>商品详情</h3>
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
		<!--固定在底部的按钮@click="toMember"-->
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
			<view class="fix-buy-btn fr bg-hdsh">
				<a @click="goPay">立即购买</a>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,mapGetters
	} from "vuex";
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uParse from "@/components/gaoyia-parse/parse.vue"
	import uniIcons from '@/components/uni-icon/uni-icon.vue'
	export default {
		components: {
			uniNumberBox,
			uParse,
			uniIcons
		},
		data() {
			return {
				id: '', //商品id
				detail: {},
				comment_list: [],
				default_img: require('@/static/icon/default.png'),
				photo: "",
				store: "",
				store_photo: require("@/static/icon/logo-noname.png"),
				price_arr: [], //现价列表
				origin_price_arr: [], //原价列表
				price: "",
				origin_price: "",
				shop_num: 1, //购买数量
				collect: false,
				store_name: "",
				surplus: 0, //余量
				retData: {}, //店铺详情
			};
		},
		computed:{
			...mapGetters(['get_package_list_data'])
		},
		onLoad(obj) {
			this.loadPackageDetail(obj.id);
			this.loadComm(obj.id);
			this.id = obj.id;
		},
		methods: {
			//查套票
			loadPackageDetail(id) {
				this.$base.szblGet("/api/scpose/" + id, {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
				}).then(res => {
					let detail = this.$base.strResToJson(res.data);
					this.detail = detail;
					console.log(detail);
					this.max_shop = parseInt(this.detail.kw3);
					this.detail.photo = this.$base.strResToJson(this.detail.photo);
					this.photo = this.detail.photo[0]
					for (var i = 0; i < this.detail.photo.length; i++) {
						this.detail.photo[i] = this.$base.urlPrex + this.detail.photo[i]
					}
					// this.photo = this.detail.photo;
					this.surplus = parseInt(this.detail.kw3) - parseInt(this.detail.kw2)

					if (this.detail.remarks == null) {
						this.detail.remarks = "";
					}
					// console.log(this.detail)
					
					
					//#ifdef H5
					// this.$base.wxShare("【清溪商城套票】" + this.detail.name, this.detail.remarks, this.$base.linkFilter(window.location.href),
					this.$base.wxShare("【" + this.$DEVELOPER.name + "套票】" + this.detail.name, this.detail.remarks, this.$base.linkFilter(window.location.href),
						this.detail.photo[0]);
					
					//#endif
				}).catch((msg) => {
					console.log(msg);
				})
			},
			// 查评论
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
						console.log(this.$base.strResToJson(res.data));
						if (res.data) {
							this.comment_list = this.$base.strResToJson(res.data);
							for (var i = 0; i < this.comment_list.length; i++) {
								if (this.comment_list[i].name.length == 11) {
									this.comment_list[i].name = this.comment_list[i].name.substr(0, 3) + "***" + this.comment_list[i].name.substr(
										8, 3);
								}
								if(this.comment_list[i].kw2 == '' || this.comment_list[i].kw2 == []){
									this.comment_list[i].kw2 = ''
								}else{
									this.comment_list[i].kw2 = this.comment_list[i].kw2[0]
								}
							}
						} else {

						}
						// console.log(this.comment_list);
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
				}).then((dataJson) => {
					// console.log(this.$base.strResToJson(dataJson.data));
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
			goPay() {
				//登录提示
				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/detailPackage/detailPackage?id=' + this.id,
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
					});
					return false;
				}
				if (this.detail.kw3 < 1) {
					uni.showToast({
						title: '套票已售罄 , 请选择其他商品购买',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				} else if (this.detail.kw3 < this.shop_num) {
					uni.showToast({
						title: '该套票最多购买' + this.shop_num + this.detail.kw7,
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				
				// console.log(this.detail);

				this.$store.commit('set_package_data', {
					name: this.detail.name, //产品标题
					// querykeyword: this.detail.name + ",清溪商城",
					querykeyword: this.detail.name + "," + this.$DEVELOPER.name,
					cid: this.detail.id, //产品id
					gid: 7, //订单类型
					kw0: '', //
					kw1: this.detail.kw8, //商店电话
					kw4: this.detail.kw1, //总金额
					kw5: 1, //数量
					kw6: '', //收货人
					kw7: '', //收货人电话
					kw8: '', //付款方式
					kw12: 0, //是否自提
					kw18: 0, //运费
					photo: this.photo,
					address: '',
					unit: 'haidaoshenghuo', //商店id
				});

				uni.navigateTo({
					url: '/pages/shopping/payPackage/payPackage'
				})

			},
			// 返回首页
			backToIndex() {
				uni.switchTab({
					url: "/pages/tabBar/index/index"
				})
			},
			toggleCollect() {
				//登录后无法同步收藏数据
				//登录判断

				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/detailPackage/detailPackage?id=' + this.id,
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
					});
					return false;
				}
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
					.getState(), data).then(res =>  {
						//返回处理
						this.collect = true;
					}).catch((msg) => {
					console.log(msg);
					return;
				});
			},
			delCollect() {
				this.$base.szblDel("/api/scpace/" + this.id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token +
					"&state=" + this.$base.getState(), null).then(res => {
					//处理
					this.collect = false;
				}).catch((msg) => {
					console.log(msg);
					return;
				});
			},
			customer() {
				uni.showToast({
					title: '请关注“海岛生活”微信公众号联系人工客服~',
					mask: false,
					duration: 1500,
					icon: 'none'
				})
			}
		},
	}
</script>

<style scoped>
	swiper {
		width: 750upx;
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
	
	.original{
		color: #605E5E;
		text-decoration: line-through;
		font-size: 20upx;
		margin-left: 20upx;
	}
</style>
