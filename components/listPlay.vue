<template>
	<!-- 门票的列表 -->
	<view>
		<view class="hotel-list">
			<view class="warp-ul">
				<view class="warp-li" v-for="(item,index) in play_list" :key="index">
					<!-- <a> -->
					<view @click="toStore(item)" class="hotel-list-item jd-list-item">
						<view class="hotel-list-img">
							<image v-if="item.photo == ''" :src="store_photo" alt=""></image>
							<image v-else :src="item.photo" alt=""></image>
						</view>

						<view class="cate-list-right" style="overflow: hidden;text-overflow: ellipsis;width: 63%;">
							<p>{{item.name}}
								<!-- <i class="iconfont icon-youbian"></i> -->
							</p>
							<!-- <view class="hotel-star">
									<i class="iconfont icon-pingfen1 star-blue" v-for="x in stars"></i><i class="iconfont star-blue icon-shoucang1" v-for="y in noStars"></i>
									2.3 
									<span>(16条评论)</span>
								</view> -->
							<view class="play-list-remark">{{item.gid == 0 ? item.address : item.jsondata}}</view>
							<view class="jd-item-minprice">¥{{item.gid == 0 ? item.kw4 : item.kw7}} <span>起</span></view>


							<!-- <view class="hotel-list-right-bottom">
									<view class="cate-price">¥{{cate.kw0}}<span>起</span></view>
								</view> -->
							<!-- <view class="cate-to-store" @click="toStore(cate)"> -->
						</view>

					</view>
				</view>
			</view>
		</view>
		<view class="bottom-hint">
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
			}
		},
		data() {
			return {
				play_list: [],
				b_hint: '到底啦~',
				store_photo: require("@/static/icon/default.png"),
				stars: 2,
				noStars: 3,
			};
		},
		created() {
			this.loadPlayList()
		},
		methods: {
			loadPlayList(mark) {
				if(mark){
					this.play_list = []
				}
				this.$base.szblGet(this.path, this.obj).then((res) => {
					this.$emit('pageNum',res.pages)
					this.$emit('num', res.num)
					var play_list = this.$base.strResToJson(res.data);
					// console.log(play_list);
					if (play_list) {
						for (var i = 0; i < play_list.length; i++) {
							var cate_num = 0;
							play_list[i].cate_num = cate_num;
							if (play_list[i].photo != '') {
								var temp_photo = this.$base.strResToJson(play_list[i].photo);
								play_list[i].photo = this.$base.urlPrex + temp_photo[0];
							}
							this.play_list.push(play_list[i])
						}
						console.log(this.play_list);
					} else {
						this.b_hint = "暂无相关景点~";
					}
				}).catch((err) => {
					console.log(err);
					return;
				});
			},
			toStore(x) {
				uni.navigateTo({
					url: '/pages/shopping/detailPlay/detailPlay?id=' + x.id,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>

</style>
