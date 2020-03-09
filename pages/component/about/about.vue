<template>
	<!-- 关于页面,仅APP用 -->
	<view class="bg-logo">
		<view class="version">For Android V0.5.8</view>
		<view class="about-list">
			<!-- <view class="item">
				<text>检测更新</text>
				<text class="font-icon">&#xe79a;</text>
			</view>
			<view class="item">
				<text>公司信息</text>
				<text class="font-icon">&#xe79a;</text>
			</view>
			<view class="item last-item">
				<text>隐私政策</text>
				<text class="font-icon">&#xe79a;</text>
			</view> -->
		</view>
		<view class="copyright">
			Copyright©2019
			<!-- <view class="">
				海岛生活haidsh.com版权所有
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				date: new Date(),
				year: '',
			};
		},
		onLoad(){
			this.year = this.date.getFullYear()
		},
		methods:{
			
		}
	}
</script>

<style>
.version{
	position: relative;
    top: 25%;
    margin: auto;
    text-align: center;
}

.copyright{
	position: relative;
	top: 88%;
	text-align: center;
	margin: auto;
	color: #A9A9A9;
	font-size: 24upx;
}

.about-list{
	position: absolute;
    top: 37%;
    width: 100%;
}

.about-list .item{
	border-top: 1upx solid #EEEEEE;
	padding: 20upx 0;
	/* height: 30px; */
    display: flex;
    flex-direction: row;
	align-items: center;
    justify-content: space-between;
}

.about-list .last-item{
	border-bottom: 1upx solid #EEEEEE;
}

.about-list text:first-child{
	margin-left: 30upx;
}

.about-list text:last-child{
	margin-right: 20upx;
	color: #a9a9a9;
}
</style>
