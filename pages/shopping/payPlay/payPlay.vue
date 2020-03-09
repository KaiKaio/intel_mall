<template>
	<!-- 门票支付页 -->
	<view class="pay-play">
		<calendar ref="calendar" :disableBefore="true" @confirm="changeDate" :start-date="startDate" :end-date="endDate"></calendar>
		<view class="pay-jd-head">
			<view class="play-flex-cont name">
				<h3>{{detail.name}}{{detail.gid == 0 ? get_jd_data.name : ''}}</h3>
				<a v-if="detail.gid == 0" class="color-hdsh" @click="YData.xz=true">购买须知</a>
			</view>
			<view v-if="detail.gid == 1" class="play-flex-cont time">
				<text>开场时间: {{get_jd_data.stime}}</text>
				<text>散场时间: {{get_jd_data.etime}}</text>
			</view>
			<view v-if="detail.gid == 0" class="play-flex-cont name" @click="YData.xg ? orderDate.calendarShow=true : uni.showToast({
				title: '订单已生成，无法修改',
				mask: false,
				duration: 1500,
				icon: 'none'
			})">
				<h4>入园日期</h4>
				<view class="date">{{date}}</view>
				<a class="color-hdsh" @click="openCalendar">修改日期</a>
			</view>

			<view class="play-flex-cont name" style="display: flex;align-items: center;" v-if="detail.gid == 0">
				<h4>购买数量</h4>
				<uni-number-box @change="numChange" :min="1" :max="10"></uni-number-box>
			</view>
		</view>
		<!-- <view class="pay-jd-head sec">
			<view class="play-flex-cont name">
				<h4>费用说明</h4>
			</view>
			<view class="play-flex-cont name">
				<h5>费用说明</h5>
				<view class="hint">景区大门进入，内项目自费</view>
			</view>
		</view> -->
		<view class="pay-jd-head sec">
			<view class="play-flex-cont name">
				<h4>{{detail.gid == 0 ? "取票信息" : "验票信息"}}</h4>
				<view v-if="detail.gid == 0" class="hint" style="padding-top:.05rem;"><b>仅需填1位，</b>用于身份验证</view>
			</view>
			<view class="play-flex-cont name">
				<h5>{{detail.gid == 0 ? "取票人" : "验票人"}}</h5>
				<view class="hint"><input type="text" v-model="order[0].kw6" placeholder="请输入姓名" /></view>
			</view>
			<view class="play-flex-cont name">
				<h5>手机号码</h5>
				<view class="hint"><input type="text" v-model="order[0].kw7" placeholder="请输入手机号码" /></view>
			</view>
			<view v-if="detail.gid == 1" class="play-flex-cont name">
				<h5>身份证号</h5>
				<view class="hint"><input type="text" v-model="order[0].kw18" maxlength="18" placeholder="请输入身份证号" /></view>
			</view>
			<view v-if="detail.gid == 1" class="play-flex-cont name">
				<view class="t_a">
					<h5>人脸识别信息录入</h5>
					<text>请确保录入的是正面免冠照片，否则将影响入闸</text>
				</view>
				<image class="upload" @click="face" :src="faceImg" mode="aspectFit"></image>
			</view>
		</view>
		<!-- <view class="pay-jd-head sec">
			<view class="play-flex-cont name">
				<text class="face">人脸信息录入</text>
				<image class="upload" @click="face" :src="faceImg" mode="aspectFit"></image>
			</view>
		</view> -->
		<view class="pay-jd-head sec">
			<view class="play-flex-cont name">
				<h4>其他说明</h4>
			</view>
			<view class="play-flex-cont name">
				<h5>使用说明</h5>
				<view v-if="detail.gid == 0" class="hint">订购后取票务必携带相应身份证及可优惠证件，一票一证(儿童可无)</view>
				<view v-if="detail.gid == 1" class="hint">验票时请根据工作人员提示通过闸口，如人脸识别失败请进入门票订单详情中，出示二维码验证</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="choose-payment">
			<view class="pay pay-sub" @click="changePayment('ali')">
				<text class="font-icon icon-alipay">&#xe660;</text>
				<view class="weixin"><span>支付宝</span>
				</view>
				<text class="font-icon fr" v-if="payment == 'ali'">&#xe622;</text>
			</view>
			<view class="pay" @click="changePayment('wx')" style="margin-bottom: 50px;">
				<text class="font-icon icon-wx">&#xe7b0;</text>
				<view class="weixin"><span>微信支付</span>
				</view>
				<text class="font-icon fr" v-if="payment == 'wx'">&#xe622;</text>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifdef H5 || MP-WEIXIN -->
		<view class="pay">
			<text class="font-icon">&#xe7b0;</text>
			<view class="weixin"><span>微信支付</span><em>推荐</em></view>
			<text class="font-icon fr">&#xe622;</text>
		</view>
		<!-- #endif -->

		<view class="paymoney">
			<view class="money">合计：<span>¥{{order[0].kw4}}</span></view>
			<view class="pay-btn bg-hdsh" @click="paySubmit">立即支付</view>
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
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import calendar from "@/components/uni-calendar/uni-calendar.vue"
	// #ifdef H5
	import lrz from 'lrz'
	// #endif

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
	import {
		mapGetters
	} from 'vuex';
	export default {
		components: {
			uniNumberBox,
			calendar
		},
		data() {
			return {
				orderDate: {
					calendarShow: false,
					minDate: new Date(),
					maxDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 30),
					selectedDate: dateFormat(new Date(), "yyyy年MM月dd日")
				},
				date: dateFormat(new Date(), "yyyy年MM月dd日"),
				choosed: dateFormat(new Date(), "yyyy-MM-dd"), //入园日期
				startDate: this.myGetDate(0), //剧院票用：开始日期
				endDate: this.myGetDate(30), //剧院票用：结束日期
				// type: 'date',
				detail: {},
				order: [{
					"createuserid": this.$userMsg.userid, //创建人id
					"stime": '', //开始时间
					"name": '', //商店名称
					"cid": '', //产品id
					"gid": '', //订单类型
					"kw0": '', //商店名称
					"kw1": '', //商店电话
					"kw4": '', //总金额
					"kw5": 1, //数量
					"kw6": '', //收货人
					"kw7": '', //收货人电话
					"kw8": "微信", //支付方式
					"kw11": this.$DEVELOPER.name + "票务消费订单", //订单描述
					"kw17": "", //人脸照片
					"kw18": '', //身份证
					"appid": this.$DEVELOPER.szblid,
					"rpflag": this.$DEVELOPER.cid,
					"querykeyword": '', //快速搜索
					"unit": '', //商店id
					"jsondata": '', //规格id,数量,活动id
				}],
				order_id: '', //业务订单id
				YData: {
					xg: true,
					orderNum: '', //支付订单id
					xz: false //控制购买须知显示状态
				},
				payment: 'wx',
				payChoice: "微信",
				addre_list: "",
				timeAfter: 0, //防抖
				timeNow: 0, //防抖
				// faceImg: "/static/images/btn_upload.png",
				faceImg: require("@/static/images/btn_upload.png"), //人脸照片展位图
				faceImgUpLoadArr: [] //上传数组
			};
		},
		computed: {
			...mapGetters(['get_jd_data'])
		},
		watch: {
			// 监听支付标识
			payment() {
				if (this.payment == 'wx') {
					this.payChoice = "微信"
				}
				if (this.payment == 'ali') {
					this.payChoice = "支付宝"
				}
			}
		},
		onLoad(obj) {
			if (this.get_jd_data.cid == 4) {
				// 景点门票
				this.order[0].kw4 = parseFloat(this.get_jd_data.kw0).toFixed(2);
				this.order[0].stime = this.choosed;
			} else if (this.get_jd_data.cid == 6) {
				// 剧院票
				this.order[0].kw4 = this.get_jd_data.mark == 0 ? this.get_jd_data.kw13 : this.get_jd_data.kw14
				this.order[0].remarks = this.get_jd_data.mark
				let stime = new Date(this.get_jd_data.stime.replace(/-/g, '/')) //创建日期对象
				let stime_s = stime.getTime() //转化为时间戳毫秒数
				stime.setTime(stime_s - 1000 * 60 * 30) //时间减去30分钟
				this.order[0].stime = this.$base.dateFormat(stime)
				this.order[0].etime = this.get_jd_data.etime;
				this.order[0].jsondata = {
					start: this.get_jd_data.stime,
					end: this.get_jd_data.etime
				}
			}
			this.order[0].gid = this.get_jd_data.cid == 4 ? 4 : 8
			//景点详情数据
			this.$base.szblGet("/api/scplay/" + obj.id, {
				m: this.$userMsg.userid,
				tk: this.$userMsg.token,
				state: this.$base.getState()
			}).then(res => {
				this.detail = this.$base.strResToJson(res.data);
				this.photo = this.$base.strResToJson(this.detail.photo);
				this.order[0].photo = this.photo;
				this.order[0].name = this.detail.kw0;
				this.order[0].unit = this.detail.unit;
				this.order[0].cid = this.detail.id;
				this.order[0].kw0 = this.detail.name;
				this.order[0].kw1 = this.detail.kw8;
				this.order[0].querykeyword = this.detail.kw0;
				// console.log(this.order)
			}).catch((msg) => {
				console.log(msg);
				return;
			});


			//查收货地址
			this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
				m: this.$userMsg.userid,
				tk: this.$userMsg.token,
				state: this.$base.getState(),
			}).then(resData => {
				let res = this.$base.strResToJson(resData.data).address
				if (res == "" || res == "[]" || res == null) {
					this.addre_list = []
				} else {
					this.addre_list = res
					for (let i = 0; i < this.addre_list.length; i++) {
						if (this.addre_list[i].isDefault == true) {
							this.show_msg = this.addre_list[i];
							this.order[0].kw6 = this.show_msg.name;
							this.order[0].kw7 = this.show_msg.phone;
						}
					}
					// console.log(this.show_msg)
				}
				// this.$store.commit('set_address_data', res)
			}).catch((msg) => {
				console.log(msg)
			})
		},
		methods: {
			// chooseDate(e) {
			// 	// console.log(e);
			// 	if (e.date < 10) {
			// 		e.date = '0' + e.date
			// 	}
			// 	if (e.month < 10) {
			// 		e.month = '0' + e.month
			// 	}
			// 	this.date = e.year + "年" + e.month + "月" + e.date + "日"
			// 	this.choosed = e.fulldate;
			// 	this.order[0].stime = e.year + "-" + e.month + "-" + e.date
			// 	// this.order[0].stime = this.choosed;
			// 	// this.startDate = this.choosed;
			// },
			// 修改日期
			changeDate(e) {
				console.log(e);
				this.date = e.year + "年" + e.month + "月" + e.date + "日"
				this.choosed = e.fulldate;
				this.order[0].stime = e.year + "-" + e.month + "-" + e.date
				// console.log(e)
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
				// 				if (m >= 1 && m <= 9) {
				// 					m = "0" + m;
				// 				}
				// 				// 对月份进行处理，1-9号在前面添加一个“0”
				// 				if (d >= 0 && d <= 9) {
				// 					d = "0" + d;
				// 				}
				return y + "-" + m + "-" + d;
			},
			// 修改购买数量
			numChange(value) {
				if (!this.YData.xg) {
					uni.showToast({
						title: '订单已生成不可修改',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
				}
				this.order[0].kw5 = value;
				this.order[0].kw4 = parseFloat(this.order[0].kw5 * this.get_jd_data.kw0).toFixed(2);
			},
			/**
			 * 支付方法
			 * @param {String} orderid 实际支付订单
			 */
			payUp(orderid) {
				// console.log(orderid)

				uni.showToast({
					title: '',
					icon: 'loading',
					mask: true,
					duration: 50000,
				});
				if (this.payment == 'ali') {
					this.$base.szblGet("/api/alipayApp/" + orderid, {
						alisid: this.$DEVELOPER.aliPayMark,
						u: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState()
					}).then((dataJson) => {
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: dataJson.data, //微信、支付宝订单数据
							success: (res) => {
								// console.log('success:' + JSON.stringify(res));
								this.paySuccess();
								uni.hideToast();
								uni.showToast({
									title: '订单支付成功',
									icon: 'none',
									mask: false,
									duration: 1000
								});
							},
							fail: (err) => {
								// console.log('fail:' + JSON.stringify(err));
								uni.hideToast();
								if (err.errMsg == 'requestPayment:fail:[payment支付宝:62001]用户中途取消支付操作') {
									uni.redirectTo({
										url: '/pages/order/orderPlay/orderPlay?type=0',
										success: res => {},
										fail: () => {},
										complete: () => {}
									});
								} else {
									uni.showToast({
										title: '订单支付失败',
										icon: 'none',
										mask: false,
										duration: 1000
									});
								}
							}
						});
					}).catch((msg) => {
						console.log(msg);
					})
				} else if (this.payment == 'wx') {
					let mark = ''
					if (this.$TERMINAL.m == 'nmy') {
						mark = this.$DEVELOPER.nmyPayMarkApp
					} else {
						mark = this.$DEVELOPER.wxPayMarkAPP
					}
					this.$base.szblGet("/api/wechatpayApp/" + orderid, {
						wxsid: mark,
						u: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState()
					}).then(dataJson => {
						this.$PAYSUCCMSG.length = 0
						let obj = {
							phones: this.detail.kw8,
							cn_1: this.order[0].kw0,
							cn_2: "新加",
							cn_3: this.order[0].kw6 + "预订了" + this.order[0].name.replace(/【/g, " ").replace(/】/g, " "),
							order_id: this.order_id
						}
						this.$PAYSUCCMSG.push(obj)
						if (this.$TERMINAL.os == 'i') {
							window.webkit.messageHandlers.iosWechatPay.postMessage({
								body: JSON.parse(dataJson.data)
							});
						} else if (this.$TERMINAL.os == 'a') {
							window.android.androidWechatPay(dataJson.data)
						} else {
							// console.log(dataJson.data)
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: JSON.parse(dataJson.data), //微信、支付宝订单数据
								success: (res) => {
									// console.log('success:' + JSON.stringify(res));
									this.paySuccess();
									uni.hideToast();
									uni.showToast({
										title: '订单支付成功',
										icon: 'none',
										mask: false,
										duration: 1000
									});
								},
								fail: (err) => {
									// console.log('fail:' + JSON.stringify(err));
									uni.hideToast();
									uni.redirectTo({
										url: '/pages/order/orderPlay/orderPlay?type=0',
										success: res => {},
										fail: () => {},
										complete: () => {}
									});
									uni.showToast({
										title: '订单支付失败',
										icon: 'none',
										mask: false,
										duration: 1000
									});
								}
							});
						}
					}).catch((msg) => {
						console.log(msg);
						uni.hideToast();
					})
				}
			},
			// 支付成功后通知商家
			paySuccess() {
				let obj = {
					"phones": this.detail.kw8,
					"cn_1": this.order[0].name,
					"cn_2": "新加",
					"cn_3": this.order[0].kw6 + "预订了" + this.order[0].kw0.replace(/【/g, " ").replace(/】/g, " "),
				}

				this.$base.paySuccess(0, this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.szblid, this.order_id, obj.phones,
					obj.cn_1, obj.cn_2, obj.cn_3)

			},
			// 修改支付标识
			changePayment(mark) {
				this.payment = mark
			},
			// 下单并调起支付
			paySubmit() {
				let _this = this
				let delayTime = 1500
				this.timeNow = Date.now()
				if (this.timeNow - this.timeAfter >= 1500) {
					this.timeAfter = this.timeNow
				} else {
					uni.showToast({
						mask: false,
						title: '请勿重复下单',
						duration: 1000,
						icon: "none"
					})
					return
				}
				this.order[0].kw8 = this.payChoice
				// this.order[0].jsondata = this.get_jd_data.id + ',' + this.order[0].kw5 + ',00'
				this.order[0].htmldata = this.get_jd_data.id + ',' + this.order[0].kw5 + ',00,' + this.detail.id + '----'

				// #ifdef H5

				// var ua = window.navigator.userAgent.toLowerCase();
				// if (ua.match(/MicroMessenger/i) != 'micromessenger') {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		mask: false,
				// 		title: '请关注“海岛生活”微信公众号打开',
				// 		duration: 1000
				// 	})
				// 	return false;
				// }
				// #endif
				function wechatPay() {
					// #ifdef H5
					uni.showToast({
						title: '',
						icon: 'loading',
						mask: true,
						duration: 2000
					});
					// 微信H5支付
					_this.$base.getWxPay(_this.$userMsg.userid, _this.$userMsg.token, _this.YData.orderNum, _this.$DEVELOPER.wxPayMarkPUBLIC,
						uni.getStorageSync("wxOpenid")).then((res)  => {
							//支付成功
							// if (res == "ok") {
							_this.paySuccess();
							// }
						}).catch((msg) => {
						alert(msg);
					});
					// #endif

					// #ifdef MP-WEIXIN
					// 微信小程序支付
					_this.$base.getWxxcxPay(_this.$userMsg.userid, _this.$userMsg.token, _this.YData.orderNum, _this.$DEVELOPER.wxPayMarkXCX,
						uni.getStorageSync("wxXCXOpenid")).then((res) => {
						// console.log(res)
						uni.requestPayment({
							provider: "wxpay",
							timeStamp: res.timeStamp.toString(),
							nonceStr: res.nonceStr,
							package: res.package,
							signType: res.signType,
							paySign: res.paySign,
							success: (resData) => {
								// console.log(resData)
								_this.paySuccess()
							}
						})
					}).catch((msg) => {
						console.log(msg)
					})
					// #endif
				}

				if (!(/^([\u4e00-\u9fa5]){2,7}$/).test(this.order[0].kw6)) {
					uni.showToast({
						title: '请输入取票人姓名',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
				}
				if (!(/^1\d{10}$/).test(this.order[0].kw7)) {
					uni.showToast({
						title: '请输入取票人手机号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
				}
				if (this.detail.gid == 1) {
					if (this.order[0].kw18 == '') {
						uni.showToast({
							title: '请输入身份证号',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						return;
					}
					if (this.testid(this.order[0].kw18).status == 0) {
						uni.showToast({
							title: '请输入正确的身份证号',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						return;
					}

					if (this.faceImgUpLoadArr.length == 0) {
						uni.showToast({
							title: '请录入人脸信息',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						return;
					}
				}

				// let strOrder = JSON.stringify(this.order)
				// let strOrder = this.$base.jsonResToStr(this.order)

				if (this.YData.orderNum) {
					// 调起支付
					// #ifdef APP-PLUS
					this.payUp(this.YData.orderNum);
					// #endif
					// #ifdef H5 || MP-WEIXIN
					if (this.payment == 'wx') {
						if (this.$TERMINAL.m == 'nmy') {
							this.payUp(this.YData.orderNum);
						} else {
							wechatPay();
						}
					} else if (this.payment == 'sc') {
						this.payUp(this.YData.orderNum);
					}
					// #endif
					return;
				} else {
					//生成订单
					if (this.order[0].gid == 8) {
						// 剧院票
						uni.showLoading({
							mask: true
						})
						// 上传图片
						this.$base.szblPost("/api/media/img?u=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" +
							this.$base.getState(), this.faceImgUpLoadArr).then(dataJson => {
							this.order[0].kw17 = this.$base.strResToJson(dataJson.data)
							
							this.order[0].kw5 = this.$base.getRSAEncryptStr(this.order[0].kw5)
							this.order[0].kw4 = this.$base.getRSAEncryptStr(this.order[0].kw4 * 100)
							
							let strOrder = this.$base.jsonResToStr(this.order)
							// 生成订单
							this.$base.szblPost("/api/sciorder?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" +
								this.$base
								.getState(),
								strOrder).then(res => {
								let r = this.$base.strResToJson(res.data)
								this.YData.xg = false;
								this.YData.orderNum = r[0].kw2;
								this.order_id = r[0].id;

								//海康上传人脸接口
								// this.$base.szblPost("/api/hkfaces?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" +
								// 	this.$base
								// 	.getState(), {
								// 		kw0: r[0].kw6,
								// 		kw1: r[0].kw18,
								// 		kw2: this.faceImgUpLoadArr.photo
								// 	}).then(fres => {
								// 	console.log(fres, '添加成功');
								// }).catch(msg => {
								// 	console.log(msg);
								// })

								// this.paySuccess()
								// return


								// #ifdef APP-PLUS
								this.payUp(this.YData.orderNum);
								// #endif

								// #ifdef H5 || MP-WEIXIN
								if (this.payment == 'wx') {
									if (this.$TERMINAL.m == 'nmy') {
										this.payUp(this.YData.orderNum);
									} else {
										wechatPay();
									}
								} else if (this.payment == 'sc') {
									this.payUp(this.YData.orderNum);
								}
								// #endif
								uni.hideLoading()
							}).catch((msg) => {
								uni.hideLoading()
								uni.showToast({
									title: msg,
									icon: "none",
									duration: 1500,
									mask: false
								})
								return;
							});
						}).catch(msg => {
							uni.hideLoading()
							uni.showToast({
								title: '图片上传失败',
								icon: 'none',
								mask: false,
								duration: 1500
							})
							console.log(msg);
						});
					} else {
						// 门票：gid=4
						uni.showLoading({
							mask: true
						})
						
						this.order[0].kw5 = this.$base.getRSAEncryptStr(this.order[0].kw5)
						this.order[0].kw4 = this.$base.getRSAEncryptStr(this.order[0].kw4 * 100)
						
						let strOrder = this.$base.jsonResToStr(this.order)
						this.$base.szblPost("/api/sciorder?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" +
							this.$base
							.getState(),
							strOrder).then(res => {
							let r = this.$base.strResToJson(res.data)
							this.YData.xg = false;
							this.YData.orderNum = r[0].kw2;
							this.order_id = r[0].id;

							// this.paySuccess()
							// return


							// #ifdef APP-PLUS
							this.payUp(this.YData.orderNum);
							// #endif

							// #ifdef H5 || MP-WEIXIN
							if (this.payment == 'wx') {
								if (this.$TERMINAL.m == 'nmy') {
									this.payUp(this.YData.orderNum);
								} else {
									wechatPay();
								}
							} else if (this.payment == 'sc') {
								this.payUp(this.YData.orderNum);
							}
							// #endif
							uni.hideLoading()
						}).catch((msg) => {
							uni.hideLoading()
							uni.showToast({
								title: msg,
								icon: "none",
								duration: 1500,
								mask: false
							})
							return;
						});
					}

				}

			},
			// 调起相机
			face() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['camera'],
					success: (res) => {
						//tempFilePaths 图片的本地文件路径列表
						//tempFiles 图片的本地文件列表，每一项是一个 File 对象
						console.log(res.tempFilePaths);
						console.log(res.tempFiles);
						this.faceImg = res.tempFilePaths[0]
						// 压缩
						// #ifndef H5
						// 待测试
						uni.compressImage({
							src: res.tempFilePaths[0],
							quality: 100,
							success: rst => {
								this.faceImgUpLoadArr = [{
									photo: rst.path,
									len: rst.size
								}]
							},
							fail: msg => {
								console.log(msg);
							}
						})
						// #endif

						// #ifdef H5
						lrz(res.tempFilePaths[0], {
							quality: 1
						}).then(rst => {
							this.faceImgUpLoadArr = [{
								photo: rst.base64,
								len: rst.base64Len
							}]
						}).catch(err => {
							console.log(err);
						})
						// #endif
					}
				})
			},
			// 验证身份证号
			testid(id) {
				// 1 "验证通过!", 0 //校验不通过
				var format =
					/^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
				//号码规则校验
				if (!format.test(id)) {
					return {
						'status': 0,
						'msg': '身份证号码不合规'
					};
				}
				//区位码校验
				//出生年月日校验   前正则限制起始年份为1900;
				var year = id.substr(6, 4), //身份证年
					month = id.substr(10, 2), //身份证月
					date = id.substr(12, 2), //身份证日
					time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
					now_time = Date.parse(new Date()), //当前时间戳
					dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
				if (time > now_time || date > dates) {
					return {
						'status': 0,
						'msg': '出生日期不合规'
					}
				}
				//校验码判断
				var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
				var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
				var id_array = id.split("");
				var sum = 0;
				for (var k = 0; k < 17; k++) {
					sum += parseInt(id_array[k]) * parseInt(c[k]);
				}
				if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
					return {
						'status': 0,
						'msg': '身份证校验码不合规'
					}
				}
				return {
					'status': 1,
					'msg': '校验通过'
				}
			},
			// 打开日期控件 
			openCalendar() {
				this.$refs.calendar.open();
			},
		}
	}
</script>

<style>
	.play-flex-cont {
		display: flex;
	}

	.pay-jd-head {
		background: #fff;
		/* padding: 0 4%; */
		margin-bottom: 15upx;
		/* width: 750upx; */
	}

	.pay-jd-head .name:last-child {
		border: none;
	}

	.pay-jd-head .name {
		padding: 25upx 20upx 25upx 30upx;
		/* padding: 25upx 0; */
		border-bottom: 2upx solid #eee;
		justify-content: space-between;
	}

	.pay-jd-head .name h5 {
		text-align: center;
	}

	.pay-jd-head .name h3 {
		line-height: 38upx;
		font-size: 36upx;
		width: 70%;
	}

	.pay-jd-head .name a {
		font-size: 24upx;
		/* color: #7bbfea; */
		/* color: #00A0EA; */
	}

	.pay-jd-head .name h4 {
		font-size: 28upx;
		width: 140upx;
	}

	.pay-jd-head .name .face {
		font-size: 28upx;
		width: 140upx;
	}

	.pay-jd-head .time {
		padding: 25upx 20upx 25upx 30upx;
		border-bottom: 2upx solid #eee;
		flex-direction: column;
		justify-content: space-between;
	}

	.num-box {
		border-radius: 8upx;
		border: 2upx solid #eee;
		line-height: 46upx;
		height: 46upx;
	}

	.num-box span {
		width: 45upx;
	}

	.num-box input {
		width: 66upx;
		border-left: 1px solid #eee;
		border-right: 1px solid #eee;
		background: #fff;
		color: #000;
	}

	.pay-jd-head h5 {
		font-size: 24upx;
		color: #999;
		width: 140upx;
		margin-right: 20upx;
	}

	.pay-jd-head .hint {
		font-size: 24upx;
		width: 70%;
	}

	.pay-jd-head.sec .name {
		justify-content: inherit;
	}

	.pay-jd-head.sec b {
		font-weight: normal;
		color: #e02e24;
	}

	.pay-jd-head.sec input {
		width: 100%;
	}

	.play-flex-cont .t_a {
		width: 140upx;
		text-align: center;
		margin-right: 20upx;
	}

	.t_a text {
		color: #e02e24;
	}

	.calendar {
		display: block;
	}

	/* .play-calendar {
		position: absolute;
		height: 892upx;
		width: 706upx;
		margin: auto;
		z-index: 20;
		border-radius: 7px;
		border: 1px #eee solid;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.play-overlay {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .8);
		z-index: 5;
	} */
	.play-calendar {
		/* position: absolute;
		height: 892upx;
		width: 706upx;
		margin: auto; */
		z-index: 20;
		/* border-radius: 7px;
		border: 1px #eee solid;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0; */
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

	.cancel-overlay {
		position: absolute;
		top: 20upx;
		right: 20upx;
		font-size: 40upx;
		color: #E0E0E0;
	}

	.pay-play {
		position: relative;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 750upx;
		min-height: 100vh;
	}

	.upload {
		width: 200upx;
		height: 200upx;
		border: 2upx solid #999;
		border-radius: 20upx;
	}
</style>
