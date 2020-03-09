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
					<checkbox class="check-item" color="#fff" :value="index.toString()" style="width: 44upx; height: 44upx;" />
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
			
			<view v-show="JSON.stringify($store.state.zhsq.shopCartList) === '{}' || $store.state.zhsq.shopCartList.length === 0">
				<p style="text-align: center;">购物车还没有商品，快去选购吧~</p>
			</view>
		</view>
		
		<view class="cart-bottom">
			<view style="display: flex; align-items: center;">
				<checkbox ref="allSel" value="all" :checked="selectAllFlag" @click="selectAll" style="margin: 0upx 12upx; width: 44upx; height: 44upx;" />
			 	<text>全选</text>
			</view>
			<view class="right">
				<view>合计: <text style="color: #eb544d;">￥{{ totalPrice }}</text></view>
				<view class="pay bg-hdsh" @click="pay">结&nbsp;算</view>
			</view>
		</view>
	</view>

</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	
	import topPlaceholder from "@/components/top-placeholder.vue"
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		name: 'shopCartModel',
		
		components: {
			topPlaceholder,
			uniNumberBox,
			uniPopup
		},
		
		computed: {
			...mapState({
				zhsq: state => state.zhsq
			}),
			
			...mapGetters(['get_shopCartList'])
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
		onReachBottom() {
			// this.getListObj.pnum++
			// if (this.getListObj.pnum > this.pageNum) {
			// 	return
			// } else {
			// 	this.getList('rb')
			// }
		},
		computed: {
			
		},
		watch: {
			//刷新list的时候检查全选按钮的状态
			// shopList: function() {
				
			// }
		},
		methods: {
			...mapActions({
			    getCartList: "getCartList"
			}),
			
			checkboxChange(e) {
				
				let selectArrIndex = e.detail.value// 已经选中的商品坐标号
				
				let selectArr = []
				for(let i = 0; i < selectArrIndex.length; i++) {
					let index = parseInt(selectArrIndex[i]) // 格式化已选中商品的下标 ('1' => 1)
					selectArr.push(this.$store.state.zhsq.shopCartList[index])
				}
				
				this.selectArr = selectArr
				
				this.computedPrice()
				
				// 判断全选反选
				if(e.detail.value.length === this.$store.state.zhsq.shopCartList.length) {
					this.selectAllFlag = true
				} else {
					this.selectAllFlag = false
				}
				
			},
			
			selectAll() {
				this.selectAllFlag = !this.selectAllFlag
				if(this.selectAllFlag === true) {
					this.$refs.checkUl.checkboxList.map(item => {
						item.checkboxChecked = true
						this.selectArr = this.$store.state.zhsq.shopCartList
						
					})
				} else {
					this.$refs.checkUl.checkboxList.map(item => {
						item.checkboxChecked = false
						this.selectArr = []
					})
				}
				this.computedPrice()
			},
			
			pay() {
				if(JSON.stringify(this.$store.state.zhsq.shopCartList) === '{}' || this.selectArr.length === 0) {
					uni.showToast({
						title: '请先选择商品',
						icon: 'none'
					})
					return
				}
				
				this.$parent.$parent.$parent.cancel()
				this.$store.commit('set_shopcart_data', {
					shopArr: this.selectArr,
					price: this.totalPrice
				});
				uni.navigateTo({
					url: '/pages/shopping/payShopCart/payShopCart'
				})
			},
			
			changeNumber(e, item, index) {
				// 先判断是否已经选中
				let flag = false
				for(let i = 0; i < this.selectArr.length; i++) {
					if(item.id === this.selectArr[i].id) {
						this.selectArr[i].kw1 = e
						this.computedPrice()
						break
					}
				}
				
				// this.shopList[index].kw1 = e
				this.$store.state.zhsq.shopCartList[index].kw1 = e
				
				
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
			
			computedPrice() {
				let totalPrice = 0
				for(let i = 0; i < this.selectArr.length; i++) {
					let kw1 = new Number(this.selectArr[i].kw1)
					let kw2 = new Number(this.selectArr[i].kw2)
					let total = new Number(kw1 * kw2)
					totalPrice += total
				}
				totalPrice = totalPrice.toFixed(2)
				this.totalPrice = totalPrice
			},
			
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
								console.log(res, '删除信息')
								this.getCartList()
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
