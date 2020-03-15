<template>
	<view class="index">
		
		<!-- 购物车 -->
		<shop-cart-btn />
		
		<view class="scroll-button bg-hdsh" v-if="!isInit" :class="isScrollShow ? 'scroll-ac' : 'scroll-unac'" @click="toTop()">
			<text class="font-icon">&#xe631;</text>
		</view>
		
		<view class="locat-bar">
			
			<view class="avatar-wrapper">
				<image v-if="JSON.stringify(get_userMsg) === '{}'" :src="default_photo" mode="aspectFit" />
				</image>
				<image v-if="JSON.stringify(get_userMsg) !== '{}' && wxavartar_flag === true" :src="get_userMsg.kw16" mode="aspectFit" />
				</image>
				<image v-if="JSON.stringify(get_userMsg) !== '{}' && wxavartar_flag === false" :src="$base.urlPrex + get_userMsg.kw16" mode="aspectFit" />
				</image>
			</view>
			
			<view @click="toCity" class="locat-min">{{area.shortname}}</view>
			<text @click="toCity" class="font-icon">&#xe642;</text>
			
			
			<view class="flex-cont search-input search-produc" @click="toMore">
				<input style="padding-left: 60upx;" type="text" placeholder="搜索" confirm-type="'search'" />
				<text class="font-icon search-icon">&#xe612;</text>
			</view>
		</view>
		
		<!-- <search-bar :isLoact="true"></search-bar> -->

		<view class="index-content">
			
			<view id="slider-index">
				<swiper 
					:indicator-dots="true" 
					:indicator-active-color="$PROP.hdsh_color" 
					:autoplay="true" 
					:interval="3000"
					:duration="500" 
					:circular="true">
					<swiper-item v-for="(x,index) in imgTop" :key="index">
						<view class="swiper-item">
							<image v-show="x.showFlag === true" @load="swiperLoad(index)" :src="x.url" mode="aspectFill"></image>
							<view v-show="x.showFlag === false" class="ske-swiper"></view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			
			<view class="new-pro-placeholder">
				<view class="title">
					<view>
						<text class="font-icon" style="color: #eb544d;">&#xe663;</text>
						<text>商品列表</text>
					</view>
					<div class="line">
						<view></view>
						<view></view>
						<view></view>
					</div>
					
					<view class="more-wrap">
						<text class="font-icon more" style="font-size: 30upx; margin-right: 0upx;">&#xe777;</text>
						<text class="more" @click="toMore">产品分类</text>
					</view>
				</view>
			</view>

			<view class="new-list">
				<view class="new-item" v-for="(x,index) in list" :key="index" @click="toShopDetail(x)">
					
					<image v-show="x.showFlag === true" :style="{ opacity: x.showFlag === true ? 1 : 0 }" @load="loadCompleteList(index)" :src="$base.urlPrex + x.photo[0]" mode="aspectFill"></image>
					<view class="list-skeleton" v-show="x.showFlag === false" style="height: 216upx; width: 100%; background-color: #ccc;"></view>
					
					<view class="item-bottom">
						<view class="name">
							<text v-show="x.showFlag === true">{{ x.name }}</text>
							<text v-show="x.showFlag === false" class="ske-name"></text>
						</view>
						
						<!-- <view>
							<text style="color: #a9a9a9; font-size: 24upx;">月销{{ parseInt(Math.random()*100) }}</text>
						</view> -->
						
						<view class="detail">
							<text class="price">
								<text v-show="x.showFlag === true">¥{{x.kw1}}</text>
								<text v-show="x.showFlag === false" class="ske-price"></text>
							</text>
							
							<!-- <text v-show="x.showFlag === true" @click.stop="add_cart(x)" class="add-cart">+</text> -->
							<text v-show="x.showFlag === true" @click.stop="add_cart(x)" class="font-icon add-cart">&#xe606;</text>
							<text v-show="x.showFlag === false" class="ske-cart"></text>
						</view>
					</view>
				</view>
			</view>
			
			<view id="shop-bottom-hint" class="bottom-hint">
				{{b_hint}}
			</view>
		</view>
		
		<uni-popup @change="skuPopChange" class="sku-list" ref="sku_pop" type="center">
			<view class="spu-name">{{ spuItem.name }}</view>
			<view>规格：</view>
			<view class="sku-list-wrapper">
				<view v-if="sku === null">
					暂无规格
				</view>
				<view v-else class="sku-item" v-for="item in sku" :key="item.id" @click="clickSku(item)" :class="{'sku-active': item.id === selectSku.id}">
					{{ item.name }}
				</view>
			</view>
			
			<view>数量：</view>
			<uni-number-box style="transform: scale(0.8); transform-origin: 0 0; margin-top: 10upx;" class="shop-number" @change="skuNumberChange" :value="1" :min="1" :max="99"></uni-number-box>
			
			<view style="display: flex; justify-content: flex-end;">
				<text @click="addCart" class="font-icon bg-hdsh" style="font-size: 32upx; color: #fff; border-radius: 50%; padding: 12upx;">&#xe655;</text>
			</view>
		</uni-popup>
		
		
		<view @click="cancel" class="shop-cart-shadow" v-show="shopCartShow === true" ></view>
		<view class="bottom-pop" :class="{ 'show': shopCartShow === true  }">
			<shopCartModel />
		</view>
			
	</view>
