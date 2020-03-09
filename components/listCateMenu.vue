<template>
	<!-- 美食菜单的wrap -->
	<view>
		<uni-popup ref="popup" type="bottom">
			<view class="pop-title">
				美食简介
			</view>
			<view class="pop-detail">
				{{syno}}
			</view>
		</uni-popup>
		<view class="cate-list">
			<view class="wrap-ul">
				<view class="wrap-li" v-for="(cate,index) in cate_list" :key="index">
					<!-- <a> -->
					<view class="cate-list-item">
						<view class="cate-list-img">
							<image v-if="cate.photo == ''" :src="default_photo" mode="aspectFit"></image>
							<image v-else :src="cate.photo" mode="aspectFit"></image>
						</view>

						<view class="cate-list-right">
							<p>{{cate.name}}</p>
							<view class="cate-list-remark" @click="openPopup(cate.remarks)">{{cate.remarks}}</view>
							<!-- <p>销量
									<span></span>
									<span></span>
								</p> -->
							<view class="cate-list-right-bottom">
								<view class="cate-price">¥{{cate.kw0}}</view>
								<view class="cate-button">
									<uni-number-box @change="numChange($event,index)" :value="0" :max="10"></uni-number-box>
									<!-- <view class="sku-selector-reduce" :class="{'sku-selector-reduce-none':cate.cate_num<1}" @click="cutNum(cate.cate_num,index)"></view>
										<input type="number" :class="{'sku-selector-reduce-none':cate.cate_num<1}" id="sku-input" @blur="inputBlur(cate.cate_num)" class="sku-selector-input" maxlength="5" v-model="cate.cate_num">
										<view class="sku-selector-increase" @click="addNum(cate.cate_num,index)"></view> -->
									<!-- <view class="sku-selector-reduce" @click="cutNum(cate.cate_num,index)"></view>
									<input type="number" :id="'sku-input'+index" class="sku-selector-input" maxlength="5" placeholder="0">
									<view class="sku-selector-increase" @click="addNum(cate.cate_num,index)"></view> -->
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="img"><img :src="default_photo"/></view>
		    			<view class="goods-name">{{x.name}}</view>
		    			<view class="detail">
					        <b class="price-icon">¥</b>
					        <b class="price">{{x.kw1}}</b>
					        <view class="info">
					        </view>
					    </view> -->
					<!-- </a> -->
				</view>
			</view>
		</view>
		<view class="bottom-hint">
			{{b_hint}}
		</view>
		<!--固定在底部的按钮-->
		<view class="mb-50"></view>
		<view class="fix-mall-btn">
			<view class="fix-mall-index fl">
				<a @click="backToIndex">
					<text class="font-icon">&#xe68a;</text>
					<text>主页</text>
				</a>
				<a @click="customer">
					<text class="font-icon">&#xe604;</text>
					<text>客服</text>
				</a>
				<!-- <a href="index.html">
						<i class="iconfont"></i>
						<p>首页</p>
					</a>
          			<a @click="toMember">
						<i class="iconfont icon-ren"></i>
						<p>个人中心</p> -->
				</a>
			</view>
			<view class="fix-buy-btn bg-hdsh fr" @click="goPay">
				<a>立即下单</a>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from "vuex";
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniNumberBox,
			uniPopup
		},
		props: {
			path: {
				type: String,
				default: ""
			},
			obj: {
				type: Object,
				default () {
					return {}
				}
			},
			storeMsg: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				cate_list: "",
				b_hint: "到底啦~",
				default_photo: require("@/static/icon/default.png"),
				cate_num: 0,
				login_mask: false,
				to_path: "",
				store_phone: "",
				syno: ""
			};
		},
		created() {
			this.loadData();

		},
		methods: {
			openPopup(remarks) {
				this.syno = remarks
				this.$refs.popup.open()
			},
			closePopup() {
				this.$refs.popup.close()
			},
			numChange(value, index) {
				// 				this.order.kw5 = value;
				// 				this.order.kw4 = parseFloat(this.order.kw5 * this.get_jd_data.kw0).toFixed(2);
				this.cate_list[index].cate_num = value
			},
			loadData() {
				console.log(this.path, this.obj)
				this.$base.szblGet(this.path, this.obj).then((res) => {
					this.cate_list = this.$base.strResToJson(res.data);
					// console.log(this.cate_list);
					for (var i = 0; i < this.cate_list.length; i++) {
						var cate_num = 0;
						this.cate_list[i].cate_num = cate_num;
						this.cate_list[i].photo = this.$base.urlPrex + this.$base.strResToJson(this.cate_list[i].photo);
					}
					if (!this.cate_list[0]) {
						this.b_hint = "暂无相关美食~";
					}
				}).catch((err) => {
					console.log(err);
					return;
				});
			},
			addNum(cate_num, index) {
				var id = "sku-input" + index;
				cate_num++;
				this.cate_list[index].cate_num = cate_num;
				document.getElementById(id).value = cate_num;
				// console.log(this.cate_list)
			},
			cutNum(cate_num, index) {
				var id = "sku-input" + index;
				cate_num--;
				if (cate_num < 1) {
					cate_num = 0;
				}
				this.cate_list[index].cate_num = cate_num;
				document.getElementById(id).value = cate_num;
			},
			inputBlur(cate_num) {
				cate_num == "" || cate_num < 1 || !/^[0-9]+.?[0-9]*$/.test(cate_num) ?
					(cate_num = 1) :
					(cate_num = cate_num);
			},
			toMember() {
				//登录提示
				this.to_path = "/member";
				if (!this.login_mask && !localStorage.phone) {
					this.login_mask = true;
					this.$layer.msg("请先登录账号");
					return false;
				}
				this.$router.openPage("/member");
			},
			child(data) {
				this.login_mask = data;
			},
			reLogin(status) {
				if (status) {
					this.login_mask = true;
					// this.$layer.msg("登录状态已过期，请重新登录")
				}
			},
			goPay() {
				if (this.$userMsg.userid == null) {
					// this.login_mask = true;
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/cateStore/cateStore?id=' + this.storeMsg.id,
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
					return false;
				}
				var price = 0;
				var num = 0;
				var jsondata = "";
				var list = [];
				for (var i = 0; i < this.cate_list.length;) {
					price = price + this.cate_list[i].kw0 * this.cate_list[i].cate_num;
					num = num + this.cate_list[i].cate_num;
					if (
						this.cate_list[i].cate_num == 0 ||
						this.cate_list[i].cate_num == "0"
					) {
						i++;
					} else {
						if (jsondata == "") {
							jsondata +=
								this.cate_list[i].id +
								"," +
								this.cate_list[i].cate_num.toString() + "," + "00"
						} else {
							jsondata +=
								"----" +
								this.cate_list[i].id +
								"," +
								this.cate_list[i].cate_num.toString() + "," + "00"
						}
						var item = {
							name: this.cate_list[i].name,
							price: this.cate_list[i].kw0,
							num: this.cate_list[i].cate_num,
							photo: this.cate_list[i].photo,
						};

						list.push(item);
						i++;
					}
				}
				// console.log(list);
				if (price == 0) {
					uni.showToast({
						icon: 'none',
						mask: false,
						title: '请选择需要购买的美食',
						duration: 1500
					})
					return;
				} else {
					// price = Math.floor(price * 100) / 100;
					price = this.$base.numberFormat(price, 2, '.')
					this.set_pay_data({
						price: price, //总价
						parcel: this.storeMsg.kw7,
						gid: 2, //订单类型
						cid: this.storeMsg.id, //店铺id
						shop_num: num, //购买的总量
						sku_cont: "",
						sku_photo: list[0].photo,
						shop: "",
						name: this.storeMsg.name,
						id: "",
						kw0: this.storeMsg.name,
						// kw1: this.storeMsg.phone,
						// kw17: this.storeMsg.kw7, //外卖
						unit: this.storeMsg.id, //店铺 id
						store_name: this.storeMsg.name,
						store_phone: this.storeMsg.kw2,
						mark: "cate", //标记位
						jsondata: jsondata,
						list: list //购买的美食列表
					});

				}

				uni.navigateTo({
					url: '/pages/shopping/payCate/payCate',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			backToIndex() {
				uni.switchTab({
					url: "/pages/tabBar/index/index"
				})
			},
			customer() {
				uni.showToast({
					title: '请关注“海岛生活”微信公众号联系人工客服~',
					// title: '功能正在开发中...',
					mask: false,
					duration: 1500,
					icon: 'none'
				})
				// uni.navigateTo({
				// 	url: '/pages/shopping/userService/userService'
				// })
			},

			...mapMutations(["set_pay_data"])
		}
	}
</script>

<style>
	.cate-list {
		background: #FFFFFF;
	}

	.cate-list .wrap-ul {
		overflow: hidden;
		width: 100%;
	}

	.cate-list .wrap-ul .wrap-li {
		padding: 10upx 20upx;
		background: #fff;
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
		font-size: 28.000000000000004upx;
		padding: 0;
		margin-top: 25upx;
	}

	/* .g-price i{
  float: right;
}
.g-price{
  margin: 10upx 0 40upx;
}
.g-price{
  padding: 0 40upx 1upx 20upx;
}
.g-price .money{
  font-size: 36upx;
  color:#e02e24;
  font-family: arial;
} */
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

	/* .fix-mall-index a {
		padding: 0;
		line-height: 60upx;
		height: 60upx;
		margin: 20upx 0;
	} */

	.fix-mall-btn {
		/* line-height: 100upx; */
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
		height: calc(100upx + 1px);
		/* line-height: inherit; */
	}

	.pop-title {
		font-size: 30upx;
	}

	.pop-detail {
		color: #999;
	}
</style>
