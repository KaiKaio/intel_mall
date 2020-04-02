<script>
	import { mapActions } from 'vuex';
	
	export default {
		onLaunch: function(obj) {
			this.$base.getTokenFromAppIdAndSecret(
				this.$DEVELOPER.szblid, 
				this.$DEVELOPER.szblsecret
			).then((msg) => {
				//优先获取默认账户的tk并保存
				this.$DEVELOPER.token = this.$userMsg.token;
				//随后判断是否有用户信息，自动登录
				return this.$base.autoLogin(this.$DEVELOPER.szblid)
			}).then(msg => {
				this.getUserMsg() // 获取用户信息
				this.getCartList() // 获取购物车
			}).catch(msg => {
				console.log(msg, '错误')
			});
			
			
			// 选择地区配置
			if(uni.getStorageSync('zhsq_unitInfo') === "" || uni.getStorageSync('zhsq_areaMsg') === "") {
				uni.reLaunch({
					url: '/pages/component/citys/citys'
				})
			} else {
				let zhsq_unitInfo_str = uni.getStorageSync('zhsq_unitInfo')
				this.$store.commit('set_unit_data', this.$base.strResToJson(zhsq_unitInfo_str))
				
				
				let zhsq_areaMsg_str = uni.getStorageSync('zhsq_areaMsg')
				this.$areaMsg = this.$base.strResToJson(zhsq_areaMsg_str)
				
			}

		},
		async onShow() {
			// 若获取Token的时间太久，则重刷页面
			let diff = 0;
			this.$STOPWATCH.now = new Date();
			if (this.$STOPWATCH.before != '') {
				diff = (this.$STOPWATCH.now.getTime() - this.$STOPWATCH.before.getTime()) / 1000;
			}
			this.$STOPWATCH.before = this.$STOPWATCH.now
			
			if (diff > 7200) {
				uni.reLaunch({
					url: '/pages/tabBar/index/index'
				})
			}

			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				
				// 获取微信签名
				await this.$base.getWxSign(this.$DEVELOPER.wxPayMarkPUBLIC)
				
				this.$base.getWxUserOpenId(this.$DEVELOPER.wxPayMarkPUBLIC).then(res => {
					uni.setStorageSync("wxOpenid", res.openid)
				}).catch(err => {
					console.log(err, '错误信息')
				})
			}
			// #endif
		},
		onHide: function() {},
		methods: {
			...mapActions({
			    getCartList: "getCartList"
			}),
			
			getUserMsg(){
				uni.showLoading({
				    title: '加载中...'
				})
				
				this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
				}).then((resData) => {
					global.$userDetail = this.$base.strResToJson(resData.data);
					
					this.$store.commit('set_userMsg', global.$userDetail)
					
					// 如果没有数据库中没有微信OpenID并且本地存有微信OpenID
					if(global.$userDetail.wxopenid === '' && uni.getStorageSync("wxOpenid") !== '') {
						return this.$base.getWxUserInfo(
							uni.getStorageSync("wxOpenid"), 
							this.$DEVELOPER.wxPayMarkPUBLIC
						)
						
					} else {
						return Promise.reject('没有Return 获取微信信息接口')
					}
					
				}).then(res => {
					console.log(res, '获取微信用户信息')
					if (res != null) {
						// 修改信息
						let wxData = this.$base.strResToJson(res);
						return this.$base.szblPut(
							'/api/user/my' +
							'?m=' + this.$userMsg.userid + 
							'&tk=' + this.$userMsg.token + 
							'&state=' + this.$base.getState(), {
								"id": this.$userMsg.userid,
								"wxopenid": uni.getStorageSync("wxOpenid"),
								kw12: wxData.nickname, //微信昵称
								kw16: wxData.headimgurl,//微信头像
								kw15: wxData.sex // 性别
							}
						)
					}
				}).then(res => {
					uni.hideLoading();
					this.getUserMsg() // 修改完成后再次执行一次此函数
				}).catch((msg) => {
					uni.hideLoading();
					console.log(msg)
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("/common/base-upx.css");
	@import url("/common/style-upx.css");
	
	
	checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		background-color: #eb544d;
		color: #fff;
		width: 48upx;
		height: 48upx;
		font-size: 36upx;
		align-items: center;
		justify-content: center;
		display: flex;
		border-radius: 50%;
	}
	
	checkbox .uni-checkbox-input {
		border: 2upx solid #ccc;
		width: 36upx;
		height: 36upx;
		border-radius: 50%;
		transition: all .3s;
	}
</style>
