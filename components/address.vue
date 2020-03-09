<template>
	<view>
		<view class="address-sec" v-if="addre_list.length == 0" style="margin-top: 0;">
			<view id="address-btn" class="address-btn" @click="toAddressList('pay')">
				<span v-if="type"><i class="iconfont icon-bianji"></i>新建收货地址</span>
				<!-- <span v-if="type&&!show_mark">请填写联系方式</span>
			<span v-if="!type">请填写提货信息</span> -->
				<i class="iconfont icon-youbian"></i>
			</view>
		</view>
		<view class="address" v-else-if="!isSL" @click="toAddressList('pay')" style="margin-top: 0;">
			<h3>收货人：{{default_addre.name}}<text>{{default_addre.phone}}</text></h3>
			<p class="detail">收货地址：{{default_addre.prov+default_addre.city+default_addre.area}}
				{{default_addre.address}}</p>
		</view>
		<view class="self-lifting-wrap" v-if="get_pay_data.kw10 == 1 && addre_list.length != 0">
			<view class="title">
				<text>线下自提</text>
				<view class="kg" :class="{ac:isSL}" @click="isSL ? isSL=false : isSL=true">
					<view class="yuan"></view>
				</view>
			</view>
			<view class="content" v-if="isSL">
				<text>{{default_addre.name + "  " + default_addre.phone}}</text>
				<text>请选择自提点</text>
				<radio-group @change="changeSL" class="sl-radio">
					<label class="radio item" v-for="(item,index) in SLPoint" :key="index">
						<radio :value="item.value" :checked="index === current" color="#00a0ea"/>
						<text>{{item.name}}</text>
					</label>
				</radio-group>
					
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			
		},
		data() {
			return {
				addre_list: [], //地址列表
				default_addre: {}, //默认收货地址
				default_addre_index: '', //默认收货地址的下标
				isSL: false, //是否自提
			};
		},
		methods:{
			toAddressList(mark) {
				if(this.isSL){
					return
				}
				uni.navigateTo({
					url: '/pages/component/addressList/addressList?m=' + mark,
				});
			},
		}
	}
</script>

<style>
	.address {
		padding: 2% 13.33% 3%;
		line-height: 60upx;
	}

	.address h3 b {
		padding: 0 36upx;
	}

	.address h3 {
		font-size: 30upx;
	}

	.address .detail {
		font-size: 26upx;
		padding-left: 50upx;
		margin-left: -50upx;
	}

	.address:after {
		right: 5%;
	}

	.address-btn {
		padding: 0 6%;
		line-height: 160upx;
	}

	.address-sec .icon-youbian {
		font-size: 28upx;
	}

	.address-sec .icon-bianji {
		font-size: 50upx;
		padding-right: 25upx;
	}

	.address-sec li {
		border: none;
	}
</style>
