<template>
	<!-- 评论 -->
	<view class="comment" :style="'min-height:' + windowHeight + 'px'">
		<view v-for="(x, index) in get_comment_data.jsondata" :class="{last_p: index == get_comment_data.jsondata.length - 1}"
		 :key="index" class="pinglun" v-if="get_comment_data.gid == '3'">
			<view class="title-wrap">
				<image :src="x.photo" mode="aspectFit"></image>
				<view class="title">
					<text>{{x.spuname}}</text>
					<text>{{x.skuname}}</text>
				</view>
			</view>
			<view class="">
				<textarea rows="5" cols="50" class="textarea" v-model="x.cont" placeholder="亲，您对这个商品满意吗？您的评价会帮助我们选择更好的商品哦~"></textarea>
			</view>
			<!-- <p class="comment-head">添加图片</p>
			<view class="add-photo">
				<view class="photo" v-for="(x,index) in list_photo_xc">
					<view class="szbl-upload-btn"><img :src="x.photo" /></view>
					<span class="szbl-badge-del" @click="onDelphoto(list_photo_xc,index)">×</span>
				</view>
				<view class="photo" v-if="list_photo_xc.length < 3">
					<view class="szbl-upload-btn szbl-btn-class">
						<input type="file" multiple="multiple" accept="image/*" @change="onAddXCphoto($event)"/>
					</view>
				</view>
			</view> -->
			<view class="flex-cont shop-fen">
				<span>商品评分</span>
				<!-- <view id="function-demo" class="target-demo">
					<img v-for="(x,index) in stars" :src="x.imgsrc" @click="imgClick(index)"/>
				</view> -->
				<uni-rate :value="x.star_num" max="5" :active-color="$PROP.hdsh_color" @change="changeRate($event, index)"></uni-rate>
				<!-- <view id="function-hint" class="hint">{{x.stars_cont}}</view> -->
			</view>
		</view>
		<view v-if="get_comment_data.gid != '3'">
			<view class="">
				<textarea rows="5" cols="50" class="textarea" v-model="cont" placeholder="亲，您对这个商品满意吗？您的评价会帮助我们选择更好的商品哦~"></textarea>
			</view>
			<!-- <p class="comment-head">添加图片</p>
			<view class="add-photo">
				<view class="photo" v-for="(x,index) in list_photo_xc">
					<view class="szbl-upload-btn"><img :src="x.photo" /></view>
					<span class="szbl-badge-del" @click="onDelphoto(list_photo_xc,index)">×</span>
				</view>
				<view class="photo" v-if="list_photo_xc.length < 3">
					<view class="szbl-upload-btn szbl-btn-class">
						<input type="file" multiple="multiple" accept="image/*" @change="onAddXCphoto($event)"/>
					</view>
				</view>
			</view> -->
			<view class="flex-cont shop-fen">
				<span>商品评分</span>
				<uni-rate value="5" max="5" :active-color="$PROP.hdsh_color" @change="changeRateSingal"></uni-rate>
				<view id="function-hint" class="hint">{{stars_cont}}</view>
			</view>
		</view>
		<view class="pinglun-btn bg-hdsh" @click="comSubmit">提交评论</view>
	</view>
</template>

