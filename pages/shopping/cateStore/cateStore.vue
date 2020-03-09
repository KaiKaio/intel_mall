<template>
	<!-- 美食店铺页面 -->
	<view>
		<view class="cs-info">
			<view class="cs-info-head">
				<view class="cs-img">
					<image :src="store_photo"></image>
				</view>
				<view class="cs-name">
					<view class="wrap-ul">
						<view class="store-name">
							<span>{{store.name}}</span>
							<view>
								<text v-if="store.parcel" class="font-icon">&#xe639;</text>
								<text v-if="!collect" class="font-icon" @click="toggleCollect">&#xe601;</text>
								<text v-else class="font-icon" style="color:#00A0EA" @click="toggleCollect">&#xe869;</text>
							</view>

						</view>
						<view class="store-comment">
							<!-- <i class="iconfont icon-pingfen1 star-blue" v-for="x in stars"></i><i class="iconfont star-blue icon-shoucang1" v-for="y in noStars"></i> -->
							<!-- 2.3  -->
							<!-- <span>(16条评论)</span> -->
						</view>
						<view class="store-remarks">
							{{store.remarks}}
						</view>
						<view class="shop-hours">
							<!-- 营业时间 -->
						</view>
					</view>
				</view>
			</view>
			<view class="cs-address" v-if="store.xyz">
				<a :href="'http://m.amap.com/navi/?start=0&dest='+store.xyz+'&destName='+store.name+'&key=a8c10d2a51b2169ca943c058f201d511'">
					<i class="iconfont icon-map"></i> 店铺地址
				</a>
			</view>
			<view class="cs-remark">
				亲爱的顾客，您好！如果您有忌口（不要辣椒、葱花、香菜等）请在下单的同时写好备注，谢谢您的配合！
			</view>
		</view>
		<view class="cs-list">
			<p>本店美食</p>
			<!-- <view class="cs-list-content">
				<view class="cs-list-content-item" v-for="(cate,index) in cateList" :key="index">
					<view class="cs-list-img">
						<img :src="cate.photo" alt="">
					</view>
					<p>{{cate.name}}</p>
					<p>¥{{cate.kw0}}</p>
				</view>
			</view>
			<view class="menu-button" @click="toMenu">
				进入菜单
			</view> -->
		</view>

		<list-cate-menu v-if="store != ''" :path="path" :obj="obj" :storeMsg="store" ref="loadData"></list-cate-menu>


		<view id="goods-reviews-module" class="goods-reviews-container" v-if="comment_list.length">
			<view class="goods-reviews-header">
				<a>
					<view class="goods-reviews-title">
						<view class="goods-reviews-num">
							评价
							<span>({{comment_list.length}})</span>
						</view>
						<!-- <span v-if="comment_list.length>2" @click="$router.openPage('/commentList/'+detail.id)" class="goods-reviews-more">查看全部</span> -->
					</view>
				</a>
			</view>
			<!-- totest -->
			<view class="goods-reviews-list">
				<view class="reviews-item" v-for="(x,index) in comment_list" :key="index" v-if="index<4">
					<view class="reviews-item-title">
						<image :src="x.kw2 ? x.kw2 : default_img" :mode="'widthFix'"></image>
						<span class="reviews-item-name">{{x.name}}</span>
						<!-- <view class="" > -->
							<uni-icons type="star-filled" v-for="(star,sindex) in x.kw1" :key="sindex"  size="24" :color="$PROP.hdsh_color" class="reviews-stars"></uni-icons>
						<!-- </view> -->
						<span class="reviews-item-time">{{x.createtime}}</span>
					</view>
					<view class="reviews-item-content">{{x.kw3}}</view>
				</view>
			</view>
		</view>
		<!-- <view id="goods-reviews-module" class="goods-reviews-container" v-if="comment_list.length">
			<view class="goods-reviews-header">
				<a>
					<view class="goods-reviews-title">
						<view class="goods-reviews-num">
							商品评价
							<span>({{comment_list.length}})</span></view><span v-if="comment_list.length>2" @click="toMenu(detail.id)" class="goods-reviews-more">查看全部</span>
					</view>
				</a>
			</view>
			<view class="goods-reviews-list">
				<view class="reviews-item" v-for="(x,index) in comment_list" v-if="index<2" :key="index">
					<view class="reviews-item-title"><img :src="x.kw2 ? x.kw2 : store_photo"><span class="reviews-item-name">{{x.name}}<b>
								<i style="width:50.4px;"></i></b></span><span class="reviews-item-time">{{x.createtime}}</span></view>
					<view class="reviews-item-content">{{x.kw3}}</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import listCateMenu from '@/components/listCateMenu.vue';
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import uniIcons from '@/components/uni-icon/uni-icon.vue';

	export default {
		components: {
			listCateMenu,
			uniPopup,
			uniIcons
		},
		data() {
			return {
				path: '/api/scstyle',
				obj: {
					// "appid": this.$base.appid,
					"m": this.$DEVELOPER.szblid,
					"tk": this.$DEVELOPER.token,
					"state": this.$base.getState(),
					"cid": 3,
					"fid": '',
					"status": 0,
					"psize": 20,
					"pnum": 1,
					// "areacode": this.$base.getQueryAreaCode(this.$areaMsg.id),
				},
				cateJson: {
					m: this.$DEVELOPER.szblid,
					tk: this.$DEVELOPER.token,
					state: this.$base.getState(),
					fid: "",
					cid: 3,
					psize: 0,
					pnum: 0,
					status: 0,
					rpflag: this.$DEVELOPER.cid,
				},
				cateList: [],
				collect: false, //关注状态
				stars: 2,
				noStars: 3,
				comment_list: [], //评论列表
				store: '', 
				store_photo: require('@/static/icon/default.png'),
				id: '', //商店id
				share_img: '', //微信分享的图片
				default_img: require('@/static/icon/default.png'),
			};
		},
		onLoad(obj) {
			this.id = obj.id;
			this.obj.unit = obj.id;
			//判断是否登录后判断是否关注该店铺
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

			//查评论
			this.$base.szblGet("/api/scctc", {
				m: this.$DEVELOPER.szblid,
				tk: this.$DEVELOPER.token,
				state: this.$base.getState(),
				cid: obj.id,
				kw4: 3,
				status: 0,
				psize: 10,
				pnum: 1,
				rpflag: this.$DEVELOPER.cid,
			}).then(res => {
				if (res.data) {
					this.comment_list = this.$base.strResToJson(res.data);
					// console.log(this.comment_list);
					for (var i = 0; i < this.comment_list.length; i++) {
						if (this.comment_list[i].name.length == 11) {
							this.comment_list[i].name = this.comment_list[i].name.substr(0, 2) + "***" + this.comment_list[i].name.substr(
								10, 3);
						}
						this.comment_list[i].createtime = this.comment_list[i].createtime.substr(0,10)
						this.comment_list[i].kw1 = parseInt(this.comment_list[i].kw1)
						if(this.comment_list[i].kw2 == '' || this.comment_list[i].kw2 == []){
							this.comment_list[i].kw2 = ''
						}else{
							this.comment_list[i].kw2 = this.comment_list[i].kw2[0]
						}
					}
				} else {
				
				}
				// console.log(this.comment_list);
			}).catch((err) => {
				console.log(err);
				return;
			});

			//获取店铺详情
			this.$base.szblGet('/api/scshop/' + obj.id, {
				m: this.$DEVELOPER.szblid,
				tk: this.$DEVELOPER.token,
				state: this.$base.getState(),
			}).then((res) => {
				// console.log(this.$base.strResToJson(res.data));
				this.store = this.$base.strResToJson(res.data);
				if (this.store.kw6 != '' && this.store.kw6.indexOf('失败') == -1) {
					var temp_photo = this.$base.strResToJson(this.store.kw6);
					this.store_photo = this.$base.urlPrex + temp_photo[0];
					this.share_img = this.store_photo;
				}
				// #ifdef H5
				// alert(this.store.name + ",," + this.store.remarks + ",," + this.store_photo + ",," + window.location.href)
				this.$base.wxShare(this.store.name, this.store.remarks, this.$base.linkFilter(window.location.href), this.share_img);
				// #endif
				

				//查美食
				// this.cateJson.fid = this.store.id;
				this.cateJson.unit = this.store.id;
				// console.log(this.cateJson);
				this.$base.szblGet('/api/scstyle', this.cateJson).then((dataJson) => {
					this.cateList = this.$base.strResToJson(dataJson.data);
					for (var i = 0; i < this.cateList.length; i++) {
						var temp_photo = this.$base.strResToJson(this.cateList[i].photo);
						this.cateList[i].photo = this.$base.urlPrex + temp_photo[0];
					}
				}).catch((err) => {
					console.log(err);
					return;
				});
				// console.log(this.detail);
			}).catch((err) => {
				console.log(err);
				return;
			});
		},
		methods: {
			toMenu() {
				// var id = this.$route.params.id;
				// var store = {
				//   "name":this.store.name,
				//   "phone":this.store.kw2,
				// }

				// console.log(this.store);
				this.$router.openPage("/cateMenu/" + this.$route.params.id + "/" + this.store.name + "/" + this.store.kw2 + "/" +
					this.store.parcel);
			},
			checkCollect(status) {
				if (status) {
					this.$base.szblGet("/api/scpace/", {
						m: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState(),
						fid: this.$userMsg.userid,
						cid: this.id,
						gid: "2",
						status: "1",
						"rpflag": this.$DEVELOPER.cid,
					}).then((dataJson) => {
						//处理
						// console.log(dataJson);
						if (dataJson.num != 0) {
							this.collect = true;
							// console.log(this.$base.strResToJson(dataJson.data));
						}
					}).catch((msg) => {
						console.log(msg);
						return;
					});
				}
			},
			child(data) {
				this.login_mask = data;
			},
			toggleCollect() {
				//判断登录状态
				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/cateStore/cateStore?id=' + this.id,
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
			addCollect() {
				var data = {
					fid: this.$userMsg.userid,
					cid: this.id,
					gid: "2",
					status: "1",
					rpflag: this.$DEVELOPER.cid,
					// appid: this.$base.appid
				};
				this.$base.szblPost("/api/scpace?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" + this.$base
					.getState(), data).then((dataJson1) => {
						//返回处理
						this.collect = true;
					}).catch((msg) => {
					console.log(msg);
					return;
				});
			},
			delCollect() {
				this.$base.szblDel("/api/scpace/" + this.id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token +
					"&state=" + this.$base.getState(), null).then((dataJson) => {
					//处理
					this.collect = false;
				}).catch((msg) => {
					console.log(msg);
					return;
				});
			},
		}
	}
</script>

<style>
.goods-reviews-container{
	margin-bottom: 120upx;
}
</style>
