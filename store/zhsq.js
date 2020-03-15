import common, { user_msg } from '@/static/js/common.js';

import Vue from 'vue';

const zhsq = {
	state : {
		userMsg: {},
		shopCartList: [],
		orderStatus: 0
	},
	
	actions : {
		getCartList({commit}, pjson) {
			return new Promise((resolve, reject) => {
				console.log(user_msg, 'user_msg')
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
					labelid: '1014002'
				}).then(res => {
					let data = common.strResToJson(res.data)
					console.log(data, 'data')
					commit('getCartList', data)
				}).catch(msg => {
					reject(msg)
				})
			})
		},
		
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