<template>
	<!-- 美食列表 -->
	<view>
		<view class="cate-list">
			<view class="warp-ul">
				<view class="warp-li" v-for="(cate,index) in cate_list" :key="index">
					<!-- <a> -->
					<view @click="toStore(cate)" class="cate-list-item">
						<view class="cate-list-img">
							<img v-if="cate.photo == ''" :src="store_photo" alt="">
							<img v-else :src="cate.photo" alt="">
						</view>

						<view class="cate-list-right">
							<p>
								<span>{{cate.name}}</span>
								<text v-if="cate.parcel" class="font-icon">&#xe639;</text>
							</p>
							<view class="cate-list-remark">{{cate.remarks}}</view>
							<!-- <p>销量
									<span></span>
									<span></span>
								</p> -->
							<view class="cate-list-right-bottom" v-if="cate.kw0 != 0.00">
								<view class="cate-price">¥{{cate.kw0}}</view>
								<!-- <span>已售</span> -->
							</view>
							<view class="cate-to-store" v-if="cate.kw0 != 0.00">
								详情 >
							</view>
							<view class="cate-to-store" v-if="cate.kw0 == 0.00">
								预售中
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
				cate_list: [],
				b_hint: '到底啦~',
				store_photo: require("@/static/icon/default.png"),
			};
		},
		created() {
			this.loadCateList()
		},
		methods: {
			loadCateList(mark) {
				if(mark){
					this.cate_list = []
				}
				this.$base.szblGet(this.path, this.obj).then((res) => {
					this.$emit('pageNum',res.pages)
					this.$emit('num', res.num)
					if (res.data != null) {
						var cate_list = JSON.parse(res.data);
						// console.log(cate_list);
						for (var i = 0; i < cate_list.length; i++) {
							var cate_num = 0;
							cate_list[i].cate_num = cate_num;
							if (cate_list[i].photo != '') {
								var temp_photo = this.$base.strResToJson(cate_list[i].photo);
								cate_list[i].photo = this.$base.urlPrex + temp_photo[0];
							}
							this.cate_list.push(cate_list[i])
						}
						// console.log(this.cate_list);
					} else {
						this.b_hint = "暂无相关美食~";
					}
				}).catch((err) => {
					console.log(err);
					return;
				});
			},
			toStore(x){
				uni.navigateTo({
					url: '/pages/shopping/cateStore/cateStore?id=' + x.unit,
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
