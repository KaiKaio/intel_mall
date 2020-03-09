import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import zhsq from './zhsq.js'

const store = new Vuex.Store({
	state: {
		page_data: {}, //登录注册用的页面跳转数据
		shopcart_data: {}, //购物车数据
		address_data: {}, //收货地址
	},
	
	mutations:{
		set_page_data: (state, value) => {
			state.page_data = value
			uni.setStorageSync("page_data", JSON.stringify(state.page_data));
		},
		set_shopcart_data: (state, value) => {
			state.shopcart_data = value
			uni.setStorageSync("shopcart_data", JSON.stringify(state.shopcart_data));
		},
		set_address_data: (state, value) => {
			state.address_data = value
			uni.setStorageSync("address_data", JSON.stringify(state.address_data));
		},
	},
	
	getters:{
		get_page_data: state => {
			return state.page_data
		},
		get_shopcart_data: state => {
			return state.shopcart_data
		},
		get_address_data: state => {
			return state.address_data
		},
	},
	
	modules: {
		zhsq: zhsq
	}
	
})

export default store