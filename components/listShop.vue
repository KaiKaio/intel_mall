<template>
	<!-- 商品的列表 -->
	<view class="">
		<view class="new-list">
			<view class="new-item" v-for="(x,index) in shopList" :key="index" @click="toShopDetail(x)">
				<!-- <image :src="$base.urlPrex + x.photo[0]" mode="aspectFit"></image> -->
				<image :src="x.photo[0]" mode="aspectFit"></image>
				<view class="item-bottom">
					<view class="name">
						{{x.name}}
					</view>
					<view class="detail">
						<text v-if="x.list.length == 0" class="price">¥{{x.kw1}}</text>
						<text v-if="x.list.length != 0" class="price">¥{{x.now_price}}</text>
						<!-- <view class="sales">
							销量{{x.kw2}}
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<view id="shop-bottom-hint" class="bottom-hint">
			{{b_hint}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			path: {
				type: String,
				default: ''
			},
			obj: {
				type: Object,
				default(){
					return {}
				}
			},
			mark: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				b_hint: '到底啦~',
				shopList: []
			};
		},
		created() {
			this.loadData();
		},
		mounted() {
			// console.log(this.obj)
		},
		methods: {
			loadData(mark) {
				if(mark){
					this.shopList = []
				}
				uni.showLoading({
					title: '',
					mask: true,
				});
				this.$base.szblGet(this.path, this.obj).then((res) => {
					this.$emit('pageNum', res.pages)
					this.$emit('num', res.num)
					var shopList = this.$base.strResToJson(res.data);
					console.log(shopList)
					for (var i = 0; i < shopList.length; i++) {
						shopList[i].photo = this.$base.strResToJson(shopList[i].photo)
						// if(shopList[i].list.length != 0){
							for(let j = 0; j < shopList[i].list.length; j++){
								if(shopList[i].list[j].gid == '1'){
									// 只有活动才计算活动价
									// let act = shopList[i].list[j].kw0 == '1' ? parseFloat(shopList[i].list[0].kw1) : parseFloat(shopList[i].list[0].kw2),
									let act = parseFloat(shopList[i].list[0].kw1), //获取第一个活动
										now_price = shopList[i].list[j].kw0 == '1' ? (shopList[i].kw1 * act / 10) : (shopList[i].kw1 - act)
									now_price = this.$base.numberFormat(now_price, 2 , '.')
									shopList[i].act = act; //kw0=1为折扣（按10来算），kw0=2为减价
									shopList[i].now_price = now_price;
									break //计算第一次活动价后跳出循环
								}else{
									// 优惠券则跳出本轮循环
									if(j == shopList[i].list.length - 1){
										shopList[i].now_price = shopList[i].kw1;
									}else{
										continue
									}
								}
							}
						for (var j = 0; j < shopList[i].photo.length; j++) {
							shopList[i].photo[j] = this.$base.urlPrex + shopList[i].photo[j]
						}
						this.shopList.push(shopList[i])
					}
					uni.hideLoading()
				}).catch((msg) => {
					console.log(msg);
					uni.hideLoading()
					return;
				})
			},
			// 到商品详情
			toShopDetail(x) {
				uni.navigateTo({
					url: '/pages/shopping/detailShop/detailShop?id=' + x.id,
				});
			},
		}
	}
</script>

<style>
	.shop-list {
		display: flex;
		justify-content: space-evenly;
		/* padding: 0 3.33%; */
	}

	.shop-list .warp-ul {
		overflow: hidden;
		/* width: 100.8%; */
		width: 48.36%;
	}

	.shop-list .warp-li {
		/* flex-shrink: 0; */
		/* width: 49.2%; */
		width: 100%;
		position: relative;
		float: left;
		margin-bottom: 8upx;
		margin-right: 0.79%;
		background: #fff;
		border-radius: 8upx;
		overflow: hidden;
		/* margin-right: 0;
		margin-bottom: 12upx; */
	}

	.shop-list .warp-ul .img img {
		/* max-height: 100%; */
		height: 100%;
		width: 100%;
		vertical-align: middle
	}

	.shop-list .warp-ul .img {
		/* text-align: center;
		font-size: 0; */
		width: 362.68upx;
		height: auto;
	}

	.shop-list .wrap-ul .wrap-li .img image {
		width: 100%;
		min-height: 362.68upx;
	}

	.hot-img {
		width: 362.68upx;
		min-height: 2upx;
	}

	.shop-list .goods-name {
		font-size: 24upx;
		line-height: 38upx;
		padding: 18upx 18upx 0 18upx;
		height: auto;
		/* #ifndef H5 */
		max-height: 80upx;
		/* #endif */
		/* #ifdef H5 */
		max-height: 90upx;
		/* #endif */
		position: relative;
		/* width: 100%; */
		overflow: hidden;
		word-wrap: break-word;
		-webkit-box-orient: vertical;
		text-align: justify;
		color: #333;
	}

	.shop-list .detail {
		height: 90upx;
		line-height: 90upx;
		padding: 6upx 18upx 0;
		width: 100%;
		/* padding: 4upx 14.000000000000002upx 0; */
		position: relative;
		height:
			/* 62upx;
		line-height: 36upx */
		;
		display: flex;
		align-items: baseline;
	}

	.shop-list .detail .price {
		font-size: 35upx;
	}

	.shop-list .goods-name {
		/* padding: 16upx 16upx 0; */


		/* font-size: 26upx; */
		/* height: 88upx; */
		/* line-height: 36upx; */
	}




	.shop-list .detail b {
		color: #ee2e3a;
		font-weight: 700;
		font-family: arial;
		float: left;
	}

	.shop-list .detail .price-icon {
		font-size: 20upx;
	}

	.shop-list .detail .info {
		position: absolute;
		right: 14.000000000000002upx;
		bottom: 16upx;
		top: 10upx;
		font-size: 26upx;
		color: #9c9c9c;
	}



	.new-list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		/* margin-bottom: 100upx; */
	}

	.new-item {
		width: 216upx;
		height: 340upx;
		border-radius: 10upx;
		border: 1upx solid #EEEEEE;
		margin-bottom: 51upx;
		overflow: hidden;
		background: #FFFFFF;
	}

	.new-item image {
		width: 216upx;
		height: 216upx;
	}

	.item-bottom {
		height: 116upx;
	}

	.item-bottom .name {
		height: 55upx;
		font-size: 20upx;
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
		color: #d81e06;
		letter-spacing: -2upx;
	}

	.item-bottom .detail text {
		font-size: 30upx;
		font-weight: bold;
		margin-left: 17upx;
	}

	.item-bottom .detail .sales {
		margin-right: 23upx;
		font-size: 18upx;
		color: #a9a9a9;
	}
</style>
