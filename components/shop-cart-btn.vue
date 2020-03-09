<template>
	<!-- 悬浮的购物车按钮 -->
	<view>
		<view class="btn-wrap bg-hdsh" @click="toShopCart()">
			<text class="font-icon">&#xe6f0;</text>
			<text class="cart-number">{{ get_shopCart_lengh }}</text>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	export default {
		name: 'shopCartBtn',
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters(['get_shopCart_lengh'])
		},
		methods:{
			toShopCart(){
				if (this.$userMsg.userid == null) {
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/shopCart/shopCart',
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
					return false;
				}else{
					// uni.navigateTo({
					// 	url: '/pages/shopping/shopCart/shopCart'
					// })
					
					uni.hideTabBar({
						animation: true,
						complete: ()=> {
							let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
							console.log(scrollTop, 'scrollTop')
							
							let body = document.getElementsByTagName('body')[0]
							
							this.$parent.$parent.shopCartShow = true
							body.style.cssText = 'top:-' + scrollTop + 'px;'
							body.style.overflow = 'hidden'
							body.style.position = 'fixed'
						}
					})
				}
			}
		}
	}
</script>

<style>
.btn-wrap{
	position: fixed;
	right: 20upx;
	bottom: 280upx;
	z-index: 1;
	height: 60upx;
	width: 60upx;
	line-height: 60upx;
	border-radius: 50%;
	text-align: center;
	border: 1px solid #eee;
	color: #FFFFFF;
	box-shadow: 0px 0px 0px 6upx rgba(235,84,77, .4);
}

.cart-number {
	position: absolute;
	top: -16upx;
	right: -16upx;
	font-size: 24upx;
	background-color: #EB544D;
	width: 28upx;
	height: 28upx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
}
</style>
