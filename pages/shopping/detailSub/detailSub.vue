<template>
	<!-- 专题详情 -->
	<view class="">
		<!-- 报错时显示的页面 -->
		<view v-if="isError" :style="{height: windowHeight + 'px', lineHeight: windowHeight + 'px' }" class="page-error"
		 @click="loadPage(obj)">
			网络不通畅，请点击重新加载
		</view>
		<view v-else :style="'min-height:' + windowHeight + 'px'" :class="{ 'bg-fp' : pSort == 'fp' , 'bg-hd' : pSort == 'hd' , 'bg-zq' : pSort == 'hdzq'}">
			<image v-if="pSort == 'fp'" class="sub-img" :src="imgTop" mode="widthFix"></image>
			<view class="sub-mask-1" v-if="pSort == 'hd'" @click="toDetail('1573096097633869924478')"></view>
			<view class="sub-mask-2" v-if="pSort == 'hd'" @click="toDetail('1540258146294896986793')"></view>
			<view class="sub-mask-3" v-if="pSort == 'hd'" @click="toDetail('1540259729825355582676')"></view>
			<view class="sub-mask-4" v-if="pSort == 'hd'" @click="toDetail('15403524935131628364645')"></view>

			<view class="sub-mask-5" v-if="pSort == 'fczt'" @click="toDetail('15740656711491509158518')"></view>
			<view class="sub-mask-6" v-if="pSort == 'fczt'" @click="toDetail('1573096097633869924478')"></view>
			<!-- <view class="sub-mask-7" v-if="pSort == 'fczt'" @click="toDetail('15695650098682009305177')"></view> -->
			<!-- <hotelList :path="path_hotel" :obj="obj_hotel" :mark="'subject'" :fake="fake"></hotelList> -->
			<view class="sub-ul" v-if="pSort == 'fp'">
				<view class="sub-li" v-for="(x,index) in list_shop1" :key="index" @click="toDetail(x.id)">
					<!-- <view class="img"> -->
					<!-- <img :src="x.photo[0]" /> -->
					<!-- </view> -->
					<image :src="x.photo[0]" mode="aspectFit"></image>
					<view class="goods-name">{{x.name}}</view>
					<view class="detail">
						<b class="price-icon" v-if="x.kw1!='待定'">¥</b>
						<b class="price">{{x.now_price ? x.now_price : x.kw1}}</b>
						<!-- <b v-if="x.activitytype == null" class="price">{{x.kw1}}</b> -->
						<!-- <b v-if="x.activitytype == 2 || x.activitytype == 1" class="price">{{x.now_price}}</b>
						<span v-if="x.activitytype == 1" class="discount-text">{{x.agio}}折</span>
						<span v-if="x.activitytype == 2" class="origin-price">¥{{x.kw1}}</span> -->
						<span v-if="x.now_price" class="origin-price">¥{{x.kw1}}</span>
					</view>
				</view>
			</view>
			<view v-if="pSort == 'hd'">
				<image class="sub-img" :src="imgList[0]" mode="widthFix"></image>
				<!-- <view class="sub-ul">
					<view class="sub-li" v-for="(x,index) in zq_list1" :key="index" @click="toDetail(x.id)">
						<image :src="x.photo[0]" mode="aspectFit"></image>
						<view class="goods-name">{{x.name}}</view>
						<view class="detail">
							<b class="price-icon" v-if="x.kw1!='待定'">¥</b>
							<b class="price">{{x.now_price ? x.now_price : x.kw1}}</b>
							<span v-if="x.now_price" class="origin-price">¥{{x.kw1}}</span>
						</view>
					</view>
				</view> -->
				<image class="sub-img" :src="imgList[1]" mode="widthFix"></image>
				<!-- <view class="sub-ul">
					<view class="sub-li" v-for="(x,index) in zq_list2" :key="index" @click="toDetail(x.id)">
						<image :src="x.photo[0]" mode="aspectFit"></image>
						<view class="goods-name">{{x.name}}</view>
						<view class="detail">
							<b class="price-icon" v-if="x.kw1!='待定'">¥</b>
							<b class="price">{{x.now_price ? x.now_price : x.kw1}}</b>
							<span v-if="x.now_price" class="origin-price">¥{{x.kw1}}</span>
						</view>
					</view>
				</view> -->
				<image class="sub-img" :src="imgList[2]" mode="widthFix"></image>

				<image class="sub-img" :src="imgList[3]" mode="widthFix"></image>
				<image class="sub-img" :src="imgList[4]" mode="widthFix"></image>
				<view class="sub-ul hd-bg">
					<view class="sub-li" v-for="(x,index) in zq_list3" :key="index" @click="toDetail(x.id)">
						<image :src="x.photo[0]" mode="aspectFit"></image>
						<view class="goods-name">{{x.name}}</view>
						<view class="detail">
							<b class="price-icon" v-if="x.kw1!='待定'">¥</b>
							<b class="price">{{x.now_price ? x.now_price : x.kw1}}</b>
							<span v-if="x.now_price" class="origin-price">¥{{x.kw1}}</span>
						</view>
					</view>
				</view>
				<view class="button-back" @click="backToTop"></view>
			</view>
			<view v-if="pSort == 'fczt'">
				<image class="sub-img" :src="fcImgList[0]" mode="widthFix"></image>
				<image class="sub-img" :src="fcImgList[1]" mode="widthFix"></image>
				<image class="sub-img" :src="fcImgList[2]" mode="widthFix"></image>
				<image class="sub-img" :src="fcImgList[3]" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'detailSub',
		data() {
			return {
				imgList: ["/static/images/zt_01.jpg", "/static/images/zt_02.jpg", "/static/images/zt_03.jpg",
					"/static/images/zt_04.jpg", "/static/images/zt_05.jpg"
				],
				fcImgList: ["/static/images/fczt_01.jpg", "/static/images/fczt_02.jpg", "/static/images/fczt_03.jpg",
					"/static/images/fczt_04.jpg"
				],
				imgTop: '',
				// keyWordList: [
				// 	"海味榔 辣木茶",
				// 	"茶叶礼盒",
				// 	"【石山特产】火山糖甲 富硒黑糖 火山口特产 古法黑糖 零添加500g",
				// 	"【单品专享】野蜂巢蜜 非人工养野生蜂蜜 500g/瓶 源自海南卓津",
				// 	"可可饮品",
				// 	"海南兴科 椰奶咖啡",
				// 	"【文昌特色】春光 丽派礼盒 400g/盒（80*5）",
				// 	"【文昌特产】金椰坊 椰子饭 530g/个",
				// 	"【文昌特色】老船长椰子酒 200ml/瓶",
				// ],
				// path_hotel: "/api/scsearchhome",
				path_shop: "/api/scdsc",
				// obj_hotel: {
				// 	"m": this.$DEVELOPER.szblid,
				// 	"tk": this.$DEVELOPER.token,
				// 	"state": this.$base.getState(),
				// 	"cid": "001002",
				// 	"kw": '海岛生活',
				// 	"status": 2,
				// 	"psize": 10,
				// 	"pnum": 0,
				//  "rpflag": this.$DEVELOPER.cid,
				// 	// "areacode": this.areacode,
				// },
				obj_shop1: {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					"gid": '',
					"kw": '',
					"status": 2,
					"type": 1,
					// "orderby": 4,
					"cid": "001004",
					"psize": 10,
					"pnum": 0,
					"rpflag": this.$DEVELOPER.cid,
				},
				obj: {},
				pSort: '',
				list_shop1: [],
				windowHeight: 0,
				isError: false,
				// zq_kw_list1: ['海南兴科 茶叶礼盒100g*2罐', '海南兴科 鹧鸪茶', '海味榔 辣木茶', '海南兴科 香草兰绿茶', '海南兴科 玉兰花茶', '【石山特产】猫须茶',
				// 	'【石山特产】火山金钗石斛 富硒养生饮片 豪华装', '【石山特产】火山金钗石斛 富硒养生饮片 商务装', '【海岛精选】海南兴科 兴隆热带植物园 特级香草兰纯苦丁茶'
				// ],
				// zq_kw_list2: ['【石山特产】石斛酒', '【海岛精选】菠萝蜜起泡酒', '【文昌特色】老船长椰子酒'],
				zq_kw_list3: [
					"【石山特产】海味榔 火山辣木茶 茶叶",
					"茶叶礼盒",
					"【石山特产】火山糖甲 富硒古法黑糖 零添加500g/条 ",
					"【石山特产】野蜂巢蜜 非人工养野生蜂蜜 500g/瓶 源自海南卓津",
					"可可饮品",
					"椰奶咖啡",
					"【文昌特色】春光 丽派礼盒 400g/盒（80*5）",
					"【文昌特产】金椰坊 椰子饭 530g/个",
					"【文昌特色】老船长椰子酒 200ml/瓶",
				],
				// zq_list1: [],
				// zq_list2: [],
				zq_list3: [],
				// fake: {
				// 	name: "海岛生活民宿店",
				// 	brief: "火山石坞民宿欢迎您"
				// }
			}
		},
		onLoad(obj) {
			uni.showLoading({
				mask: true,
				title: '加载中'
			})
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight
					// console.log(this.windowHeight);
				}
			})
			this.obj = obj
			this.loadPage(this.obj)
		},
		onShow() {
			// #ifdef H5
			if (this.obj.s == 'hd') {
				uni.setNavigationBarTitle({
					title: '双11购物狂欢'
				});
				this.$base.wxShare('双11超低价抢购！全场5折起限量包邮！', '火山石斛最高直降300元！全场购买指定金额即获精美赠品。', this.$base.linkFilter(window.location
						.href),
					'');
			}
			if (this.obj.s == 'hdzq') {
				uni.setNavigationBarTitle({
					title: '月满中秋佳节大促'
				});
				this.$base.wxShare('中秋送礼选新意！茶酒特价包邮', '【月满中秋 踏月还乡】\n活动时间：9月3日－9月14日', this.$base.linkFilter(window.location
						.href),
					'');
			}
			if (this.obj.s == 'fp') {
				uni.setNavigationBarTitle({
					title: '海口扶贫旅游产品专区'
				});
				this.$base.wxShare('海口旅游扶贫商品', '【海岛生活】扶贫专区，传递健康绿色生活', this.$base.linkFilter(window.location.href), '');
			}
			if (this.obj.s == 'fczt') {
				uni.setNavigationBarTitle({
					title: '澄迈富硒福橙-福利专区'
				});
				this.$base.wxShare('源自澄迈富硒福地 新鲜福橙 特惠福利', '精选优质果，传递健康橙！限时包邮！京东快递。', this.$base.linkFilter(window.location.href), '');
			}
			// #endif

		},
		methods: {
			loadPage(obj) {
				// console.log(1);
				this.pSort = obj.s
				if (obj.s == 'hd') {
					// this.imgTop = '/static/images/zt.jpg'
					// uni.hideLoading()
					this.zq_kw_list3.forEach(item => {
						this.getZqList(this.zq_list3, item)
					})
					// 					this.list_shop1 = []
					// 					this.keyWordList.forEach((item, index) => {
					// 
					// 						this.obj_shop1.kw = item
					// 						this.getList(obj.s, index)
					// 						if (index == this.keyWordList.length - 1) {}
					// 					})
				}
				if (obj.s == 'fp') {
					this.imgTop = this.$base.urlPrex + '/Media/photo' + obj.p
					this.list_shop1 = []
					this.obj_shop1.kw = "海口旅游扶贫"
					this.getList(obj.s)
				}
				if (obj.s == 'fczt') {
					uni.hideLoading()
				}
				// if (obj.s == 'hdzq') {
				// 	this.imgTop = '/static/images/zt1.jpg'
				// 	this.zq_kw_list1.forEach(item => {
				// 		this.getZqList(this.zq_list1, item)
				// 	})
				// 	this.zq_kw_list2.forEach(item => {
				// 		this.getZqList(this.zq_list2, item)
				// 	})
				// 	this.zq_kw_list3.forEach(item => {
				// 		this.getZqList(this.zq_list3, item)
				// 	})
				// }
			},
			// 获取 列表
			getList(sort, index) {
				this.$base.szblGet(this.path_shop, this.obj_shop1).then(res => {
					let list = this.$base.strResToJson(res.data)
					if (list) {
						for (let i = 0; i < list.length; i++) {
							list[i].photo = this.$base.strResToJson(list[i].photo)
							if (list[i].list.length != 0 && list[i].list[0].kw0 == 2) {
								//减价活动
								// let cheap = parseFloat(list[i].list[0].kw2);
								let cheap = parseFloat(list[i].list[0].kw1);
								let now_price = list[i].kw1 - cheap;
								// now_price = Math.floor(now_price * 100) / 100;
								now_price = this.$base.numberFormat(now_price, 2, '.')
								list[i].cheapen = cheap;
								list[i].now_price = now_price;
							}
							if (list[i].list.length != 0 && list[i].list[0].kw0 == 1) {
								//折扣活动,按10来算
								let rebate = parseFloat(list[i].list[0].kw1);
								let now_price = list[i].kw1 * rebate / 10;
								// now_price = Math.floor(now_price * 100) / 100;
								now_price = this.$base.numberFormat(now_price, 2, '.')
								list[i].rebate = rebate;
								list[i].now_price = now_price;
							}
							for (let j = 0; j < list[i].photo.length; j++) {
								list[i].photo[j] = this.$base.urlPrex + list[i].photo[j]
							}
							this.list_shop1.push(list[i])
							this.isError = false
							if (sort == 'fp' || (sort == 'hd' && index == this.keyWordList.length - 1)) {
								uni.hideLoading()
							}
						}
					}
				}).catch(msg => {
					uni.hideLoading()
					if (sort == 'fp') {
						this.isError = true
					}
					console.log(msg)
				})
			},
			// 获取列表
			getZqList(list, kw) {
				let obj = {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					"gid": '',
					"kw": kw,
					"status": 2,
					"type": 1,
					// "orderby": 4,
					"cid": "001004",
					"psize": 10,
					"pnum": 0,
					"rpflag": this.$DEVELOPER.cid,
				}
				const _list = list
				this.$base.szblGet(this.path_shop, obj).then(res => {
					let temp_list = this.$base.strResToJson(res.data)
					console.log(temp_list);
					if (temp_list) {
						for (let i = 0; i < temp_list.length; i++) {
							temp_list[i].photo = this.$base.strResToJson(temp_list[i].photo)
							if (temp_list[i].list.length != 0 && temp_list[i].list[0].kw0 == 2) {
								//减价活动
								let cheap = parseFloat(temp_list[i].list[0].kw2);
								// let cheap = parseFloat(temp_list[i].list[0].kw1);
								let now_price = temp_list[i].kw1 - cheap;
								now_price = this.$base.numberFormat(now_price, 2, '.')
								temp_list[i].cheapen = cheap;
								temp_list[i].now_price = now_price;
							}
							if (temp_list[i].list.length != 0 && temp_list[i].list[0].kw0 == 1) {
								//折扣活动,按10来算
								let rebate = parseFloat(temp_list[i].list[0].kw1);
								let now_price = temp_list[i].kw1 * rebate / 10;
								now_price = this.$base.numberFormat(now_price, 2, '.')
								temp_list[i].rebate = rebate;
								temp_list[i].now_price = now_price;
							}
							for (let j = 0; j < temp_list[i].photo.length; j++) {
								temp_list[i].photo[j] = this.$base.urlPrex + temp_list[i].photo[j]
							}
							_list.push(temp_list[i])
							this.isError = false
							uni.hideLoading()
						}
					}
				}).catch(msg => {
					uni.hideLoading()
					this.isError = true
					console.log(msg)
				})

			},
			// 返回顶部
			backToTop() {
				window.scrollTo(0, 0)
			},
			toDetail(id) {
				uni.navigateTo({
					url: "/pages/shopping/detailShop/detailShop?id=" + id
				})
			},
			toHotel() {
				uni.navigateTo({
					url: "/pages/shopping/detailHotel/detailHotel?id=15437420836691244675273"
				})
			},
		}
	}
