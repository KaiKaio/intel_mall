<template>
	<!-- 门票详情 -->
	<view>
		<view class="play-calendar">
			<calendar ref="calendar" :disableBefore="true" @confirm="changeDate" :range="true"></calendar>
		</view>
		<!--图片轮播-->
		<swiper :indicator-dots="true" :indicator-active-color="$PROP.hdsh_color" :autoplay="true" :interval="3000" :duration="500"
		 :circular="true">
			<swiper-item v-for="(x,index) in photo" :key="index">
				<view class="swiper-item">
					<!-- <image :src="$base.urlPrex + x" mode="'widthFix'"></image> -->
					<image :src="x" mode="'widthFix'"></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- // <view id="slider">
			// <swiper :options="swiperOption">
				// <swiperSlide v-for="x in photo" :key="x.id"><img :src="base.apiUrl+x" /></swiperSlide>
				// <view class="swiper-pagination" slot="pagination"></view>
				// </swiper>
			// </view> -->
		<!-- 商店 -->
		<view class="store-wrap" @click="toStore()">
			<view class="store-info">
				<image :src="store_photo" />{{detail.kw0}}
			</view>
			<view class="store-call">
				<text class="font-icon">&#xe79a;</text>
			</view>
		</view>
		<view v-if="detail.gid == 0" class="jd-title">
			<h3>{{detail.name}}</h3>
			<text>{{detail.kw3}}级景区</text>
			<view class="time color-hdsh">营业时间：{{detail.kw5}}
				<!-- <span @click="YData.xz=true">购票须知</span> -->
			</view>
			<view class="dz"><text class="font-icon">&#xe699;</text>{{detail.address}}</view>
		</view>
		<view class="jd-title" v-else>
			<h3>{{detail.name}}</h3>
		</view>
		<view class="jd-tj">
			<view v-if="detail.gid == 1" class="range-wrap">
				<view class="date-range">
					<text>{{startDate}}</text>
					<text>至</text>
					<text>{{endDate}}</text>
				</view>
				<view class="color-hdsh" @click="openCalendar">
					修改日期
				</view>
			</view>
			<h3 v-if="detail.gid == 0">门票推荐</h3>
			<view>
				<view class="wrap-li flex-cont" v-if="sku.length > 0" v-for="(x,index) in sku" :key="index">
					<view v-if="detail.gid == 0" class="left">
						<h4>{{x.name}}</h4>
						<p v-if="x.id == '1564726362164409799114'">海南身份证优惠价，随买随用</p>
						<p v-else>随买随用</p>
						<!-- <p>已售1000 &nbsp|&nbsp <span @click="YData.xz=true">购买须知</span></p> -->
						<!-- <p><span @click="YData.xz=true">购买须知：{{detail.jsondata}}</span></p> -->
					</view>
					<view v-else class="left">
						<h4 v-if="detail.gid == 0">{{x.name}}</h4>
						<p>开场时间：{{x.stime}}</p>
						<p>散场时间：{{x.etime}}</p>
					</view>
					<view class="right" v-if="x.kw0 != 0.00 && x.cid == 4">
						<p><span>¥</span>{{x.kw0}}</p>
						<a class="bg-hdsh" @click="goPay(index)">立即预订</a>
					</view>
					<view v-else class="movie-right">
						<view class="item">
							<text>VIP座</text>
							<p><span>¥</span>{{x.kw13}}</p>
							<a v-if="x.kw13 != '0'" class="bg-hdsh" @click="goPay(index, 0)">立即预订</a>
							<a v-else class="bg-gray">售罄</a>
						</view>
						<view class="item">
							<text>普通座</text>
							<p><span>¥</span>{{x.kw14}}</p>
							<a v-if="x.kw1 != '0'" class="bg-hdsh" @click="goPay(index, 1)">立即预订</a>
							<a v-else class="bg-gray">售罄</a>
						</view>
					</view>
					<view class="right" v-if="x.kw0 == 0.00 && x.cid == 4">
						<a>预售中</a>
					</view>
				</view>
				<view v-if="sku.length == 0" style="text-align: center;">
					这个时间段内暂无场次，请选择别的时间段
				</view>
			</view>
		</view>
		<view v-if="detail.gid == 0" class="shop-detail">
			<view class="type-cont">
				<ul class="flex-cont">
					<li v-for="(x,index) in type" :key="index" :class="{'tab-ac-hdsh':index==typeIndex}" @click="typeChange(index)">{{x}}</li>
				</ul>
			</view>
			<!-- <h3>景点详情</h3> -->
			<rich-text v-if="typeIndex == 0" class="detail-html" :nodes="detail.htmldata"></rich-text>
			<!-- <view v-if="typeIndex == 1" class="goods-details-desc" v-html="detail.jsondata == null || detail.jsondata == 'null' ? '' : detail.jsondata"> -->
			<view v-else class="goods-details-desc">
				<text v-if="typeIndex == 1">{{detail.jsondata}}</text>
				<text v-if="typeIndex == 2">{{detail.kw6}}</text>
				<text v-if="typeIndex == 3">{{detail.kw7}}</text>
			</view>
			<!-- <view v-if="typeIndex == 2">
				<view class="">
					<view class="">
						咨询电话
					</view>
					<text>{{detail.kw8}}</text>
					<view class="">
						景点特色
					</view>
					<text>{{detail.kw6}}</text>
					<view class="">
						交通指南
					</view>
					<text>{{detail.kw7}}</text>
				</view>
			</view> -->
		</view>
		<view v-if="detail.gid == 1" class="shop-detail">
			<h3>详情</h3>
			<rich-text class="detail-html" :nodes="detail.htmldata"></rich-text>
		</view>
		<view class="model-cont" v-if="YData.xz" @click="YData.xz=false">
			<view class="cont">
				<h3>{{detail.name}}</h3>
				<view class="c">{{detail.jsondata}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import calendar from "@/components/uni-calendar/uni-calendar.vue"
	import {
		mapMutations,
		mapGetters
	} from "vuex";

	// 格式化日期 
	function dateFormat(date, fmt) {
		var o = {
			"M+": date.getMonth() + 1,
			"d+": date.getDate()
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};

	export default {
		components: {
			calendar
		},
		data() {
			return {
				YData: {
					xz: false //失效
				},
				detail: {},
				photo: [], //轮播图
				sku: {}, //规格
				id: "", //门票id
				type: ['景点详情', '购买须知', '景点特色', '交通指南'],
				typeIndex: 0,
				store_photo: require("@/static/icon/default.png"),
				// date: dateFormat(new Date(), "yyyy年MM月dd日"),
				startDate: this.myGetDate(0),
				endDate: this.myGetDate(7),
			};
		},
		// 		computed: {
		// 			...mapGetters(['get_jd_data'])
		// 		},
		onLoad(obj) {
			this.id = obj.id;
			uni.showLoading({

			})
			this.$base.szblGet("/api/scplay/" + obj.id, {
				"m": this.$DEVELOPER.szblid,
				"tk": this.$DEVELOPER.token,
				"state": this.$base.getState(),
			}).then(res => {
				this.detail = this.$base.strResToJson(res.data);
				uni.setNavigationBarTitle({
					title: this.detail.name
				})
				this.detail.gid = parseInt(this.detail.gid)
				console.log(this.detail);
				this.photo = this.$base.strResToJson(this.detail.photo);
				for (var i = 0; i < this.photo.length; i++) {
					this.photo[i] = this.$base.urlPrex + this.photo[i]
				}
				//处理富文本中的图片
				this.detail.htmldata = this.detail.htmldata.replace(/<img/gi,
					'<img style="width:100%; height: auto; display: block"');
				// #ifdef H5
				this.$base.wxShare(this.detail.name, this.detail.jsondata, this.$base.linkFilter(window.location.href), this
					.$base
					.urlPrex + this.$base
					.strResToJson(this.detail.photo)[0]);
				// #endif
				console.log(this.detail)
				this.getStyle();
			}).catch((msg) => {
				console.log(msg);
				uni.hideLoading()
				return;
			});
		},
		methods: {
			// 查规格
			getStyle(){
				let sku_obj = {
					m: this.$DEVELOPER.szblid,
					tk: this.$DEVELOPER.token,
					state: this.$base.getState(),
					unit: this.detail.unit,
					kw4: this.id,
					cid: 4,
					status: 0,
					psize: 0,
					pnum: 0,
					rpflag: this.$DEVELOPER.cid,
					// areacode: this.$base.getQueryAreaCode(this.$areaMsg.id)
				}
				if (this.detail.gid == 1) {
					sku_obj.cid = 6
					let now = new Date()
					if(this.$base.dateFormat(now).indexOf(this.startDate) != -1){
						sku_obj.stime = this.$base.dateFormat(now)
					}else{
						sku_obj.stime = this.startDate
					}
					sku_obj.etime = this.endDate
				}
				// 查规格
				this.$base.szblGet("/api/scstyle", sku_obj).then(res => {
					this.sku = this.$base.strResToJson(res.data);
					console.log(this.sku)
					uni.hideLoading()
				}).catch((msg) => {
					uni.hideLoading()
					return;
				});
			},
			/**
			 * 获取距离当天n天的日期
			 * @param {Number} addDayCount 与当前日期的天数差
			 */
			myGetDate(addDayCount) {
				let date = new Date();
				date.setDate(date.getDate() + addDayCount); //获取AddDayCount天后的日期
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				let d = date.getDate();
				if(m < 10){
					m = '0' + m
				}
				if(d < 10){
					d = '0' + d
				}
				console.log(y,m,d);
				// 对月份进行处理，1-9月在前面添加一个“0”
				return y + "-" + m + "-" + d;
			},
			// 修改日期
			changeDate(e) {
				console.log(e)
				this.startDate = e.range.begin
				this.endDate = e.range.end
				this.getStyle()
			},
			// 查店铺
			loadShop() {
				this.$base.szblGet("/api/scshop/" + this.detail.unit, {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState()
				}).then(dataJson => {
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
			// 切换tab
			typeChange(index) {
				this.typeIndex = index
			},
			/**
			 * @param {Number} index 规格下标
			 * @param {Number} index 0-vip票，1-普通票（仅在cid=6时使用）
			 */
			goPay(index, mark) {
				// console.log(this.sku[index])
				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/detailPlay/detailPlay?id=' + this.id,
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
					return false;
				}
				let obj = this.sku[index]
				if (typeof mark == 'number') {
					obj.mark = mark
				} else {
					obj.mark = ''
				}
				this.$store.commit('set_jd_data', obj);
				uni.navigateTo({
					url: '/pages/shopping/payPlay/payPlay?id=' + this.id,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			toStore() {
				// uni.navigateTo({
				// 	url: '/pages/shopping/store/store?id=' + this.detail.unit + '&m=4',
				// 	success: res => {},
				// 	fail: () => {},
				// 	complete: () => {}
				// });
			},
			// 打开日期控件
			openCalendar() {
				this.$refs.calendar.open();
			}
			// ...mapMutations(["set_jd_data"])
		}
	}
</script>

<style>
	swiper {
		/* width: 100%; */
		/* height: auto; */
		/* min-height: upx; */
		/* height: 480upx; */
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

	.movie-right {
		display: flex;
		width: 360upx;
		flex-direction: column;
		/* justify-content: space-between; */
	}

	.movie-right .item {
		display: inline-flex;
		justify-content: space-between;
		line-height: 46upx;
		height: 46upx;
	}

	.movie-right .item a {
		color: #fff;
		line-height: 44upx;
		height: 44upx;
		border-radius: 22upx;
		font-size: 24upx;
		display: block;
		width: 128upx;
		text-align: center;
	}

	.movie-right .item p {
		/* line-height: 46upx;
		height: 46upx; */
		font-size: 28upx;
		color: #e02e24;
		font-family: arial;
		margin-bottom: 10upx;
	}

	.movie-right .item span {
		font-size: 20upx;
	}

	.movie-right .item text {
		font-size: 24upx;
	}

	.movie-right .item text {
		width: 72upx;
	}

	.play-overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .8);
		z-index: 5;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.play-calendar {
		z-index: 20;
	}

	.range-wrap {
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.date-range {
		width: 80%;
		display: inline-flex;
		justify-content: space-evenly;
		align-items: center;
	}

	.date-range text:nth-child(2) {
		font-size: 20upx;
		color: #999;
	}
</style>
