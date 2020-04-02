<template>
	<!-- 我的收货地址列表 -->
	<view>
		<view class="address-list">
			<view class="address-item" v-for="(x,index) in add_list" :key="index" >
				<view class="address-left"  @click="choose(index)">
					<view class="top">
						{{x.name}}<span>{{x.phone}}</span>
					</view>
					<view class="bottom">
						<span class="color-hdsh" v-if="x.isDefault">默认</span> {{ x.areaname + ' ' + x.address }}
					</view>
				</view>
				<view class="address-right" @click="toAddress(index)">
					编辑
				</view>
			</view>
		</view>
		<view v-if="add_list.length == 0" class="add-hint">
			请添加收货地址
		</view>
		<view class="add-wrap" v-if="add_list.length < 8">
			<view class="reg-next add-address bg-hdsh" @click="toAddress('add')">
				<i class="iconfont icon-tianjia"></i>
				添加地址
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				page_mark: '',
				add_list: [],
				address_mode: {
					name: '', //收货人
					phone: '', //收货电话
					prov: '', //省
					city: '', //市
					area: '', //区
					address: '', //地址
					isDefault: '', //是否默认地址
				}
			};
		},
		computed: {
			...mapState({
			    unit_data: state => state.zhsq.unit_data
			})
		},
		onLoad(obj) {
			this.page_mark = obj.m;
			
			uni.setNavigationBarTitle({
				title: this.unit_data.name
			})
			// this.getAddreList()
		},
		onShow() {
			this.getAddreList()
		},
		methods: {
			getAddreList(){
				this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
						m: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState()
					}).then((resData) => {
					let res = this.$base.strResToJson(resData.data).address
					if (res == "" || res == "[]" || res == null) {
						this.add_list = []
					} else {
						this.add_list = []
						for(let i = 0; i < res.length; i++) {
							if(res[i].unit === this.unit_data.id) {
								this.add_list.push(res[i])
							}
						}
						// this.add_list = res
					}
					this.$store.commit('set_address_data', this.add_list)
				}).catch((msg) => {
					console.log(msg)
				})
			},
			choose(index) {
				//从支付页面过来，则选择该地址，否则无效
				if (this.page_mark == 'pay') {
					this.$store.commit('set_address_data', {
						changeIndex: index
					})
					uni.navigateBack({
						delta: 1
					});
				} else {
					return
				}
			},
			toAddress(mark) {
				uni.navigateTo({
					url: '/pages/component/addressEdit/addressEdit?m=' + mark,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			// ...mapMutations(["set_address_data"])
		}
	}
</script>

<style>
	.address-list {
		background: #fff;
		font-size: 28upx;
	}

	.address-item {
		padding: 20upx 0 20upx 20upx;
		display: flex;
	}

	.address-left {
		width: 85%;
	}

	.address-right {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 14%;
		margin: 13upx 0;
		border-left: 1px solid #999;
		color: #999;
		font-size: 26upx;
	}

	.address-left .top {
		font-size: 30upx;
		margin-bottom: 1px;
	}

	.address-left .top span {
		margin-left: 20upx;
		color: #999;
		font-size: 28upx;
	}

	.address-left .bottom span {
		margin-right: 10upx;
		font-size: 25upx;
		/* color: #00A0EA */
	}

	.add-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding-bottom: 20upx;
		/* background: #fff; */
	}

	.add-wrap i {
		font-size: 20upx;
		margin-right: 10upx;
	}

	.add-address {
		margin-top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.add-hint {
		text-align: center;
		color: #999;
		font-size: 30upx;
		margin-top: 200upx;
	}

	.reg-next {
		width: 93%;
		text-align: center;
		/* background: linear-gradient(to right, rgba(0, 160, 234, .7), rgba(0, 160, 234, .3)); */
		color: #fff;
		margin: auto;
		border-radius: 300upx;
		padding: 10upx;
	}
</style>
