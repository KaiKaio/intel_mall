<template>
	<!-- 登录页 -->
	<view class="bg-logo">
		<view class="phone">
			<text class="font-icon color-hdsh">&#xe61e;</text>
			<text>手机号</text>
			<input type="number" value="" v-model="phone" placeholder-style="font-size: 24upx" placeholder="请输入手机号" maxlength="11" />
		</view>
		
		<view class="pwd">
			<text class="font-icon">&#xe619;</text>
			<text>验证码</text>
			<input type="number" placeholder-style="font-size: 24upx" v-model="authCode" value="" placeholder="请输入短信验证码"
			 maxlength="6" />
			 
			<view class="get-auth bg-hdsh" @click="getAuthCode">
				{{num_html}}
			</view>
		</view>
		<view class="login-text">
			
		</view>
		<view class="login-btn bg-hdsh" @click="login">
			登录
		</view>
	</view>
</template>

<script>
	import {
		mapGetters, mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				showPwd: true,
				phone: '',
				pwd: '',
				authCode: '',
				isRegistered: true,
				isLogin: false,
				button: '登录',
				num_html: '获取验证码',
				page: '',
				smsid: '15826210430701267284594'
			};
		},
		computed: {
			...mapGetters(['get_page_data'])
		},
		onLoad(obj) {
			if (obj.m != "null") {
				this.phone = obj.m
			}
			this.page = this.get_page_data.page
		},
		methods: {
			...mapActions({
			    getCartList: "getCartList"
			}),
			getAuthCode() {
				if (!(/^1\d{10}$/).test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				var num_time = 60
				var timer = null
				uni.showToast({
					title: '',
					icon: 'loading',
					mask: true,
					duration: 50000
				});
				//获取验证码
				this.$base.szblPost(
					"/api/sms/mpcode?m=" + this.$DEVELOPER.szblid + 
					"&tk=" + this.$DEVELOPER.token + 
					"&state=" + this.$base.getState() + 
					"&phone=" + this.phone + 
					"&appid=" + this.$DEVELOPER.szblid + 
					"&smsid=" + this.smsid
				).then(res =>{
					uni.hideToast();
					this.num_html = num_time + '秒'
					timer = setInterval(() => {
						num_time--
						this.num_html = num_time + '秒'
						if (num_time < 1) {
							this.get_statu = true
							this.num_html = '获取验证码'
							clearInterval(timer)
						}
					}, 1000);
				}).catch(msg => {
					console.log(msg);
					uni.hideToast()
				})
			},
			login() {
				if (this.authCode == '') {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				uni.showLoading({
					mask: true
				})
				this.$base.loginByPhoneCode(this.phone, this.authCode, this.$DEVELOPER.szblid, 'u').then(res => {
					uni.hideLoading()
					this.getCartList()
					uni.reLaunch({
						url: this.page,
					})
				}).catch((msg) => {
					console.log(msg);
					uni.hideLoading()
					uni.showToast({
						title: msg,
						icon: 'none',
						mask: false,
						duration: 1000
					})
					return
				})
				// this.$base.normalLogin(this.phone, this.pwd, 'u').then((msg) => {
				// 	console.log(msg)
				// 	uni.hideToast();
				// 	if (msg == "登录成功") {
				// 		// console.log(11)
				// 		console.log(this.page)
				// 		uni.reLaunch({
				// 			url: this.page,
				// 		})
				// 	}
				// }).catch((msg) => {
				// 	console.log(msg)
				// 	uni.hideToast();
				// 	uni.showToast({
				// 		title: msg,
				// 		icon: 'none',
				// 		mask: false,
				// 		duration: 1500
				// 	});
				// 	return
				// })
			},
			// forget() {
			// 	uni.navigateTo({
			// 		url: '/pages/component/register/register?m=f',
			// 		success: res => {},
			// 		fail: () => {},
			// 		complete: () => {}
			// 	});
			// },
		}
	}
</script>

<style>
.bg-logo {
	height: 100vh;
	width: 750upx;
	/* background: #fff url(~@/static/icon/hdsh/logo.png) no-repeat 50% 13.3881%; */
	background-size: 30%;
	position: relative;
}


</style>
