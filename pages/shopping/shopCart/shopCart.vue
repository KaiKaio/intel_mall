<template>
	<!-- 购物车 -->
	<view>
		<view class="cart-wrapper">
			<checkbox-group ref="checkUl" @change="checkboxChange">
				<view class="list-item" v-for="(item, index) in shopList" :key="item.id">
					<view class="delete-btn" @click="delItem(item, index)">&#xe67a;</view>
					<label class="list-label"></label>
					<checkbox :value="index.toString()" style="width: 44upx; height: 44upx;" />
					<image class="item-image" :src="$base.urlPrex + item.photo[0]" mode=""></image>
					<view class="item-info">
						<view>{{ item.name }}</view>
						<view class="sku-name">{{ item.kw0 }}</view>
						<view class="bottom-wrapper">
							<text>￥{{ item.kw2 }}</text>
							<uni-number-box class="shop-number" @change="changeNumber($event, item, index)" :value="parseInt(item.kw1)" :min="1" :max="99"></uni-number-box>
						</view>
					</view>
				</view>
			</checkbox-group>
		</view>
		
		<view class="cart-wrapper" v-if="empty === true" style="text-align: center;">
			<p>购物车还没有商品，快去选购吧~</p>
		</view>
		
		<view class="cart-bottom">
			<view style="display: flex; align-items: center;">
				<checkbox ref="allSel" value="all" :checked="selectAllFlag" @click="selectAll" style="margin: 0upx 12upx; width: 44upx; height: 44upx;" />
			 	<text>全选</text>
			</view>
			<view class="right">
				<view>合计：￥{{ totalPrice }}</view>
				<view class="pay bg-hdsh" @click="pay">结&nbsp;算</view>
			</view>
		</view>
	</view>

</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniNumberBox,
			uniPopup
		},
		data() {
			return {
				shopList: [],
				selectArr: [],
				totalPrice: 0,
				
				selectAllFlag: false, // 全选标记
				
				throttleFlag: true,
				
				empty: false // 购物车是否为空
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.getList()
			
			
		},
		onReachBottom() {
			this.getListObj.pnum++
			if (this.getListObj.pnum > this.pageNum) {
				return
			} else {
				this.getList('rb')
			}
		},
		computed: {
			
		},
		watch: {
			//刷新list的时候检查全选按钮的状态
			shopList: function() {
				
			}
		},
		methods: {
			getList() {
				
				uni.showLoading({
					mask: true
				})
				
				this.$base.szblGet('/api/carts', {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					pnum: 1,
					psize: 6,
					state: this.$base.getState(),
					createuserid: this.$userMsg.userid,
					rpflag: this.$DEVELOPER.cid,
					appid: this.$DEVELOPER.szblid,
					areacode: this.$areaMsg.id,
					labelid: '1014002'
				}).then(res => {
					this.totalShopNum = res.num
					this.pageNum = res.pages
					if(res.data === null) {
						this.empty = true
						this.shopList = []
					} else {
						this.shopList = this.$base.strResToJson(res.data)
					}
					
					uni.hideLoading()
					
				}).catch(msg => {
					console.log(msg)
				})
			},
			
			checkboxChange(e) {
				
				let selectArrIndex = e.detail.value// 已经选中的商品坐标号
				
				let selectArr = []
				for(let i = 0; i < selectArrIndex.length; i++) {
					let index = parseInt(selectArrIndex[i]) // 格式化已选中商品的下标 ('1' => 1)
					selectArr.push(this.shopList[index])
				}
				
				this.selectArr = selectArr
				
				this.computedPrice()
				
				// 判断全选反选
				if(e.detail.value.length === this.shopList.length) {
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
						this.selectArr = this.shopList
						
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
				
				this.shopList[index].kw1 = e
				
				
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
								this.getList()
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
.cart-wrapper {
	width: 94%;
	margin: 20upx auto 0upx;
	background-color: #fff;
	border-radius: 20upx;
}

.cart-wrapper .list-item {
	position: relative;
	display: flex;
	width: 90%;
	margin: 0 auto;
	align-items: center;
	padding: 48upx 0px 16upx;
}

.cart-wrapper .list-item .delete-btn {
	position: absolute;
	right: 0upx;
	top: 8upx;
	background-color: #f56c6c;
	color: #fff;
	padding: 2upx 16upx;
	border-radius: 8upx;
	font-size: 24upx;
}

.cart-wrapper .list-item .item-image {
	background-color: #fff;
	width: 200upx;
	height: 200upx;
	margin: 0upx 20upx;
	border-radius: 18upx;
}

.cart-wrapper .list-item .item-info {
	width: calc(100% - 200upx - 44upx - 40upx);
}

.cart-wrapper .list-item .item-info > view:first-child {
	font-size: 28upx;
	height: 80upx;
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
	position: fixed;
	bottom: 0upx;
	width: 100%;
	display: flex;
	background-color: #fff;
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
