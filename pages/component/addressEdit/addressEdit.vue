<template>
	<!-- 编辑、新增用户收货地址 -->
	<view>
		<ul class="input-list">
			<li>
				<span>姓名</span>
				<input type="text" placeholder="收货人姓名" v-model="shMSg.name" />
			</li>
			<li>
				<span>电话</span>
				<input type="text" placeholder="收货人手机号" v-model="shMSg.phone" />
			</li>
			<li @click="showChose=true">
				<span>所在小区</span>
				<input type="text" placeholder="选择小区" v-model="houseArea.name" disabled style="width: 100%;" />
			</li>
			<li>
				<span style="width: 100%">门牌号（详细地址）</span>
				<textarea placeholder="填写门牌或者楼层房间号（ 例如:B幢-1802 ）" style="width: 100%;" v-model="shMSg.detail"></textarea>
			</li>
			<li v-if="!userMsg.isDefault || index == 'add'">
				<span>设置默认地址</span>
				<view class="kg" :class="{'bg-hdsh ac':YData.cs}" @click="YData.cs ? YData.cs=false : YData.cs=true">
					<view class="yuan"></view>
				</view>
			</li>
			<li v-if="index != 'add'" style="text-align: center; color: #d91827" @click="delAddress">
				删除收货地址
			</li>
		</ul>
		<view class="new-btn bg-hdsh" @click="submitAddress">保存</view>
		
		<section class="showChose" v-show="showChose">
			<section class="address">
				<section class="title" style="text-align:center;">
					<h4>居住小区</h4>
					<span @click="closeAdd()">×</span>
				</section>
				<ul>
					<li 
						class="addList" 
						v-for="item in info" 
						:key="item.id"
						 @click="getProvinceId(item)" 
						:class="item.id === houseArea.id ? 'active' : ''">{{item.name}}</li>
				</ul>
			</section>
		</section>
	</view>
</template>

