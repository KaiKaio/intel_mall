<template>
	<view class="product-list">
		<!-- 
		<view class="top-wrap">
			<view class="search-bar">
				<view class="flex-cont search-input search-produc">
					<input type="text" placeholder="搜索" confirm-type="'search'" @confirm="search" v-model="kw" />
					<text class="font-icon search-icon">&#xe612;</text>
					<text class="font-icon delete-icon" @click="fetchShopList(null)" v-show="deleteButton">&#xe67f;</text>
				</view>
				<text class="search-btn bg-hdsh" @click="search">搜索</text>
				
			</view>
		</view> -->
		
		<view style="
			border-radius: 24upx;
			display: flex; 
			justify-content: space-between;
			margin: 12upx auto;
			background-color: #fff;
			width: 97%;">
			<view style="transition: all .3s; border-top-left-radius: 24upx; border-bottom-left-radius: 24upx; width: 50%; padding: 12upx 0px; text-align: center;" :style="{backgroundColor: selTab === 0 ? '#eb544d' : '', color: selTab === 0 ? '#fff' : ''}" @click="selTab = 0">商品</view>
			<view style="transition: all .3s; width: 50%; padding: 12upx 0px; text-align: center;" :style="{backgroundColor: selTab === 1 ? '#eb544d' : '', color: selTab === 1 ? '#fff' : ''}" @click="selTab = 1">订单</view>
			<view style="transition: all .3s; border-top-right-radius: 24upx; border-bottom-right-radius: 24upx; width: 50%; padding: 12upx 0px; text-align: center;" :style="{backgroundColor: selTab === 2 ? '#eb544d' : '', color: selTab === 2 ? '#fff' : ''}" @click="selTab = 2">配送管理</view>
		</view>
		
		<view class="index-content" v-if="selTab === 0">
			<view class="list-wrap">
				<view class="new-list">
					
					<view class="shoplist" ref="viewBox" @scroll="scroll" v-show="list.length > 0">
						<view style="position: relative;" class="new-item" v-for="(x,index) in list" :key="index">
							
							<view
								v-if="x.sticktop == '1'" 
								style="
								padding: 0upx 14upx;
								border-radius: 10upx;
								z-index: 1;
								background-color: #eb544d;
								text-align: center;
								position: absolute;
								color: #fff;
								font-size: 24upx;
								right: 0px;
								top: 0upx;">推荐</view>
							
							<image @load="loadCompleteList(index)" :src="$base.urlPrex + x.photo[0]" mode="aspectFill"></image>							
							<view class="item-bottom">
								<view class="name">
									<text>{{ x.name }}</text>
								</view>
								
								<view class="detail">
									<text class="price">
										<text>¥{{x.kw1}}</text>
									</text>
									<text @click.stop="editItem(x)" class="font-icon add-cart">&#xe698;</text>
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
			<view class="spu-name">编辑商品</view>
			
			<view>
				<text class="form-label">状态：</text>
				<radio-group class="form-radio" style="display: flex; margin-top: 8upx;" @change="changeStatus">
					<label class="radio-item" style="margin-right: 28upx; display: flex;">
						<view class="radio-icon" style="display: flex;">
							<radio :checked="spuItem.status === 1" value="1" />
						</view>
						<view>下架</view>
					</label>
					<label class="radio-item" style="margin-right: 28upx; display: flex;">
						<view class="radio-icon">
							<radio :checked="spuItem.status === 2" value="2" />
						</view>
						<view>上架</view>
					</label>
				</radio-group>
			</view>
			
			<view class="form-item">
				<text class="form-label">商品名称：</text>
				<input class="form-item-input" type="text" v-model="spuItem.name" />
			</view>
			
			<view class="form-item">
				<text class="form-label">计数单位：</text>
				<input class="form-item-input" type="text" v-model="spuItem.kw7" />
			</view>
			
			<view class="form-item">
				<text class="form-label">咨询电话：</text>
				<input class="form-item-input" type="text" v-model="spuItem.kw8" />
			</view>
				
			<view class="form-item">
				<text class="form-label">产品图片：</text>
				<view class="upload-wrapper">
					<template v-for="(item, index) in spuItem.photo">
						<view class="upload-item" v-if=" spuItem.photo instanceof Array " :key="item">
							<view class="idcard-img" :style="{ backgroundImage: `url(${ $base.urlPrex + item })` }">
								<view class="delete-img" @click="deleteImg(item, index)">x</view>
							</view>
						</view>
					</template>
					
					<view class="upload-area" @tap="onUploadPhoto">+</view>
				</view>
			</view>
				
			<view>
				<view>规格：</view>
				<view 
					class="sku-item" 
					v-for="(item, index) in sku" 
					:key="item.id" 
					style="
						display: flex; 
						border: 2upx solid #ccc; 
						border-radius: 6upx; 
						margin-bottom: 8upx; 
						align-items: center;">
					
					<view
						style="margin-right: 20upx; 
						height: 160upx; 
						width: 160upx; 
						background-repeat: no-repeat; 
						background-position: center;
						background-size: cover;"
						class="idcard-img" 
						:style="{ backgroundImage: `url(${ $base.urlPrex + item.photo[0] })` }"
					>
					</view>
					
					<view>
						<view>名称：{{ item.name }}</view>
						<view>库存：{{ item.kw2 }}</view>
						<view>价格：{{ item.kw0 }}</view>
					</view>
					
					 <view style="margin-right: 12upx; margin-left: auto;" @click="editSku(item, index)">编辑</view>
					
				</view>
					
			</view>
			
			
			
			<view style="display: flex; justify-content: flex-end;">
				<text @click="submitEdit" class="font-icon bg-hdsh" style="font-size: 32upx; color: #fff; border-radius: 50%; padding: 12upx;">&#xe698;</text>
			</view>
			
			<uni-popup class="sku_edit" ref="sku_edit" type="center">
				<view style="text-align: center; font-size: 28upx; color: #bbb; margin-bottom: 24upx;">编辑规格</view>
				<view style="display: flex; margin-bottom: 20upx">
					<text style="width: 30%; text-align: right;">规格名称：</text>
					<input style="border-radius: 4px;
						height: 52upx;
						background-color: #eee;
						border: 1px solid #ccc;
						font-size: 14px;
						padding: 0px 8px;
						width: 70%;" type="text" v-model="editSkuItem.name" />
				</view>
				<view style="display: flex; margin-bottom: 20upx">
					<text style="width: 30%; text-align: right;">库存：</text>
					<input style="border-radius: 4px;
						height: 52upx;
						background-color: #eee;
						border: 1px solid #ccc;
						font-size: 14px;
						padding: 0px 8px;
						width: 70%;" type="text" v-model="editSkuItem.kw2" />
				</view>
				
				<view style="background-color: #EB544D; padding: 8upx 0upx; border-radius: 8upx; width: 20%; color: #fff; text-align: center;" @tap="submitSkuEdit">保存</view>
			</uni-popup>
			
		</uni-popup>
		
		
		<orderList v-if="selTab === 1" />
		<delivePerson v-if="selTab === 2" />
		
		
	</view>
