<template>
	<!-- 优惠券绑定页面 -->
	<view>
		<view class="top-wrap">
			<view class="coupon-wrap bg-hdsh">
				<image class="border top-border" src="/static/images/coupon-top-750-6.png" mode=""></image>
				<image class="border bottom-border" src="/static/images/coupon-bottom-750-6.png" mode=""></image>
				<text class="title">{{detail.name}}</text>
				<view class="date-wrap">
					<text class="line left"></text>
					<text class="date">{{detail.stime + ' 至 ' + detail.etime}}</text>
					<text class="line right"></text>
				</view>
				<image class="bg-img" src="" mode=""></image>
				<view class="price-wrap">
					<text v-if="detail.kw0 == '2'">￥</text>
					<text>{{detail.kw1}}{{detail.kw0 == '1' ? '折': ''}}</text>
				</view>
				<view class="condition">
					{{'单次消费满' + detail.kw4 + '元可' + (detail.kw0 == '1' ? '享受折扣' : '抵扣')}}
				</view>
			</view>
			<text class="expired-hint" v-if="detail.status == 3">
				已过期
			</text>
			<view class="button-wrap">
				<view class="button" v-if="isBind == true" @click="goHome">
					<text>已领取优惠券，去使用</text>
				</view>
				<view class="button" v-else :style="detail.status == 3 ? 'opacity: 0.3' : ''" @click="binding">
					<text>确认领取</text>
				</view>
			</view>
		</view>
		<view class="bottom-wrap">
			<view class="title-wrap">
				<view class="line left"></view>
				<text class="title">
					猜你喜欢
				</text>
				<view class="line right"></view>
			</view>
			<list-shop :path="pathShop" :obj="objShop" ref="loadData" @pageNum="listenPageNum"></list-shop>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pathShop: '/api/scdsc',
				objShop: {
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					"gid": '',
					"kw": '',
					"status": 2,
					"type": 1,
					"orderby": '',
					"cid": "001004",
					// "psize": 20,
					"psize": 27,
					"pnum": 1,
					"rpflag": this.$DEVELOPER.cid,
					// "areacode": this.$areaMsg.id
				},
				page_num: 0,
				detail: {},
				isBind: false, // 是否为已领取状态，控制按钮
			}
		},
		onLoad(obj) {
			this.getCouponDetail(obj.i)
		},
		onReachBottom() {
			this.objShop.pnum++;
			if (this.objShop.pnum > this.page_num) {
				return
			} else {
				this.$refs.loadData.loadData(false);
			}
		},
		methods: {
			/**
			 * 监听当前页数
			 * @param {Number} data 页数
			 */
			listenPageNum(data) {
				this.page_num = data
			},
			/**
			 * 获取优惠券详情
			 * @param {String} id 优惠券id
			 */
			getCouponDetail(id) {
				this.$base.szblGet("/api/scactivity/" + id, {
					m: this.objShop.m,
					tk: this.objShop.tk,
					state: this.$base.getState()
				}).then(res => {
					this.detail = this.$base.strResToJson(res.data)
					this.detail.stime = this.detail.stime.substr(0,16)
					this.detail.etime = this.detail.etime.substr(0,16)
					if(this.detail.kw0 == '1'){ // 如果是折扣
						if(this.detail.kw1.indexOf('.0') == -1){
							this.detail.kw1 = parseFloat(this.detail.kw1)
						}else{
							this.detail.kw1 = parseInt(this.detail.kw1)
						}
					}
					console.log(this.detail.kw1, '折扣详情');
					console.log(this.detail);
				}).catch(msg => {
					console.log(msg);
				})
			},
			// 绑定优惠券
			binding() {
				if (this.detail.status == 3) {
					return
				}
				// 判断是否登录，若未登录，则进入登录方法
				if(this.$userMsg.userid == null) {
					this.isLogin()
					return
				}
				
				this.$base.szblPost('/api/screla?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this.$base
					.getState(), {
						objectid: this.$userMsg.userid,
						relationid: this.detail.id,
						gid: 2
					}).then(res => {
					// console.log(this.$base.strResToJson(res.data));
					uni.showToast({
						icon: 'none',
						title: '领取成功！',
						duration: 1500,
						mask: false
					})
					this.isBind = true
				}).catch(msg => {
					console.log(msg);
					if(msg == '该关联关系已经添加过了!!'){
						uni.showToast({
							icon: 'none',
							title: '您已领取过此优惠券了',
							duration: 1500,
							mask: false
						})
						this.isBind = true
					}
				})
			},
			
			isLogin(mark, obj, status) {
				this.$store.commit('set_page_data', {
					page: this.$route.fullPath,
				})
				uni.navigateTo({
					url: '/pages/component/login/login?m=null',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			
			goHome() {
				uni.switchTab({
					url: "/pages/tabBar/index/index"
				})
			}
		}
	}
</script>

<style>
	.flex-box {
		display: flex;
		align-content: flex-start;
	}

	.top-wrap {
		border: 0upx solid black;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		padding: 24upx 30upx 0upx;
	}

	.coupon-wrap {
		border: 0upx solid black;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		height: 350upx;
		font-size: 28upx;
		color: rgb(255, 255, 255);
		position: relative;
		padding: 0upx 16upx;
		/* background-color: rgb(170, 170, 170); */
	}

	.coupon-wrap .border {
		display: flex;
		width: 100%;
		height: 6upx;
		left: 0upx;
		position: absolute;
		object-fit: cover;
	}

	.coupon-wrap .top-border {
		top: 0upx;
	}

	.coupon-wrap .bottom-border {
		bottom: 0upx;
	}

	.coupon-wrap .title {
		white-space: pre-wrap;
		border: 0upx solid black;
		position: relative;
		box-sizing: border-box;
		display: block;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		font-size: 28upx;
		padding-top: 36upx;
		text-align: center;
		color: rgb(255, 255, 255);
	}

	.coupon-wrap .date-wrap {
		border: 0upx solid black;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-content: flex-start;
		flex-shrink: 0;
		height: 30upx;
		margin-top: 20upx;
	}

	.date-wrap .line {
		white-space: pre-wrap;
		border-width: 2upx 0upx 0upx;
		border-style: solid;
		border-color: rgba(255, 255, 255, 0.2);
		border-image: initial;
		position: relative;
		box-sizing: border-box;
		display: block;
		flex-direction: column;
		align-content: flex-start;
		flex: 1 1 0%;
		font-size: 32upx;
		top: 12upx;
	}

	.date-wrap .left {
		margin-right: 48upx;
	}

	.date-wrap .right {
		margin-left: 48upx;
	}

	.date {
		white-space: pre-wrap;
		border: 0upx solid black;
		position: relative;
		box-sizing: border-box;
		display: block;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		font-size: 24upx;
		color: rgb(255, 255, 255);
	}

	.coupon-wrap .bg-img {
		display: flex;
		width: 178upx;
		height: 164upx;
		right: 40upx;
		bottom: 60upx;
		position: absolute;
	}

	.coupon-wrap .price-wrap {
		border: 0upx solid black;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-content: flex-start;
		flex-shrink: 0;
		left: 32upx;
		bottom: 80upx;
		color: rgb(255, 255, 255);
		position: absolute;
		align-items: flex-end;
	}

	.coupon-wrap .price-wrap text:nth-child(1) {
		white-space: pre-wrap;
		border: 0upx solid black;
		position: relative;
		box-sizing: border-box;
		display: block;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		font-size: 36upx;
		top: -16upx;
		color: rgb(255, 255, 255);
	}

	.coupon-wrap .price-wrap text:nth-child(2) {
		white-space: pre-wrap;
		border: 0upx solid black;
		position: relative;
		box-sizing: border-box;
		display: block;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		font-size: 70upx;
		color: rgb(255, 255, 255);
	}

	.coupon-wrap .condition {
		white-space: pre-wrap;
		border: 0upx solid black;
		position: absolute;
		box-sizing: border-box;
		display: block;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		font-size: 28upx;
		left: 32upx;
		bottom: 32upx;
		color: rgb(255, 255, 255);
	}

	.expired-hint {
		white-space: pre-wrap;
		border: 0upx solid black;
		position: relative;
		box-sizing: border-box;
		display: block;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		font-size: 28upx;
		color: rgb(255, 80, 0);
		text-align: center;
		margin: 20upx 0upx;
	}

	.button-wrap {
		border: 0upx solid black;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		margin-top: 32upx;
	}

	.button-wrap .button {
		border: 0upx solid black;
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		place-content: flex-start center;
		flex-shrink: 0;
		cursor: pointer;
		height: 80upx;
		/* background-image: linear-gradient(to right, #e82a1a, #c72518); */
		background-image: linear-gradient(to right, #7bbfea, #00a0ea);
		border-radius: 8upx;
		padding: 12upx 25upx;
		/* opacity: 0.3; */
	}

	.button-wrap .button text {
		white-space: pre-wrap;
		border: 0upx solid black;
		position: relative;
		box-sizing: border-box;
		display: block;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		font-size: 32upx;
		color: rgb(255, 255, 255);
		text-align: center;
	}

	.bottom-wrap {
		border: 0upx solid black;
		box-sizing: border-box;
		display: flex;
		-webkit-box-orient: vertical;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
	}

	.bottom-wrap .title-wrap {
		border: 0upx solid black;
		box-sizing: border-box;
		display: flex;
		-webkit-box-orient: horizontal;
		flex-direction: row;
		align-content: flex-start;
		flex-shrink: 0;
		height: 80upx;
		-webkit-box-align: center;
		align-items: center;
		padding: 0upx 30upx;
	}

	.title-wrap .line {
		border-width: 2upx 0upx 0upx;
		border-style: solid;
		border-color: rgb(221, 221, 221);
		border-image: initial;
		box-sizing: border-box;
		display: flex;
		-webkit-box-orient: vertical;
		flex-direction: column;
		align-content: flex-start;
		flex: 1 1 0%;
		-webkit-box-flex: 1;
	}

	.title-wrap .title {
		white-space: pre-wrap;
		border: 0upx solid black;
		position: relative;
		box-sizing: border-box;
		display: block;
		-webkit-box-orient: vertical;
		flex-direction: column;
		align-content: flex-start;
		flex-shrink: 0;
		font-size: 24upx;
		color: rgb(153, 153, 153);
		margin-left: 72upx;
		margin-right: 72upx;
	}
</style>