<script>
	import uniRate from "@/components/uni-rate/uni-rate.vue"
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {
			uniRate
		},
		data() {
			return {
				stars: ['非常差', '差', '一般', '好', '非常好'],
				stars_cont: '非常好',
				star_num: 5, //星数
				cont: '', //评价内容
				list_photo_xc: [],
				// route_obj: {},
				windowHeight: 0, //窗口高度
			};
		},
		/**
		 * @param {Object} obj c-产品id(美食：商店id),i-订单id,n-产品标题,s-订单类型,u-商店id 
		 */
		onLoad(obj) {
			// this.route_obj = obj
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight
				}
			})
			if (this.get_comment_data.gid == "3") {
				this.get_comment_data.jsondata.forEach(item => {
					this.$set(item, 'stars_cont', '非常好')
					this.$set(item, 'star_num', 5)
					this.$set(item, 'cont', '')
				})
			}
			console.log(this.get_comment_data);
		},
		computed: {
			...mapGetters(['get_comment_data'])
		},
		methods: {
			// imgClick(index) {
			// 	for (var i = index; i < this.stars.length; i++) {
			// 		this.stars[i].imgsrc = imgSrc_sec;
			// 		this.stars[i].active = false;
			// 	}
			// 	for (var i = 0; i < index + 1; i++) {
			// 		this.stars[i].imgsrc = imgSrc;
			// 		this.stars[i].active = true;
			// 	}
			// 	this.stars_cont = this.stars[index].cont;
			// },
			changeRate(value, index) {
				this.$set(this.get_comment_data.jsondata[index], 'star_num', value.value)
				this.$set(this.get_comment_data.jsondata[index], 'stars_cont', this.stars[value.value - 1])
				console.log(this.get_comment_data);
				// this.star_num = value.value;
				// this.stars_cont = this.stars[value.value - 1]
			},
			changeRateSingal(value){
				this.star_num = value.value;
				this.stars_cont = this.stars[value.value - 1]
			},
			//添加图片
			onAddXCphoto(e) {
				let files = e.target.files || e.dataTransfer.files;
				// alert(files[0].name + files[0].size + files[0].type);
				if (window.FileReader) {
					// this.$layer.msg("11");
					for (let i = 0; i < files.length; i++) {
						if (!/image\/\w+/.test(files[i].type)) {
							this.$layer.msg('请确保文件为图像类型!');
							return false;
						}

						//压缩图片
						lrz(files[i], {
							width: 750,
							quality: 0.8
						}).then((rst) => {
							let tempPhoto = {};
							tempPhoto.photo = rst.base64;
							tempPhoto.len = rst.base64Len;
							this.list_photo_xc.push(tempPhoto);
						}).catch((err) => {
							console.log(err);
							return;
						});

						// this.$layer.msg("33");
					};
				} else {
					return false;
				}
			},
			//删除图片
			onDelphoto(e, index) {
			},
			//提交功能
			// onSubmit() {
			// 		//获取客户端调用标识
			// 	var state = szblMCom.getState();
			// 	var userid = szblMCom.userid;
			// 	var token = szblMCom.token;
			// 	//上传图片
			// 	/*****/
			// 	szblMCom.ajaxPost("/api/media/img" + "?u=" + userid + "&tk=" + token +
			// 		"&state=" + state, this.list_photo_xc).then((dataJson) => {
			// 		if(dataJson.state != state) {
			// 			$.toast("网络被拦截，请重试", 2500, 'szbl-bg-lightblack');
			// 			return;
			// 		}
			// 		var retData = szblMCom.strResToJson(dataJson.data);
			// 	}).catch((msg) => {
			// 			$.toast(msg, 1500, 'szbl-bg-lightblack');
			// 	});

			// },
			// 提交评论
			comSubmit() {
				uni.showLoading({
					mask: true
				})
				// szblMCom.ajaxPost("/api/media/img" + "?u=" + localStorage.u + "&tk=" + localStorage.tk +
				// 	"&state=" + szblMCom.getState(), this.list_photo_xc).then((dataJson) => {
				// 	if(dataJson.state != state) {
				// 		return;
				// 	}
				let sort = parseInt(this.get_comment_data.gid);
				let comment = {
					"createuserid": this.$userMsg.userid,
					"fid": '', //产品id
					"cid": this.get_comment_data.unit, //商店id
					"gid": this.get_comment_data.id, //订单id
					"kw0": this.get_comment_data.name, //订单名
					"kw1": this.star_num, //星级
					"kw2": global.$userDetail.photo.indexOf('/Media/') != -1 ? '["' + global.$userDetail.photo.slice(global.$userDetail.photo.indexOf("/Media")) + '"]' : '[]', //头像
					"kw3": this.cont, //内容
					"kw4": sort, //类型
					"querykeyword": this.$userMsg.username + ',' + this.get_comment_data.name,
					"name": this.$userMsg.username,
					"unit": this.get_comment_data.unit,
					"rpflag": this.$DEVELOPER.cid,
				}
				if(sort == 3){
					let count = 1
					this.get_comment_data.jsondata.forEach((item, index) => {
						comment.fid = item.spuid
						comment.kw1 = item.star_num
						comment.kw3 = item.cont
						//提交评论
						this.$base.szblPost("/api/scctc?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + '&state=' + this.$base
							.getState(),
							comment).then(res => {
							count++
							if (count == this.get_comment_data.jsondata.length) {
								uni.hideLoading()
								uni.showToast({
									title: '评价成功',
									icon: 'none',
									mask: false,
									duration: 1000
								});
								uni.navigateBack({
									delta: 1
								})
							}
						}).catch((msg) => {
							uni.hideLoading()
							uni.showToast({
								title: '评价失败',
								icon: 'none',
								mask: false,
								duration: 1000
							});
						});
					})
				}else{
					comment.fid = sort == 2 ? '' : this.get_comment_data.cid
					//提交评论
					this.$base.szblPost("/api/scctc?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + '&state=' + this.$base.getState(), comment).then((res) => {
						uni.hideLoading()
						uni.showToast({
							title: '评价成功',
							icon:'none',
							mask: false,
							duration: 1000
						});
						uni.navigateBack({
							delta:1
						})
					}).catch((msg) => {
						uni.hideLoading()
						uni.showToast({
							title: '评价失败',
							icon:'none',
							mask: false,
							duration: 1000
						});
					});
				}
				// if (this.route_obj.s == "1") {
				// 	sort = 2;
				// } else if (this.route_obj.s == "2") {
				// 	sort = 3;
				// } else if (this.route_obj.s == "3") {
				// 	sort = 1;
				// } else if (this.route_obj.s == "4") {
				// 	sort = 4;
				// }

				// let comment = {
				// 	"createuserid": this.$userMsg.userid,
				// 	"fid": this.route_obj.s == "2" ? '' : this.route_obj.c, //产品id
				// 	"cid": this.route_obj.u, //商店id
				// 	"gid": this.route_obj.i, //订单id
				// 	"kw0": this.route_obj.n, //订单名
				// 	"kw1": this.star_num, //星级
				// 	"kw2": this.$userMsg.photo, //头像
				// 	"kw3": this.cont, //内容
				// 	"kw4": sort, //类型
				// 	"querykeyword": this.$userMsg.username + ',' + this.route_obj.n,
				// 	"name": this.$userMsg.username,
				// 	"unit": this.route_obj.u
				// }
				// let count = 1
				// this.get_comment_data.jsondata.forEach((item, index) => {
				// 	comment.fid = item.spuid
				// 	comment.kw1 = item.star_num
				// 	comment.kw3 = item.cont
				// 	//提交评论
				// 	this.$base.szblPost("/api/scctc?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + '&state=' + this.$base
				// 		.getState(),
				// 		comment).then(res => {
				// 		count++
				// 		if (count == this.get_comment_data.jsondata.length) {
				// 			uni.hideLoading()
				// 			uni.showToast({
				// 				title: '评价成功',
				// 				icon: 'none',
				// 				mask: false,
				// 				duration: 1000
				// 			});
				// 			uni.navigateBack({
				// 				delta: 1
				// 			})
				// 		}
				// 	}).catch((msg) => {
				// 		uni.hideLoading()
				// 		uni.showToast({
				// 			title: '评价失败',
				// 			icon: 'none',
				// 			mask: false,
				// 			duration: 1000
				// 		});
				// 	});
				// })
			}
		}
	}