</script>

<style scoped>
	.button-back {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 50upx;
		margin: 0 auto;
		width: 200upx;
		height: 50upx;
	}

	.sub-img {
		width: 750upx;
		margin-bottom: -6upx;
	}

	.sub-ul {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-around
	}

	.sub-li {
		background: #fff;
		width: 230upx;
		margin: 10upx 0;
		border-radius: 6upx;
		overflow: hidden;
	}

	.sub-li .img {
		height: 230upx;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.sub-li .goods-name {
		font-size: 24upx;
		line-height: 38upx;
		height: auto;
		max-height: 70upx;
		overflow: hidden;
		word-wrap: break-word;
	}

	.sub-li b {
		color: #ee2e3a;
	}

	.sub-li image {
		width: 230upx;
		height: 230upx;
	}

	.sub-li .detail {
		height: 60upx;
		display: flex;
		align-items: center;
		padding: 0 10upx;
	}

	.bg-hd {
		background: #3c5573;
		/* background: linear-gradient(to right, #ed1dc9, #e21a27); */
	}

	.bg-fp {
		background: #fffcf5;
	}

	.bg-zq {
		background: #176684;
	}

	.sub-mask-1 {
		position: absolute;
		top: 1138upx;
		left: 16upx;
		right: 0;
		margin: 0 auto;
		width: 670upx;
		height: 320upx;
		/* background: rgba(255, 255, 255, 0.5); */
		z-index: 3;
	}

	.sub-mask-2 {
		position: absolute;
		top: 1626upx;
		left: 16upx;
		right: 0;
		margin: 0 auto;
		width: 670upx;
		height: 320upx;
		/* background: rgba(255, 255, 255, 0.5); */
		z-index: 3;
	}

	.sub-mask-3 {
		position: absolute;
		top: 1994upx;
		left: 16upx;
		right: 0;
		margin: 0 auto;
		width: 670upx;
		height: 320upx;
		/* background: rgba(255, 255, 255, 0.5); */
		z-index: 3;
	}

	.sub-mask-4 {
		position: absolute;
		top: 2362upx;
		left: 16upx;
		right: 0;
		margin: 0 auto;
		width: 670upx;
		height: 320upx;
		z-index: 3;
		/* background: rgba(255, 255, 255, 0.9); */
	}

	.sub-mask-5 {
		position: absolute;
		top: 602upx;
		/* right: 22px; */
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 666upx;
		height: 380upx;
		/* background: rgba(255, 255, 255, 0.9); */
		z-index: 3;
	}

	.sub-mask-6 {
		position: absolute;
		top: 1022upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 666upx;
		height: 380upx;
		/* background: rgba(255, 255, 255, 0.9); */
		z-index: 3;
	}

	.sub-mask-7 {
		position: absolute;
		top: 2564upx;
		right: 46upx;
		margin: 0 auto;
		width: 308upx;
		height: 464upx;
		/* background: rgba(255, 255, 255, 0.9); */
		z-index: 3;
	}

	.hd-bg {
		background: #3c5573;
	}
</style>
