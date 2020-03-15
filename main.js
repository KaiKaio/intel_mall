import Vue from 'vue';
import App from './App';
// import Axios from 'axios';

import common, { user_msg } from './static/js/common.js';
// import common, { user_msg } from './static/js/common-new.js';

import locat from './components/locat.vue';
import searchBar from './components/search-bar.vue'

import store from './store/index.js'

Vue.config.productionTip = false;  //设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.prototype.$store = store;
Vue.prototype.$base = common;
Vue.prototype.$userMsg = user_msg;
// Vue.prototype.$parseHtml = parseHtml;
Vue.prototype.$DEVELOPER = {
	szblid: '86supgrpszbl15825121655901346766423',
	szblsecret: '394a74c85fbdd635291f50b0d799286dc52b9022',
	cid: '1582512245668771502918', //资源识别码rpflag
	name: '智慧商圈',
	

	areacode: '86', //所有操作的地域都传这个
    token: '',
	wxPayMarkPUBLIC: 'szblhnxz', //海南小镇微信公众号支付标识
	// wxPayMarkPUBLIC: 'hdsh', //海岛生活微信公众号支付标识
	wxPayMarkXCX: 'hdshxcx', //海岛生活微信小程序支付标识
	wxPayMarkAPP: 'hdshapp', //海岛生活APP支付标识
	nmyPayMarkApp: 'nmyapp', //农民云终端APP支付标识
	aliPayMark: 'hdsh' //支付宝支付标识
};
Vue.prototype.$STOPWATCH = { 
	//存获取token的时间,秒表
	before: '',
	now: ''
};
//默认的区域
Vue.prototype.$areaMsg = {
	id: '460105',
	name: '五源河',
	shortname: '五源河',
};
//终端信息
Vue.prototype.$TERMINAL = {
	m: '', //标识，nmy-海南农民云
	szblid: '', //对应的开发者id
	szblsecret:'' ,
	os: '', //操作系统, i-ios,a-android
	labelid: '' //标签id
}
// 公共属性
Vue.prototype.$PROP = {
	// hdsh_color: '#c72518'
	hdsh_color: '#00a0ea'
}

Vue.prototype.$PAYSUCCMSG = []
//用户信息
global.$userDetail = {};

Vue.component('search-bar', searchBar);
Vue.component('locat', locat);


App.mpType = 'app'

const app = new Vue({
	store,
	...App
})

app.$mount()
