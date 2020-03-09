<template>
	<!-- 我的收藏列表 -->
	<view>
		<view class="infinite-list-wrapper like-goods-wrapper" id="like-goods-list" v-if="YData.show">
			<view class="like-item" v-for="(x,index) in list" :key="index">
				<!-- <view class="like-item-goods-img"> -->
					<image class="shop-img" :src="$base.urlPrex + $base.strResToJson(x.photo)[0]" mode="'aspectFit'"></image>
				<!-- </view> -->
				<view class="like-item-right">
					<view class="shop-name">
						<text>{{x.name}}</text>
					</view>
					<view class="shop-brief">
						<text>{{x.kw2}}人购买 · 剩余{{x.kw3+x.kw7}}</text>
						<!-- <text> · 剩余{{x.kw3+x.kw7}}</text> -->
					</view>
					<view class="shop-bottom">
						<view class="shop-price">
							¥{{x.kw1}}
						</view>
						<view class="shop-button">
							<view class="shop-more" @click.stop="moreC(index)">
								更多
							</view>
							<view class="shop-det" @click="toDetail(x.id)">
								详情
							</view>
						</view>
						<!-- <image class="bubble-img" :src="bubble" :mode="'aspectFit'">
							<ul class="goods-more-btn">
								<li class="goods-more-item" @click="del(x,index)">
									<font>
										<font>取消收藏</font>
									</font>
								</li>
								<li @click="$router.openPage('/store/'+x.kw5+'/shop')" class="goods-more-item" id="likeEnterMall">
									<font>
										<font>进入店铺</font>
									</font>
								</li>
							</ul>
						</image> -->
						<view @click.stop v-if="YData.mIndex===index" class="like-item-goods-more-wrapper">
							<ul class="goods-more-btn">
								<li class="goods-more-item" @click="del(x,index)">
									<font>
										<font>取消收藏</font>
									</font>
								</li>
								<li @click="toStore(x)" class="goods-more-item" id="likeEnterMall">
									<font>
										<font>进入店铺</font>
									</font>
								</li>
							</ul>
						</view>
					</view>
				</view>
				<!-- <view class="like-item-goods-text">
					<view class="like-item—goods-name ">
						<font>
							<font>{{x.name}}</font>
						</font>
					</view>
					<view class="like-item-goods-count ">
						<span>
							<font>
								<font>{{x.kw2}}人购买</font>
							</font>
						</span>
						<span>
							<font>
								<font>&middot; 剩余{{x.kw3+x.kw7}}</font>
							</font>
						</span>
					</view>
					<view class="like-item-goods-bottom">
						<view class="like-item-goods-line"></view>
						<view class="like-item-goods-price like-price-mid false">
							<i>
								<font>
									<font>&yen; </font>
								</font>
							</i>
							<span>
								<font>
									<font>{{x.kw1}}</font>
								</font>
							</span>
						</view>
						<view class="like-item-goods-start" @click="toDetail(x.id)">
							<font>
								<font>详情</font>
							</font>
						</view>
						<view class="like-item-goods-more" @click.stop="moreC(index)">
							<font>
								<font>更多</font>
							</font>
						</view>
						<section @click.stop v-if="YData.mIndex===index" class="like-item-goods-more-wrapper">
							<ul class="goods-more-btn">
								<li class="goods-more-item" @click="del(x,index)">
									<font>
										<font>取消收藏</font>
									</font>
								</li>
								<li @click="$router.openPage('/store/'+x.kw5+'/shop')" class="goods-more-item" id="likeEnterMall">
									<font>
										<font>进入店铺</font>
									</font>
								</li>
							</ul>
						</section>
					</view>
					<view class="notification-container"></view>
				</view> -->
			</view>
		</view>
		<view class="no-like-wrapper" v-else>
			<view class="no-like-text">
				<font>
					<font>您还没有收藏过商品</font>
				</font>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				YData: {
					mIndex: '',
					inputV: '',
					show: true //控制更多弹出框 的显示 
				},
				pjson: {},
				obj: {
					"gid": '',
					"kw": '',
					"status": 2
				},
				path: '/api/scdsc',
				bubble: require('@/static/images/qp.png')
			};
		},
		onLoad(obj) {
			this.pjson = {
				"m": this.$userMsg.userid,
				"tk": this.$userMsg.token,
				"state": this.$base.getState(),
				"gid": 0,
				"fid": this.$userMsg.userid,
				"status": "2",
				"psize": 0,
				"pnum": 0,
				"rpflag": this.$DEVELOPER.cid,
			};
			this.obj.gid = obj.id == 'all' ? '' : obj.id;
			this.dataF(this.pjson);
		},
		methods: {
			toDetail(id){
				uni.navigateTo({
					url: '/pages/shopping/detailShop/detailShop?id=' + id,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			moreC(index) {
				//更多操作
				if (this.YData.mIndex !== index) {
					this.YData.mIndex = index;
				} else {
					this.YData.mIndex = '';
				}
			},
			del(x, index) {
				//取关
				uni.showLoading({
					title: ' ',
					mask: true
				});
				this.$base.szblDel("/api/scpace/" + x.id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" + this.$base.getState())
					.then((dataJson) => {
						uni.hideLoading()
						uni.showToast({
							title: '取关成功',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						this.list.splice(index, 1);
						this.YData.mIndex = '';
						if (!this.list.length) {
							this.YData.show = false;
						}
					}).catch((msg) => {
						uni.hideLoading()
						uni.showToast({
							title: '系统繁忙	，请稍后再试',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						return;
					});
			},
			dataF(pjson) {
				//查收藏数
				this.$base.szblGet("/api/scpace/", pjson).then((dataJson) => {
					this.list = this.$base.strResToJson(dataJson.data);
					if (!this.list.length) {
						this.YData.show = false;
					}
				}).catch((msg) => {
					return;
				});
			},
			toStore(x) {
				uni.navigateTo({
					url: '/pages/shopping/store/store?id=' + x.unit + '&m=1',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			/* searchF(){
			    this.pjson.kw=this.YData.inputV;
			    this.dataF(this.pjson);
			} */

		}
	}
</script>

<style>
.search-input {
  padding: 20upx;
  background: #fff;
  margin-bottom: 10upx;
}
.search-page{
    overflow: hidden;
}
.search-input input {
  width: 100%;
  padding: 20upx;
  background: #f5f5f5;
  padding-left: 65upx;
  font-size: 30upx;
  border-radius: 0;
}
.search-input i {
  position: absolute;
  top: 20upx;
  left: 20upx;
  padding: 14upx;
  color: #888;
}
.search-input span {
  display: inline-block;
  width: 20%;
  text-align: center;
  padding: 15upx;
  color: #fff;
  background: #ee2e3a;
}
.like-goods-wrapper {
	min-height: 850upx;
	width: 100%;
}
.like-item {
    height: 270upx;
    width: 100%;
    position: relative;
    background-color: #fff;
	display: flex;
	align-items: center;
}

.like-item .shop-img{
	width: 220upx;
	height: 220upx;
	margin-left: 20upx;
    flex-shrink: 0;
}

.like-item .bubble-img{
	position: absolute;
	z-index: 99;
	top: 50upx;
	right: 30upx;
	width: 280upx;
	height: 220upx;
}

.like-item-right{
	width: 100%;
	height: 220upx;
    margin-left: 20upx;
	display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.like-item-right .shop-name{
	max-height: 80upx;
    overflow: hidden;
}

.like-item-right .shop-brief{
	
}

.like-item-right .shop-brief text:nth-child(2){
	margin-left: 20upx;
}

.like-item-right .shop-bottom{
	display: flex;
    justify-content: space-between;
	align-items: center;
	position: relative;
}

.like-item-right .shop-bottom .shop-price{
	color: #d81e06;
    letter-spacing: -1px;
    font-size: 30upx;
    font-weight: bold;
    margin-left: 8px;
}

.like-item-right .shop-bottom .shop-button{
	display: flex;
	margin-right: 50upx;
	align-items: center;
}

.like-item-right .shop-bottom .shop-button .shop-det{
	color: #fff;
    background-color: #00A0EA;
    border-radius: 8upx;
    height: 65upx;
    width: 120upx;
    display: flex;
    justify-content: center;
    align-items: center;
	
}

.like-item-right .shop-bottom .shop-button .shop-more{
	margin-right: 20upx;
}
.like-item-goods-img {
    margin-top: 10upx;
    margin-left: 20upx;
    position: absolute;
    width: 220upx;
    height: 220upx;
    overflow: hidden;
    background-color: #fafafa;
    background-size: contain;
    line-height: 220upx;
    text-align: center;
}
/* .like-item-goods-img image{
    vertical-align: middle;
    max-height: 100%;
} */
.like-item-goods-text {
   /* padding-left: 280upx;
    padding-top: 26upx; */
}
.like-item-goods-name {
    max-height: 69upx;
    line-height: 36upx;
    color: #333;
    font-size: 28upx;
    vertical-align: bottom;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    overflow-y: hidden;
}
.like-item-goods-count {
    margin-top: 22upx;
    color: #9c9c9c;
    font-size: 26upx;
}
.like-item-goods-bottom {
    padding-left: 280upx;
    padding-right: 24upx;
    /* position: absolute; */
    bottom: 0;
    height: 84upx;
    width: 100%;
}
.like-item-goods-bottom view {
    display: inline;
}
.like-item-goods-bottom .like-item-goods-line {
    position: absolute;
    border-bottom: 1px solid #e5e5e5;
    width: 100%;
    bottom: 0;
    line-height: 0;
    height: 0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
}
.like-item-goods-bottom .like-item-goods-price {
    max-width: 130upx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    color: #e02e24;
    font-size: 32upx;
    white-space: nowrap;
    position: absolute;
    top: -8upx;
}
.like-item-goods-bottom .like-price-mid {
    top: 14upx;
}
.like-item-goods-bottom .like-item-goods-price i {
    font-size: 30upx;
    display: inline-block;
    width: 30upx;
    text-align: center;
}
.like-item-goods-bottom .like-item-goods-start {
    float: right;
    font-size: 28upx;
    color: #fff;
    /* background-color: #e02e24; */
    background-color: #00A0EA;
    border-radius: 8upx;
    height: 56upx;
    width: 120upx;
    padding: 10upx 0;
    text-align: center;
    margin-left: 16upx;
    position: relative;
}
.like-item-goods-more {
    float: right;
    margin-top: -10upx;
    padding: 22upx 0;
    width: 80upx;
    height: 76upx;
    font-size: 28upx;
    color: #58595b;
    text-align: right;
}
.like-item-goods-more-wrapper .goods-more-btn {
    width: 220upx;
    height: 220upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.like-item-goods-more-wrapper .goods-more-btn .goods-more-item {
    display: -webkit-box;
    display: flex;
    display: -webkit-flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-align-items: center;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-direction: row;
    -webkit-flex-direction: row;
    font-size: 28upx;
    height: 92upx;
    position: relative;
    border-bottom: 1px solid #e0e0e0;
}
.more-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 20;
}
.no-like-wrapper {
    height: 842upx;
    background-color: #f4f4f4;
    -webkit-box-orient: horizontal;
    flex-direction: row;
    -webkit-flex-direction: row;
}
.no-like-wrapper, .no-like-wrapper .no-like-text {
    width: 100%;
    display: -webkit-box;
    display: flex;
    display: -webkit-flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-align-items: center;
    -webkit-box-direction: normal;
}
.no-like-wrapper .no-like-text {
    color: #58595b;
    text-align: center;
    font-size: 32upx;
    -webkit-box-orient: vertical;
    flex-direction: column;
    -webkit-flex-direction: column;
}
.no-like-wrapper .no-like-text:before {
    content: "\e65f";
    font-size: 140upx;
    color: #ccc;
    font-family: 'iconfont';
    line-height: 1;
    margin-bottom: 56.00000000000001upx;
}
</style>
