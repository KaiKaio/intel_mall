<template>
	<!-- 购物车 -->
	<view class="shop-wrapper-comm">
		<view class="cart-wrapper">
			<view class="cart-wrapper-title">
				<view>购物车</view>
				<text @click="cancel" class="font-icon delete">&#xe67f;</text>
			</view>
			<checkbox-group ref="checkUl" @change="checkboxChange" v-show="$store.state.zhsq.shopCartList.length > 0">
				<view class="list-item" v-for="(item, index) in $store.state.zhsq.shopCartList" :key="item.id">
					<label class="list-label"></label>
					<checkbox :checked="item.checkBox" :value="index.toString()" class="check-item" color="#fff" style="width: 44upx; height: 44upx;" />
					<image class="item-image" :src="$base.urlPrex + item.photo[0]" mode=""></image>
					<view class="item-info">
						<view style="display: flex; justify-content: space-between;"><view>{{ item.name }}</view><view class="delete-btn font-icon" @click="delItem(item, index)">&#xe67a;</view></view>
						<view class="sku-name">规格：{{ item.kw0 }}</view>
						<view class="bottom-wrapper">
							<text style="color: #eb544d;">￥{{ item.kw2 }}</text>
							<uni-number-box class="shop-number" @change="changeNumber($event, item, index)" :value="parseInt(item.kw1)" :min="1" :max="99"></uni-number-box>
						</view>
					</view>
				</view>
			</checkbox-group>
			
			<view style="color: #8d8d8d; 
				height: 80%; 
				display: flex; 
				align-items: center;
				flex-direction: column; 
				justify-content: center;" v-show="JSON.stringify($store.state.zhsq.shopCartList) === '{}' || $store.state.zhsq.shopCartList.length === 0">
				<view style="display: flex; justify-content: center; margin-bottom: 24upx;">
					<text class="font-icon" style="font-size: 92upx;">&#xe659;</text>
				</view>
				<p style="text-align: center; font-size: 32upx;">购物车还没有商品，快去选购吧~</p>
			</view>
		</view>
		
		<view class="cart-bottom">
			<view style="display: flex; align-items: center;">
				<checkbox ref="allSel" value="all" :checked="selectAllFlag" @click="selectAll" style="margin: 0upx 12upx; width: 44upx; height: 44upx;" />
			 	<text>全选</text>
			</view>
			<view class="right">
				<view>合计: <text style="color: #eb544d;">￥{{ $store.state.zhsq.totalPrice.toFixed(2) }}</text></view>
				<view class="pay bg-hdsh" @click="pay">结&nbsp;算</view>
			</view>
		</view>
	</view>

</template>

