<template>
	<!-- 产品列表页的容器 -->
	<view class="product-list">
		
		<shop-cart-btn />
		
		<view class="top-wrap">
			<!-- 搜索 -->
			<view class="search-bar">
				<view class="flex-cont search-input search-produc">
					<input type="text" placeholder="搜索" confirm-type="'search'" @confirm="search" v-model="kw" />
					<text class="font-icon search-icon">&#xe612;</text>
					<text class="font-icon delete-icon" @click="fetchShopList(null)" v-show="deleteButton">&#xe67f;</text>
				</view>
				<text class="search-btn bg-hdsh" @click="search">搜索</text>
				
			</view>
			
		</view>


		<view class="index-content">
			<view class="list-wrap">
				<!-- 一级菜单 -->
				<view class="first-menu">
					<view class="item" :class="{'active': selFirst === index}" v-for="(item, index) in labels" :key="item.id" @click="selectLabel(item, index)">
						{{ item.name }}
					</view>
				</view>
				
				<view class="new-list">
					<!-- 二级菜单 -->
					<view class="second-menu">
						<view class="item" :class="{'active': selSecond === index}" v-for="(item, index) in labelsTow" :key="item.id" @click="selectLabelTow(item, index)">
							{{ item.name }}
						</view>
					</view>
					
					<view class="shoplist" ref="viewBox" @scroll="scroll" v-show="list.length > 0">
						<view class="new-item" v-for="(x,index) in list" :key="index" @click="toShopDetail(x)">
							
							<image @load="loadCompleteList(index)" :src="$base.urlPrex + x.photo[0]" mode="aspectFill"></image>
							<!-- <image v-show="x.showFlag === true" @load="loadCompleteList(index)" :src="$base.urlPrex + x.photo[0]" mode="aspectFill"></image> -->
							<!-- <view class="list-skeleton" v-show="x.showFlag === false" style="height: 216upx; width: 100%; background-color: #ccc;"></view> -->
							
							<view class="item-bottom">
								<view class="name">
									<text>{{ x.name }}</text>
									<!-- <text v-show="x.showFlag === true">{{ x.name }}</text> -->
									<!-- <text v-show="x.showFlag === false" class="ske-name"></text> -->
								</view>
								
								<view class="detail">
									<text class="price">
										<text>¥{{x.kw1}}</text>
										<!-- <text v-show="x.showFlag === true">¥{{x.kw1}}</text> -->
										<!-- <text v-show="x.showFlag === false" class="ske-price"></text> -->
									</text>
									
									<!-- <text @click.stop="add_cart(x)" class="add-cart">+</text> -->
									<text @click.stop="add_cart(x)" class="font-icon add-cart">&#xe606;</text>
									<!-- <text v-show="x.showFlag === true" @click.stop="add_cart(x)" class="add-cart">+</text> -->
									<!-- <text v-show="x.showFlag === false" class="ske-cart"></text> -->
								</view>
							</view>
						</view>
					</view>
					
					<view class="nonelist" v-show="list.length == 0">
						暂无此类商品~
					</view>
					
					
				</view>
			</view>
		</view>
		
		
		<uni-popup @change="skuPopChange" class="sku-list" ref="sku_pop" type="center">
			<view class="spu-name">{{ spuItem.name }}</view>
			<view>规格：</view>
			<view class="sku-list-wrapper">
				<view v-if="sku === null">
					暂无规格
				</view>
				<view class="sku-item" v-for="item in sku" :key="item.id" @click="clickSku(item)" :class="{'sku-active': item.id === selectSku.id}">
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
	import { mapGetters, mapActions } from 'vuex';
	
	import shopCartBtn from '@/components/shop-cart-btn.vue'
	import shopCartModel from '@/components/shop-cart-model.vue'
	
	
	export default {
		components: {
			shopCartBtn,
			shopCartModel
		},
		data() {
			return {
				shopCartShow: false,
				
				selFirst: 0,
				selSecond: 0,
				
				isDelay: false, //防止模态框滑动期间用户反复操作
				isUnAc: false, //分类选择框是否不打开（初始化用）
				showShop: false, //显示的是否是商品
				showHotel: false, //显示的是否是民宿
				showCate: false, //显示的是否是美食
				showPlay: false, //显示的是否是门票
				isActive: 0, //商品时，被选中的排序方式的下标
				isPrice: '', //价格排列的顺序，up-升序，down-降序
				isSort: false, //控制分类选择框的打开状态
				leftList: [], //分类选择框的左侧分类
				rightList: [], //分类选择框的右侧分类
				leftIndex: -1, //被选中左侧分类的下标
				rightIndex: 0, //被选中右侧分类的下标
				pathShop: '/api/spu',
				
				shopMark: false, //判断是否需要置空列表： true-置空，false-不置空
				
				timeout: '', //定时器
				topSort: '购', //顶部类型的显示内容
				topSortList: ["购", "游", "宿", "食"], //海岛生活配置,顶部类型列表的可选内容
				// topSortList: [ "游", "购","宿", "食"],  //清溪商城配置
				topSortIndex: 0, //被选中顶部类型列表的下标
				topSortClicked: false, //判断顶部类型列表是否显示
				sortName: '全部分类', //当前分类名
				kw: '', //搜索关键词
				page_num: 0, //分页数
				
				list: [],
				
				sku: [],
				spuItem: {},
				
				selectSku: {}, // 选择到的规格
				skuNumber: 1 ,// 规格数量
				
				pageNumber: 1,
				serverPage: 0,
				pageSize: 12,
				labels: [],
				labelsTow: [],
				
				
				box: '',
				deleteButton: false
			};
		},
		/**
		 * @param {Object} obj obj.kw-搜索关键词，obj.ob-商品排序方式，obj.id-当前要展示哪种类型的产品
		 */
		onLoad(obj) {
			this.fetchShopList()
			this.fetchLabels()
		},
		
		
		onShow() {
			
		},
		
		// 上拉加载
		onReachBottom() {
			this.pageNumber++
			
			if(this.pageNumber > this.serverPage) {
				return
			}
			
			this.fetchShopList()
		},
		watch: {
			
		},
		methods: {
			...mapActions({
			    getCartList: "getCartList"
			}),
			scroll() {
				if(this.$refs.viewBox.$el.scrollTop === this.$refs.viewBox.$el.scrollHeight - this.$refs.viewBox.$el.offsetHeight) {
					this.pageNumber++
					this.fetchShopList('', 'pageAdd')
				}
				// console.log(this.$refs.viewBox.$el.scrollTop)
				// console.log(this.$refs.viewBox.$el.clientHeight)
			},
			
			selectLabelTow(item, index) {
				this.selSecond = index
				let obj = {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					"pnum": 1,
					"psize": 99,
					"status": '2',
					"cid": item.id,
					"querykeyword": '',
					"appid": this.$DEVELOPER.szblid,
					"rpflag": this.$DEVELOPER.cid,
					"areacode": this.$areaMsg.id,
					"labelid": '1009001'
				}
				
				this.$base.szblGet('/api/spus?', obj).then(res => {
					
					if(res.data === null) { // 如果没有结果
						this.list = []
						return
					}
					
					let r = this.$base.strResToJson(res.data)
					this.list = r
					
					this.serverPage = res.pages
					
				})
			},
			
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
			
			// 获取分类
			fetchLabels() {
				
				this.$base.szblGet('/api/labels', {
					m: this.$DEVELOPER.szblid,
					tk: this.$DEVELOPER.token,
					state: this.$base.getState(),
					pnum: '0',
					psize: '0',
					fid: '2',
					gid: '1016',
				}).then(res => {
					this.labels = this.$base.strResToJson(res.data)
					
					this.selectLabel(this.labels[0], 0)

				}).catch(err => {
					console.log(err)
				})
			},
			
			selectLabel(item, index) {
				this.selFirst = index
				this.$base.szblGet('/api/labels', {
					m: this.$DEVELOPER.szblid,
					tk: this.$DEVELOPER.token,
					state: this.$base.getState(),
					pnum: '0',
					psize: '0',
					fid: '3',
					gid: item.id,
				}).then(res => {
					this.labelsTow = this.$base.strResToJson(res.data)
				}).catch(err => {
					console.log(err)
				})
			},
			
			// 列表图片加载完毕
			loadCompleteList(index) {
				this.list[index].showFlag = true
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
							this.$refs.sku_pop.close()
						})
					}
				}).catch(err => {
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
			
			toShopDetail(x) {
				uni.navigateTo({
					url: '/pages/shopping/detailShop/detailShop?id=' + x.id
				});
			},
			
			search() {
				this.fetchShopList(this.kw)
			},
			
			fetchShopList(kw, str) {
				if(str === 'pageAdd' && this.serverPage < this.pageNumber) {
					uni.showToast({
						title: '到底啦~',
						icon: 'none'
					})
					return
				}
				
				if(kw === null) {
					this.kw = ''
				}
				
				
				
				let obj = {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					"pnum": 1,
					"psize": 99,
					"status": '2',
					"querykeyword": this.kw,
					"appid": this.$DEVELOPER.szblid,
					"rpflag": this.$DEVELOPER.cid,
					"areacode": this.$areaMsg.id,
					"labelid": '1009001'
				}
				
				this.$base.szblGet('/api/spus?', obj).then(res => {
					if(res.data === null) { // 如果没有结果
						this.list = []
						return
					}
					
					let r = this.$base.strResToJson(res.data)
					
					if(str === 'pageAdd') {
						r.map(item => {
							this.list.push(item)
						})
					} else {
						this.list = r
					}
					
					if(kw !== null) { // 显示删除键
						this.deleteButton = true
					} else if (kw === null) {
						this.deleteButton = false
					}
					
					this.serverPage = res.pages
				})
			},
			
			back() {
				uni.navigateBack({
					delta: 1
				})
			}
		},
		
	}