</template>

<script>
	import { mapGetters, mapActions, mapState } from 'vuex';
	import lrz from 'lrz'
	
	import orderList from './order.vue'
	import delivePerson from './delivePerson.vue'
	
	export default {
		components: {
			orderList,
			delivePerson
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
				
				editSkuItem: {},
				
				box: '',
				deleteButton: false,
				
				selTab: 0
			};
		},
		
		computed: {
			...mapState({
			    unit_data: state => state.zhsq.unit_data
			})
		},
		
		/**
		 * @param {Object} obj obj.kw-搜索关键词，obj.ob-商品排序方式，obj.id-当前要展示哪种类型的产品
		 */
		onLoad(obj) {
			uni.setNavigationBarTitle({
				title: this.unit_data.name
			})
			
			
			this.selTab = obj.status / 1
			
			if(this.selTab === 0) {
				this.fetchShopList()
			}
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
			},
			
			submitSkuEdit() { // 提交规格编辑
				uni.showLoading()
				this.$base.szblPut('/api/skus/' + this.editSkuItem.id +
					'?m=' + this.$userMsg.userid +
					'&tk=' + this.$userMsg.token + 
					'&state=' + this.$base.getState() +
					'&appid=' + this.$DEVELOPER.szblid, {
						name: this.editSkuItem.name,
						kw2: this.editSkuItem.kw2,
						appid: this.$DEVELOPER.szblid,
						querykeyword: this.editSkuItem.name + ',' + this.spuItem.name,
						id: this.editSkuItem.id
					}
				).then(res => {
					uni.showToast({
						title: '修改成功'
					})
					this.editItem(this.spuItem)
					this.$refs.sku_edit.close()
					uni.hideLoading()
				}).catch(err => {
					uni.showToast({
						title: err
					})
					uni.hideLoading()
					console.log(err)
				})
			},
			
			// 编辑规格
			editSku(item ,index) {
				uni.showLoading()
				let res = JSON.parse(JSON.stringify(item)) 
				this.editSkuItem = res
				this.$refs.sku_edit.open()
				uni.hideLoading()
			},
			
			onUploadPhoto() {
				uni.chooseImage({
				    count: 1,
				    sizeType: ['original', 'compressed'],
				    sourceType: ['album'],
				    success: (res) => {
				        // 预览图片
						lrz(res.tempFilePaths[0], {
							width: 750,
							quality: 0.8
						}).then((rst) => {
							let tempPhoto = {
								photo: '',
								len: ''
							};
							
							tempPhoto.photo = rst.base64;
							tempPhoto.len = rst.base64Len;
							
							uni.showToast({
								icon: 'loading',
								mask: true,
								duration: 50000
							});
							
							return this.$base.szblPost(
								"/api/media/img" +
								"?u=" + this.$userMsg.userid +
								"&tk=" + this.$userMsg.token +
								"&state=" + this.$base.getState(), [tempPhoto]
							)
						}).then((res) => {
							let r = this.$base.strResToJson(res.data)
							this.spuItem.photo.push(r[0])
							uni.hideToast()
						}).catch((err) => {
							console.log(err);
							return;
						});
						
				    }
				});
			},
			
			deleteImg(item, index) {
				uni.showModal({
					title: '',
					content: '您确定删除此证件照吗?',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							this.spuItem.photo.splice(index, 1)
						}
						if (res.cancel) {
							return
						}
					}
				})
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
					"labelid": '1009001',
					"unit": this.unit_data.id
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
			
			changeStatus(e) {
				this.spuItem.status = e.detail.value
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
			
			// 提交编辑
			submitEdit() {				
				this.$base.szblPut('/api/spus/' + this.spuItem.id +
					'?m=' + this.$userMsg.userid +
					'&tk=' + this.$userMsg.token + 
					'&state=' + this.$base.getState() +
					'&appid=' + this.$DEVELOPER.szblid, this.spuItem
				).then(res => {
					uni.showToast({
						title: '修改成功'
					})
					this.fetchShopList()
					this.$refs.sku_pop.close()
				}).catch(err => {
					uni.showToast({
						title: err
					})
					console.log(err)
				})
			},
			
			editItem(item) {
				this.spuItem = this.$base.strResToJson(JSON.stringify(item))
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
				uni.showLoading()
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
					"m": this.$userMsg.userid,
					"tk": this.$userMsg.token,
					"state": this.$base.getState(),
					"pnum": 1,
					"psize": 99,
					// "status": '',
					"querykeyword": this.kw,
					"appid": this.$DEVELOPER.szblid,
					"rpflag": this.$DEVELOPER.cid,
					"areacode": this.$areaMsg.id,
					"orderby_sticktop": "d_d",
					"orderby_createtime": "d_d",
					// "labelid": '1009001',
					"unit": this.unit_data.id
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
					
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
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

<style lang="scss" scoped>
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

	.product-list {
		// padding-top: 80upx;
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
		width: 100%;
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
		width: 30%;
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
		height: 68upx;
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
		font-size: 38upx;
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
	
	
	
	.form-item {
		margin: 28upx 0upx;
		> .uni-list {
			margin-bottom: 24upx;
			> .uni-list-cell {
				> .uni-list-cell-left {
					margin-left: 24upx;
					font-size: 30upx;
					margin-bottom: 8upx;
				}
				> .uni-list-cell-db {
					background-color: #fff;
					border-top: 2upx solid #ccc;
					border-bottom: 2upx solid #ccc;
					padding: 16upx 24upx;
					font-size: 32upx;
				}
			}
		}
		> .form-label {
			width: calc(28upx * 5); 
			font-size: 28upx;
			padding-left: 4upx;
		}
		> .form-item-input {
			color: #333;
			width: calc(100% - 28upx * 5 - 2upx); 
			border: 2upx solid #e1e1e1;
			background-color: #f6f6f6;
			border-radius: 4px;
			height: 60upx;
			line-height: 60upx;
			padding: 0upx 20upx;
			font-size: 28upx;
			margin-top: 8upx;
		}
		> .form-item-textarea {
			border: 2upx solid #aaa;
			width: 80%;
		}
		&:first-child {
			margin: 0upx 0upx 28upx;
		}
		> .form-radio {
			display: flex;
			width: calc(100% - 28upx * 5 - 2upx);
			height: 60upx;
			line-height: 60upx;
			> .radio-item {
				display: flex;
				margin-right: 4upx;
				.radio-icon {
					transform: scale(0.8);
				}
			}
		}
		> .uni-list {
			width: calc(100% - 28upx * 5 - 2upx);
			border: 2upx solid #e1e1e1;
			background-color: #f6f6f6;
			border-radius: 4px;
			height: 60upx;
			line-height: 60upx;
			padding: 0upx 20upx;
			.uni-input {
				display: flex;
				justify-content: space-between;
				.font-icon {
					font-size: 24upx;
				}
			}
		}
		
		> .upload-wrapper {
			margin-top: 8upx;
			width: 100%;
			display: flex;
			color: #353535;
			overflow-x: auto;
			flex-wrap: wrap;
			> .upload-area {
				color: #ccc;
				font-size: 80upx;
				width: 160upx;
				height: 160upx;
				background-color: #f6f6f6;
				border-radius: 4px;
				border: solid 1px #e1e1e1;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 16upx;
			}
			
			> .upload-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 20upx;
				> .idcard-img {
					position: relative;
					width: 160upx;
					height: 160upx;
					background-position: center;
					background-repeat: no-repeat;
					background-size: cover;
					border-radius: 4px;
					border: solid 1px #e1e1e1;
					margin-bottom: 8px;
					> .delete-img{
						position: absolute;
						right: 0upx;
						top: 0upx;
						font-size: 28upx;
						color: #fff;
						background-color: #EE2E3A;
						font-weight: 700;
						width: 28upx;
						height: 28upx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 4upx;
						line-height: initial;
					}
				}
			}
		}
	}
</style>