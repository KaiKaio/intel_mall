<template>
	<!-- 民宿的列表 -->
	<view>
		<view class="hotel-list">
			<view class="warp-ul">
				<view class="warp-li" v-if="hotel_list" v-for="(item,index) in hotel_list" :key="index" :class="{'hotel-list-p-top-none': index != 0, 'hotel-list-p-bottom-none': index == hotel_list.length - 1}">
					<!-- <a> -->
					<view @click="toStore(item)" class="hotel-list-item">
						<view class="hotel-list-img">
							<image v-if="item.kw6 == ''" :src="store_photo" alt=""></image>
							<image v-else :src="item.kw6" alt=""></image>
						</view>

						<view class="hotel-list-right">
							<p>{{item.name}}
								<!-- <i class="iconfont icon-youbian"></i> -->
							</p>
							<!-- <view class="hotel-star">
									<i class="iconfont icon-pingfen1 star-blue" v-for="x in stars"></i><i class="iconfont star-blue icon-shoucang1" v-for="y in noStars"></i>
									2.3 
									<span>(16条评论)</span>
								</view> -->
							<!-- <view class="hotel-list-remark list-remark">{{item.remarks != null && item.remarks.length != 0 ? item.remarks : '暂无简介...'}}</view> -->
							<view class="hotel-list-remark list-remark">{{item.remarks ? item.remarks : '暂无简介...'}}</view>


							<!-- <view class="hotel-list-right-bottom" v-if="item.name == '火山石坞民宿店'">
								<view class="hotel-price">¥398<span>起</span></view>
							</view> -->
							
							<view class="hotel-list-right-bottom">
								<view class="hotel-price">¥{{item.list[0].kw0}}<span>起</span></view>
							
							</view>

							<!-- <view class="hotel-list-right-bottom" v-else>
								<span>预售中</span>
							</view> -->
							<!-- <i class="iconfont icon-youbian"></i> -->
							<text class="font-icon">&#xe79a;</text>
							<!-- <view class="cate-to-store" @click="toStore(cate)"> -->
						</view>

					</view>
				</view>
			</view>
		</view>
		<view v-if="mark != 'index' && mark != 'subject'" id="hotel-bottom-hint" class="bottom-hint">
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
				type: String,
				default: '',
			},
		},
		data() {
			return {
				hotel_list: [],
				b_hint: '到底啦~',
				store_photo: require("@/static/icon/default.png"),
				stars: 2,
				noStars: 3,
			};
		},
		created() {
			this.loadHotelList()
		},
		methods: {
			loadHotelList(mark) {
				if(mark){
					this.hotel_list = []
				}
				this.$base.szblGet(this.path, this.obj).then((res) => {
					this.$emit('pageNum',res.pages)
					this.$emit('num', res.num)
					var hotel_list = this.$base.strResToJson(res.data);
					// console.log(hotel_list);
					if (hotel_list) {
						for (var i = 0; i < hotel_list.length; i++) {
							var cate_num = 0;
							hotel_list[i].cate_num = cate_num;
							if (hotel_list[i].kw6 != '' && hotel_list[i].kw6.indexOf('失败') == -1) {
								var temp_photo = this.$base.strResToJson(hotel_list[i].kw6);
								hotel_list[i].kw6 = this.$base.urlPrex + temp_photo[0];
							}else{
								hotel_list[i].kw6 = this.store_photo
							}
							
							//保留小数点后两位
							hotel_list[i].list[0].kw0 = parseInt(hotel_list[i].list[0].kw0)
							// this.hotel_list.push(hotel_list[i])
							this.szblGetAsync('/api/scshop/' + hotel_list[i].id,{} ,i).then((resData) => {
								hotel_list[resData.index].remarks = this.$base.strResToJson(resData.data).remarks
								this.hotel_list.push(hotel_list[resData.index])
							}).catch((msg) => {
								console.log(msg);
								return
							})
// 							if (this.hotel_list[i].user != '') {
// 								var temp_photo = this.$base.strResToJson(this.hotel_list[i].user);
// 								this.hotel_list[i].user = this.$base.urlPrex + temp_photo[0];
// 							}
							//查最低价房型
// 							this.szblGetAsync('/api/schomeandstyle',{
// 								m: this.$DEVELOPER.szblid,
// 								tk: this.$DEVELOPER.token,
// 								state: this.$base.getState(),
// 								status: 2,
// 								unit: this.hotel_list[i].id,
// 								psize: 1,
// 								pnum: 0
// 							}, i).then((retData) => {
// 								this.hotel_list[retData.index].list = this.$base.strResToJson(retData.data)
// 							}).catch((msg) => {
// 								console.log(msg)
// 								return
// 							})
						}
						// console.log(this.hotel_list)
					} else {
						this.b_hint = "暂无相关民宿~";
					}

					// console.log(this.hotel_list);
				}).catch((err) =>  {
					console.log(err);
					return;
				});
			},
			toStore(x) {
				uni.navigateTo({
					url: '/pages/shopping/detailHotel/detailHotel?id=' + x.id,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			//获取数据（同步）
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
		},
		
	}
</script>

<style>

</style>
