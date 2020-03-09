<template>
	<!-- 优惠券列表 -->
	<view>
		<view class="store" v-for="(store, sIndex) in store_list" :key="sIndex" v-if="store_list.length > 0">
			<view class="title">
				<image :src="store.photo == '' ? default_img : store.photo" mode="aspectFit"></image>
				<text>{{store.name}}</text>
				<text @click="toStore(store.id)">进店</text>
			</view>
			<view class="coupon" v-for="(coupon, cIndex) in store.coupon" :key="cIndex" :class="{'m-t-10' : cIndex != 0}">
				<view class="coupon-left">
					<text class="color-hdsh">{{'单次消费满' + coupon.kw4 + '元' + (coupon.kw0 == '1' ? ('可打' + coupon.kw1 + '折') : ('减' + coupon.kw1 + '元'))}}</text>
					<text>店铺优惠券（{{coupon.kw6 == '0' ? '可与活动叠加' : '不可与活动叠加'}}）</text>
					<text>部分商品可用</text>
					<text>{{coupon.stime + ' 至 ' + coupon.etime}}</text>
				</view>
				<view class="tear-line"></view>
				<view class="coupon-right">
					<text @click="toUseCoupon(store.id, coupon.id)">去使用</text>
				</view>
			</view>
		</view>
		<view v-if="store_list.length <= 0" class="no-list">
			<text>您还未领取过优惠券</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				default_img: require('@/static/icon/default.png'),
				store_list: [], //以店铺为单位存放优惠券列表
			}
		},
		onLoad() {
			this.getCoupon()
		},
		methods: {
			// 获取优惠券列表，然后分店铺显示
			getCoupon() {
				this.$base.szblGet('/api/screla/listCoupon', {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
					objectid: this.$userMsg.userid,
					status: 0,
					psize: 100,
					pnum: 1
				}).then(res => {
					let list = this.$base.strResToJson(res.data)
					console.log(list);

					// 先把商店分出来
					list.forEach((lItem, lIndex) => {
						lItem.stime = lItem.stime.substr(0, 16)
						lItem.etime = lItem.etime.substr(0, 16)
						if (lItem.kw0 == '1') {
							if (lItem.kw1.indexOf('.0') != -1) {
								lItem.kw1 = parseInt(lItem.kw1)
							} else {
								lItem.kw1 = parseFloat(lItem.kw1) * 10
							}
						}
						if (lIndex == 0) {
							let shop = {
								id: lItem.unit,
								name: '',
								photo: '',
								coupon: []
							}
							this.store_list.push(shop)
						} else {
							if (this.store_list.filter(element => {
									return element.id == lItem.unit
								}).length == 0) {
								this.store_list.push({
									id: lItem.unit,
									name: '',
									photo: '',
									coupon: []
								})
							}
						}
					})

					// 再往商店里加优惠券 
					this.store_list.forEach((sItem, sIndex) => {
						this.$base.szblGet('/api/scshop/' + sItem.id, {
							m: this.$DEVELOPER.szblid,
							tk: this.$DEVELOPER.token,
							state: this.$base.getState()
						}).then(res => {
							let resData = this.$base.strResToJson(res.data)
							if (resData.kw6 != "" && resData.kw6.indexOf('失败') == -1) {
								sItem.photo = this.$base.urlPrex + this.$base.strResToJson(resData.kw6)[0];
							} else {
								sItem.photo = ''
							}
							sItem.name = resData.name
						}).catch(msg => {
							console.log(msg);
						})
						list.forEach((lItem, lIndex) => {
							if (sItem.id == lItem.unit) {
								sItem.coupon.push(lItem)
							}
						})
					})


				}).catch(msg => {
					console.log(msg);
				})
			},
			// 进店
			toStore(id) {
				uni.navigateTo({
					url: '/pages/shopping/store/store?id=' + id + '&m=1',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 使用优惠券,todo
			toUseCoupon(storeId, couponId) {
				uni.navigateTo({
					url: '/pages/shopping/store/store?id=' + storeId + '&m=1',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	.store {
		background: #fff;
		padding: 20upx;
		margin: 20upx;
		border-radius: 10upx;
	}

	.store .title {
		display: flex;
		align-items: center;
		position: relative;
		margin-bottom: 20upx;
	}

	.store image {
		width: 80upx;
		height: 80upx;
		margin-right: 20upx;
		flex-shrink: 0;
	}

	.store .title text:first-child {
		max-width: 440upx;
	}

	.store .title text:last-child {
		position: absolute;
		right: 20upx;
		display: block;
		padding: 4upx 20upx;
		border: solid 2upx #999;
		border-radius: 40upx;
		color: #999;
	}

	/* .coupon {
		width: 670upx;
		height: 168upx;
		border-radius: 10upx;
		display: flex;
		position: relative;
		background: #7bbfea6E;
		overflow: hidden;
	}

	.coupon:after,
	.coupon:before {
		content: '';
		position: absolute;
		height: 20upx;
		width: 20upx;
		background: #fff;
		border-radius: 10upx;
		right: 168upx;
	}

	.coupon:before {
		top: -10upx
	}

	.coupon:after {
		bottom: -10upx
	}

	.tear-line {
		width: 2upx;
		height: 100%;
		background-image: linear-gradient(to bottom, #000 0%, #000 50%, transparent 50%);
		background-size: 2upx 12upx;
		background-repeat: repeat-y;
	}

	.coupon-left {
		width: 504upx;
		display: flex;
		flex-direction: column;
		padding-left: 20upx;
		justify-content: center;
	}

	.coupon-left text:nth-child(2) {
		color: #999;
		font-size: 26upx;
	}

	.coupon-left text:last-child {
		font-size: 16upx;
	}

	.coupon-right {
		width: 180upx;
		position: relative;
		display: flex;
		align-items: center;
	}

	.coupon-right text {
		position: absolute;
		right: 20upx;
		display: block;
		padding: 4upx 20upx;
		border: solid 2upx #00a0ea;
		border-radius: 40upx;
		color: #00a0ea;
	}

	.m-t-10 {
		margin-top: 20upx;
	} */

	.no-list {
		height: 800upx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.no-list text {
		color: #58595b;
		font-size: 32upx;
	}
</style>
