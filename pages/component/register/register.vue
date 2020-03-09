<template>
	<!-- 注册页，现无用 -->
	<view>
		<view class="bg-logo">
			<view class="phone">
				<text class="font-icon" style="color: #00a0ea;">&#xe61e;</text>
				<text>手机号</text>
				<input type="number" value="" v-model="phone" placeholder-style="font-size: 24upx" placeholder="请输入手机号" maxlength="11" />
			</view>
			<view class="pwd" v-if="isRegistered">
				<text class="font-icon">&#xe611;</text>
				<text>密码</text>
				<input type="text" placeholder-style="font-size: 24upx" v-model="pwd" :password="showPwd" value="" placeholder="请输入6-16个字符"
				 maxlength="16" />
				<text class="font-icon" :class="[!showPwd ? 'pwd-ac' : '']" @click="changePwd">&#xe7d8;</text>
			</view>
			<view class="pwd" v-if="isForget">
				<text class="font-icon">&#xe611;</text>
				<text>密码</text>
				<input type="text" placeholder-style="font-size: 24upx" v-model="pwd" :password="showPwd" value="" placeholder="请输入6-16个字符"
				 maxlength="16" />
				<text class="font-icon" :class="[!showPwd ? 'pwd-ac' : '']" @click="changePwd">&#xe7d8;</text>
			</view>
			<view class="auth-code" v-if="(isRegistered && !isForget) || (!isRegistered && isForget)">
				<text class="font-icon">&#xe619;</text>
				<text>验证码</text>
				<input type="number" placeholder-style="font-size: 24upx" v-model="auth" value="" placeholder="请输入短信验证码" maxlength="6" />
				<!-- <text class="font-icon" :class="[!showPwd ? 'pwd-ac' : '']" @click="changePwd">&#xe619;</text> -->
				<view class="get-auth" @click="getAuthCode">
					{{num_html}}
				</view>
			</view>
			<view class="register-text">
				<text class="pwd-ac" @click="back">返回登录</text>
			</view>
			<view v-if="isRegistered && !isForget" class="rigister-btn" @click="register">
				立即注册
			</view>
			<view v-if="!isRegistered && isForget" class="rigister-btn" @click="alterPwd">
				修改密码
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				showPwd: true,
				phone: '',
				pwd: '',
				auth: '',
				isRegistered: false, //是否未注册
				isForget: false, //是否为忘记密码的情况
				button: '下一步',
				get_statu: true,
				num_html: '获取验证码',
				page: '',
			};
		},
		computed:{
			...mapGetters(['get_page_data'])
		},
		onLoad(obj) {
			if (obj.m == "f") {
				this.isForget = true
			}
			this.page = this.get_page_data.page
		},
		watch: {
			phone() {
				if (this.phone.length == 11 && !this.isForget) {
					// console.log(this.isForget)
					this.next()
				}
			}
		},
		methods: {
			changePwd() {
				this.showPwd = !this.showPwd
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			next() {
				// if(this.phone.length == 11){
				uni.showToast({
					title: '',
					icon: 'loading',
					mask: true,
					duration: 50000
				});
				this.$base.szblPost("/api/c2cu/cp?m=" + this.$DEVELOPER.szblid + "&tk=" + this.$DEVELOPER.token + "&state=" + this.$base
					.getState() + "&phone=" + this.phone + "&rpflag=" + this.$DEVELOPER.cid).then((dataJson) => {
					//验证手机号是否注册
					//dataJson.msg: yes-已注册，no-未注册
					uni.hideToast();
					if (dataJson.msg == 'yes') {
						uni.showToast({
							title: '此手机号已注册',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						uni.redirectTo({
							url: '/pages/component/login/login?m=' + this.phone,
						});
					} else if (dataJson.msg == 'no') {
						this.isRegistered = true
					}
					// console.log(dataJson)
				}).catch((msg) => {
					console.log(msg)
					uni.hideToast();
				})
				// }


				// this.isRegistered = true
				// this.button = '注册'
			},
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
				this.$base.szblPost("/api/user/sc?m=" + this.$DEVELOPER.szblid + "&tk=" + this.$DEVELOPER.token + "&state=" + this.$base
					.getState() + "&phone=" + this.phone + "&rpflag=" + this.$DEVELOPER.cid).then((dataJson) => {
					// console.log(dataJson)
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
				}).catch((msg) => {
					console.log(msg)
					uni.hideToast();
				})


			},
			register() {
				if (!(/^1\d{10}$/).test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				if(this.pwd == ''){
					uni.showToast({
						title: '请输入密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				if(this.auth == ''){
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				var pjson = {
					name: this.phone,
					password: this.$base.getPWDEncode(this.pwd),
					mpcode: this.auth,
					kw0: '', //真实姓名
					kw1: this.phone, //电话号码
					kw2: '',
					kw3: '',
					rpflag: this.$DEVELOPER.cid
				}
				this.$base.szblPost("/api/c2cu/reg?m=" + this.$DEVELOPER.szblid + "&tk=" + this.$DEVELOPER.token + "&state=" + this.$base
					.getState(), pjson).then((dataJson) => {
					// console.log(dataJson)
					if (dataJson.msg == "添加成功!") {
						//登录
						this.$base.normalLogin(this.phone, this.pwd, 'u').then((msg) => {
							// console.log(msg)
							if (msg == "登录成功") {
								//登录成功后跳到注册前一个页面
								uni.reLaunch({
									url: this.page,
								})
							}
						}).catch((msg) => {
							uni.showToast({
								title: msg,
								icon: 'none',
								mask: true,
								duration: 1500
							});
							return
						})
					}
					uni.hideToast();
				}).catch((msg) => {
					uni.hideToast();
					uni.showToast({
						title: msg,
						icon: 'none',
						mask: false,
						duration: 1000
					});
				})
			},
			alterPwd() {
				if (!(/^1\d{10}$/).test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				if(this.pwd == ''){
					uni.showToast({
						title: '请输入密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				if(this.auth == ''){
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				uni.showToast({
					title: '',
					icon: 'loading',
					mask: true,
					duration: 50000
				});
				this.$base.regAndForgetOrModifyPwd(this.phone, this.pwd, this.auth, "u").then((msg) => {
					uni.hideToast();
					if (msg == "登录成功") {
						uni.reLaunch({
							url: this.page,
						})
					}
				}).catch((msg) => {
					uni.hideToast();
					uni.showToast({
						title: msg,
						icon: 'none',
						mask: false,
						duration: 1000
					});
					return
				})
			}
		}
	}
</script>

<style>

</style>
