<template>
	<!-- 个人信息页 -->
	<view class="edit-form">
		<h3>个人信息</h3>
		
		<view class="form-item">
			<text class="form-label">昵称：</text>
			<input class="form-item-input" type="text" v-model="formInfo.kw12" />
		</view>
		<view class="form-item">
			<text class="form-label">真实姓名：</text>
			<input class="form-item-input" type="text" v-model="formInfo.kw0" />
		</view>
		<view class="form-item">
			<text class="form-label">手机号码：</text>
			<input class="form-item-input" type="text" v-model="formInfo.kw1" />
		</view>
		<view class="form-item">
			<text class="form-label">性别：</text>
			<radio-group class="form-radio" @change="sexChange">
				<label class="radio-item">
					<view class="radio-icon">
						<radio :checked="formInfo.kw3 === '男'" value="男" />
					</view>
					<view>男</view>
				</label>
				<label class="radio-item">
					<view class="radio-icon">
						<radio :checked="formInfo.kw3 === '女'" value="女" />
					</view>
					<view>女</view>
				</label>
			</radio-group>
		</view>
		<view class="form-item">
			<text class="form-label">生日：</text>
				<view class="uni-list-cell form-item-input">
					<view class="uni-list-cell-db">
						<picker mode="date" fields="day" :value="formInfo.kw15" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input" v-if="formInfo.kw15 === ''">{{ date }}</view>
							<view class="uni-input">{{ formInfo.kw15 }}</view>
						</picker>
					</view>
				</view>
		</view>
		
		<view class="form-item">
			<text class="form-label">头像：</text>
			<view class="upload-wrapper">
				<view class="upload-item">
					<view class="upload-area" v-if="formInfo.kw16 === ''" @tap="onUploadPhoto('Avatar')">+</view>
					
					<view class="idcard-img" v-if="formInfo.kw16 !== '' && wxAvatar === false" :style="{ backgroundImage: `url(${ $base.urlPrex + formInfo.kw16 })` }">
						<view class="delete-img" @click="deleteImg('Avatar')">x</view>
					</view>
					
					<view class="idcard-img" v-if="formInfo.kw16 !== '' && wxAvatar === true" :style="{ backgroundImage: `url(${ formInfo.kw16 })` }">
						<view class="delete-img" @click="deleteImg('Avatar')">x</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="form-button-wrapper">
			<button  class="button-item submit" @click="submitEdit">修改</button>
		</view>
	</view>
</template>

<script>
	import lrz from 'lrz'
	
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			
			return {
				formInfo: {},
				wxAvatar: false,
				
				date: currentDate,
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad() {
			this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
				m: this.$userMsg.userid,
				tk: this.$userMsg.token,
				state: this.$base.getState(),
			}).then((res) => {
				this.formInfo = this.$base.strResToJson(res.data);
				
				if(this.formInfo.kw16.indexOf("http") != -1) { // 判断是否为微信头像
					this.wxAvatar = true  // 是
				} else {
					this.wxAvatar = false
				}
				
				if(this.formInfo.kw0 === null) { // 处理真实姓名
					this.formInfo.kw0 = '暂无'
				}
				
			})
		},
		methods: {
			bindDateChange(e) {
				this.date = e.target.value
				this.formInfo.kw15 = this.date
			},
			
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			
			sexChange(e) {
				this.formInfo.kw3 = e.detail.value
			},
			
			deleteImg(str) {
				uni.showModal({
					title: '',
					content: '您确定删除此证件照吗?',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							this.formInfo.kw16 = ''
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			
			//添加图片
			onUploadPhoto(str) {
				uni.chooseImage({
				    count: 1,
				    sizeType: ['original', 'compressed'],
				    sourceType: ['album'],
				    success: (res) => {
				        // 预览图片
						lrz(res.tempFilePaths[0], {
							width: 750,
							quality: 0.8
						}).then((rst) => {
							let tempPhoto = {
								photo: '',
								len: ''
							};
							
							tempPhoto.photo = rst.base64;
							tempPhoto.len = rst.base64Len;
							
							uni.showToast({
								icon: 'loading',
								mask: true,
								duration: 50000
							});
							
							return this.$base.szblPost(
								"/api/media/img" +
								"?u=" + this.$userMsg.userid +
								"&tk=" + this.$userMsg.token +
								"&state=" + this.$base.getState(), [tempPhoto]
							)
						}).then((res) => {
							this.wxAvatar = false
							let r = this.$base.strResToJson(res.data)
							this.formInfo.kw16 = r[0]
							uni.hideToast()
						}).catch((err) => {
							console.log(err);
							return;
						});
						
				    }
				});
			},
			
			submitEdit() {
				this.$base.szblPut(
					'/api/user/my' +
					'?m=' + this.$userMsg.userid + 
					'&tk=' + this.$userMsg.token + 
					'&state=' + this.$base.getState(), {
						'id': this.$userMsg.userid,
						'kw12': this.formInfo.kw12,
						'kw3': this.formInfo.kw3,
						'kw15': this.formInfo.kw15,
						'kw16': this.formInfo.kw16,
						'kw0': this.formInfo.kw0,
						'kw1': this.formInfo.kw1
					}
				).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'success'
					})
					uni.reLaunch({
						url: '/pages/tabBar/member/member',
						success: res => {}
					})
				}).catch(err => {
					uni.showToast({
						title: err
					})
				})
			}
			
		}
	}