</script>

<style scoped>
	@keyframes placeHolderShimmer {
		0% {
		    background-position: -468px 0
		}
		100% {
		    background-position: 350px 50px
		}
	}
	
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
	
	.index-content {
		position: relative;
		height: var(--status-bar-height);
	}

	.placeholder {
		position: relative;
		height: 80upx;
	}

	.placeholder-shop {
		height: 160upx;
	}

	.product-list .top-wrap {
		/* #ifndef MP-WEIXIN */
		position: fixed;
		top: var(--status-bar-height);
		/* #endif */
		width: 375px;
		z-index: 999;
	}

	.search-bar {
		background: #FFFFFF;
		height: 80upx;
		/* position: fixed; */
		top: var(--status-bar-height);
		width: 750upx;
		z-index: 5;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: flex-end;
	}

	.shai .wrap-li {
		padding: 20upx 0;
		width: 20%;
		text-align: center;
	}

	.shai {
		background: #fff;
		border-top: 2upx solid #EDEDED;
		margin-bottom: 10upx;
		height: 80upx;
		/* position: fixed; */
		top: 80upx;
		width: 750upx;
		z-index: 5;
	}

	.shai .wrap-li view {
		border-left: 2upx solid #d7d7d7;
	}

	.shai .wrap-li text {
		font-size: 27upx;
	}

	.shai .wrap-li:first-child view {
		border: none;
	}

	.shai .sort-wrap {
		/* height: 76vh; */
		background: #fff;
		z-index: 1;
		width: 750upx;
		/* display: none; */
		height: 0;
	}

	.shai .sort-wrap scroll-view {
		width: 375upx;
		/* padding-left: 30upx; */
	}

	.shai .sort-wrap scroll-view:first-child {
		background: #F2F2F4;
	}

	@keyframes scroll-bot {
		from {
			height: 0;
		}

		to {
			height: 70vh;
		}
	}

	@keyframes scroll-top {
		from {
			height: 70vh;
		}

		to {
			height: 0;
		}
	}

	.sort-ac {
		display: flex !important;
		position: absolute;
		z-index: 4;
		animation: scroll-bot .6s;
		height: 70vh !important;
	}

	.sort-unac {
		animation: scroll-top .6s;
		height: 0;
	}

	.list-wrap {
		padding-top: 80upx;
		display: flex;
	}
	
	.list-wrap > .first-menu {
		background-color: #ededed;
		width: 20%;
	}
	
	.list-wrap > .first-menu > .item{
		padding: 16upx 0px;
		text-align: center;
		color: rgba(95, 95, 95, .6);
		transition: all .3s;
	}
	
	.list-wrap > .first-menu > .item.active{
		color: rgb(95, 95, 95);
		background-color: #fafafa;
		height: auto;
		padding: 16upx 0px;
		text-align: center;
	}

	@keyframes overlay-bloom {
		from {
			background-color: rgba(0, 0, 0, 0);
		}

		to {
			background-color: rgba(0, 0, 0, 0.8);
		}
	}

	@keyframes overlay-fade {
		from {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-color: rgba(0, 0, 0, 0.8);
		}

		to {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			/* z-index: -1; */
			background-color: rgba(0, 0, 0, 0);
		}
	}

	.overlay {
		position: fixed;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */

		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .8);
		animation: overlay-bloom 1s;
	}

	.overlay-fade {
		animation: overlay-fade 1s;
	}

	.sort-item {
		height: 80upx;
		padding-left: 60upx;
		display: flex;
		align-items: center;
		/* margin: 30upx 0 0 30upx; */
	}

	.sort-bg-ac {
		background: #FFFFFF;
	}

	.search-bar .search-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 66upx;
		width: 105upx;
		margin-right: 15upx;
		color: #fff;
		/* background: #7bbfea; */
		/* background: #00A0EA; */
		border-radius: 8upx;
	}

	.search-produc {
		position: relative;
		width: 604upx !important;
		border-bottom: none !important;
	}

	.search-produc input {
		padding-left: 60upx;
		border-radius: 0 10upx 10upx 0;
	}

	.back-btn {
		margin-left: 20upx;
	}

	.choose-top-sort {
		border: 2upx solid #f2f2f4;
		border-right: none;
		width: 140upx;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	.top-sort-icon {
		position: relative !important;
		left: auto !important;
		top: auto !important;
	}

	.top-sort-list {
		/* border: 2upx solid #f6f6f6; */
		height: 200upx;

		/* top: var(--status-bar-height); */
		/* #ifdef APP-PLUS */
		top: 124upx;
		width: 144upx;
		/* left: 15upx; */
		left: 72upx;
		border: 2upx solid #f2f2f4;
		border-top: none;
		/* #endif */


		/* #ifndef APP-PLUS */
		top: 72upx;
		width: 140upx;
		left: 14upx;
		/* #endif */
		z-index: 9;
		background: #fff;
		position: fixed;
		visibility: hidden;
	}

	.top-sort-list-ac {
		/* animation: sort-scroll-bot 1s; */
		/* height: 200upx !important; */
		visibility: visible;
	}

	@keyframes sort-scroll-bot {
		from {
			height: 0;
		}

		to {
			height: 200upx;
		}
	}

	@keyframes sort-scroll-top {
		from {
			height: 200upx;
		}

		to {
			height: 0;
		}
	}
	
	.new-list {
		width: 80%;
	}
	
	.new-list > .second-menu {
		display: flex;
		white-space: nowrap;
		padding-bottom: 20upx;
		margin-top: 20upx;
		margin-left: 16upx;
		overflow-x: auto;
	}
	
	.new-list > .second-menu >.item {
		background-color: #ededed;
		padding: 8upx 18upx;
		border-radius: 20upx;
		color: #5f5f5f;
		margin-right: 8upx;
		font-size: 24upx;
	}
	
	.new-list > .second-menu >.item.active {
		background-color: #f7d9d7;
		padding: 8upx 18upx;
		border-radius: 20upx;
		color: #eb544d;
		margin-right: 8upx;
		font-size: 24upx;
		height: auto;
		overflow: initial;
		vertical-align: initial;
	}
	
	.new-list > .shoplist {
		display: flex;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		height: 87vh;
		overflow-y: auto;
		padding-bottom: 40px;
	}
	
	.new-list > .nonelist {
		display: flex;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		height: 81vh;
		overflow-y: auto;
		align-items: center;
	}
	
	.new-item {
		width: 45%;
		height: fit-content;
		border-radius: 10upx;
		box-shadow: 0upx 20upx 28upx #eee;
		margin-bottom: 30upx;
		padding-bottom: 8upx;
		overflow: hidden;
		background-color: #fff;
	}
	
	.new-item image {
		width: 100%;
		height: 216upx;
	}
	
	.search-bar .search-input uni-text.delete-icon {
		font-size: 32upx;
		position: absolute;
		right: 12upx;
		left: initial;
		top: 20upx;
	}
	
	.item-bottom .name {
		height: 55upx;
		font-size: 20upx;
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


	.top-sort-item {
		height: 50upx;
		text-align: center;
		line-height: 50upx;
	}

	.top-sort-item-ac {
		background: #00a0ea;
		color: #fff;
	}
	
	
	.product-list .uni-popup.sku-list .uni-popup__wrapper-box .spu-name {
		text-align: center;
		color: #8d8d8d;
		font-size: 32upx;
	}
	
	.product-list .uni-popup.sku-list .uni-popup__wrapper-box .sku-list-wrapper {
		display: flex;
		flex-wrap: wrap;
		margin-top: 16upx;
	}
	
	.product-list .uni-popup.sku-list .uni-popup__wrapper-box .sku-list-wrapper .sku-item{
		margin-right: 12upx;
		padding: 4upx 28upx;
		margin-bottom: 20upx;
		border: 2upx solid #8d8d8d;
		border-radius: 8upx;
	}
	
	.product-list .uni-popup.sku-list .uni-popup__wrapper-box .sku-list-wrapper .sku-item.sku-active {
		background-color: rgba(235, 84, 77, 0.1);
		border: 1px solid rgba(235,84,77, 1);
		color: rgba(235,84,77, 1);
	}
</style>