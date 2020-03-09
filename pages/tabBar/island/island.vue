<template>
	<!-- 打开小镇导览的web-view -->
	<view>
		<!-- #ifdef H5 -->
		<!-- <map :style="{height: height + 'px'}" :latitude="latitude" :show-location="true" :longitude="longitude" :polyline="polyline"
		 :scale="12" :controls="controls" :markers="marker_list">
			<cover-view class="cover-left">
			</cover-view>
			<cover-view class="cover-right">
			</cover-view>
		</map> -->
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<!-- <map :latitude="latitude" :longitude="longitude" :show-location="true" :polyline="polyline" :scale="scale" :controls="controls"
		 @controlta="blow()" :markers="marker_list">
			<cover-view class="cover-left">
			</cover-view>
			<cover-view class="cover-right">
			</cover-view>
		</map> -->
		<!-- #endif -->
		
		<!-- <web-view src="https://ss.nkshuju.com/wap/index-xzdl.html?dis=2" :webview-styles="webviewStyles"></web-view> -->
		
		<web-view v-if="$areaMsg.id != '469005' " src="https://ss.nkshuju.com/wap/index-xzdl.html" :webview-styles="webviewStyles"></web-view>
		<web-view v-else src="https://ss.nkshuju.com/wap/index-xzdl.html?areaCode=1111#" :webview-styles="webviewStyles"></web-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'map',
				latitude: 19.930048,
				longitude: 110.223714,
				scale: 12,
				polyline: [{
					// points: this.$base.list_area,
					color: '#00a0ea',
					width: 2,
				}],
				height: 0,
				controls: [{
					iconPath: "/static/icon/index.png",
					clickable: true,
					position: {
						left: 50,
						top: 50,
						width: 50,
						height: 50,
					}
				}],
				marker_list: [],
				webviewStyles: {
					progress: {
						color: '#00a0ea'
					}
				}
			};
		},
		onShow() {
			// #ifdef H5
			if(this.$areaMsg.id == '469005') {
				document.title = '智慧海岛'
			}
			// #endif
		},
		onLoad() {
			// #ifdef H5
			if(this.$areaMsg.id == '469005') {
				document.title = '智慧海岛'
			}
			// #endif
			
			// #ifdef H5
			this.$base.wxShare('', '', this.$base.linkFilter(window.location.href), '');
			// #endif
			uni.getSystemInfo({
				success: (res) => {
					this.height = res.screenHeight - res.windowBottom;
				},
				fail: (msg) => {
					console.log(msg)
				}
			})
			// this.getList()
		},
		methods: {
			blow(e) {
				// console.log(e)
				this.scale++
				// console.log(this.scale)
			},
			getList() {
				this.$base.szblGet('/api/dlp', {
					m: this.$DEVELOPER.szblid,
					tk: this.$DEVELOPER.token,
					state: this.$base.getState(),
					status: 1,
					snum: '2',
					psize: 0,
					pnum: 0,
					listpage: false,
					areacode: this.$base.getQueryAreaCode('460105103')
					// areacode: 86
				}).then((resData) => {
					// console.log(this.$base.strResToJson(resData.data))
					let list = this.$base.strResToJson(resData.data)
					for (let i = 0; i < list.length; i++) {
						var marker = {
							id: i,
							longitude: list[i].xyz.split(",")[0],
							latitude: list[i].xyz.split(",")[1],
							title: list[i].name,
							iconPath: '/static/icon/dl-trav.png',
							width: 15,
							height: 15,
							label:{
								content: list[i].name,
								color: '#5d7c90',
								fontSize: 10,
								borderWidth: 0,
								textAlign: 'center'
							}
						}
						this.marker_list.push(marker)
					}
					// console.log(this.marker_list)

				}).catch((msg) => {
					console.log(msg)
				})
			}
		}
	}
</script>

<style>
	map {
		width: 750upx;
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
	}

	.cover-left,
	.cover-right {
		z-index: 99;
		width: 80upx;
		height: 200upx;
		background: #FFFF33;
		position: absolute;
		top: 5upx;
	}

	.cover-left {
		left: 5upx;
	}

	.cover-right {
		right: 5upx;
	}
</style>