</script>

<style lang="scss">
.edit-form {
	padding: 20upx 32upx;
	background-color: #fff;
	font-size: 28upx;
	margin-top: 16upx;
	> .form-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 28upx 0upx;
		> .uni-list {
			margin-bottom: 24upx;
			> .uni-list-cell {
				> .uni-list-cell-left {
					margin-left: 24upx;
					font-size: 30upx;
					margin-bottom: 8upx;
				}
				> .uni-list-cell-db {
					background-color: #fff;
					border-top: 2upx solid #ccc;
					border-bottom: 2upx solid #ccc;
					padding: 16upx 24upx;
					font-size: 32upx;
				}
			}
		}
		> .form-label {
			width: calc(28upx * 5); 
		}
		> .form-item-input {
			color: #333;
			width: calc(100% - 28upx * 5 - 2upx); 
			border: 2upx solid #e1e1e1;
			background-color: #f6f6f6;
			border-radius: 4px;
			height: 60upx;
			line-height: 60upx;
			padding: 0upx 20upx;
		}
		> .form-item-textarea {
			border: 2upx solid #aaa;
			width: 80%;
		}
		&:first-child {
			margin: 0upx 0upx 28upx;
		}
		> .form-radio {
			display: flex;
			width: calc(100% - 28upx * 5 - 2upx);
			height: 60upx;
			line-height: 60upx;
			> .radio-item {
				display: flex;
				margin-right: 4upx;
				.radio-icon {
					transform: scale(0.8);
				}
			}
		}
		> .uni-list {
			width: calc(100% - 28upx * 5 - 2upx);
			border: 2upx solid #e1e1e1;
			background-color: #f6f6f6;
			border-radius: 4px;
			height: 60upx;
			line-height: 60upx;
			padding: 0upx 20upx;
			.uni-input {
				display: flex;
				justify-content: space-between;
				.font-icon {
					font-size: 24upx;
				}
			}
		}
		
		> .upload-wrapper {
			width: calc(100% - 28upx * 5 - 2upx);
			display: flex;
			color: #353535;
			> .upload-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 24upx;
				> .upload-area {
					color: #ccc;
					font-size: 80upx;
					width: 180upx;
					height: 180upx;
					background-color: #f6f6f6;
					border-radius: 4px;
					border: solid 1px #e1e1e1;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 16upx;
				}
				> .idcard-img {
					position: relative;
					width: 180upx;
					height: 180upx;
					background-position: center;
					background-repeat: no-repeat;
					background-size: cover;
					border-radius: 4px;
					border: solid 1px #e1e1e1;
					margin-bottom: 8px;
					> .delete-img{
						position: absolute;
						right: 0upx;
						top: 0upx;
						font-size: 28upx;
						color: #fff;
						background-color: #EE2E3A;
						font-weight: 700;
						width: 28upx;
						height: 28upx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 4upx;
						line-height: initial;
					}
				}
			}
		}
	}
	> .form-button-wrapper {
		width: 80%;
		margin: 24upx auto 0upx;
		display: flex;
		justify-content: center;
		> .button-item {
			color: #fff;
			border-radius: 12upx;
			font-size: 32upx;
			margin: 0;
			padding: 12upx 100upx;
			line-height: initial;
			&.cancel {
				background-color: #d7d7d7;
			}
			
			&.submit {
				background-color: #eb544d;
			}
		}
		
	
	}
}
</style>
