<template>
	<!-- 店铺页 -->
	<view>
		<uni-popup :animation="true" ref="popup" type="top" :maskClick="true">
			<view class="qr-hint">
				<text>截屏或长按保存店铺二维码</text>
				<image class="store-qrcode" :src="store.qrcode" mode="aspectFit"></image>
			</view>
		</uni-popup>
		<view class="store-wrap">
			<view class="store-info">
				<image :src="store.kw6" />{{store.name}}
				<text class="font-icon" @click="showQRCode">&#xe650;</text>
			</view>
			<view class="collect">
				<text v-if="!collect" class="bg-hdsh color-white">关注</text>
				<text v-else class="bg-hdsh color-white">已关注</text>
			</view>
		</view>
		<view class="shai">
			<view class="flex-cont">
				<!-- <view v-if="shopNum" class="wrap-li" :class="{'color-hdsh' : isActive==1}" @click="rank(1)">
					<view>商品</view>
				</view>
				<view v-if="hotelNum" class="wrap-li" :class="{'color-hdsh' : isActive==2}" @click="rank(2)">
					<view>民宿</view>
				</view>
				<view v-if="cateNum" class="wrap-li" :class="{'color-hdsh' : isActive==3}" @click="rank(3)">
					<view>美食</view>
				</view>
				<view v-if="playNum" class="wrap-li" :class="{'color-hdsh' : isActive==4}" @click="rank(4)">
					<view>票务</view>
				</view> -->
				
				<!-- <view v-for="(x,index) in tab" :key="index" v-if="x.mark != 0" class="wrap-li" :class="{'color-hdsh' : isActive == (index+1)}" @click="rank((index+1))"> -->
				<view v-for="(x,index) in tab" :key="index" v-if="x.mark != 0" class="wrap-li" :class="{'color-hdsh' : x.isActive}" @click="rank(index)">
					<view>{{x.name}}</view>
				</view>
			</view>
		</view>
		<!-- <list-shop v-show="isActive == 1" :path="pathShop" :obj="objShop" ref="loadData" @num="getShopNum"></list-shop>
		<list-hotel v-show="isActive == 2" :path="pathHotel" :obj="objHotel" ref="loadHotelList" @num="getHotelNum"></list-hotel>
		<list-cate v-show="isActive == 3" :path="pathCate" :obj="objCate" ref="loadCateList" @num="getCateNum"></list-cate>
		<list-play v-show="isActive == 4" :path="pathPlay" :obj="objPlay" ref="loadPlayList" @num="getPlayNum"></list-play> -->
		<list-shop v-show="tab[0].isActive" :path="pathShop" :obj="objShop" ref="loadData" @num="getShopNum"></list-shop>
		<list-hotel v-show="tab[1].isActive" :path="pathHotel" :obj="objHotel" ref="loadHotelList" @num="getHotelNum"></list-hotel>
		<list-cate v-show="tab[2].isActive" :path="pathCate" :obj="objCate" ref="loadCateList" @num="getCateNum"></list-cate>
		<list-play v-show="tab[3].isActive" :path="pathPlay" :obj="objPlay" ref="loadPlayList" @num="getPlayNum"></list-play>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				store: '', //店铺详情
				pathShop: '/api/scdsc',
				shopNum: 0, //商品数量
				cateNum: 0, //美食数量
				hotelNum: 0, //民宿数量
				playNum: 0, //门票数量
				isActive: 1,
				collect: false,
				// tab: [],
				tab: [{
					name: '商品',
					mark: 0,
					isActive: false
				},{
					name: '民宿',
					mark: 0,
					isActive: false
				},{
					name: '美食',
					mark: 0,
					isActive: false
				},{
					name: '票务',
					mark: 0,
					isActive: false
				}],
				countTabNum: 0, //记录查四种列表返回的次数
				objShop: {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					"gid": '',
					"kw": '',
					"status": 2,
					"type": 1,
					"orderby": '',
					// "cid": "001004",
					// "psize": 20,
					"psize": 30,
					"pnum": 1,
					"unit": ''
					// "areacode": this.$areaMsg.id
				},
				pathHotel: '/api/schomeandstyle',
				objHotel: {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					// "cid": "001002",
					"kw": '',
					"status": 2,
					"psize": 30,
					"pnum": 1,
					"unit": ''
					// "areacode": this.$areaMsg.id,
				},
				pathPlay: '/api/scplay',
				objPlay: {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					// "cid": "001003",
					"kw": '',
					"status": 2,
					"psize": 30,
					"pnum": 1,
					"unit": ''
					// "areacode": this.$areaMsg.id,
				},
				pathCate: '/api/scstyle',
				objCate: {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					"cid": "3",
					"kw": '',
					// "kw8": "001001",
					"status": 0,
					"psize": 30,
					"pnum": 1,
					"unit": ''
					// "areacode": this.$areaMsg.id,
				},
			}
		},
		// 上拉加载
		onReachBottom() {
			if (this.tab[0].isActive) {
				this.objShop.pnum++;
				this.shopMark = false;
				if (this.objShop.pnum > this.page_num) {
					return
				} else {
					this.$refs.loadData.loadData(this.shopMark);
				}
			}
			if (this.tab[2].isActive) {
				this.objCate.pnum++;
				if (this.objCate.pnum > this.page_num) {
					return
				} else {
					this.$refs.loadCateList.loadCateList();
				}
			}
			if (this.tab[1].isActive) {
				this.objHotel.pnum++;
				this.$refs.loadHotelList.loadHotelList();
			}
			if (this.tab[3].isActive) {
				this.objPlay.pnum++;
				if (this.objPlay.pnum > this.page_num) {
					return
				} else {
					this.$refs.loadPlayList.loadPlayList();
				}
			}
		},
		/**
		 * @param {stirng} obj.id 店铺id
		 * @param {string} obj.m 1-商品,2-民宿,3-美食,4-票务 
		 */
		onLoad(obj) {
			this.objCate.unit = this.objHotel.unit = this.objPlay.unit = this.objShop.unit = obj.id
			this.getDetail(obj.id)
			this.obj = obj
			if(obj.m){
				// this.isActive = parseInt(obj.m)
				this.tab[obj.m-1].isActive = true
			}
			//判断是否收藏店铺
			if (this.$userMsg.userid != null) {
				this.$base.szblGet("/api/scpace/", {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
					fid: this.$userMsg.userid,
					cid: obj.id,
					gid: "2",
					status: "1",
					psize: 0,
					pnum: 0,
					rpflag: this.$DEVELOPER.cid,
				}).then((dataJson) => {
					//处理
					// console.log(dataJson);
					if (dataJson.data != '[]') {
						this.collect = true;
					}
				}).catch((msg) => {
					console.log(msg);
					return;
				});
			}
		},
		watch:{
			countTabNum(newNum){
				if(newNum == 4 && !this.obj.m){
					for(let i = 0; i< this.tab.length; i++){
						if(this.tab[i].mark != 0){
							this.tab[i].isActive = true
							break
						}
					}
				}
			}
		},
		methods: {
			// 获取店铺详情
			getDetail(id) {
				this.$base.szblGet("/api/scshop/" + id, {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState()
				}).then(dataJson => {
					this.store = this.$base.strResToJson(dataJson.data);
					if (this.store.kw6 != "" && this.store.kw6.indexOf('失败') == -1) {
						this.store.kw6 = this.$base.urlPrex + this.$base.strResToJson(this.store.kw6);
					} else {
						this.store.kw6 = require("@/static/icon/default.png")
					}
					uni.setNavigationBarTitle({
						title: this.store.name
					})
					// this.store.qrcode = this.$base.urlPrex + this.store.qrcode;
					console.log(this.store);
				}).catch(msg => {
					console.log(msg);
					return;
				});
			},
			// 展示商店二维码
			showQRCode() {
				this.$refs.popup.open()
			},
			// 获取四种类型产品的数量
			getShopNum(data){
				this.shopNum = data
				// this.tab.push({
				// 	name: '商品',
				// 	mark: data,
				// 	isActive: false
				// })
				this.tab[0].mark = data
				this.countTabNum += 1
			},
			getCateNum(data){
				this.cateNum = data
				// this.tab.push({
				// 	name: '美食',
				// 	mark: data,
				// 	isActive: false
				// })
				this.tab[2].mark = data
				this.countTabNum += 1
			},
			getHotelNum(data){
				this.hotelNum = data
				// this.tab.push({
				// 	name: '民宿',
				// 	mark: data,
				// 	isActive: false
				// })
				this.tab[1].mark = data
				this.countTabNum += 1
			},
			getPlayNum(data){
				this.playNum = data
				// this.tab.push({
				// 	name: '票务',
				// 	mark: data,
				// 	isActive: false
				// })
				this.tab[3].mark = data
				this.countTabNum += 1
			},
			rank(x){
				if(this.tab[x].isActive){
					return
				}
				this.tab.forEach(item => {
					if(item.isActive){
						item.isActive = !item.isActive
					}
				})
				this.tab[x].isActive = true
				// this.isActive = x
			}
		}
	}
</script>

<style>
	.store-wrap {
		margin-top: 0;
	}

	.store-wrap .collect {
		flex-shrink: 0;
		width: 20%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.store-wrap .collect text {
		width: 80%;
		text-align: center;
		border-radius: 20upx;
	}

	.store-info text {
		margin-left: 10upx;
	}

	.store-qrcode {
		width: 600upx;
		height: 600upx;
		margin-top: 30upx;
	}

	.qr-hint {
		width: 100%;
		text-align: center;
	}
	
	.shai .wrap-li {
		padding: 20upx 0;
		width: 25%;
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
</style>