<script>
	import { mapActions } from 'vuex';
	// import { mapState, mapGetters, mapActions } from 'vuex';
	
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		name: 'shopCartModel',
		
		components: {
			uniNumberBox,
			uniPopup
		},
		
		data() {
			return {
				// shopList: [],
				selectArr: [],
				totalPrice: 0,
				
				selectAllFlag: false, // 全选标记
				
				throttleFlag: true,
				
				empty: false // 购物车是否为空
			}
		},
		created() {
		},
		mounted() {
		},
		updated() {
			// 判断全选反选
			
			let flag = true // 该变量只要变成 false , 则显示全选状态
			
			for(let i = 0; i < this.$store.state.zhsq.shopCartList.length; i++) {
				if(this.$store.state.zhsq.shopCartList[i].checkBox === false) { // 如果有一个Check为False，则全选为False
					this.selectAllFlag = false
					flag = false
				}
			}
			
			if(flag === true) {
				this.selectAllFlag = true
			}
			
			this.$store.commit('computedTotalPrice', '') // 计算价格
		},
		computed: {
			
		},
		watch: {
		},
		methods: {
			...mapActions({
			    getCartList: "getCartList"
			}),
			
			// 选择商品 Checkbox
			checkboxChange(e) {
				let selectArrIndex = e.detail.value// 已经选中数组
				
				this.$store.commit('checkChange', selectArrIndex) // 改变Check
				this.$store.commit('computedTotalPrice', '') // 计算价格
			},
			
			// 全选按钮点击
			selectAll() {
				this.selectAllFlag = !this.selectAllFlag
				
				
				if(this.selectAllFlag === true) { // 如果需要全选，则将全部数组派发
					let length = this.$store.state.zhsq.shopCartList.length
					let arr = []
					for(let i = 0; i < length; i++) {
						arr.push(i.toString())
					}
					this.$store.commit('checkChange', arr) // 改变Check
				} else if (this.selectAllFlag === false) { // 如果反选，传空数组
					this.$store.commit('checkChange', [])
				}
				this.$store.commit('computedTotalPrice', '') // 计算价格
			},
			
			// 点击结算（支付）按钮
			pay() {
				// 判断购物车是否为空
				if(JSON.stringify(this.$store.state.zhsq.shopCartList) === '{}') {
					uni.showToast({
						title: '购物车为空..',
						icon: 'none'
					})
					return
				}
				
				let checkArr = [] // 选中商品数组
				let emptyFlag = false // 判断是否无选中商品标记 `false 为空`
				for(let i = 0; i < this.$store.state.zhsq.shopCartList.length; i++) { // 选出Check的 `Item`
					if(this.$store.state.zhsq.shopCartList[i].checkBox === true) {
						checkArr.push(this.$store.state.zhsq.shopCartList[i])
						emptyFlag = true
					}
				}
				
				if(emptyFlag === false) {
					uni.showToast({
						title: '未选中商品..',
						icon: 'none'
					})
					return
				}
				
				this.$parent.$parent.$parent.cancel()
				
				this.$store.commit('set_shopcart_data', {
					shopArr: checkArr,
					price: this.$store.state.zhsq.totalPrice
				});
				uni.navigateTo({
					url: '/pages/shopping/payShopCart/payShopCart'
				})
			},
			
			// 更改购物车数量
			changeNumber(e, item, index) {
				this.$store.commit('changeNumber', { number: e, id: item.id })
				
				this.computedPrice()
				
				if(this.throttleFlag === false) {
					console.log('节流了')
					return
				} 
				
				this.throttleFlag = false
				
				setTimeout(() => {
					let ajaxItem = this.$base.strResToJson(JSON.stringify(item))
					this.$base.szblPut(`/api/carts/${ajaxItem.id}
						?m=${this.$userMsg.userid}
						&tk=${this.$userMsg.token}
						&state=${this.$base.getState()}
						&appid=${ajaxItem.appid}`, ajaxItem
					).then(res => {
						console.log(res, '更改数量信息Success')
						this.throttleFlag = true
					}).catch(err => {
						console.log(err, '更改数量信息Error')
						this.throttleFlag = true
					})
				}, 1500)
			},
			
			// 关闭购物车模块
			cancel() {
				this.$parent.$parent.$parent.shopCartShow = false
				
				let body = document.getElementsByTagName('body')[0]
				
				body.style.position = ''
				body.style.overflow = ''
				
				let top = body.style.top
				
				document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
				
				body.style.top = ''
				
				uni.showTabBar({
					animation: true
				})
			},
			
			// 计算价格函数
			computedPrice() {},
			
			// 删除购物车项目
			delItem(item, index) {
				
				uni.showModal({
				    title: '提示',
				    content: '确定删除此记录吗？',
				    success:  (res) => {
				        if (res.confirm) {
							this.$base.szblDel(`/api/carts
								?m=${this.$userMsg.userid}
								&tk=${this.$userMsg.token}
								&state=${this.$base.getState()}`, item
							).then(res => {
								
								this.$store.commit('del_shopCart_data', item.id)
								this.$store.commit('computedTotalPrice', '') // 计算价格
								
							}).catch(err => {
								console.log(err, '删除出现错误')
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			}
		}
	}
</script>

<style>
.shop-wrapper-comm {
	width: 100%;
	position: fixed;
	bottom: 0upx;
}
.cart-wrapper {
	height: 60vh;
	background-color: #fff;
	overflow-y: auto;
}

.cart-wrapper > .cart-wrapper-title {
	display: flex;
	padding: 18upx 18upx 12upx;
	font-size: 34upx;
	justify-content: space-between;
	position: sticky;
	top: 0px;
	width: 90%;
	background-color: #fff;
	z-index: 1;
	border-bottom: 1px solid #eee;
	margin: 0 auto;
}

.cart-wrapper > .cart-wrapper-title .font-icon.delete {
	color: #EB544D;
}

.cart-wrapper .list-item {
	position: relative;
	display: flex;
	width: 90%;
	margin: 0 auto;
	align-items: center;
	padding: 12upx 0px 12upx;
	border-bottom: 1upx solid #eee;
}

.cart-wrapper .list-item .delete-btn {
	color: #8d8d8d;
	font-size: 32upx;
}

.cart-wrapper .list-item .item-image {
	background-color: #fff;
	width: 160upx;
	height: 160upx;
	margin: 0upx 20upx;
	border-radius: 18upx;
}

.cart-wrapper .list-item .item-info {
	width: calc(100% - 200upx - 44upx - 40upx);
}

.cart-wrapper .list-item .item-info > view:first-child {
	font-size: 28upx;
	max-height: 80upx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.cart-wrapper .list-item .sku-name {
	margin-top: 12upx;
	display: inline-flex;
	color: #333;
	background-color: #eee;
	font-size: 24upx;
	border-radius: 16upx;
	padding: 2upx 12upx;
}

.cart-wrapper .list-item .bottom-wrapper {
	margin-top: 20upx;
	display: flex;
	justify-content: space-between;
	align-items: center;	
}

.cart-wrapper .list-item .shop-number {
	transform: scale(0.8);
}

.cart-bottom {
	width: 100%;
	display: flex;
	background-color: #ededed;
	justify-content: space-between;
	align-items: center;
}

.cart-bottom .right {
	display: flex;
	width: 50%;
	align-items: center;
	justify-content: space-between;
}

.cart-bottom .right .pay {
	padding: 24upx 52upx;
	overflow: initial;
	color: #fff;
	margin-top: 0upx;
}

</style>