<script>
	// import city from '@/static/js/city.js';
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				YData: {
					cs: false,
					ssq: ''
				},
				showChose: false,
				showProvince: true,
				showCity: false,
				showDistrict: false,
				showCityList: false,
				showDistrictList: false,
				province: '',
				city: '',
				district: '',
				GetProvinceId: 2,
				District: false,
				Province: false,
				City: false,
				AreaCode: '',
				// v-for循环判断是否为当前
				selected: false,
				// info: city,
				info: '',
				shMSg: {
					name: '',
					phone: '',
					city: '',
					detail: ''
				},
				userMsg: {},
				index: '', //传过来的下标，若新增则为'add'
				address_list: '',
				houseArea: {}
			};
		},
		computed: {
			...mapGetters(['get_address_data'])
		},
		onLoad(obj) {
			this.index = obj.m;
			this.address_list = this.get_address_data
			this.getArea()
			
			if (this.index != "add") {
				this.index = parseInt(this.index)
				this.userMsg = this.address_list[this.index]
				if (this.userMsg.name) {
					this.shMSg.phone = this.userMsg.phone;
					this.shMSg.detail = this.userMsg.address;
					this.shMSg.name = this.userMsg.name;
					
					this.houseArea = {
						"id": this.userMsg.areaid, // 小区ID
						"name": this.userMsg.areaname, // 小区名称
						"address": this.userMsg.areadetail // 小区详细地址
					}
					
					// this.YData.ssq = this.userMsg.prov + ' ' + this.userMsg.city + ' ' + (this.userMsg.area ? this.userMsg.area : '');
					// this.YData.cs = this.userMsg.isDefault
					// this.AreaCode = this.userMsg.areacode
				}
				
			} else {
				if (this.address_list.length == 0) {
					this.YData.cs = true
				}
			}
		},
		methods: {
			getArea(level) {
				uni.showLoading({
					title: '',
					mask: true
				});
				this.$base.szblGet('/api/templates', {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState(),
					appid: this.$DEVELOPER.szblid,
					rpflag: this.$DEVELOPER.cid,
					// areacode: this.$areaMsg.id,
					fid: '0',
					labelid: '1006006',
					pnum: 1,
					psize: 99
				}).then(res => {
					return this.$base.szblGet('/api/templates', {
						m: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState(),
						appid: this.$DEVELOPER.szblid,
						rpflag: this.$DEVELOPER.cid,
						// areacode: this.$areaMsg.id,
						fid: this.$base.strResToJson(res.data)[0].id,
						labelid: '1006006',
						pnum: 1,
						psize: 99
					})
				}).then(res => {
					this.info = this.$base.strResToJson(res.data)
					uni.hideLoading()
				}).catch(msg => {
					uni.hideLoading()
					uni.showToast({
						title: '网络延迟，请稍后再试',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					console.log(msg)
				})
			},
			choseAdd: function() {
				this.showChose = true;
			},
			closeAdd: function() {
				this.showChose = false;
			},
			_filter(add, name, code) {
				let result = [];
				for (let i = 0; i < add.length; i++) {
					if (code == add[i].id) {
						result = add[i][name];
					}
				}
				return result;
			},
			
			getProvinceId(item) {
				this.houseArea = item
				this.showChose = false
			},
			
			provinceSelected: function() {
				// 清除市级和区级列表
				this.showCityList = false;
				this.showDistrictList = false;
				// 清除市级和区级选项
				this.City = false;
				this.District = false;
				this.Province = false;
				// 选项页面的切换
				this.showProvince = true;
				this.showCity = false;
				this.showDistrict = false;
			},
			getCityId: function(id, input, index) {
				this.city = id;
				this.City = input;
				this.showProvince = false;
				this.showCity = false;
				this.showDistrict = true;
				this.District = false;
				// this.showDistrictList = this._filter(this.showCityList, 'district', this.city);
				// // 选择当前添加active
				// this.showCityList.map(a => a.selected = false);
				// this.showCityList[index].selected = true;

				let pjson = {
					pid: id,
					pnum: 0,
					psize: 1000
				}
				let _this = this
				uni.showLoading({
					title: '',
					mask: true
				});
				this.$base.szblGet('/api/sysareacode/', pjson).then(function(res) {
					// consol_this.$base.strResToJson(res.data))
					_this.showDistrictList = _this.$base.strResToJson(res.data)
					uni.hideLoading()
				}).catch(function(msg) {
					uni.hideLoading()
					uni.showToast({
						title: '网络延迟，请稍后再试',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					console.log(msg)
				})
			},
			citySelected: function() {
				this.showProvince = false;
				this.showCity = true;
				this.showDistrict = false;
			},
			getDistrictId: function(id, input, index) {
				this.district = id;
				this.District = input;
				// 选择当前添加active
				this.showDistrictList.map(a => a.selected = false);
				this.showDistrictList[index].selected = true;
				// 选取市区选项之后关闭弹层
				this.showChose = false;
				this.YData.ssq = this.Province + ' ' + this.City + ' ' + this.District;
				// this.AreaCode = id
			},
			districtSelected: function() {
				this.showProvince = false;
				this.showCity = false;
				this.showDistrict = true;
			},
			
			submitAddress() {
				if (!(/^([\u4e00-\u9fa5]){2,7}$/).test(this.shMSg.name)) {
					uni.showToast({
						title: '请输入收货人姓名',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false
				}
				if (!(/^1\d{10}$/).test(this.shMSg.phone)) {
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false
				}
				if (!this.shMSg.detail) {
					uni.showToast({
						title: '详细地址不能为空',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false
				}
				
				console.log()
				
				var add_detail = {
					"name": this.shMSg.name,
					"phone": this.shMSg.phone,
					"areaid": this.houseArea.id, // 小区ID
					"areaname": this.houseArea.name, // 小区名称
					"areadetail": this.houseArea.address, // 小区详细地址
					"isDefault": this.YData.cs,
					"address": this.shMSg.detail
				}
				
				
				if (this.index == "add") {
					if (add_detail.isDefault) {
						for (let i = 0; i < this.address_list.length; i++) {
							this.address_list[i].isDefault = false
						}
					}
					this.address_list.push(add_detail)
				} else {
					this.address_list[this.index] = add_detail
					if (add_detail.isDefault) {
						for (let i = 0; i < this.address_list.length; i++) {
							if (i != this.index) {
								this.address_list[i].isDefault = false
							}
						}
					}
				}
				
				this.$base.szblPut(
					'/api/user/my?m=' + this.$userMsg.userid + 
					'&tk=' + this.$userMsg.token + 
					'&state=' + this.$base.getState(), {
						"id": this.$userMsg.userid,
						"address": this.address_list,
					}).then((res) => {
						
					uni.showToast({
						title: '保存成功',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					uni.navigateBack({
						delta: 1
					});
				}).catch((err) => {
					console.log(err)
				})
				this.msg = true;
				this.eait = false;
			},
			//判断、修改默认地址
			changeDefault() {
				for (var j = 0; j < this.address_list.length; j++) {
					//判断是否有重复的默认地址，有则保留最新的并跳出，无则设置第一个为默认地址
					if (this.address_list[j].isDefault && this.address_list[this.address_list.length - 1].isDefault && j != this.address_list
						.length - 1) {
						this.address_list[j].isDefault = false
						// console.log(3)
						break
					}
					if (!this.address_list[j].isDefault && j == this.address_list.length - 1) {
						this.address_list[0].isDefault = true;
						// console.log(4)
					}
				}
			},
			delAddress() {
				var _this = this;
				uni.showModal({
					title: '',
					content: '您确定要删除收货地址吗？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							uni.showToast({
								icon: 'loading',
								mask: true,
								duration: 50000
							});
							if (this.address_list.length == 1) {
								// console.log(1)
								this.address_list = ''
							} else {
								// console.log(2)
								if (this.address_list[this.index].isDefault) {
									this.address_list.splice(this.index, 1)
									this.address_list[0].isDefault = true
								} else {
									this.address_list.splice(this.index, 1)
								}
								//删除数组中这个下标的值
							}
							// this.changeDefault()
							_this.$base.szblPut('/api/user/my?m=' + _this.$userMsg.userid + '&tk=' + _this.$userMsg.token + '&state=' +
								_this.$base.getState(), {
									"id": _this.$userMsg.userid,
									"address": _this.address_list
								}).then(function(res) {
								// console.log(_this.address_list)
								// console.log(res);
								uni.hideToast();
								uni.showToast({
									title: '删除成功',
									icon: 'none',
									mask: false,
									duration: 1500
								});
								uni.navigateBack({
									delta: 1
								});
							}).catch(function(msg) {
								console.log(msg)
								return
							});
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	.new-btn {
		width: 80%;
		margin: 83upx auto 0;
		line-height: 74upx;
		color: #fff;
		font-size: 28upx;
		text-align: center;
		/* background: #00a0ea; */
	}

	.del-btn {
		background: #d91827
	}

	.input-list {
		background: #fff;
		padding: 0 4%;
	}

	.input-list li {
		padding: 30upx 1.44%;
		font-size: 28upx;
		border-bottom: 1px solid #eee;
	}

	.input-list input {
		font-size: 28upx;
		width: 65.31%;
		background: #fff;
	}

	.input-list span {
		display: inline-block;
		width: 33.33%;
	}

	.input-list textarea {
		border: none;
		outline: none;
		resize: none;
		width: 65.31%;
		font-family: Microsoft YaHei;
		vertical-align: top;
	}

	.kg {
		height: 34upx;
		width: 80upx;
		border: 1px solid #999;
		border-radius: 17upx;
		float: right;
		line-height: 34upx;
		position: relative;
		transition: all .5s;
	}

	.kg .yuan {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
		background: #999;
		position: absolute;
		left: 1upx;
		top: 50%;
		margin-top: -14upx;
		transition: all .5s;
	}

	.kg.ac .yuan {
		left: 46upx;
		transition: all .5s;
		background: #fff;
	}

	.kg.ac {
		/* background: #c72518; */
		border-color: #fff;
		transition: all .5s;
	}

	.myAddress {
		width: 100%;
		background-color: white;
		border-top: 4px solid rgba(245, 245, 245, 1);
		color: #333;
	}

	.myAddress .cont {
		border-bottom: 1px solid rgba(245, 245, 245, 0.8);
	}

	.myAddress .cont span {
		display: inline-block;
		font-size: 28upx;
		color: #333;
		line-height: 88upx;
		margin-left: 32upx;
	}

	.myAddress .cont section {
		float: left;
	}

	.myAddress .cont p {
		display: inline-block;
		font-size: 28upx;
		color: #333333;
		line-height: 88upx;
		margin-left: 100upx;
	}

	.myAddress .cont .pic2 {
		float: right;
		width: 14upx;
		height: 24upx;
		margin: 32upx 32upx 32upx 0;
	}

	.myAddress .cont p.text {
		margin-left: 72upx;
	}

	.showChose {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 120;
		background: rgba(77, 82, 113, 0.8);
	}

	.address {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 121;
		background: #fff;
		width: 100%;
		padding: 0;
		margin: 0;
	}

	.title h4 {
		display: inline-block;
		font-size: 32upx;
		line-height: 88upx;
		font-weight: normal;
		color: #999;
	}

	.title span {
		font-size: 45upx;
		line-height: 34upx;
		color: #D8D8D8;
		position: absolute;
		right: 5%;
		top: 4%;
	}

	.area {
		display: inline-block;
		font-size: 24upx;
		line-height: 70upx;
		margin-left: 42upx;
		color: #333;
		border-bottom:  1px solid #FFFFFF;
	}

	.addList {
		padding-left: 32upx;
		font-size: 34upx;
		line-height: 80upx;
		color: #333;
	}

	/* 修改的格式 */
	.address ul {
		width: 95%;
		height: 100%;
		max-height: 440upx;
		overflow: auto;
	}

	.address ul li {
		margin-left: 5%;
	}

	.address .title .active {
		color: #0071B8;
		border-bottom: 2upx solid #0071B8;
		height: auto;
		padding: 0;
	}

	.address ul .active {
		color: #0071B8;
	}

	.address:after {
		display: none;
	}

	.addList.active {
		height: auto;
	}
</style>
