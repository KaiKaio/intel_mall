<template>
	<view>
		<view class="add-botton-wrapper">
			<button class="add-botton" @click="addPerson">添加配送成员</button>
		</view>
		<ul class="list">
			<template  v-for="(item, index) in personList" >
				<li class="list-item" :key="item.id">
					
					<!-- <view class="list-item-top"></view> -->
					
					<view v-if="item.kw16.indexOf('http') === 0" class="avatar" :style="{ backgroundImage: `url(${ item.kw16 })` }"></view>
					<view v-else class="avatar" :style="{ backgroundImage: `url(${ $base.urlPrex + item.kw16 })` }"></view>
					
					
					<view class="person-info">
						<view>
							<text>手机号：{{ item.kw1 }}</text>
						</view>
						
						
						<view>
							<text>真实姓名：{{ item.kw0 }}</text>
						</view>
						
						<view>
							<text>昵称：{{ item.kw12 }}</text>
						</view>
						
						
						
						<view>
							<text v-if="item.kw3 !== '' ">性别：{{ item.kw3 }}</text>
							<text v-else>性别：暂无</text>
						</view>
						
					</view>
					
					
					
					<view class="button-wrapper">
						<button class="function-botton" @click="handleDelInfo(item, index)" >解除绑定</button>
					</view>
				</li>
			</template>
		</ul>
		
		
		
		
		
		<uni-popup class="sku-list" ref="person_pop" type="center">
			<view class="spu-name" style="color: #888; font-size: 32upx; text-align: center;">添加配送员</view>
			
			<view class="form-item">
				<text class="form-label" style="margin: 8upx 0upx; display: block;">手机号：</text>
				
				<view style="display: flex; justify-content: space-between;">
					<input style="width: 79%; font-sise: 24upx; height: 50upx; padding: 0upx 8upx; background-color: #eee; border: 2upx solid #ccc; border-radius: 8upx;" type="text" v-model="searchPhone" @confirm="searchUserByPhone">
					<view style="width: 18%; align-items: center;
						display: flex;
						justify-content: center;
						background-color: rgb(235, 84, 77);
						color: rgb(255, 255, 255);
						border-radius: 4px;" @click="searchUserByPhone">搜索</view>
				</view>
			</view>
			
			<view class="form-item" v-if="searchResult.kw12">
				<text class="form-label" style="margin: 8upx 0upx; display: block;">昵称：</text>
				<input style="font-sise: 24upx; height: 50upx; padding: 0upx 8upx; background-color: #eee; border: 2upx solid #ccc; border-radius: 8upx;" class="form-item-input" type="text" disabled v-model="searchResult.kw12" />
			</view>
			
			<view class="form-item" v-if="searchResult.kw12">
				<text class="form-label" style="margin: 8upx 0upx; display: block;">性别：</text>
				<input style="font-sise: 24upx; height: 50upx; padding: 0upx 8upx; background-color: #eee; border: 2upx solid #ccc; border-radius: 8upx;" class="form-item-input" type="text" disabled v-model="searchResult.kw3" />
			</view>
			
			<view class="form-item" v-if="searchResult.kw12">
				<text class="form-label" style="margin: 8upx 0upx; display: block;">真实姓名：</text>
				<view style="height: 50upx;
					padding: 0px 8upx;
					background-color: rgb(238, 238, 238);
					border: 1px solid rgb(204, 204, 204);
					border-radius: 8upx;">{{ searchResult.kw0 === 'null' || searchResult.kw0 == null  ? '暂无' :  searchResult.kw0 }}</view>
			</view>
				
			<view class="form-item" style="margin: 8upx 0upx; display: block;" v-if="searchResult.kw12">
				<text class="form-label">头像：</text>
				
				<view style="border: 2upx solid #ccc; border-radius: 16upx; width: 160upx; height: 160upx; background-size: contain;" v-if="searchResult.kw16.indexOf('http') === 0" class="avatar" :style="{ backgroundImage: `url(${ searchResult.kw16 })` }"></view>
				<view style="border: 2upx solid #ccc; border-radius: 16upx; width: 160upx; height: 160upx; background-size: contain;" v-else class="avatar" :style="{ backgroundImage: `url(${ $base.urlPrex + searchResult.kw16 })` }"></view>
			</view>
			
			
			
			<view style="display: flex; justify-content: flex-end; margin-top: 8upx;">
				<view style="background-color: #eb544d; color: #fff; padding: 0upx 8upx; border: 2upx solid #ccc;" @click="bindPerson">绑定为本店送货员</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	export default {
		name: 'delivePerson',
		data() {
			return {
				searchPhone: '',
				searchResult: {
					kw16: ''
				},
				personList: []
			};
		},
		
		mounted () {
			this.fetchDelivePerson()
		},
		onReachBottom() {},
		methods: {
			
			addPerson() {
				this.$refs.person_pop.open()
			},
			
			fetchDelivePerson() {
				this.$base.szblGet('/api/users/br', {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
					appid: this.$DEVELOPER.szblid,
					rpflag: this.$DEVELOPER.cid,
					areacode: this.$areaMsg.id,
					pnum: '1',
					psize: '1000',
					rid: '15844996086031044545059', // 角色ID
					oid: '15844978590081769957231', // 组织ID
					gid: 1
				}).then(res => {
					this.personList = this.$base.strResToJson(res.data)
				}).catch(err => { 
					console.log(err)
				})
			},
			
			// 通过手机号查询用户
			searchUserByPhone() {
				this.$base.szblGet('/api/user/bp', {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
					appid: this.$DEVELOPER.szblid,
					rpflag: this.$DEVELOPER.cid,
					username: this.searchPhone, // 手机号码
					gid: '1'
				}).then(res => {
					if(res.data === null) {
						uni.showToast({
							title: '查无此人，请重新搜索',
							icon: 'none'
						})
						return
					}
					this.searchResult = this.$base.strResToJson(res.data)
				}).catch(err => {
					console.log(err)
				})
			},
			
			// 绑定送货员
			bindPerson() {
				if(this.searchResult.kw0 === 'null' || this.searchResult.kw0 === null) {
					uni.showToast({
						title: '请先让配送员完善 "真实姓名", 否则无法绑定',
						duration: 2000,
						icon: 'none'
					})
					return
				}
				
				this.$base.szblPost(
					'/api/user/bir?m=' + this.$userMsg.userid +
					'&tk=' +  this.$userMsg.token +
					'&state=' + this.$base.getState() +
					'&uid=' + this.searchResult.id +
					'&rid=' + '15844996086031044545059' +
					'&oid=' + '15844978590081769957231').then(res => {
					uni.showToast({
						title: '绑定成功',
						duration: 2000,
						icon: 'none'
					})
					this.fetchDelivePerson()
					this.$refs.person_pop.close()
				}).catch(err => {
					uni.showToast({
						title: err
					})
				})
			},
			
			handleDelInfo(item, index) {
				uni.showModal({
					content: `确认解除 ${item.kw0} 与本店的配送员关系吗？`,
					showCancel: true,
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							this.$base.szblDel(
								'/api/user/unr/' + item.urid + 
								'?m=' +this.$userMsg.userid +
								'&tk=' +  this.$userMsg.token +
								'&state=' + this.$base.getState()
							).then(res => {
								uni.showToast({
									title: '解除成功'
								})
								this.fetchDelivePerson()
							}).catch(err => {
								uni.showToast({
									title: err
								})
							})
						}
						if (res.cancel) {
							return
						}
					}
				})
				
			}
			
		}
	}
