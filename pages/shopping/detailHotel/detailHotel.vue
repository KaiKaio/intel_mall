<template>
	<!-- 民宿详情 -->
	<view>
		<!--图片轮播-->
		<swiper :indicator-dots="true" :indicator-active-color="$PROP.hdsh_color" :autoplay="true" :interval="3000"
		 :duration="500" :circular="true">
			<!-- <swiper-item v-for="(x,index) in store.user" :key="index"> -->
			<swiper-item v-for="(x,index) in store.kw6" :key="index">
				<view class="swiper-item">
					<!-- <image :src="$base.urlPrex + x" mode="'widthFix'"></image> -->
					<image :src="x" mode="'widthFix'"></image>
				</view>
			</swiper-item>
		</swiper>

		<!-- <view id="slider" class="swiper-container mui-slider hotel-swiper-container">
			<swiper :options="swiperOption">
				<swiperSlide v-for="x in store.user" :key="x.id">
					<img :src="base.apiUrl + x" />
				</swiperSlide>
				<view class="swiper-pagination" slot="pagination"></view>
			</swiper>
		</view> -->

		<!-- <mx-date-picker :show="showPicker" type="'range'" format="'yyyy-mm-dd'" :value="value" :show-seconds="false" @confirm="onSelected" @cancel="onSelected" :begin-text="'入住'" :end-text="'离店'"/> -->
		<!-- 商店 -->
		<view class="hotel-store-wrap">
			<view class="hotel-store-info">
				<!-- <img :src="store_photo"/> -->
				<span>{{store.name}}</span>
				<text v-if="!collect" class="font-icon" @click="toggleCollect">&#xe601;</text>
				<text v-else class="font-icon" style="color:#ee2e3a" @click="toggleCollect">&#xe869;</text>
			</view>
			<view class="shop-map">
				<!-- <a :href="'https://m.amap.com/navi/?start=0&dest'+store.xyz+'&destName='+store.name+'&key=a8c10d2a51b2169ca943c058f201d511'"> -->
				<a>
					<h3>{{store.address}}</h3>
				</a>
			</view>
			<!-- <a :href="'tel:'+ store.kw2">
            <view class="store-call">
              <i class="iconfont icon-weibiaoti-"></i>
            </view>
          </a> -->
		</view>

		<view class="choose">
			选择时间
		</view>
		<view id="checkinout">
			<calendar class="uni-calendar" @change="change"></calendar>

			<!-- {{range[0]}} - {{range[1]}}
            <button type="primary" @click="onShowDatePicker('range')">选择日期范围</button> -->


			<!-- <view id="firstSelect" style="width:100%;">
				<view class="Date_lr" style="float:left;">
					<P>入住</p>
					<input id="startDate" type="text" value="" style="" readonly>
				</view>
				<view class="Date_lr" style="float:right;">
					<p>离店</p>
					<input id="endDate" type="text" value="" style="" readonly>
				</view>
				<span class="span21">共<span class="NumDate">1</span>晚</span>
			</view> -->
		</view>

		<view class="choose-home-num">
			<text>选择房间数</text>
			<uni-number-box @change="numChange($event)" :min="1" :max="10"></uni-number-box>
		</view>

		<view class="mask_calendar">
			<view class="calendar"></view>
			<!-- 提示 -->
			<view class="calendar_tishi">请选择离店日期...</view>
		</view>

		<view class="shop-detail shop-detail-margin-b" v-if="hotelList.length !=0">
			<h3>房型</h3>
			<view class="hotel-desc-box">
				<view class="wrap-li" v-for="(hotel,index) in hotelList" :key="index">
					<view class="room-list-top">
						<view class="room-list-img">
							<!-- <img :src="hotel.photo[0]" alt=""> -->
							<image :src="hotel.photo[0]" mode="'widthFix'"></image>
						</view>
						<view class="room-list-name">
							<span>{{hotel.name}}</span>
							<span :id="index + 'span'" :class="hotel.isSelected ? 'norm-text-ac' : 'norm-text-unac'">{{hotel.kw8}}</span>
							<span>可住2人</span>
						</view>
						<view class="room-list-minprice" @click="toggleNorm(index)" v-if="hotel.minprice != 0.00">
							¥<span>{{hotel.minprice}}</span><text class="font-icon">&#xe63c;</text>
						</view>
						<view class="room-list-minprice" v-if="hotel.minprice == 0.00">
							预售
						</view>
					</view>
					<view :id="index" :class="hotel.isSelected ? 'norm-ac' : 'norm-unac'" :key="hotel.isSelected" class="norm-list">
						<view class="norm-item" v-for="(norm, nindex) in hotel.jsondata" :key="nindex">
							<span>{{norm.name}}</span>
							<span v-if="norm.kw1 > 0">剩余{{norm.kw1}}间</span>
							<span v-if="norm.kw1 == 0">无房间</span>
							<span>¥{{norm.kw0}}</span>
							<view v-if="norm.kw1 > 0" class="norm-pay bg-hdsh" @click="goPay(hotel,norm)">立即预订</view>
							<view v-if="norm.kw1 == 0" class="norm-pay norm-pay-false">暂无库存</view>
						</view>
					</view>
				</view>
			</view>
			<view class="detail-html" v-html="detail.htmldata"></view>
		</view>
		<view class="shop-detail" v-if="hotelList.length ==0" style="text-align:center;color:#e02e24;">
			暂无房间
		</view>
		<view id="goods-reviews-module" class="goods-reviews-container" v-if="comment_list.length">
			<view class="goods-reviews-header">
				<a>
					<view class="goods-reviews-title">
						<view class="goods-reviews-num">
							民宿评价
							<span>({{comment_list.length}})</span></view><span v-if="comment_list.length>2" @click="$router.openPage('/commentList/'+detail.id)"
						 class="goods-reviews-more">查看全部</span>
					</view>
				</a>
			</view>
			<view class="goods-reviews-list">
				<view class="reviews-item" v-for="(x,index) in comment_list" v-if="index<2" :key="index">
					<view class="reviews-item-title"><img :src="x.kw2 ? x.kw2 : store_photo"><span class="reviews-item-name">{{x.name}}<b><i
								 style="width:50.4px;"></i></b></span><span class="reviews-item-time">{{x.createtime}}</span></view>
					<view class="reviews-item-content">{{x.kw3}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import calendar from '@/components/date-picker/date-picker.vue';
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import {
		mapMutations
	} from "vuex";
	export default {
		components: {
			calendar,
			uniNumberBox,
		},
		data() {
			return {
				id: '', //商店id
				detail: "",
				store: "", //商店
				hotelList: [], //房型列表
				store_photo: require("@/static/icon/default.png"),
				comment_list: [], //评论列表
				stime: "", //开始日期
				etime: "", //结束日期
				numDate: 1, //天数
				homeNum: 1, //房间数
				collect: false, //关注状态
				// range: ['', ''],
				// showPicker: false,
				// type: 'range',
				// value: '',
				share_img: '', //微信分享的图片
			};
		},
		onLoad(obj) {
			this.id = obj.id;
			this.stime = this.myGetDate(0);
			this.etime = this.myGetDate(1);
			// 			this.range[0] = this.myGetDate(0)
			// 			this.range[1] = this.myGetDate(1)
			this.loadNorm();
			this.getStore();
		},
		methods: {
			numChange(value) {
				// 				this.order.kw5 = value;
				// 				this.order.kw4 = parseFloat(this.order.kw5 * this.get_jd_data.kw0).toFixed(2);
				this.homeNum = value;
				this.loadNorm();
			},
			//MxDatePicker
			// 			onShowDatePicker(type) { //显示
			// 				this.type = type;
			// 				this.showPicker = true;
			// 				this.value = this[type];
			// 			},
			// 			onSelected(e) { //选择
			// 				//e.value 为选择的值
			// 				//e.date 为原始的date对象
			// 				this.showPicker = false;
			// 				if (e) { // 因为cancel事件也绑定了这个函数，而且canel事件传的参数false
			// 					this[this.type] = e.value;
			// 					console.log(e);
			// 				}
			// 			},
			//date-picker,修改起始时间和天数
			change({
				choiceDate,
				dayCount
			}) {
				//参数解释
				//1.choiceDate 时间区间（开始时间和结束时间）
				//2.dayCount 共多少晚
				// 对月份进行处理，1-9号在前面添加一个“0”
				this.stime = choiceDate[0].re;
				this.etime = choiceDate[1].re;
				this.numDate = dayCount;
				this.loadNorm();
				// console.log(choiceDate, dayCount)
				// console.log("入住从 " + choiceDate[0].re + "  到 " + choiceDate[1].re + "  共 " + dayCount + " 晚");
			},
			//规格开关
			toggleNorm(index) {
				this.hotelList[index].isSelected = true;
				for (var i = 0; i < this.hotelList.length; i++) {
					if (i != index && this.hotelList[i].isSelected == true) {
						this.hotelList[i].isSelected = false
					}
				}
			},
			// todo
			// 			checkCollect(status) {
			// 				if (status) {
			// 					this.$base.szblGet("/api/scpace/", {
			// 							fid: localStorage.u,
			// 							cid: this.$route.params.id,
			// 							gid: "2",
			// 							status: "1",
			// 							appid: this.$base.appid
			// 						}).then((dataJson) => {
			// 							//处理
			// 							console.log(dataJson);
			// 							if (dataJson.num != 0) {
			// 								this.collect = true;
			// 								console.log(JSON.parse(dataJson.data));
			// 							}
			// 						}).catch((msg) => {
			// 							console.log(msg);
			// 							return;
			// 						});
			// 				}
			// 			},
			// 去支付
			goPay(hotel, norm) {
				//检查登录状态
				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						// page: '/pages/shopping/detailHotel/detailHotel?id=' + this.id,
						page: '/pages/shopping/detailHotel/detailHotel?id=' + this.id,
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
					});
					return false;
				}
				if (!this.stime) {
					uni.showToast({
						title: '请选择入住时间',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				} else if (!this.etime) {
					uni.showToast({
						title: '请选择离店时间',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				} else if (!this.homeNum) {
					uni.showToast({
						title: '请选择房间数',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}

				this.$store.commit('set_hotel_data', {
					room: hotel.name, //房型
					norm: norm.name, //规格
					province: hotel.province,
					city: hotel.city,
					unit: this.id, //商店id
					cid: hotel.id, //房型id
					kw0: hotel.kw0, //商店名
					kw4: this.$base.numberFormat(norm.kw0 * this.numDate * this.homeNum, 2, '.'), //总价
					kw5: this.homeNum, //房间数
					kw8: hotel.kw8, //房间设施
					kw12: norm.kw12, //是否退房手续费
					store_phone: this.store.kw2,
					photo: hotel.photo,
					stime: this.stime, //入住时间
					etime: this.etime, //离店时间
					numDate: this.numDate,
					normId: norm.id, //规格id
					normPrice: norm.kw0, //规格单价
					mark: "hotel", //标记位
				});

				uni.navigateTo({
					url: '/pages/shopping/payHotel/payHotel',
				});
			},
			// 添加收藏
			addCollect() {
				var data = {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
					fid: this.$userMsg.userid,
					cid: this.id,
					gid: "2",
					status: "1",
					rpflag: this.$DEVELOPER.cid,
					// appid: this.$base.appid
				};
				this.$base.szblPost("/api/scpace", data).then((dataJson1) => {
					//返回处理
					this.collect = true;
				}).catch((msg) => {
					console.log(msg);
					return;
				});
			},
			// 取消收藏
			delCollect() {
				this.$base.szblDel("/api/scpace/" + this.id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token +
						"&state=" + this.$base.getState(), null
					).then((dataJson) => {
						//处理
						this.collect = false;
					})
					.catch((msg) => {
						console.log(msg);
						return;
					});
			},
			// 更改收藏状态 
			toggleCollect() {
				//检查登录状态
				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/detailShop/detailShop?id=' + this.id,
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
			//加载民宿房型、规格
			loadNorm() {
				uni.showLoading({
					title: '加载中'
				})
				let hotelJson = {
					m: this.$DEVELOPER.szblid,
					tk: this.$DEVELOPER.token,
					state: this.$base.getState(),
					unit: this.id,
					status: 2,
					psize: 0,
					pnum: 0,
					rpflag: this.$DEVELOPER.cid,
					// areacode: this.$base.getQueryAreaCode(this.$areaMsg.id),
				};
				this.$base.szblGet("/api/schomes", hotelJson).then((dataJson) => {
					let hotelList = this.$base.strResToJson(dataJson.data);
					console.log(hotelList);
					if (hotelList.length != 0) {
						//查规格
						for (let i = 0; i < hotelList.length; i++) {
							hotelList[i].isSelected = false;
							// this.szblGetAsync("/api/schorder/selecthomeorder?areacode=" + this.$base.getQueryAreaCode(this.$areaMsg.id), {
							this.szblGetAsync("/api/schorder/selecthomeorder", {
								"m": this.$DEVELOPER.szblid,
								"tk": this.$DEVELOPER.token,
								"state": this.$base.getState(),
								"stime": this.stime,
								"etime": this.etime,
								"cid": 2,
								"fid": this.id,
								"pnum": 0,
								"psize": 0,
								"kw4": hotelList[i].id,
								"num": this.homeNum,
								"rpflag": this.$DEVELOPER.cid,
							}, i).then((resData) => {
								// console.log(resData)
								let norms = this.$base.strResToJson(resData.data);
								// console.log(norms);
								if (norms.length != 0) {
									let price = parseFloat(norms[0].kw0);
									for (let l = 0; l < norms.length; l++) {
										let pricem = parseFloat(norms[l].kw0);
										if (price > pricem) {
											price = pricem;
										}
									}
									// console.log(hotelList[resData.index])
									hotelList[resData.index].minprice = price;
								}
								hotelList[resData.index].homenum = norms.length;
								hotelList[resData.index].jsondata = norms;
							}).catch((msg) => {
								console.log(msg)
							})
							
						}
						hotelList = this.$base.listPhotoProcess(hotelList)
					}
					this.hotelList = hotelList;
					uni.hideLoading();

				}).catch((err) => {
					console.log(err);
					uni.hideLoading();
					return;
				});
			},
			/**
			 * 获取距离当天n天的日期
			 * @param {Number} addDayCount 与当前日期的天数差
			 */
			myGetDate(addDayCount) {
				var date = new Date();
				date.setDate(date.getDate() + addDayCount); //获取AddDayCount天后的日期
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				var d = date.getDate();
				// 对月份进行处理，1-9月在前面添加一个“0”
				if (m >= 1 && m <= 9) {
					m = "0" + m;
				}
				// 对月份进行处理，1-9号在前面添加一个“0”
				if (d >= 0 && d <= 9) {
					d = "0" + d;
				}
				return y + "-" + m + "-" + d;
			},
			//查店铺信息
			getStore() {
				this.$base.szblGet("/api/scshop/" + this.id, {
						m: this.$DEVELOPER.szblid,
						tk: this.$DEVELOPER.token,
						state: this.$base.getState()
					}).then((dataJson) => {
						this.store = this.$base.strResToJson(dataJson.data);
						if (this.store.kw6 != "" && this.store.kw6 != "null") {
							this.store.kw6 = this.$base.strResToJson(this.store.kw6);
							for(var i = 0; i< this.store.kw6.length; i++){
								this.store.kw6[i] = this.$base.urlPrex + this.store.kw6[i]
							}
							this.share_img = this.store.kw6[0];
						}
						
						// #ifdef H5
						// alert(this.store.name + ",," + this.store.remarks + ",," + this.store_photo + ",," + window.location.href)
						this.$base.wxShare(this.store.name, this.store.remarks, this.$base.linkFilter(window.location.href), this.share_img);
						// #endif
						
						// console.log(this.store);
					})
					.catch((msg) => {
						console.log(msg);
						return;
					});
			},
			//获取数据（同步方法）
			szblGetAsync: async function(url, jsonData, index) {
				return await new Promise((resolve, reject) => {
					uni.request({
						url: this.$base.urlPrex + url,
						method: 'GET',
						data: jsonData,
						dataType: 'json',
						success: res => {
							if (res.data.code != 0) {
								reject(res.data.msg)
							}
							res.data.index = index;
							resolve(res.data)
						},
						fail: (returnMsg) => {
							console.log(returnMsg)
							//将状态置为reject，并把错误信息返回
							reject(returnMsg.errMsg);
						},
						complete: () => {}
					});
				})
			},

			// ...mapMutations(["set_hotel_data"])
		}
	}
</script>

<style>
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

	#slider .swiper-slide {
		text-align: center;
		font-size: 0;
	}

	#slider .swiper-slide img {
		max-width: 100%;
		max-height: 100%;
		vertical-align: middle;
	}

	.hotel-swiper-container {
		min-height: 0;
		max-height: 500upx;
	}

	.g-delivery-cost-hint {
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

	.g-price i {
		float: right;
	}

	.g-price {
		margin: 10upx 0 40upx;
	}

	.g-price {
		padding: 0 40upx 1upx 20upx;
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

	.fix-mall-index a {
		padding: 0;
		line-height: 60upx;
		height: 60upx;
		margin: 20upx 0;
	}

	.fix-mall-btn {
		line-height: 100upx;
		height: 100upx;
	}

	.fix-mall-index i {
		display: inline-block;
		vertical-align: middle;
		background: none;
		width: auto;
		height: auto;
		color: #666;
		font-size: 40upx;
	}

	.fix-buy-btn {
		/* background: #ea7b7b; */
		height: calc(100upx + 2upx);
		line-height: inherit;
	}

	.uni-calendar {
		width: 750upx;
	}

	.norm-ac {
		display: block;
	}

	.norm-unac {
		display: none;
	}

	.norm-text-ac {
		height: auto;
	}

	.norm-text-unac {
		height: 20upx;
	}

	.choose-home-num {
		width: 750upx;
		background: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 10upx 0;
	}
	
	.shop-detail-margin-b{
		margin-bottom:60upx !important;
	}
</style>
