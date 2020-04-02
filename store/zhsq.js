import common, { user_msg } from '@/static/js/common.js';

import Vue from 'vue';

const zhsq = {
	state : {
		userMsg: {},
		shopCartList: [],
		orderStatus: 0,
		totalPrice: 0,
		
		unit_data: {}, // 店铺数据
	},
	
	actions : {
		getCartList({state, commit}, pjson) {
			return new Promise((resolve, reject) => {
				common.szblGet('/api/carts', {
					m: user_msg.userid,
					tk: user_msg.token,
					pnum: 1,
					psize: 99,
					state: common.getState(),
					createuserid: user_msg.userid,
					rpflag: Vue.prototype.$DEVELOPER.cid,
					appid: Vue.prototype.$DEVELOPER.szblid,
					areacode: Vue.prototype.$areaMsg.id,
					labelid: '1014002',
					unit: state.unit_data.id
				}).then(res => {
					let data = common.strResToJson(res.data)
					if(data.length === undefined) {
						console.log('暂无购物车信息')
					} else {
						data.map(item => {
							item.checkBox = false
						})
					}
					
					commit('getCartList', data)
					resolve()
				}).catch(msg => {
					reject(msg)
				})
			})
		}
		
	},
	
	mutations : {
		set_userMsg: (state, value) => {
			state.userMsg = value
		},
		
		getCartList: (state, list) => {
			state.shopCartList = list
		},
		
		set_order_status: (state, value) => {
			state.orderStatus = value
		},
		
		// 删除购物车
		del_shopCart_data: (state, itemID) => {
			for(let i = 0; i < state.shopCartList.length; i++) {
				if(state.shopCartList[i].id === itemID) {
					state.shopCartList.splice(i, 1)
				}
			}
		},
		
		// 改变数量
		changeNumber: (state, obj) => {
			for(let i = 0; i < state.shopCartList.length; i++) {
				if(state.shopCartList[i].id === obj.id) {
					state.shopCartList[i].kw1 = obj.number
				}
			}
		},
		
		// 改变CheckBox
		checkChange: (state, selectArr) => {
			let arr = selectArr
			
			for(let i = 0; i < state.shopCartList.length; i++) {
				state.shopCartList[i].checkBox = false
			}
			
			for(let i = 0; i < arr.length; i++) {
				state.shopCartList[arr[i] * 1].checkBox = true
			}
		},
		
		// 计算价格
		computedTotalPrice: (state, obj) => {
			let totalPrice = 0
			for(let i = 0; i < state.shopCartList.length; i++) {
				if(state.shopCartList[i].checkBox === true) {
					totalPrice += state.shopCartList[i].kw1 * state.shopCartList[i].kw2
				}
			}
			state.totalPrice = totalPrice
		},
		
		// 存储选择的店铺
		set_unit_data: (state, value) => {
			state.unit_data = value;
		},
	},
	
	getters:{
		get_userMsg: state => {
			return state.userMsg
		},
		
		get_shopCartList: state => {
			return state.shopCartList
		},
		
		get_shopCart_lengh: state => {
			let length = 0
			for(let i = 0; i < state.shopCartList.length; i++) {
				length += (state.shopCartList[i].kw1 * 1)
			}
			return length
		},
		
		wxavartar_flag: state => {
			if(state.userMsg.kw16.indexOf("http") != -1) {
				return true
			} else {
				return false
			}
			
		}
	},
}

export default zhsq