</template>

<script>
import shopCartBtn from '@/components/shop-cart-btn.vue'
import uniPopup from "@/components/uni-popup/uni-popup.vue"
import shopCartModel from '@/components/shop-cart-model.vue'

import { mapGetters, mapActions } from 'vuex';

export default {
	components: {
		shopCartBtn,
		uniPopup,
		shopCartModel
	},
	data() {
		return {
			shopCartShow: false,
			
			userDetail: global.$userDetail,
			default_photo: require("@/static/icon/default.png"),
			
			imgTop: [
				{
					url: 'https://apitest.nkshuju.com/Media/photo/15819938331371952069387/20200221/1582259761578252139505',
					showFlag: false
				},
				{
					url: 'https://apitest.nkshuju.com/Media/photo/15819938331371952069387/20200219/1582103089597928277603',
					showFlag: false
				}
			], //顶部轮播图
			// imgTitle: [newPro], //每个专区的标题
			list: [],
			locat: {}, //定位信息
			type: ['吃', '住', '游', '购', '娱'],
			b_hint: '到底啦~',
			area: '', //地区信息
			newNum: 9, //用于记录“新品推荐”模块剩余可查的商品数
			scrolls: 0, //滚动距离
			
			isScrollShow: false , //判断“回到顶部”按钮的显示状态
			isInit: true, //判断当前是否是初始化
			
			windowHeight: 0 ,//窗口高度
			
			sku: [],
			spuItem: {},
			
			selectSku: {}, // 选择到的规格
			skuNumber: 1 ,// 规格数量
			
			pageNumber: 1,
			serverPage: 0,
			pageSize: 9,
			
			timeNow: '',
			timeAfter: ''
		}
	},
	computed: {
		...mapGetters(['get_userMsg', 'wxavartar_flag'])
	},
	
	onLoad() {
		this.area = this.$areaMsg;
		uni.setNavigationBarTitle({
			title: this.$DEVELOPER.name
		})
		let a = uni.getSystemInfoSync()
		this.windowHeight = a.windowHeight
		
		let count = 0
		let timer = setInterval(() => {
			count++
			if(this.$DEVELOPER.token === '') {
				console.log('继续轮询查找')
			} else if (this.$DEVELOPER.token !== '') {
				clearInterval(timer)
				this.fetchShopList()
			} else if (count > 60) {
				clearInterval(timer)
			}
		}, 500)

	},
	onShow() {
		// #ifdef H5
		// this.$base.wxShare('', '', this.$base.linkFilter(window.location.href), '');
		// #endif
		
	},
	onPageScroll(obj) {
		if(obj.scrollTop > this.windowHeight){
			this.isInit = false
			this.isScrollShow = true
		}
		if(obj.scrollTop < this.windowHeight / 2){
			this.isScrollShow = false
		}
	},
	// 上拉加载
	onReachBottom() {
		this.pageNumber++
		
		if(this.pageNumber > this.serverPage) {
			return
		}
		
		this.fetchShopList()
	},
	onShow() {},
	methods: {
		...mapActions({
		    getCartList: "getCartList"
		}),
		cancel() {
			this.shopCartShow = false
			
			let body = document.getElementsByTagName('body')[0]
			
			body.style.position = ''
			body.style.overflow = ''
			
			let top = body.style.top
			
			document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
			
			body.style.top = ''
			
			uni.showTabBar({
				animation: true
			})
		},
		
		// 列表图片加载完毕
		loadCompleteList(index) {
			this.list[index].showFlag = true
		},
		
		swiperLoad(index) {
			this.imgTop[index].showFlag = true
		},
		
		clickSku(item) {
			this.selectSku = item
		},
		
		skuPopChange(e) { // 关闭规格弹窗的回调（清空键入值）
			if(e.show === false) {
				this.selectSku = {}
				this.skuNumber = 1
			}
		},
		
		skuNumberChange(e) {
			this.skuNumber = e
		},
			
		// 添加进入购物车
		addCart() {
			this.timeNow = Date.now()
			if (this.timeNow - this.timeAfter >= 2000) {
				this.timeAfter = this.timeNow
				uni.showLoading({
					title: '添入购物车..',
					mask: true
				});
			} else {
				console.log('重复添加')
				return
			}
			
			
			if (this.$userMsg.userid == null) { // 判断是否已登录
				this.$store.commit('set_page_data', {
					page: '/pages/tabBar/index/index',
				})
				uni.navigateTo({
					url: '/pages/component/login/login?m=null'
				});
			}
			
			if(JSON.stringify(this.selectSku) === '{}') {
				uni.showToast({
					mask: false,
					duration: 1500,
					title: '请选择规格！',
					icon: 'none'
				})
				return
			}
			
			
			let cartJson = {
				name: this.spuItem.name, //商品名
				fid: this.selectSku.id, //规格id
				cid: this.spuItem.id, //商品id
				kw0: this.selectSku.name, // 规格名称
				kw1: this.skuNumber, // 数量
				kw2: this.selectSku.kw0, // 加入购物车时规格的价钱
				photo: `["${this.selectSku.photo[0]}"]`, // 图片
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
						if(cartList[i].fid === this.selectSku.id) {
							
							cartList[i].kw1 = parseInt(cartList[i].kw1) + this.skuNumber
							
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
						"&state=" + this.$base.getState(), cartJson
					).then(res => {
						uni.showToast({
							icon: 'none',
							mask: false,
							title: '添加成功！'
						});
						
						this.getCartList()
						
						uni.hideLoading()
						this.$refs.sku_pop.close()
					})
				} else {
					this.$base.szblPost(
						"/api/carts?m=" + this.$userMsg.userid + 
						"&tk=" + this.$userMsg.token + 
						"&state=" + this.$base.getState(), cartJson
					).then(res => {
						uni.showToast({
							icon: 'none',
							mask: false,
							title: '添加成功！'
						});
						
						this.getCartList()
						
						uni.hideLoading()
						this.$refs.sku_pop.close()
					})
				}
			}).catch(err => {
				uni.hideLoading()
				console.log(err, '请求错误')
			})
		},
		
		add_cart(item) {
			this.spuItem = item
			this.$base.szblGet("/api/skus", {
				m: this.$DEVELOPER.szblid,
				tk: this.$DEVELOPER.token,
				state: this.$base.getState(),
				fid: item.id,
				psize: '7',
				pnum: '1',
				rpflag: this.$DEVELOPER.cid,
				labelid: '1010001',
				"areacode": this.$areaMsg.id,
			}).then(res => {
				if(res.data === null) {
					this.sku = null
				} else {
					this.sku = this.$base.strResToJson(res.data)
					this.selectSku = this.sku[0]
				}
				this.$refs.sku_pop.open()
			})
		},
		
		// 获取商品列表
		fetchShopList() {
			let obj = {
				"m": this.$DEVELOPER.szblid,
				"tk": this.$DEVELOPER.token,
				"state": this.$base.getState(),
				"pnum": this.pageNumber,
				"psize": this.pageSize,
				"querykeyword": '',
				"status": '2',
				"appid": this.$DEVELOPER.szblid,
				"rpflag": this.$DEVELOPER.cid,
				"areacode": this.$areaMsg.id,
				"labelid": '1009001'
			}
			
			this.$base.szblGet('/api/spus?', obj).then(res => {
				let r = this.$base.strResToJson(res.data)
				this.serverPage = res.pages
				r.map(item => {
					item.showFlag = false
					this.list.push(item)
				})
			})
		},
		
		//跳转至详情
		toShopDetail(x) {
			uni.navigateTo({
				url: '/pages/shopping/detailShop/detailShop?id=' + x.id
			});
		},
		
		toMore() {
			uni.switchTab({
				url: '/pages/shopping/productList/productList'
			});
		},
		
		// 返回顶部
		toTop(){
			uni.pageScrollTo({
				duration: 200,
				scrollTop: 0
			})
		},
		//跳转至地区选择页
		toCity() {
			uni.navigateTo({
				url: '/pages/component/citys/citys',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
	},
}
</script>

<style style="scss" scoped>
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
	
	
	.locat-bar text {
		font-size: 26upx;
	}
	
	.locat-bar {
		width: 20%;
		display: flex;
		align-items: center;
		color: #000;
		background-color: #fff;
		padding: 10upx 4upx 10upx 28upx;
		width: 100%;
		font-size: 30upx;
	}
	
	.locat-bar .font-icon {
		font-size: 34upx;
		margin-right: 14upx;
	}
	.locat-bar .avatar-wrapper {
		width: 80upx;
		height: 80upx;
		margin-right: 24upx;
	}
	.locat-bar .avatar-wrapper image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	
	.locat-bar .search-input{
		margin: 0upx;
		border-bottom: 0upx;
	}
	
	.locat-bar .flex-cont {
		width: 64%;
	}
	
	.locat-bar .search-input .search-icon {
		margin-right: 0upx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 36upx;
		left: 12upx;
	}
	
	
	@keyframes placeHolderShimmer {
		0% {
		    background-position: -468px 0
		}
		100% {
		    background-position: 350px 50px
		}
	}
	  
	.list-skeleton {
		animation-duration: 1s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: placeHolderShimmer;
		animation-timing-function: linear;
		background-color: #FFF;
		background-image: linear-gradient(to right, #eee 8%, rgba(141, 141, 141, 0.3) 18%, #eee 33%);
		background-repeat: repeat;
		background-size: 800px 104px;
	}
	
	.ske-swiper {
		width: 750upx;
		height: 380upx;
		display: block;
		background: #ccc;
		animation-duration: 1s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: placeHolderShimmer;
		animation-timing-function: linear;
		background-color: #FFF;
		background-image: linear-gradient(to right, #eee 8%, rgba(141, 141, 141, 0.3) 18%, #eee 33%);
		background-repeat: repeat;
		background-size: 800px 104px;
	}
	
	.ske-name {
		width: 100%;
		height: 50%;
		margin-top: 8upx;
		display: block;
		background: #ccc;
		animation-duration: 1s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: placeHolderShimmer;
		animation-timing-function: linear;
		background-color: #FFF;
		background-image: linear-gradient(to right, #eee 8%, rgba(141, 141, 141, 0.3) 18%, #eee 33%);
		background-repeat: repeat;
		background-size: 800px 104px;
	}
	
	.ske-cart {
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: block;
		background: #ccc;
		animation-duration: 1s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: placeHolderShimmer;
		animation-timing-function: linear;
		background-color: #FFF;
		background-image: linear-gradient(to right, #eee 8%, rgba(141, 141, 141, 0.3) 18%, #eee 33%);
		background-repeat: repeat;
		background-size: 800px 104px;
	}
	
	.ske-price {
		display: block;
		width: 80upx;
		height: 28upx;
		display: block;
		background: #ccc;
		animation-duration: 1s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: placeHolderShimmer;
		animation-timing-function: linear;
		background-color: #FFF;
		background-image: linear-gradient(to right, #eee 8%, rgba(141, 141, 141, 0.3) 18%, #eee 33%);
		background-repeat: repeat;
		background-size: 800px 104px;
	}
	
	swiper {
		width: 100%;
		height: 380upx;
	}

	.swiper-item {
		width: 100%;
		display: flex;
		justify-content: center;
		background: #F7F7F7;
	}

	.swiper-item image {
		width: 750upx;
		height: 380upx;
	}
	
	.index-content {
		position: relative;
		height: var(--status-bar-height);
	}

	.swiper-pagination-bullet-active {
		background: #ff5943 !important;
	}

	.ititle span {
		width: 50%;
		text-align: right;
		font-size: .26rem;
		padding-right: .3rem;
	}

	.ititle h3 {
		padding-left: 9.33%;
		background-size: 4% auto;
		font-size: .28rem;
		width: 100%;
	}

	.ititle {
		height: .72rem;
		line-height: .72rem;
		margin-top: .1rem;
	}
	

	.navi {
		display: flex;
		width: 750upx;
		/* 海岛生活配置 */
		height: 260upx;
		background: #fff;
		justify-content: space-around;
		align-items: center;
	}

	.navi-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.navi-item image:first-child {
		width: 33upx;
		height: 26upx;
	}

	.navi-item image:nth-child(2) {
		width: 112upx;
		height: 112upx;
		margin: 12upx 0 14upx 0;
	}

	.navi-item text {
		color: #666666;
		font-size: 24upx;
	}

	.new-pro-placeholder {
		background: #fff;
		margin-top: 12upx;
		position: relative;
	}
	
	.new-pro-placeholder .title {
		display: flex;
		flex-direction: column;
		font-size: 32upx;
		text-align: center;
		padding: 16upx 20upx;
		align-items: center;
	}
	
	.new-pro-placeholder .title .line {
		width: 50%;
		display: flex;
		justify-content: space-between;
		border-bottom: 0upx;
		margin-top: 8upx;
	}
	
	.new-pro-placeholder .title .line > view:first-child {
		width: 8upx;
		height: 8upx;
		background-color: #eb544d;
		border-radius: 50%;
	}
	
	.new-pro-placeholder .title .line > view:nth-child(2) {
		width: 90%;
		height: 8upx;
		background-color: #eb544d;
		border-radius: 20upx;
	}
	.new-pro-placeholder .title .line > view:nth-child(3) {
		width: 8upx;
		height: 8upx;
		background-color: #eb544d;
		border-radius: 50%;
	}
	
	.new-pro-placeholder .title .font-icon {
		font-size: 42upx;
		margin-right: 16upx;
	}

	.new-pro-placeholder image {
		height: 66upx;
		width: 222upx;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}

	.new-list {
		width: 100%;
		background: #FFFFFF;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.new-item {
		width: 30%;
		border-radius: 10upx;
		box-shadow: 0upx 20upx 28upx #eee;
		margin-bottom: 30upx;
		padding-bottom: 8upx;
		overflow: hidden;
	}

	.new-item image {
		opacity: 0;
		width: 100%;
		height: 216upx;
		transition: all .3s;
	}

	.item-bottom {
		
	}

	.item-bottom .name {
		height: 80upx;
		color: #222;
		font-size: 28upx;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		padding: 0 7upx;
	}

	.item-bottom .detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 19upx;
	}

	.item-bottom .detail .price {
		color: #eb544d;
		font-size: 32upx;
		font-weight: bold;
		margin-left: 17upx;
	}
	
	.item-bottom .detail .add-cart {
		color: #eb544d;
		margin-right: 8upx;
		font-size: 48upx;
	}

	.item-bottom .detail .sales {
		margin-right: 23upx;
		font-size: 18upx;
		color: #a9a9a9;
	}

	.more-wrap {
		background-color: #eb544d;
		border-radius: 10px;
		color: #fff;
		align-self: flex-end;
		padding: 0upx 12upx;
		display: flex;
		align-items: center;
	}

	.more {
		font-size: 24upx;
	}
	
	
	.index .uni-popup.sku-list .uni-popup__wrapper-box .spu-name {
		text-align: center;
		color: #8d8d8d;
		font-size: 32upx;
	}
	
	.index .uni-popup.sku-list .uni-popup__wrapper-box .sku-list-wrapper {
		display: flex;
		flex-wrap: wrap;
		margin-top: 16upx;
	}
	
	.index .uni-popup.sku-list .uni-popup__wrapper-box .sku-list-wrapper .sku-item{
		margin-right: 12upx;
		padding: 4upx 28upx;
		margin-bottom: 20upx;
		border: 2upx solid #8d8d8d;
		border-radius: 8upx;
	}
	
	.index .uni-popup.sku-list .uni-popup__wrapper-box .sku-list-wrapper .sku-item.sku-active {
		background-color: rgba(235, 84, 77, 0.1);
		border: 1px solid rgba(235,84,77, 1);
		color: rgba(235,84,77, 1);
	}
	
	.scroll-button {
		position: fixed;
		right: -60upx;
		bottom: 440upx;
		z-index: 1;
		height: 60upx;
		width: 60upx;
		line-height: 60upx;
		border-radius: 50%;
		text-align: center;
		border: 1px solid #eee;
		color: #FFFFFF;
	}
	
	.scroll-ac{
		animation: scroll-btn-show .6s;
		right: 20upx;
	}
	
	.scroll-unac{
		animation: scroll-btn-hide .6s;
		right: -60upx;
	}
	
	@keyframes scroll-btn-show{
		from{
			right: -60upx;
		}
		to{
			right: 20upx;
		}
	}
	
	@keyframes scroll-btn-hide{
		from{
			right: 20upx;
		}
		to{
			right: -60upx;
		}
	}
</style>