</script>

<style lang="scss">
ul.list {
	> li.list-item {
		width: 94%;
		margin: 24upx auto 0upx;
		font-size: 26upx;
		background-color: #fff;
		border-radius: 6upx;
		display: flex;
		padding: 12upx 32upx 24upx;
		box-shadow: 0px 2upx 20upx #ccc;
		flex-wrap: wrap;
		align-items: center;
		> .avatar {
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
			border-radius: 50%;
			width: 150upx;
			height: 150upx;
			border: 1px solid #ccc;
			margin-right: 24upx;
		}
		> .list-item-top {
			width: 100%;
			text-align: right;
		}
		
		> .person-info {
			line-height: 40upx;
		}
		
		> .button-wrapper {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			> .function-botton {
				padding: 0upx;
				margin: 0upx;
				font-size: 26upx;
				line-height: initial;
				background-color: rgb(235, 84, 77);
				border-radius: 4px;
				color: #fff;
				padding: 4upx 12upx;
				&:first-child {
					margin-right: 12upx;
				}
			}
		}
		&:last-child {
			margin-bottom: 24upx;
		}
	}
}

.add-botton-wrapper {
	width: 94%;
	margin: 0px auto 0upx;
	> .add-botton {
		background-color: rgb(235, 84, 77);
		border-radius: 12upx;
		padding: 12upx;
		color: #fff;
		line-height: inherit;
		margin-bottom: 24upx;
	}
}
</style>