</script>

<style>
	.shop-fen span {
		width: 25%;
	}

	.shop-fen {
		line-height: 24px;
		padding: 20upx;
	}

	#function-hint {
		padding-left: 5%;
		font-size: 26upx;
		color: #C0C0C0;
	}

	#function-demo img {
		margin-right: 10upx;
	}

	.textarea {
		height: 300upx;
		background: #fff;
	}

	.pinglun {
		background: #FFFFFF;
		margin-bottom: 10px;
	}

	.pinglun .title-wrap {
		display: flex;
		padding: 20upx;
		border-bottom: 2upx solid #999;
		align-items: center;
	}

	.pinglun .title-wrap image {
		width: 150upx;
		height: 150upx;
		flex-shrink: 0;
		margin-right: 20upx;
	}

	.pinglun .title-wrap .title {
		display: inline-flex;
		flex-direction: column;
	}

	.pinglun .title-wrap .title text:last-child {
		color: #999999;
	}

	.comment {
		position: relative;
		min-height: 100%;
		padding-bottom: 154upx;
	}

	.last_p {
		/* margin-bottom: 154upx; */
	}

	.pinglun-btn {
		line-height: 80upx;
		height: 80upx;
		width: 80%;
		color: #fff;
		text-align: center;
		border-radius: 10upx;
		position: absolute;
		bottom: 40upx;
		left: 50%;
		margin-left: -40%;
	}
</style>
