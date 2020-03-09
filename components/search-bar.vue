<template>
	<!-- 搜索框组件 -->
	<view>
		<view class="search-bar">

			<!-- 返回按钮 -->
			<!-- #ifdef APP-PLUS -->
			<text v-if="isClass" class="font-icon back-btn" @click="back">&#xe799;</text>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<text v-if="isFull" class="font-icon back-btn" @click="back">&#xe799;</text>
			<!-- #endif -->
			
			<!-- 海岛生活配置,地区按钮 -->
			<view v-if="isLoact" class="locat-bar" @click="toCity">
				<view class="locat-min">{{area.shortname}}</view>
				<text class="font-icon">&#xe63c;</text>
			</view>
			
			<!-- 搜索框 -->
			<view class="flex-cont search-input search-min" :class="{'search-min': isLoact, 'search-max': isFull, 'search-produc' :isClass}"
			 @click="toProduc(-1)">
				<view v-if="isClass" class="choose-top-sort" @click="toggletopClass">
					{{topClass}}
					<text class="font-icon top-sort-icon">&#xe63c;</text>
				</view>
				<input type="text" :placeholder="placeholder" />
				<text class="font-icon" :class="{'search-icon': isClass}">&#xe612;</text>
			</view>
			
			<!-- 搜索按钮 -->
			<text v-if="isClass" class="search-btn bg-hdsh" @click="searchBtn">搜索</text>

			<!-- <view class="flex-cont search-input search-produc">
				<view class="choose-top-sort" @click="toggletopClass">
					{{topClass}}
					<text class="font-icon top-sort-icon">&#xe63c;</text>
				</view>
				<input type="text" placeholder="搜索" confirm-type="'search'" @confirm="search" v-model="kw" />
				<text class="font-icon search-icon">&#xe612;</text>
			</view> -->
		</view>

		<!-- 吃住游购分类下拉列表 -->
		<view class="top-sort-list" :class="{'top-sort-list-ac' : topClassClicked}">
			<view class="top-sort-item" :class="{'top-sort-item-ac bg-hdsh' : topClassIndex == index}" v-for="(x,index) in topClassList"
			 :key="index" @click="choosetopClass(x,index)">
				{{x}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'search-bar',
		props: {
			isLoact: { //是否需要显示定位
				type: Boolean,
				default: false
			},
			isClass: { //是否需要吃住游购分类
				type: Boolean,
				default: false
			},
			isSort: { //是否需要排序
				type: Boolean,
				default: false
			},
			isFull: { //是否需要宽度铺满
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				area: '',
				placeholder: '搜索',
				topClass: '购',
				topClassList: ["购", "游", "宿", "食"], //海岛生活配置
				// topClassList: [ "游", "购","宿", "食"],  //清溪商城配置
				topClassIndex: 0,
				topClassClicked: false, //判断吃住游购列表是否显示
			};
		},
		created() {
			// #ifdef H5
			if(this.$route.query.areaCode == '469005') { // 如果地址参数为文昌，则更改地址
				this.$areaMsg.id = '469005'
				this.$areaMsg.name = '文昌市'
				this.$areaMsg.shortname = '文昌'
			}
			// #endif
			
			this.area = this.$areaMsg;
			
			if (this.isFull) {
				this.placeholder = '城市/街道/小镇'
			}
		},
		methods: {
			//跳转至地区选择页
			toCity() {
				uni.navigateTo({
					url: '/pages/component/citys/citys',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			//跳转至列表页
			/**
			 * @param {number} index 查询的分类id 0-商品，1-门票，2-民宿，3-美食
			 * @param {string} kw 关键词
			 * @param {number} orderby 排序方式 1.价格高到低 2.价格低到高 3.销量高到低 4.新品5.参加活动的
			 */
			toProduc(index, kw, orderby) {
				if (this.isFull) {
					return
				}
				if (!kw) {
					kw = ''
				}
				let url = '/pages/shopping/productList/productList?kw=' + kw
				if ((typeof index) == "number") {
					url += '&id=' + index;
				}
				if ((typeof orderby) == "number") {
					url += '&ob=' + orderby;
				}

				uni.navigateTo({
					url: url,
				});
			},
			// 返回按钮，app用
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			toggletopClass() {
				// 开关吃住游购分类列表
				this.topClassClicked = !this.topClassClicked
				if (this.isSort) {
					this.isSort = !this.isSort
				}
			},
		}
	}
</script>

<style>
	.search-bar {
		width: 100%;
		height: 90upx;
		display: flex;
		background: #fff;
		align-items: center;
	}

	.locat-bar text {
		font-size: 26upx;
	}

	.locat-bar {
		width: 20%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* color: #fff; */
		color: #000;
	}

	.locat-min {
		/* width: 15%;
	  text-align: center; */
		width: 90upx;
		height: 40upx;
		overflow: hidden;
		text-align: center;
	}

	.search-input {
		margin: 15upx;
		background: #fff;
		position: relative;
		border-bottom: 2upx solid #f6f6f6;
	}

	.search-input input {
		border: 2upx solid #f2f2f4;
		font-size: 26upx;
		/* padding: 15upx 0 15upx 22.13%; */
		width: 100%;
		height: 66upx;
		line-height: 66upx;
		border-radius: 8upx;
		-webkit-appearance: none;
		appearance: none;
	}

	.search-input text {
		position: absolute;
		/* left: 18.56%; */
		left: 18upx;
		top: 20upx;
		font-size: 30upx;
		color: #b2b2b2;
	}

	.search-min {
		width: 80%;
		/* background: transparent; */
		border: none;
	}

	.search-min input {
		/* padding-left: 10.13%; */
		padding-left: 60upx;
		/* background: rgba(255,255,255,0.3); */
		/* border: none; */
		/* border-radius: 80upx; */
		border-radius: 10upx;
	}

	.search-input text {
		position: absolute;
		/* left: 18.56%; */
		left: 18upx;
		top: 20upx;
		font-size: 30upx;
		color: #b2b2b2;
	}

	.search-max {
		width: 100%;
	}

	.search-produc {
		width: 604upx !important;
		border-bottom: none !important;
	}

	.search-produc input {
		padding-left: 60upx;
		border-radius: 0 10upx 10upx 0;
		/* width: 458upx; */
		/* #ifdef H5 */
		width: 410upx;
		/* #endif */

		/* #ifndef H5 */
		width: 347upx;
		/* #endif */
	}

	.choose-top-sort {
		border: 2upx solid #f2f2f4;
		border-right: none;
		width: 140upx;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	
	.top-sort-icon {
		position: relative !important;
		left: auto !important;
		top: auto !important;
	}

	.top-sort-list {
		/* border: 2upx solid #f6f6f6; */
		height: 200upx;

		/* top: var(--status-bar-height); */
		/* #ifdef APP-PLUS */
		top: 124upx;
		width: 144upx;
		/* left: 15upx; */
		left: 72upx;
		border: 2upx solid #f2f2f4;
		border-top: none;
		/* #endif */


		/* #ifndef APP-PLUS */
		top: 72upx;
		width: 140upx;
		left: 14upx;
		/* #endif */
		z-index: 9;
		background: #fff;
		position: fixed;
		visibility: hidden;
	}

	.top-sort-list-ac {
		/* animation: sort-scroll-bot 1s; */
		/* height: 200upx !important; */
		visibility: visible;
	}

	@keyframes sort-scroll-bot {
		from {
			height: 0;
		}

		to {
			height: 200upx;
		}
	}

	@keyframes sort-scroll-top {
		from {
			height: 200upx;
		}

		to {
			height: 0;
		}
	}


	.top-sort-item {
		height: 50upx;
		text-align: center;
		line-height: 50upx;
	}

	.top-sort-item-ac {
		color: #fff;
	}
	
	.search-bar .search-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 66upx;
		width: 105upx;
		margin-right: 15upx;
		color: #fff;
		border-radius: 8upx;
	}
	
	.search-input .search-icon {
		left: 154upx !important;
	}
</style>
