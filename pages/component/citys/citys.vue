<template>
	<!-- 选择城市页面 -->
	<view>
		<!-- <search-bar :isFull="true"></search-bar> -->
		
		<view class="city-input">
			<text @click="back" style="display: flex; align-items: center; width: 10%; justify-content: center;" class="font-icon">&#xe63d;</text>
			<text class="font-icon search-icon">&#xe612;</text>
			<input confirm-type="search" @confirm="fetchArea('search')" class="city-input-style" type="text" placeholder="请输入城市名称(如: 海口)" v-model="searchValue">
			<view @tap="fetchArea('search')" class="city-search-botton">搜索</view>
		</view>
		
		
		<!-- <view class="choose-locat">
			<span>定位：</span>
			<span class="color-hdsh">{{area}}</span>
		</view> -->

		<view class="choose-comm">
			<!-- <p>地区选择</p>
			<ul>
				<li v-for="(x,index) in town" :key="index" @click="toIndex(2,x)">
					{{x.name}}
				</li>
			</ul> -->
			
			
			<p class="area-title" v-if="secondList.length > 0">区划 / 城镇</p>
			<ul class="area-list">
				<!-- <li class="list-item" :class="{ active: secondSel.id === item.id }" v-for="item in secondList" :key="item.id" @click="fetchArea('selSecondArea', item)">{{ item.name }}</li> -->
				<li class="list-item" :class="{ active: secondSel.id === item.id }" v-for="item in secondList" :key="item.id" @click="fetchUnit(item)">{{ item.name }}</li>
			</ul>
			
			<!-- <p class="area-title" v-if="thirdList.length > 0">街道 / 乡镇</p>
			<ul class="area-list">
				<li class="list-item" :class="{ active: thirdSel.id === item.id }" v-for="item in thirdList" :key="item.id" @click="fetchUnit(item)">{{ item.name }}</li>
			</ul> -->
			
			<p class="area-title" v-if="unitList.length > 0">店铺</p>
			<ul class="area-list">
				<li class="list-item" :class="{ active: get_unit_data.id === item.id }" v-for="item in unitList" :key="item.id" @click="selUnit(item)">{{ item.name }}</li>
			</ul>
			
			
		</view>
		<locat @success="locatSucc" @error="locatErr"></locat>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchValue: '',
				
				secondList: [],
				secondSel: {},
				thirdList: [],
				thirdSel: {},
				unitList: [],
				get_unit_data: {},
				
				town: [
					{
						id: '460105',
						name: '五源河',
						shortname: '五源河',
					},
				],
				// sign: 'choose',
				// area: '定位中...',
			};
		},
		methods: {
			toIndex(index, x) {
				if (index == 2) {
					this.$areaMsg.id = x.id
					this.$areaMsg.name = x.name
					this.$areaMsg.shortname = x.shortname
					// console.log(this.$areaMsg)
				}
				// this.back();
				uni.reLaunch({
					url:'/pages/tabBar/index/index'
				})
			},
			back() {
				if(uni.getStorageSync('zhsq_unitInfo') === "" || uni.getStorageSync('zhsq_areaMsg') === "") {
					uni.showToast({
						title: '请先选择你所在的地区和店铺',
						mask: true,
						icon: 'none'
					})
				} else {
					uni.navigateBack()
				}
			},
			
			// 选择商店
			selUnit(item) {
				let uniInfoStr = JSON.stringify(item)
				uni.setStorageSync('zhsq_unitInfo',  uniInfoStr)
				
				this.$store.commit('set_unit_data', item)
				this.$areaMsg = this.thirdSel
				
				uni.setStorageSync('zhsq_areaMsg',  JSON.stringify(this.thirdSel))
				
				uni.switchTab({
					url:'/pages/tabBar/index/index'
				})
				
				// this.maskClickFlag = true
			},
			
			locatSucc(msg){
				this.area = msg;
			},
			locatErr(msg){
				uni.showToast({
					title: msg,
					mask: false,
					duration: 1500
				});
			},
			
			fetchArea(str, item) {
				uni.showLoading({
					mask: true,
					title: '加载中...'
				})
				
				let pjson = {
					m: this.$DEVELOPER.szblid,
					tk: this.$DEVELOPER.token,
					state: this.$base.getState(),
					pnum: 0,
					psize: 1000
				}
				
				if(str === 'search') { // 搜索市
					pjson.name = this.searchValue
					pjson.level = '2'
				}
				
				if(str === 'selArea') { // 点击市
					pjson.level = '3'
					pjson.pid = item.id
				}
				
				if(str === 'selSecondArea') { // 点击区，市县
					pjson.level = '4'
					pjson.pid = item.id
					
					this.secondSel = item
				}
				
				this.$base.szblGet('/api/sysareacode', pjson).then(res => {
					if(str === 'search') { // 搜索市
						this.areaList = this.$base.strResToJson(res.data)
						this.fetchArea('selArea', this.areaList[0])
					} else if (str === 'selArea') { // 点击市
						this.secondList = this.$base.strResToJson(res.data)
					} else if (str === 'selSecondArea') { // 点击市
						this.thirdList = this.$base.strResToJson(res.data)
					}
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
			
			fetchUnit(item) {
				this.thirdSel = item
				
				uni.showLoading({
					mask: true,
					title: '加载中...'
				})
				let pjson = {
					m: this.$DEVELOPER.szblid,
					tk: this.$DEVELOPER.token,
					state: this.$base.getState(),
					appid: this.$DEVELOPER.szblid,
					rpflag: this.$DEVELOPER.cid,
					areacode: item.id,
					pnum: 1,
					psize: 100
				}
				
				this.$base.szblGet('/api/orgs', pjson).then(res => {
					this.unitList = this.$base.strResToJson(res.data)
					if(this.unitList.length === 1) {
						this.selUnit(this.unitList[0])
					}
					uni.hideLoading()
				}).catch(err => {
					console.log(err)
					uni.hideLoading()
				})
			},
			
		},
		
		
		onLoad() {
		}
	}
</script>

<style scoped>
.status-bar {
	height: var(--status-bar-height);
	width: 100%;
	background: #F7F7F7;
}

.top-wrap {
	height: var(--status-bar-height);
	width: 100%;
	position: fixed;
	background-color: #F8F8F8;
	top: 0;
	z-index: 999;
}

.city-input {
	background-color: #fff;
	border-radius: 10upx;
	font-size: 26upx;
	width: 100%;
	display: flex;
	padding: 10upx 0upx 10upx 0upx;
	position: relative;
}

.city-input .search-icon {
	position: absolute;
	display: flex; 
	align-items: center;
	left: 92upx;
	top: 50%;
	transform: translateY(-54%);
}

.city-input .city-input-style {
	border: 2upx solid #f2f2f4;
	width: 66%;
	height: 66upx;
	line-height: 66upx;
	padding-left: 64upx;
}

.area-list .list-item.active {
	height: auto;
	overflow: initial;
	vertical-align: auto;
	background-color: rgba(235,84,77, .4);
	border-color:  rgba(235,84,77, 1);
	
}

.city-search-botton {
	background-color:  #eb544d;
	width: 20%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	border-radius: 8upx;
	border-radius: 2upx solid #eee;
	box-sizing: border-box;
	margin-left: 2%;
}
</style>
