import CryptoJS from 'crypto-js';
import {
	JSEncrypt
} from 'jsencrypt';
// #ifdef H5
import wx from 'weixin-js-sdk';
// #endif


// const urlPrex = "https://api.nkshuju.com";
const urlPrex = "https://apitest.nkshuju.com"
// const urlPrex = "http://192.168.1.109:8080/NKSJ"; //孔仁
// const urlPrex = "http://192.168.1.166/api"; //栩哥
// const urlPrex = "http://192.168.1.108:8080/"; //辅明
// const urlPrex = "http://192.168.1.87:8081/NKSJ";  //华哥
// const appid = "APP15282570679602037141755";
const authUrl = "https://auth.nkshuju.com";
// const authUrl = "http://192.168.1.166/dtcloud";  //验证地址
//获取数据
const szblGet = function(url, jsonData) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: urlPrex + url,
			method: 'GET',
			header: {
				"Content-Type": "application/json;charset=UTF-8",
				"Cache-Control": "no-cache"
			},
			data: jsonData,
			dataType: 'json',
			success: (res) => {
				if (res.data.code != 0) {
					reject(res.data.msg)
				}
				resolve(res.data)
			},
			fail: function(returnMsg) {
				console.log(returnMsg)
				//将状态置为reject，并把错误信息返回
				reject(returnMsg.errMsg);
			},
			complete: () => {}
		});
	})

	// return promise;
}

//获取数据（同步）
const szblGetSync = async function(url, jsonData) {
	return await new Promise((resolve, reject) => {
		uni.request({
			url: urlPrex + url,
			method: 'GET',
			header: {
				"Content-Type": "application/json;charset=UTF-8",
				"Cache-Control": "no-cache"
			},
			data: jsonData,
			dataType: 'json',
			success: res => {
				if (res.data.code != 0) {
					reject(res.data.msg)
				}
				resolve(res.data)
			},
			fail: (returnMsg) => {
				console.log(jsonResToStr(returnMsg))
				//将状态置为reject，并把错误信息返回
				reject(returnMsg.errMsg);
			},
			complete: () => {}
		});
	})
}

//提交数据
const szblPost = function(url, jsonData) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: urlPrex + url,
			method: 'POST',
			// 			header:{
			// 				"Content-Type":"application/json;charset=UTF-8",
			// 				"Cache-Control":"no-cache"
			// 			},
			data: jsonResToStr(jsonData),
			dataType: 'json',
			success: (res) => {
				if (res.data.code != 0) {
					reject(res.data.msg)
				}
				resolve(res.data)
			},
			fail: (returnMsg) => {
				console.log(returnMsg)
				//将状态置为reject，并把错误信息返回
				reject(returnMsg.errMsg);
			},
			complete: () => {}
		});
	})

}
//编辑数据
const szblPut = function(url, jsonData) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: urlPrex + url,
			method: 'PUT',
			header:{
				"Content-Type":"application/json;charset=UTF-8",
				"Cache-Control":"no-cache"
			},
			// data: jsonData,
			data: jsonResToStr(jsonData),
			dataType: 'json',
			success: (res) => {
				if (res.data.code != 0) {
					reject(res.data.msg)
				}
				resolve(res.data)
			},
			fail: (returnMsg) => {
				console.log(returnMsg)
				//将状态置为reject，并把错误信息返回
				reject(returnMsg.errMsg);
			},
			complete: () => {}
		});
	})

}
//删除数据
const szblDel = function(url, jsonData) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: urlPrex + url,
			method: 'DELETE',
			// 			header:{
			// 				"Content-Type":"application/json;charset=UTF-8",
			// 				"Cache-Control":"no-cache"
			// 			},
			data: jsonResToStr(jsonData),
			dataType: 'json',
			success: (res) => {
				if (res.data.code != 0) {
					reject(res.data.msg)
				}
				resolve(res.data)
			},
			fail: (returnMsg) => {
				console.log(returnMsg)
				//将状态置为reject，并把错误信息返回
				reject(returnMsg.errMsg);
			},
			complete: () => {}
		});
	})

}
/**
 * 将要上传到服务器的json对象转成json字符串
 * @param jsonStr json对象
 */
const jsonResToStr = function(jsonObj) {

	if (jsonObj == null) {

		return jsonObj;
	}

	//判断json的数据格式
	var newJson = JSON.stringify(jsonObj);
	if (newJson.indexOf("[") == 0) {

		var tempObj = null;
		for (var iKey in jsonObj) {

			if (typeof jsonObj[iKey] == "object") {

				if (checkJson(jsonObj[iKey]) == null) {

					jsonObj[iKey] = null;

				} else {

					tempObj = jsonObj[iKey];
					for (var jKey in tempObj) {

						if (typeof tempObj[jKey] == "object") {

							tempObj[jKey] = JSON.stringify(tempObj[jKey]);
						}
					}

					jsonObj[iKey] = tempObj;
				}
			}
		}
	} else if (newJson.indexOf("{") == 0) {

		var tempObj = null;
		for (var iKey in jsonObj) {

			if (typeof jsonObj[iKey] == "object") {

				if (checkJson(jsonObj[iKey]) == null) {

					jsonObj[iKey] = null;

				} else {

					jsonObj[iKey] = JSON.stringify(jsonObj[iKey]);
				}
			}
		}
	} else {

		return jsonObj;
	}

	//最后转换整个json成json字符串
	return JSON.stringify(jsonObj);


	//判断json的数据格式
	// 	var newJson = JSON.stringify(jsonObj);
	// 	if (newJson.indexOf("[") == 0) {
	// 
	// 		newJson = new Array();
	// 	} else if (newJson.indexOf("{") == 0) {
	// 
	// 		newJson = new Object();
	// 	} else {
	// 
	// 		return jsonObj;
	// 	}
	// 
	// 	//复制数据
	// 	for (var i in jsonObj) {
	// 
	// 		newJson[i] = jsonObj[i];
	// 	}
	// 
	// 	var tempObj = null;
	// 	for (var jKey in newJson) {
	// 
	// 		if (typeof newJson[jKey] == "object") {
	// 
	// 			// 			if (checkJson(newJson[jKey]) == null) {
	// 			// 
	// 			// 				newJson[jKey] = JSON.stringify(newJson[jKey]);
	// 			// 				continue;
	// 			// 			}
	// 			// 
	// 			// 			tempObj = newJson[jKey];
	// 			// 			for (var dKey in tempObj) {
	// 			// 
	// 			// 				if (tempObj[dKey] != null) {
	// 			// 
	// 			// 					newJson[jKey] = JSON.stringify(newJson[jKey]);
	// 			// 					break;
	// 			// 				}
	// 			// 			}
	// 
	// 			if (checkJson(newJson[jKey]) == null) {
	// 
	// 				newJson[jKey] = null;
	// 
	// 			} else {
	// 				tempObj = newJson[jKey];
	// 				for (var dKey in tempObj) {
	// 
	// 					if (tempObj[dKey] != null) {
	// 
	// 						newJson[jKey] = JSON.stringify(newJson[jKey]);
	// 						break;
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// 
	// 	//最后转换整个json成json字符串
	// 	return JSON.stringify(newJson);
}
/**
 * 将从服务器获取到的json字符串转成json对象
 * @param jsonStr json字符串
 */
const strResToJson = function(jsonStr) {

	if (jsonStr == null) {

		return {};
	}
	//判断是否是json字符串
	var tempJson = null;
	if (jsonStr.indexOf("[") == 0) {

		//转换最外层json字符串
		tempJson = JSON.parse(jsonStr);
		var childJson = null;
		for (var iKey in tempJson) {

			//判断外层json对象里的属性是否是json对象
			if ((typeof tempJson[iKey] == "object") &&
				(tempJson[iKey].length == undefined)) {

				//循环json对象里的属性
				childJson = tempJson[iKey];
				for (var jKey in childJson) {

					//判断是否是json字符串
					if ((typeof childJson[jKey] == "string") &&
						((childJson[jKey].indexOf("[") == 0) ||
							(childJson[jKey].indexOf("{") == 0))) {

						//转换json字符串
						childJson[jKey] = JSON.parse(childJson[jKey]);
					}
				}

				//将转换结果赋给原json
				tempJson[iKey] = childJson;
			}
		}
	} else if (jsonStr.indexOf("{") == 0) {

		//转换最外层json字符串
		tempJson = JSON.parse(jsonStr);
		for (var iKey in tempJson) {

			//判断是否是json字符串
			if ((typeof tempJson[iKey] == "string") &&
				((tempJson[iKey].indexOf("[") == 0) ||
					(tempJson[iKey].indexOf("{") == 0))) {

				//转换json字符串
				tempJson[iKey] = JSON.parse(tempJson[iKey]);
			}
		}
	} else {

		//不做处理直接返回原数据
		return jsonStr;
	}

	return tempJson;

	//先转换最外层字符串
	// 	var tempJson = JSON.parse(jsonStr);
	// 	var bIndex = null,
	// 		eIndex = null,
	// 		tempJsonTwo = null;
	// 
	// 	//兼顾单个json和json数组的转换
	// 	for (var jKey in tempJson) {
	// 
	// 		if (typeof tempJson[jKey] == "string") {
	// 
	// 			bIndex = tempJson[jKey].indexOf("{");
	// 			eIndex = tempJson[jKey].indexOf("}");
	// 			if ((bIndex >= 0) && (eIndex > 0)) {
	// 
	// 				tempJson[jKey] = JSON.parse(tempJson[jKey]);
	// 			}
	// 		} else if (typeof tempJson[jKey] == "object") {
	// 
	// 			//遍历子json
	// 			tempJsonTwo = tempJson[jKey];
	// 			for (var dKey in tempJsonTwo) {
	// 
	// 				if (typeof tempJsonTwo[dKey] == "string") {
	// 
	// 					bIndex = tempJsonTwo[dKey].indexOf("{");
	// 					eIndex = tempJsonTwo[dKey].indexOf("}");
	// 					if ((bIndex >= 0) && (eIndex > 0)) {
	// 
	// 						tempJsonTwo[dKey] = JSON.parse(tempJsonTwo[dKey]);
	// 					}
	// 				}
	// 			}
	// 
	// 			//将转换好的子json再赋值回去
	// 			tempJson[jKey] = tempJsonTwo;
	// 		}
	// 	}

	return tempJson;
}

/*******************************************************************/

/**
 * 存储登录用户信息到本地
 * @param 字符串 myData 
 */
const setUserInfo = function(myData) {
	uni.removeStorageSync("$myInfo");
	//var myInfoJson = myData || "{}";
	uni.setStorageSync("$myInfo", myData);
};

/**
 * 获取存储的登录用户信息
 * 获取json对象返回
 */
const getUserInfo = function() {
	var myInfoStr = uni.getStorageSync("$myInfo");

	if ("" != myInfoStr) {
		var myInfoJson = strResToJson(myInfoStr); //JSON.parse(myInfoStr);
		return myInfoJson;
	} else {
		return null;
	}
};

/**
 * 存储登录用户在子APP里的信息到本地
 * @param 字符串 myData 
 */
const setCUserInfo = function(myData) {
	uni.removeStorageSync("$myCAppInfo");
	//var myInfoJson = myData || "{}";
	uni.setStorageSync("$myCAppInfo", myData);
};

/**
 * 获取存储的登录用户在子APP里的信息
 * 获取json对象返回
 */
const getCUserInfo = function() {
	var myInfoStr = uni.getStorageSync("$myCAppInfo");

	if ("" != myInfoStr) {
		var myInfoJson = strResToJson(myInfoStr); //JSON.parse(myInfoStr);
		return myInfoJson;
	} else {
		return null;
	}
};

/**
 * 存储登录token信息到本地
 * @param 字符串 token
 */
const setTokenInfo = function(token) {
	uni.removeStorageSync("$myToken");
	//var myInfoJson = token || null;
	uni.setStorageSync("$myToken", token);
};

/**
 * 获取存储的登录token信息
 * 获取token
 */
const getTokenInfo = function() {
	var myInfoStr = uni.getStorageSync("$myToken");
	//var myInfoJson = strResToJson(myInfoStr);JSON.parse(myInfoStr);

	if ("" != myInfoStr) {
		return myInfoStr;
	} else {
		return null;
	}
};

/**
 * 存储Json字符串信息到本地
 * @param 存储的key名称 name 
 * @param 存储的字符串JSON信息 data 
 */
const setJsonLocalInfo = function(name, data) {
	uni.removeStorageSync(name);
	//var myInfoJson = myData || "{}";
	uni.setStorageSync(name, data);
};

/**
 * 获取存储的Json字符串信息
 * @param 存储的key名称 name 
 * 
 */
const getJsonLocalInfo = function(name) {
	var ret_Info = uni.getStorageSync(name);

	if ("" != ret_Info && null != ret_Info) {
		var myInfoJson = strResToJson(ret_Info);
		return myInfoJson;
	} else {
		return null;
	}
};

/**
 * 存储信息到本地
 * @param 存储的key名称 name 
 * @param 存储的字符串JSON信息 data 
 */
const setLocalInfo = function(name, data) {
	uni.removeStorageSync(name);
	//var myInfoJson = myData || "{}";
	uni.setStorageSync(name, data);
};

/**
 * 获取存储的信息
 * @param 存储的key名称 name 
 * 
 */
const getLocalInfo = function(name) {
	var ret_Info = uni.getStorageSync(name);
	//alert(ret_Info);
	if ("" != ret_Info && null != ret_Info) {
		return ret_Info;
	} else {
		return "";
	}
};

/**
 * 存储操作时间
 * @param 字符串 token
 */
const setopTimeInfo = function(time) {
	uni.removeStorageSync("$opTime");
	var myInfoJson = time || 0;
	uni.setStorageSync("$opTime", time);
};

/**
 * 获取操作时间
 * 获取token
 */
const getopTimeInfo = function() {
	var myInfoStr = uni.getStorageSync("$opTime") || 0;
	//var myInfoJson = strResToJson(myInfoStr);JSON.parse(myInfoStr);

	return myInfoStr;
};

/////////////////////////////////////////////////
/**
 * 切换角色
 */
const switchrole = function(rid) {
	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	let promise = new Promise(function(resolve, reject) {
		var state = getState();
		var qjson = {
			"m": user_msg.userid,
			"tk": user_msg.token,
			"state": state
		};
		//alert("switchrole li " + rid);
		szblGet("/api/role/" + rid, qjson).then(function(dataJson) {
			//alert("456");
			if (dataJson.state != state) {

				reject("返回标识出错");
				return promise;
			}
			var retJson = strResToJson(dataJson.data);

			user_msg.default_role_id = retJson.id;
			user_msg.default_role_name = retJson.rolename;
			user_msg.default_role_fid = retJson.fid;
			user_msg.default_role_cid = retJson.cid;
			user_msg.default_role_gid = retJson.gid;
			user_msg.default_role_status = retJson.status;
			user_msg.default_role_kw0 = retJson.kw0;
			user_msg.default_role_kw1 = retJson.kw1;
			user_msg.default_role_kw2 = retJson.kw2;
			user_msg.default_role_kw3 = retJson.kw3;
			user_msg.default_role_kw4 = retJson.kw4;
			user_msg.default_role_kw5 = retJson.kw5; //开发者id
			user_msg.default_role_areacode = retJson.areacode;
			user_msg.default_role_areaname = retJson.areaname;

			resolve();
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise

};


/**
 * 获取管理端用户角色查询参数
 */
const getGLURQueryParam = function() {
	var queryparam = {
		"cuid": "", //创建者id
		"unit": "", //组织id
		"areacode": "", //地区查询码
		"rpflag": "", //资源识别码
	};

	var type = user_msg.default_role_kw0;

	if (user_msg.default_role_fid == "3") {
		queryparam.cuid = user_msg.userid;
	}

	queryparam.unit = com_data.unit_id;

	var areacode = user_msg.default_role_areacode;
	if (areacode == "86") {
		queryparam.areacode = "";
	} else {
		queryparam.areacode = getQueryAreaCode(areacode);
	}
	//角色类型：1-政府   2-企业/集团
	if (type == "2") {
		queryparam.rpflag = user_msg.default_role_kw5 + "_" + com_data.menu_gid;
	}

	return queryparam;
}

/**
 * 获取指定角色的栏目菜单
 */
const getUserRoleMenu = function(rid) {
	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	let promise = new Promise(function(resolve, reject) {
		var state = getState();
		var qjson = {
			"m": user_msg.userid,
			"tk": user_msg.token,
			"state": state
		};
		//alert("456" + rid);
		szblGet("/api/menu/user/" + rid, qjson).then(function(dataJson) {
			//alert("456");
			if (dataJson.state != state) {

				reject("返回标识出错");
				return promise;
			}
			var ret_RoleData = strResToJson(dataJson.data);

			if (ret_RoleData.code == 1111) {
				reject(ret_RoleData.msg);
				return promise;
			}

			//alert(ret_RoleData.menuList);
			//设置系统顶级菜单
			setJsonLocalInfo("$t_menu", jsonResToStr(ret_RoleData.tMenu));
			//设置系统侧边栏菜单
			setJsonLocalInfo("$a_menu", jsonResToStr(ret_RoleData.aMenu));
			//szblMCom.setJsonLocalInfo("$roleInfo","");


			resolve();
		}).catch(function(msg) {

			reject(msg);
		});

	});

	return promise

};

/**
 * 设置角色 资源包  组织 关系
 * rid-角色id  rpid-资源包id  uid-组织id utable-组织表名称
 */
const setSysRoleRpUnit = function(uid, utable) {
	//alert(uid+ "_" + utable + "_" +com_data.umenu_rpid);
	/******/
	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	return new Promise(function(resolve, reject) {
		var state = getState();
		var qjson = {
			"rid": user_msg.default_role_id,
			"rpid": com_data.umenu_rpid,
			"uid": uid,
			"utable": utable
		};
		//alert("switchrole li " + rid);
		szblPost("/api/srru?m=" + user_msg.userid + "&tk=" + user_msg.token + "&state=" + getState(),
			qjson).then(function(dataJson) {

			//var retJson = strResToJson(dataJson.data);

			resolve();
		}).catch(function(msg) {

			reject(msg);
		});
	});

};

/**
 * 获取该用户是否拥有该权限
 * @param {Object} roleid 
 * true-拥有权限  false-没有权限
 */
const getRoleFlag = function(mid) {
	//var userInfoStr = getUserInfo();
	//var myInfoJson = JSON.parse(myInfoStr);
	//var fmenuids = userInfoStr.fmenuids;
	var fmenuids = com_data.ifids;
	//alert(fmenuids);
	if (fmenuids.indexOf(mid) >= 0) {
		return true;
	} else {
		return false;
	}
};

/******************************注册、登录、注销************************/
export let user_msg = {
	token: null,
	c_token: null,
	userid: null,
	username: null,
	phone: null,
	default_role_id: null,
	default_role_name: null,
	default_role_fid: null,
	default_role_cid: null,
	default_role_gid: null,
	default_role_status: null,
	default_role_kw0: null,
	default_role_kw1: null,
	default_role_kw2: null,
	default_role_kw3: null,
	default_role_kw4: null,
	default_role_kw5: null,
	default_role_areacode: null,
	default_role_areaname: null
}
// export let token = null;
// export let userid = null;
// export let username = null;
// export let phone = null;
// export let default_role_id = null;
// export let default_role_name = null;
// export let default_role_fid = null;
// export let default_role_cid = null;
// export let default_role_gid = null;
// export let default_role_status = null;
// export let default_role_kw0 = null;
// export let default_role_kw1 = null;
// export let default_role_kw2 = null;
// export let default_role_kw3 = null;
// export let default_role_kw4 = null;
// export let default_role_kw5 = null; //开发id
// export let default_role_areacode = null; //地区编码
// export let default_role_areaname = null;

//登录子APP的token
export let c_token = null; //这个还要不要？？？

/**
 * 2019年6月19日，是用不到还是废弃了我也不知道
 * 运营中心添加
 * @param un
 * @param pwd
 * @param mp_code
 * @param at
 */
// const addAccount = function(un, pwd, mp_code, at) {
// 
// 	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
// 	var promise = new Promise(function(resolve, reject) {
// 
// 		if (checkVarIsEmpty(un) ||
// 			checkVarIsEmpty(pwd) ||
// 			checkVarIsEmpty(mp_code) ||
// 			checkVarIsEmpty(at)) {
// 
// 			reject("参数不合法");
// 			return promise;
// 		}
// 
// 		//获取授权key
// 		getAuthKey(un).then(function(loginKey) {
// 
// 			var authJson = {
// 				"un": getRSAEncryptStr(un),
// 				"pw": getRSAEncryptStr(getPWDEncode(pwd)),
// 				"mpCode": getRSAEncryptStr(mp_code),
// 				"state": getState()
// 			};
// 
// 			var authStr = getAuthEncryptStr(loginKey, authJson);
// 			szblPost("/api/account?type=" + at, authStr).then(function(dataJson) {
// 
// 				if (dataJson.state != authJson.state) {
// 
// 					reject("返回标识出错");
// 					return promise;
// 				}
// 
// 				resolve(dataJson.data);
// 			}).catch(function(msg) {
// 
// 				reject(msg);
// 			});
// 		}).catch(function(msg) {
// 
// 			reject(msg);
// 		});
// 	});
// 
// 	return promise;
// };

/**
 * 2019年6月19日，暂时废弃
 * 注册账号、忘记密码或修改密码
 * @param un
 * @param pwd
 * @param mp_code
 */
// const regAndForgetOrModifyPwd = function(un, pwd, mp_code, lt) {
// 
// 	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
// 	var promise = new Promise(function(resolve, reject) {
// 
// 		// 		if (checkVarIsEmpty(un) ||
// 		// 			checkVarIsEmpty(pwd) ||
// 		// 			checkVarIsEmpty(mp_code)) {
// 		// 
// 		// 			reject("参数不合法");
// 		// 			return promise;
// 		// 		}
// 
// 		if (checkVarIsEmpty(un)) {
// 			reject("请输入手机号");
// 		}
// 		if (checkVarIsEmpty(pwd)) {
// 			reject("请输入密码");
// 		}
// 		if (checkVarIsEmpty(mp_code)) {
// 			reject("请输入验证码");
// 		}
// 
// 		//获取授权key
// 		getAuthKey(un).then(function(loginKey) {
// 
// 			var authJson = {
// 				"un": getRSAEncryptStr(un),
// 				"pw": getRSAEncryptStr(getPWDEncode(pwd)),
// 				"mpCode": getRSAEncryptStr(mp_code),
// 				"state": getState()
// 			};
// 
// 			var authStr = getAuthEncryptStr(loginKey, authJson);
// 			szblPut("/api/account", authStr).then(function(dataJson) {
// 
// 				if (dataJson.state != authJson.state) {
// 
// 					reject("返回标识出错");
// 					return promise;
// 				}
// 
// 				normalLogin(un, pwd, lt).then(function(dataJson) {
// 
// 					resolve("登录成功");
// 				}).catch(function(msg) {
// 
// 					reject(msg);
// 				});
// 			}).catch(function(msg) {
// 
// 				reject(msg);
// 			});
// 		}).catch(function(msg) {
// 
// 			reject(msg);
// 		});
// 	});
// 
// 	return promise;
// };

/**
 * 注册账号
 * @param un
 * @param pwd
 * @param appid		//应用标识
 * @param lt		//登录标识
 */
const registry = function(un, pwd, appid, lt) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		if (checkVarIsEmpty(un) ||
			checkVarIsEmpty(pwd) ||
			checkVarIsEmpty(appid) ||
			checkVarIsEmpty(lt)) {

			reject("参数不合法");
			return promise;
		}

		//获取授权key
		getAuthKey(un).then(function(loginKey) {

			let authJson = {
				"un": getRSAEncryptStr(un),
				"pw": getRSAEncryptStr(getPWDEncode(pwd)),
				"appid": appid,
				"state": getState()
			};

			let authStr = getAuthEncryptStr(loginKey, authJson);
			szblPost("/api/account", authStr).then(function(dataJson) {

				if (dataJson.state != authJson.state) {

					reject("返回标识出错");
					return promise;
				}

				normalLogin(un, pwd, appid, lt).then(function(dataJson) {

					resolve("登录成功");
				}).catch(function(msg) {

					reject(msg);
				});
			}).catch(function(msg) {

				reject(msg);
			});
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 手机号验证码登录
 * @param pn
 * @param mpc
 * @param appid		//应用标识
 * @param lt		//登录标识
 */
const loginByPhoneCode = function(pn, mpc, appid, lt) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		if (checkVarIsEmpty(pn) ||
			checkVarIsEmpty(mpc) ||
			checkVarIsEmpty(appid) ||
			checkVarIsEmpty(lt)) {

			reject("参数不合法");
			return promise;
		}

		let authJson = {
			"pn": pn,
			"mp": mpc,
			"ad": appid,
			"state": getState()
		};

		szblGet("/api/account", authJson).then(function(dataJson) {

			if (dataJson.state != authJson.state) {

				reject("返回标识出错");
				return promise;
			}

			var pwd = dataJson.data;
			getTokenFromLogin(pn, pwd, appid, lt).then(function(dataJson) {

				resolve("登录成功");
			}).catch(function(msg) {

				reject(msg);
			});
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 自动登录
 * @param appid  //应用标识
 */
const autoLogin = function(appid) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		//读取信息
		if (checkVarIsEmpty(appid)) {
			var un = uni.getStorageSync('mun')
			var pwd = uni.getStorageSync('mpwd')
			var lt = uni.getStorageSync('mlt')
		} else {
			var un = uni.getStorageSync('un');
			var pwd = uni.getStorageSync('pwd');
			var lt = uni.getStorageSync('lt');
		}

		if (checkVarIsEmpty(un) ||
			checkVarIsEmpty(pwd) ||
			checkVarIsEmpty(lt)) {

			reject("本地没有账户信息，无法自动登录");
			return promise;
		}

		getTokenFromLogin(un, pwd, appid, lt).then(function(dataJson) {

			resolve("登录成功");
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 根据账户信息登录获取token
 * @param un
 * @param pwd
 * @param appid  //应用标识
 * @param lt	//登录标识
 */
const normalLogin = function(un, pwd, appid, lt) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		if (checkVarIsEmpty(un) ||
			checkVarIsEmpty(pwd) ||
			checkVarIsEmpty(lt) ||
			checkVarIsEmpty(appid)) {

			reject("参数不合法");
			return promise;
		}

		//加密账号信息
		pwd = getRSAEncryptStr(getPWDEncode(pwd));
		getTokenFromLogin(un, pwd, appid, lt).then(function(dataJson) {
			//alert("登录成功");
			resolve("登录成功");
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 登录实现
 * @param un
 * @param pwd
 * @param appid		//应用标识
 * @param lt
 */
const getTokenFromLogin = function(un, pwd, appid, lt) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		if (checkVarIsEmpty(un) ||
			checkVarIsEmpty(pwd) ||
			checkVarIsEmpty(lt) ||
			checkVarIsEmpty(appid)) {

			reject("参数不合法");
			return promise;
		}
		// console.log(un);
		//获取授权key
		getAuthKey(un).then(function(loginKey) {

			let authJson = {
				"un": getRSAEncryptStr(un),
				"pw": pwd,
				"appid": appid,
				"state": getState()
			};

			let authStr = getAuthEncryptStr(loginKey, authJson);
			szblPost("/api/auth?type=" + lt, authStr).then(function(dataJson) {

				if (dataJson.state != authJson.state) {

					reject("返回标识出错");
					return promise;
				}

				//不可以在本地存储token
				var retJson = strResToJson(dataJson.data);
				user_msg.token = retJson.tk;
				user_msg.userid = retJson.u;
				user_msg.username = un;
				user_msg.phone = retJson.phone;
				user_msg.default_role_id = retJson.default_ro_id;
				user_msg.default_role_name = retJson.default_ro_name;
				user_msg.default_role_fid = retJson.default_ro_fid;
				user_msg.default_role_cid = retJson.default_ro_cid;
				user_msg.default_role_gid = retJson.default_ro_gid;
				user_msg.default_role_status = retJson.default_ro_status;
				user_msg.default_role_kw0 = retJson.default_ro_kw0;
				user_msg.default_role_kw1 = retJson.default_ro_kw1;
				user_msg.default_role_kw2 = retJson.default_ro_kw2;
				user_msg.default_role_kw3 = retJson.default_ro_kw3;
				user_msg.default_role_kw4 = retJson.default_ro_kw4;
				user_msg.default_role_kw5 = retJson.default_ro_kw5;
				user_msg.default_role_areacode = retJson.default_ro_areacode;
				user_msg.default_role_areaname = retJson.default_ro_areaname;

				//存储信息
				if (checkVarIsEmpty(appid)) {
					uni.setStorageSync('mun', un)
					uni.setStorageSync('mpwd', pwd)
					uni.setStorageSync('mlt', lt)
				} else {
					uni.setStorageSync('un', un);
					uni.setStorageSync('pwd', pwd);
					uni.setStorageSync('lt', lt);
				}


				resolve();
			}).catch(function(msg) {

				reject(msg);
			});
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 注销账号
 * @param appid		//应用标识
 */
const logout = function(appid) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	return new Promise(function(resolve, reject) {

		user_msg.token = null;
		user_msg.userid = null;
		user_msg.username = null;
		user_msg.phone = null;
		user_msg.default_role_id = null;
		user_msg.default_role_name = null;
		user_msg.default_role_fid = null;
		user_msg.default_role_cid = null;
		user_msg.default_role_gid = null;
		user_msg.default_role_status = null;
		user_msg.default_role_kw0 = null;
		user_msg.default_role_kw1 = null;
		user_msg.default_role_kw2 = null;
		user_msg.default_role_kw3 = null;
		user_msg.default_role_kw4 = null;
		user_msg.default_role_kw5 = null;
		user_msg.default_role_areacode = null;
		user_msg.default_role_areaname = null;

		//清除信息
		if (checkVarIsEmpty(appid)) {
			uni.removeStorageSync("mun");
			uni.removeStorageSync("mpwd");
			uni.removeStorageSync("mlt");
		} else {
			uni.removeStorageSync("un");
			uni.removeStorageSync("pwd");
			uni.removeStorageSync("lt");
		}

		resolve();
	});

};
/********************************************************************/

/****************************开发者获取token***************************/
/**
 * 根据szblid和szblsecret获取token
 * @param szblid
 * @param szblsecret
 */
const getTokenFromAppIdAndSecret = function(szblid, szblsecret) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		if (checkVarIsEmpty(szblid) ||
			checkVarIsEmpty(szblsecret)) {

			reject("参数不合法");
			return promise;
		}
		// console.log(szblid + "—" + szblsecret);

		//获取token
		var appJson = {
			"szblid": szblid,
			"szblsecret": szblsecret
		};

		// 异步
		// szblGet("/api/token", appJson).then(function(dataJson) {
		// 同步
		szblGetSync("/api/token", appJson).then(function(dataJson) {

			//不可以在本地存储token
			var cid_tk = dataJson.data.split("_");
			user_msg.default_role_cid = cid_tk[0];
			user_msg.token = cid_tk[1];

			// user_msg.token = dataJson.data;

			resolve("ok");
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 刷新token
 */
const getRefreshToken = function() {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		var state = getState();
		var tk = user_msg.token;
		szblPut("/api/auth?state=" + state, tk).then(function(dataJson) {

			if (dataJson.state != state) {

				reject("返回标识出错");
				return;
			}

			var retJson = strResToJson(dataJson.data);
			user_msg.token = retJson.tk;

			resolve();
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};
/********************************************************************/

/*****************************************登录加密相关************************************/
//登录获取authKey
//可能会出问题
const ajaxAuthKeyPost = function(url, jsonData) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	return new Promise(function(resolve, reject) {

		uni.request({
			url: authUrl + url,
			method: 'POST',
			data: jsonResToStr(jsonData),
			dataType: 'json',
			header: {
				"Content-Type": "application/json;charset=UTF-8",
				"Cache-Control": "no-cache"
			},
			success: (res) => {
				if (res.data.code != 0) {
					reject(res.data.msg)
				}
				resolve(res.data)
			},
			fail: function(returnMsg) {
				console.log(returnMsg)
				//将状态置为reject，并把错误信息返回
				reject(returnMsg.errMsg);
			},
			complete: () => {}
		});

		// 		$({
		// 			url: authUrl + url,
		// 			method: "POST",
		// 			headers: {
		// 				"Content-Type": "application/json;charset=UTF-8",
		// 				"Cache-Control": "no-cache"
		// 			},
		// 			data: jsonResToStr(jsonData),
		// 			timeout: 50000,
		// 			maxContentLength: 50000
		// 		}).then(function(response) {
		// 
		// 			if (response.data.code != 0) {
		// 
		// 				reject(response.data.msg);
		// 				return;
		// 			}
		// 
		// 			//将状态置为resolve，并把结果返回
		// 			resolve(response.data);
		// 		}).catch(function(error) {
		// 			console.log(error.data);
		// 			//将状态置为reject，并把错误信息返回
		// 			reject(error.data);
		// 		});
	});

	// return promise;
};

/**
 * 获取登录授权key
 * @param username 登录用户名
 */
const getAuthKey = function(username) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		if (checkVarIsEmpty(username)) {

			reject("参数不合法");
			return promise;
		}

		//加密用户名
		var encryptUsername = getRSAEncryptStr(username);
		if (encryptUsername == null) {

			reject("用户名不合法");
			return promise;
		}

		// console.log(encryptUsername);
		var salt = getState();
		var encryptSalt = getRSAEncryptStr(salt);
		var applyJson = {
			"a": encryptUsername,
			"s": encryptSalt
		};
		var wordArray = CryptoJS.enc.Utf8.parse(jsonResToStr(applyJson));
		var baseStr = CryptoJS.enc.Base64.stringify(wordArray);

		//key只能是wordarray或string
		var sign = CryptoJS.HmacSHA512(baseStr, String(salt)).toString(CryptoJS.enc.Hex);
		var applyStr = baseStr + "." + sign;
		// console.log(applyStr);

		var state = getState();
		ajaxAuthKeyPost("/api/authkey?state=" + state,
			applyStr).then(function(dataJson) {

			if (dataJson.state != state) {

				reject("返回标识出错");
				return;
			}

			resolve(dataJson.data);
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 对登录信息进行加密
 * @param authKey	//授权key
 * @param authJson	//登录信息
 */
const getAuthEncryptStr = function(authKey, authJson) {

	if (checkVarIsEmpty(authKey) ||
		checkVarIsEmpty(authJson) ||
		(checkJson(authJson) == null)) {

		return null;
	}

	//将json转换成字符串
	var authJsonStr = jsonResToStr(authJson);

	//获取盐值
	var salt = getState();
	var concatStr = authKey + "-" + authJsonStr + "-" + salt;

	//先转换字符串再进行编码
	var wordArray = CryptoJS.enc.Utf8.parse(concatStr);
	var baseStr = CryptoJS.enc.Base64.stringify(wordArray);
	var sign = CryptoJS.HmacSHA1(baseStr, String(salt)).toString(CryptoJS.enc.Hex);

	return baseStr + "." + sign;
};

/**
 * 对密码进行哈希
 * @param pwd //密码
 */
const getPWDEncode = function(pwd) {

	if (checkVarIsEmpty(pwd)) {

		return null;
	}

	return CryptoJS.SHA256(CryptoJS.SHA256(CryptoJS.SHA256(pwd).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex)).toString(
		CryptoJS.enc.Hex);
};

/**
 * 对字符串内容进行rsa加密
 * @param 要加密的字符串内容 //只能是字符串
 */
const getRSAEncryptStr = function(needEncryptInfo) {

	//判断传入内容的合法性
	if (checkVarIsEmpty(needEncryptInfo)) {

		return null;
	}

	//先转换字符串再进行编码
	var wordArray = CryptoJS.enc.Utf8.parse(needEncryptInfo);
	var baseStr = CryptoJS.enc.Base64.stringify(wordArray);

	var publicKey =
		"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk0IeAUxSAG+XCrFycjnpBd4tUei3DJiz+hHu2TWS8+W9dJcOCFvj0IFy1qd6MvKlBubdGiZEdncQQ/90MFhmpZFucnfEgmVqqS5+Dor4SFAI0yFwlOiLmCP66wCL+fjWLHe6I0qsjpu773rR8iCrwq6exww6L7InvfVASUF3RCi50hWKQQi9/Nc7bJtaOZ9pw5gqNaOQyTjnxzqFWzdhhG6l+CAhyt79XBkOPCIbKZ5DRa/fZTcgb0aPbyGRPTNG6nxFRawUFwcVfmlk1IDXvgWZWxO5vIy/U2CG/UHOnM+90qkCvgW+6StlVKGQQ4d6tqG8Sa2DVAFmC7bfCz8EHQIDAQAB";
	var jsEncrypt = new JSEncrypt();
	jsEncrypt.setPublicKey(publicKey);

	var jsEncryptStr = jsEncrypt.encrypt(baseStr);
	return jsEncryptStr;
};
/*************************************************************************************/

/**
 * 获取url中的ID
 * @param queryStr	//url的参数
 * @param idType	//要获取的ID类型
 */
const getId = function(queryStr, idType) {

	var bIndex = queryStr.indexOf(idType);
	var eIndex = queryStr.indexOf("&");
	var tempStr = null,
		id = null;

	//判断是否存在相应的参数
	if (bIndex < 0) {

		return null;
	}

	//u在&前面
	if (bIndex < eIndex) {

		tempStr = queryStr.substring(bIndex, eIndex);
		tempStr = tempStr.split("=");
		id = tempStr[1];
	} else if (bIndex > eIndex) { //u在&后面


		tempStr = queryStr.substring(eIndex, queryStr.length);
		tempStr = tempStr.split("=");
		id = tempStr[1];
	}

	return id;
};

/**
 * 以随机数生成每次访问的客户端标识
 */
const getState = function() {

	return Math.floor((Math.random() * 10000) + 1);
};

/**
 * 判断json是否为{}
 * @param jsonObj	//json对象
 */
const checkJson = function(jsonObj) {

	for (var jAttribute in jsonObj) {

		return jsonObj;
	}

	return null;
};

/**
 * 判断变量是否为空
 * @param variable
 */
const checkVarIsEmpty = function(variable) {

	if ((variable === "") || (variable === null) || (variable === undefined)) {

		return true;
	}

	return false;
}

/**
 * 添加url时间戳
 */
const refreshAssign = function() {

	var tnoIndex = 0;

	//先分解url判断参数个数
	var urlPath = location.href.split("?");
	if (urlPath.length > 1) {

		tnoIndex = urlPath[1].indexOf("tno");
	} else {

		tnoIndex = urlPath[0].indexOf("tno");
	}

	if (tnoIndex < 0) { //不存在时间戳代表第一次打开

		if (urlPath.length < 2) { //url后面没有参数时

			//添加时间戳访问
			location.assign(urlPath[0] + "?tno=" + Date.parse(new Date()));
		} else { //url后面有参数时

			//添加时间戳访问
			location.assign(urlPath[0] + "?" + urlPath[1] +
				"&tno=" + Date.parse(new Date()));
		}
	} else { //存在时间戳时，要更新该时间戳

		var queryStrArray = urlPath[1].split("&");
		if (queryStrArray.length == 1) { //没有其他参数

			var dateStr = queryStrArray[0].split("=");
			if ((Date.parse(new Date()) - dateStr) > 300000) {

				//添加时间戳访问
				location.assign(urlPath[0] + "?tno=" + Date.parse(new Date()));
			}
		} else {

			var queryNewStr = "";
			var tempTimeIndex = 0;

			//查找已存在的时间戳
			for (var i = 0; i < queryStrArray.length; i++) {

				tempTimeIndex = queryStrArray[i].indexOf("tno");
				if (tempTimeIndex == 0) {

					var dateStr = queryStrArray[i].split("=");
					if ((Date.parse(new Date()) - dateStr) > 300000) {

						//将已存在的时间戳去掉，重新组装新的参数和时间戳
						queryStrArray.splice(i, 1);
						if (queryStrArray.length == 1) {


							//添加时间戳访问
							location.assign(urlPath[0] + "?" + queryStrArray[0] +
								"&tno=" + Date.parse(new Date()));
						}

						queryNewStr = queryStrArray[0];
						for (var j = 1; j < queryStrArray.length; j++) {

							queryNewStr += "&" + queryStrArray[j];
							if (j == (queryStrArray.length - 1)) {

								queryNewStr += "&tno=" + Date.parse(new Date());

								//添加时间戳访问
								location.assign(urlPath[0] + "?" + queryNewStr);
							}
						}
					} else {

						return;
					}
				}
			}
		}
	}
}

/**
 * 获取url中的指定参数的值
 * @param keyStr	//要获取的参数key
 */
const getQueryValue = function(keyStr) {

	var value = null;

	//先分解url获取参数部分
	var urlStrArray = location.href.split("?");
	if (urlStrArray.length == 1) { //当前url没有参数

		return value;
	}

	//分解参数然后查找给定的key
	var queryStrArray = urlStrArray[1].split("&");
	for (var i = 0; i < queryStrArray.length; i++) {

		if (queryStrArray[i].indexOf(keyStr) >= 0) {

			value = queryStrArray[i].split("=")[1];
			break;
		}
	}

	return value;
};

/**************************************微信相关******************************************/

/**
 * 获取微信小程序用户的openId
 * @param wxsId			//微信设置ID
 * @param code			//wx.login获取的 code
 */
const getWxxcxUserOpenId = function(wxsId, code) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	let promise = new Promise(function(resolve, reject) {

		if (checkVarIsEmpty(wxsId) ||
			checkVarIsEmpty(code)) {

			reject("参数不合法");
			return promise;
		}

		var wxState = getState();
		var jsonParam = {
			"wxsid": wxsId,
			"cd": code,
			"state": wxState
		};

		//获取微信用户基本信息
		szblGet("/api/wechatxcxuser", jsonParam).then(function(dataJson) {

			if (dataJson.state != wxState) {

				reject("网络被劫持");
				return promise;
			}

			resolve(strResToJson(dataJson.data));
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 微信公众号支付
 * @param userId		//当前用户的userID
 * @param token			//访问令牌
 * @param orderId		//要支付的支付机构订单号，而不是业务订单表的订单号
 * @param wxsId			//微信设置ID
 * @param user_openId	//当前用户的openID
 */
const getWxPay = function(userId, token, orderId, wxsId, user_openId) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		// 		if (checkVarIsEmpty(userId) ||
		// 			checkVarIsEmpty(token) ||
		// 			checkVarIsEmpty(orderId) ||
		// 			checkVarIsEmpty(user_openId) ||
		// 			checkVarIsEmpty(wxsId)) {
		// 
		// 			reject("参数不能为空");
		// 			return promise;
		// 		}

		if (checkVarIsEmpty(userId)) {
			reject("登录状态过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(token)) {
			reject("登录状态已过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(orderId)) {
			reject("订单失效，请重新下单");
			return promise;
		}
		if (checkVarIsEmpty(user_openId)) {
			reject("微信id错误，请重新打开本页");
			return promise;
		}
		if (checkVarIsEmpty(wxsId)) {
			reject("微信状态码错误，请联系管理员");
			return promise;
		}

		var wxState = getState();
		var payJson = {
			"u": userId,
			"tk": token,
			"state": wxState,
			"opid": user_openId,
			"wxsid": wxsId
		};

		//获取微信支付参数
		szblGet("/api/wechatpayJsapi/" + orderId, payJson).then(function(dataJson) {

			if (dataJson.state != wxState) {

				reject("网络被劫持，支付失败！");
				return promise;
			}

			var payData = strResToJson(dataJson.data);

			//微信支付
			
			wx.ready(function(){
				
				console.log(payData, 'payData')
				
				wx.chooseWXPay({
					"timestamp": payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					"nonceStr": payData.nonceStr, // 支付签名随机串，不长于 32 位
					"package": payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					"signType": payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					"paySign": payData.paySign, // 支付签名
					success: (res) => {

						resolve("ok");
						console.log(res);
					},
					fail: (res) => {
						reject(res);
					}
				});
			});
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 微信小程序支付
 * @param userId		//当前用户的userID
 * @param token			//访问令牌
 * @param orderId		//要支付的支付机构订单号，而不是业务订单表的订单号
 * @param wxsId			//微信设置ID
 * @param user_openId	//当前用户的openID
 */
const getWxxcxPay = function(userId, token, orderId, wxsId, user_openId) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		// if(checkVarIsEmpty(userId)
		// 		|| checkVarIsEmpty(token)
		// 		|| checkVarIsEmpty(orderId)
		// 		|| checkVarIsEmpty(user_openId)
		// 		|| checkVarIsEmpty(wxsId)) {
		// 	
		// 	reject("参数不能为空");
		// 	return promise;
		// }

		if (checkVarIsEmpty(userId)) {
			reject("登录状态过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(token)) {
			reject("登录状态已过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(orderId)) {
			reject("订单失效，请重新下单");
			return promise;
		}
		if (checkVarIsEmpty(user_openId)) {
			reject("微信id错误，请重新打开本页");
			return promise;
		}
		if (checkVarIsEmpty(wxsId)) {
			reject("微信状态码错误，请联系管理员");
			return promise;
		}


		var wxState = getState();
		var payJson = {
			"u": userId,
			"tk": token,
			"state": wxState,
			"opid": user_openId,
			"wxsid": wxsId
		};

		//获取微信支付参数
		szblGet("/api/wechatpayJsapi/" + orderId, payJson).then(function(dataJson) {

			if (dataJson.state != wxState) {

				reject("网络被劫持，支付失败！");
				return promise;
			}

			var payData = strResToJson(dataJson.data);
			resolve(payData);
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};


/**
 * 获取微信签名
 * @param wxsId		//微信设置ID
 */
const getWxSign = function(wxsId) {

	if (checkVarIsEmpty(wxsId)) {

		alert("微信设置ID不能为空");
		return;
	}

	var url = location.href;
	if (url.indexOf("#") > 0) {

		url = url.split("#")[0];
	}

	var wxState = getState();
	var jsonParam = {
		"url": url,
		"state": wxState
	};

	//获取微信签名
	szblGet("/api/wechatJsConf/" + wxsId, jsonParam).then(function(dataJson) {

		if (dataJson.state != wxState) {

			console.log("网络被劫持");
			return;
		}

		var new_json = strResToJson(dataJson.data);
		wx.config({
			debug: false,
			appId: new_json.appId,
			timestamp: new_json.timestamp,
			nonceStr: new_json.nonceStr,
			signature: new_json.signature,
			jsApiList: [
				'hideOptionMenu',
				'showOptionMenu',
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'showAllNonBaseMenuItem',
				'showMenuItems',
				'hideMenuItems',
				'closeWindow',
				'chooseWXPay'
			]
		});
	}).catch(function(msg) {

		console.log(msg);
	});
};


/**
 * 微信扫码支付
 * @param userId		//当前用户的userID
 * @param token			//访问令牌
 * @param orderId		//要支付的支付机构订单号，而不是业务订单表的订单号
 * @param wxsId			//微信设置ID
 */
const getWxPayNative = function(userId, token, orderId, wxsId) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		// 		if (checkVarIsEmpty(userId) ||
		// 			checkVarIsEmpty(token) ||
		// 			checkVarIsEmpty(orderId) ||
		// 			checkVarIsEmpty(wxsId)) {
		// 
		// 			reject("参数不能为空");
		// 			return promise;
		// 		}
		// 		
		if (checkVarIsEmpty(userId)) {
			reject("登录状态过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(token)) {
			reject("登录状态已过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(orderId)) {
			reject("订单失效，请重新下单");
			return promise;
		}
		if (checkVarIsEmpty(wxsId)) {
			reject("微信状态码错误，请联系管理员");
			return promise;
		}

		var wxState = getState();
		var payJson = {
			"u": userId,
			"tk": token,
			"state": wxState,
			"wxsid": wxsId
		};

		//获取微信支付参数
		szblGet("/api/wechatpayNative/" + orderId, payJson).then(function(dataJson) {

			if (dataJson.state != wxState) {

				reject("网络被劫持，支付失败！");
				return promise;
			}

			console.log(dataJson.data);
			resolve(dataJson.data); //支付链接，需要转成二维码，然后使用微信扫码支付
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 微信支付——申请退款
 * @param userId		//当前用户的userId
 * @param token			//访问令牌
 * @param wxsId			//微信设置ID
 * @param orderId		//要支付的支付机构订单号，而不是业务订单表的订单号
 */
const wxPayRefund = function(userId, token, wxsId, orderId) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		// 		if (checkVarIsEmpty(userId) ||
		// 			checkVarIsEmpty(token) ||
		// 			checkVarIsEmpty(orderId) ||
		// 			checkVarIsEmpty(wxsId)) {
		// 
		// 			reject("参数不能为空");
		// 			return promise;
		// 		}

		if (checkVarIsEmpty(userId)) {
			reject("登录状态过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(token)) {
			reject("登录状态已过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(orderId)) {
			reject("订单失效，请重新下单");
			return promise;
		}
		if (checkVarIsEmpty(wxsId)) {
			reject("微信状态码错误，请联系管理员");
			return promise;
		}

		var wxState = getState();

		//微信支付退款
		szblPut("/api/wechatpayrefund/" + orderId +
			"?u=" + userId +
			"&tk=" + token +
			"&state=" + wxState +
			"&wxsid=" + wxsId, {}).then(function(dataJson) {

			if (dataJson.state != wxState) {

				reject("网络被劫持，支付失败！");
				return promise;
			}

			if (dataJson.data == "ok") {

				resolve(dataJson.data);
			} else {

				reject(msg);
			}
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 获取微信用户的openId
 * @param	wxsId	//微信设置ID
 */
const getWxUserOpenId = function(wxsId) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		if (location.search.indexOf("code") < 0) { //获取组装链接

			var wxState = getState();
			var indexUrl = location.href;

			if (checkVarIsEmpty(wxsId)) {

				// alert("微信设置ID不能为空");
				alert("微信状态码错误，请联系管理员");
				return;
			}

			var jsonParam = {
				"wxsid": wxsId,
				"url": indexUrl,
				"state": wxState,
				// "tp": 0
				"tp": 1
			};

			//获取组装后的微信用户url
			szblGet("/api/wechaturl", jsonParam).then(function(dataJson) {

				if (dataJson.state != wxState) {

					reject("网络被劫持");
					return promise;
				}

				//调用微信链接
				location.assign(dataJson.data);
			}).catch(function(msg) {

				reject(msg);
			});

		} else { //获取微信用户信息

			/*********解析url参数code子串********/
			var urlParam = location.search;
			var codePos = urlParam.indexOf("code");
			var urlParamSubStr = urlParam.substring(codePos, urlParam.length);
			var connectPos = urlParamSubStr.indexOf("&");
			if (connectPos < 0) {

				reject("参数不合法");
				return promise;
			}

			urlParamSubStr = urlParamSubStr.substring(0, connectPos);
			var wxCode = urlParamSubStr.split("=");
			/*********************************/

			var wxState = getState();
			if (checkVarIsEmpty(wxsId)) {

				// alert("微信设置ID不能为空");
				alert("微信状态码错误，请联系管理员");
				return;
			}

			var jsonParam = {
				"cd": wxCode[1],
				"wxst": wxsId,
				"state": wxState
			};

			//获取微信用户的信息
			szblGet("/api/wechatuser", jsonParam).then(function(dataJson) {

				if (dataJson.state != wxState) {

					reject("网络被劫持");
					return promise;
				}

				resolve(strResToJson(dataJson.data));
			}).catch(function(msg) {

				reject(msg);
			});
		}
	});

	return promise;
};


/**
 * 根据openID获取微信用户基本信息
 * @param openId		//当前用户的openId
 * @param wxsId			//微信设置ID
 */
const getWxUserInfo = function(openId, wxsId) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		// 		if (checkVarIsEmpty(openId) ||
		// 			checkVarIsEmpty(wxsId)) {
		// 
		// 			reject("参数不能为空");
		// 			return promise;
		// 		}

		if (checkVarIsEmpty(openId)) {
			reject("微信id错误，请重新打开本页");
			return promise;
		}
		if (checkVarIsEmpty(wxsId)) {
			reject("微信状态码错误，请联系管理员");
			return promise;
		}

		var wxState = getState();
		var jsonParam = {
			"wxsid": wxsId,
			"state": wxState
		};

		//获取微信用户基本信息
		szblGet("/api/wechatusers/" +
			openId, jsonParam).then(function(dataJson) {

			if (dataJson.state != wxState) {

				reject("网络被劫持，获取用户信息失败！");
				return promise;
			}

			resolve(dataJson.data);
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 微信分享
 * @param wxTitle		//分享标题
 * @param wxDesc		//分享描述
 * @param wxLink		//分享链接
 * @param wxImgUrl		//分享图片地址
 * @param wxType		//分享类型
 * @param wxDataUrl		//分享数据链接，如果type是music或video，则要提供数据链接
 */
const wxShare = function(wxTitle, wxDesc, wxLink, wxImgUrl, wxType, wxDataUrl) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		// 		if (checkVarIsEmpty(wxTitle) ||
		// 			checkVarIsEmpty(wxLink) ||
		// 			checkVarIsEmpty(wxImgUrl)) {
		// 
		// 			reject("参数不能为空");
		// 			return promise;
		// 		}

		// 		if(checkVarIsEmpty(wxTitle)){
		// 			reject("分享标题不能为空");
		// 			return promise;
		// 		}
		// 		if(checkVarIsEmpty(wxLink)){
		// 			reject("分享链接不能为空");
		// 			return promise;
		// 		}
		// 		if(checkVarIsEmpty(wxImgUrl)){
		// 			reject("分享图片格式错误");
		// 			return promise;
		// 		}

		if (wxDesc == "" || wxDesc === undefined) {
			// wxDesc = "欢迎来到清溪商城"; //清溪商城配置
			wxDesc = "欢迎来到【海岛生活】商城"; //海岛生活配置
		}
		if (wxTitle != "" && wxTitle !== undefined && wxTitle.indexOf("【海岛生活") == -1 && wxTitle.indexOf("源自澄迈") == -1 &&
			wxTitle.indexOf("海口旅游扶贫商品") == -1) {
			wxTitle = "【海岛生活】" + wxTitle;
		}
		if (wxImgUrl == "" || wxImgUrl === undefined) {
			// wxImgUrl = "https://www.haidsh.com/img/yysc.png"; //清溪商城配置
			wxImgUrl = "https://www.haidsh.com/img/hdsh.png"; //海岛生活配置
		}

		//微信配置成功后的调用
		wx.ready(function() {

			//微信分享——隐藏一些菜单项
			wx.showOptionMenu();

			wx.hideMenuItems({
				menuList: [
					'menuItem:exposeArticle',
					'menuItem:share:qq',
					'menuItem:share:weiboApp',
					'menuItem:share:facebook',
					'menuItem:share:QZone',
					'menuItem:openWithQQBrowser',
					'menuItem:openWithSafari',
					'menuItem:copyUrl',
					'menuItem:delete',
					'menuItem:share:email',
					'menuItem:share:brand'
				]
			});

			//分享到朋友圈
			wx.onMenuShareTimeline({
				title: wxTitle, //分享标题
				link: wxLink, //分享链接
				imgUrl: wxImgUrl, //分享图标
				success: function() {

					resolve();
				},
				cancel: function() {

					reject("分享取消");
				}
			});

			//如果分享类型为music、video或link，不填默认为link
			if (checkVarIsEmpty(wxType)) {

				wxType = '';
				wxDataUrl = '';
			}

			//分享给朋友
			wx.onMenuShareAppMessage({
				title: wxTitle, //分享标题
				desc: wxDesc, //分享描述
				link: wxLink, //分享链接
				imgUrl: wxImgUrl, // 分享图标
				type: wxType, //分享类型,music、video或link，不填默认为link
				dataUrl: wxDataUrl, //如果type是music或video，则要提供数据链接，默认为空
				success: function() {

					resolve();
				},
				cancel: function() {

					reject("分享取消");
				}
			});
		});
	});

	return promise;
};

/**
 * 微信提现——企业付款至银行卡
 * @param userId	//当前用户的userId
 * @param token		//访问令牌
 * @param wxsId		//微信设置ID
 * @param orderId	//要支付的支付机构订单号，而不是业务订单表的订单号
 * @param trueName	//真实姓名
 * @param bankNo	//银行卡号
 * @param bankCode	//银行代码
 */
const wxPayToBank = function(userId, token, wxsId,
	orderId, trueName, bankNo, bankCode) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	let promise = new Promise(function(resolve, reject) {

		// 		if (checkVarIsEmpty(userId) ||
		// 			checkVarIsEmpty(token) ||
		// 			checkVarIsEmpty(orderId) ||
		// 			checkVarIsEmpty(wxsId)) {
		// 
		// 			reject("参数不能为空");
		// 			return promise;
		// 		}

		if (checkVarIsEmpty(userId) || checkVarIsEmpty(token)) {
			reject("登录状态已过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(orderId)) {
			reject("订单失效");
			return promise;
		}
		if (checkVarIsEmpty(wxsId)) {
			reject("微信状态码错误，请联系管理员");
			return promise;
		}
		if (checkVarIsEmpty(trueName) || checkVarIsEmpty(bankNo) || checkVarIsEmpty(bankCode)) {
			reject("银行卡信息不完整");
			return promise
		}

		let wxState = getState();

		//微信支付退款
		szblPost("/api/wechatpaytobank/" + orderId +
			"?u=" + userId +
			"&tk=" + token +
			"&state=" + wxState +
			"&wxsid=" + wxsId +
			"&tn=" + trueName +
			"&bn=" + bankNo +
			"&bc=" + bankCode, {}).then(function(dataJson) {

			if (dataJson.state != wxState) {

				reject("网络被劫持，支付失败！");
				return promise;
			}

			if (dataJson.data == "支付成功！") {

				resolve(dataJson.data);
			} else {

				reject(msg);
			}
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**
 * 微信提现——企业付款至零钱
 * @param userId	//当前用户的userId
 * @param token		//访问令牌
 * @param wxsId		//微信设置ID
 * @param orderId	//要支付的支付机构订单号，而不是业务订单表的订单号
 * @param trueName	//真实姓名
 * @param openId	//微信用户ID
 */
const wxPayToWallet = function(userId, token, wxsId,
	orderId, trueName, openId) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	let promise = Promise(function(resolve, reject) {

		// if(checkVarIsEmpty(userId)
		// 		|| checkVarIsEmpty(token)
		// 		|| checkVarIsEmpty(orderId)
		// 		|| checkVarIsEmpty(wxsId)
		// 		|| checkVarIsEmpty(trueName)
		// 		|| checkVarIsEmpty(openId)) {
		// 	
		// 	reject("参数不能为空");
		// 	return promise;
		// }

		if (checkVarIsEmpty(userId) || checkVarIsEmpty(token)) {
			reject("登录状态已过期，请重新登录");
			return promise;
		}
		if (checkVarIsEmpty(orderId)) {
			reject("订单失效");
			return promise;
		}
		if (checkVarIsEmpty(wxsId)) {
			reject("微信状态码错误，请联系管理员");
			return promise;
		}
		if (checkVarIsEmpty(trueName) || checkVarIsEmpty(openId)) {
			reject("银行卡信息不完整");
			return promise
		}

		let wxState = getState();

		//微信支付退款
		szblPost("/api/wechatpaytowallet/" + orderId +
			"?u=" + userId +
			"&tk=" + token +
			"&state=" + wxState +
			"&wxsid=" + wxsId +
			"&tn=" + trueName +
			"&opid=" + openId, {}).then(function(dataJson) {

			if (dataJson.state != wxState) {

				reject("网络被劫持，支付失败！");
				return promise;
			}

			if (dataJson.data == "支付成功！") {

				resolve(dataJson.data);
			} else {

				reject(msg);
			}
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};

/**************************************************************************************/

/**********************************阿里相关******************************************/

/**********************支付宝支付***********************/

/**
 * 支付宝-申请退款
 * @param userId		//当前用户的userId
 * @param token			//访问令牌
 * @param alisId		//支付阿伯设置ID
 * @param orderId		//要支付的支付机构订单号，而不是业务订单表的订单号
 */
const aliPayRefund = function(userId, token, alisId, orderId) {

	//es6中的promise对象，resolve代表成功的返回，reject表示错误或异常
	var promise = new Promise(function(resolve, reject) {

		if (checkVarIsEmpty(userId) ||
			checkVarIsEmpty(token) ||
			checkVarIsEmpty(orderId) ||
			checkVarIsEmpty(alisId)) {

			reject("参数不能为空");
			return promise;
		}

		var aliState = getState();

		//支付宝支付退款
		szblPut("/api/alipayrefund/" + orderId +
			"?u=" + userId +
			"&tk=" + token +
			"&state=" + aliState +
			"&alisid=" + alisId, {}).then(function(dataJson) {

			if (dataJson.state != aliState) {

				reject("网络被劫持，支付失败！");
				return promise;
			}

			if (dataJson.data == "ok") {

				resolve(dataJson.data);
			} else {

				reject(msg);
			}
		}).catch(function(msg) {

			reject(msg);
		});
	});

	return promise;
};
/**************************************************************************************/

/***
 * 记录党建操作积分
 * @param {Object} fid 操作编号
 */
const setPMIntegral = function(fid) {

	var state = getState();
	//alert(state);
	var userid = user_msg.userid;
	var token = user_msg.c_token;
	szblPost("/app/spmi?m=" + userid + "&fid=" + fid + "&tk=" + token + "&state=" + state, "").then(function(
		dataJson) {
		//alert("123"+state);
		if (dataJson.state != state) {

			reject("返回标识出错");
			return;
		}

	}).catch(function(msg) {
		console.log(msg);
	});
};

/**
 * 设置片区选择列表信息
 * @param city 		城市
 * @param province  省
 */
const setAreaList = function() {
	var state = getState();
	var userInfoStr = getUserInfo();
	var pjson_area = {
		"m": user_msg.userid,
		"tk": user_msg.token,
		"state": state,
		"kw": "",
		"wid": userInfoStr.wid,
		"city": userInfoStr.city,
		"province": userInfoStr.province,
	};
	//异步获取片区选择列表
	szblGet("/api/areas/getList", pjson_area).then(function(dataJson) {

		if (dataJson.state != state) {

			console.log("网络被劫持");
			return;
		}

		com_data.list_area = strResToJson(dataJson.data);
	}).catch(function(msg) {

		console.log(msg);
	});


};

/**
 * 设置应用（APP）选择列表信息
 * @param area 		片区
 * @param city 		城市
 * @param province  省
 */
const setAppList = function() {
	var state = getState();
	var userInfoStr = getUserInfo();
	var pjson_app = {
		"m": user_msg.userid,
		"tk": user_msg.token,
		"state": state,
		"kw": "",
		"wid": userInfoStr.wid,
		"area": userInfoStr.area,
		"city": userInfoStr.city,
		"province": userInfoStr.province,
	};
	//异步获取片区选择列表
	szblGet("/api/apps/getList", pjson_app).then(function(dataJson) {

		if (dataJson.state != state) {

			console.log("网络被劫持");
			return;
		}

		com_data.list_app = strResToJson(dataJson.data);
	}).catch(function(msg) {

		console.log(msg);
	});
};

/**
 * 设置组织选择列表信息
 * @param {Object} roleid 
 * 
 */
const setUnitList = function() {
	var state = getState();
	var userInfoStr = getUserInfo();
	var pjson_unit = {
		"m": user_msg.userid,
		"tk": user_msg.token,
		"state": state,
		"kw": "",
		"wid": userInfoStr.wid,
		"appid": userInfoStr.appid,
		"area": userInfoStr.area,
		"city": userInfoStr.city,
		"province": userInfoStr.province,
	};
	//异步获取片区选择列表
	szblGet("/api/units/getList", pjson_unit).then(function(dataJson) {

		if (dataJson.state != state) {

			console.log("网络被劫持");
			return;
		}

		com_data.list_unit = strResToJson(dataJson.data);
	}).catch(function(msg) {

		console.log(msg);
	});
};

/**
 * 设置该用户权重对应的APP 片区 村 组织信息
 * @param {Object} 
 * 
 */
const setUserSelectAreaInfo = function() {
	var userInfoStr = getUserInfo();

};

/**
 * 截取地区编码的数字，去除零位
 * @param {Object} 
 * 
 */
const getQueryAreaCode = function(areacode) {
	//alert("areacode" + areacode);
	var shengAreaCode = areacode.substring(0, 2);
	//86指的是全中国
	if (shengAreaCode == "86") {
		return "";
	}

	var shiAreaCode = areacode.substring(2, 4);
	//alert("shiAreaCode" + shiAreaCode);
	if (shiAreaCode == "00") {

		return shengAreaCode;
	}

	var quAreaCode = areacode.substring(4, 6);
	//alert("quAreaCode" + quAreaCode);
	if (quAreaCode == "00") {

		return shengAreaCode + shiAreaCode;
	}

	var xiangAreaCode = areacode.substring(6, 9);
	//alert("xiangAreaCode" + xiangAreaCode);
	if (null == xiangAreaCode || xiangAreaCode == "000" || xiangAreaCode == "") {
		return shengAreaCode + shiAreaCode + quAreaCode;
	}

	var cunAreaCode = areacode.substring(9, 12);
	if (null == cunAreaCode || cunAreaCode == "000" || cunAreaCode == "") {
		return shengAreaCode + shiAreaCode + quAreaCode + xiangAreaCode;
	} else {
		return cunAreaCode;
	}
};

/***********************************验证相关***************************************/
/**
 * 验证手机号
 * @param num 手机号码
 */
const verifyPhone = function(num) {

	return /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(num);
};

/**
 * 验证座机号
 * @param num 手机号码
 */
const verifySeat_machine = function(num) {

	return /^([0-9]{3,5}-)[0-9]{7,8}$/.test(num);
};

/**
 * 验证数字的合法性
 * @param num 数字
 */
const verifyNum = function(num) {

	return /^\d+/.test(num);
};

/**
 * 验证密码的合法性（字母 数字 下划线）
 * @param num 数字
 */
const verifyPasswork = function(param) {

	return /^[a-zA-Z0-9_]*$/.test(param);
};

/**
 * 验证非法字符
 * @param num 数字
 */
const verifyIllegalStr = function(param) {

	return /^(([^\^\.<>%&',;=?$"':#@!~\]\[{}\\/`\|\*])*)$/.test(param);
};
/*********************************************************************************/

/*************************************cxy*****************************************/

/**
 * 过滤微信分享的链接
 */
const linkFilter = function(link) {
	if (link.indexOf('code') != -1) {
		let linkArr = link.split('?')
		linkArr[1] = linkArr[1].substring(linkArr[1].indexOf('#'))
		link = linkArr[0] + linkArr[1]
	}

	return link
}

/**
 * 将查询回来的数据中的photo字段转成数组
 * @param {Object} obj 待处理的list
 */
const listPhotoProcess = function(obj) {
	obj.forEach(function(item) {
		item.photo = strResToJson(item.photo)
		for (let i = 0; i < item.photo.length; i++) {
			item.photo[i] = urlPrex + item.photo[i]
		}
	})
	return obj
}

/**
 * 求两个日期相差的天数
 * @param {String} date1 日期1(2006-12-18格式)
 * @param {String} date2 日期2(2006-12-18格式)
 */
const dateCal = function(date1, date2) {
	let dateSpan, tempDate, iDays
	date1 = Date.parse(date1);
	date2 = Date.parse(date2);
	dateSpan = date2 - date1;
	// dateSpan = Math.abs(dateSpan);
	iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
	return iDays
}

/*
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * roundtag:舍入参数，默认 "round" 四舍五入","ceil" 向上取,"floor"向下取
 * */
// const numberFormat = function(number, decimals, dec_point, thousands_sep,roundtag) {
const numberFormat = function(number, decimals, dec_point, roundtag) {

	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	roundtag = roundtag || "round"; //"ceil","floor","round"
	let n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		// sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		// sep = (typeof thousands_sep === 'undefined') ? '' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {

			let k = Math.pow(10, prec);
			console.log();

			return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
		};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	let re = /(-?\d+)(\d{3})/;
	// while (re.test(s[0])) {
	//     s[0] = s[0].replace(re, "$1" + sep + "$2");
	// }

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	// return parseFloat(s.join(dec));
	return s.join(dec);
}

/**
 * 终端调用的支付
 * @param {Object} u
 * @param {Object} tk
 * @param {Object} orderId
 * @param {Object} os
 */
const terminalWechatPay = function(u, tk, orderId, os) {
	szblGet("/api/wechatpayApp/" + orderId, {
		wxsid: this.$DEVELOPER.wxPayMarkAPP,
		u: u,
		tk: tk,
		state: getState()
	}).then(function(dataJson) {
		if (os == 'i') {
			// ios
			window.appsdk.iosWechatPay(JSON.parse(dataJson.data))
		} else if (os == 'a') {
			// android
			window.appsdk.androidWechatPay(JSON.parse(dataJson.data))
		}
	})
}

/**
 * 支付成功后增加销量，发送短信
 * @param {Object} mark 入口标识，0-从各详情页直接付款，1-从订单列表或订单详情付款
 * @param {Object} u 用户id
 * @param {Object} tk token
 * @param {Object} appid 开发者appid
 * @param {Object} orderId 业务订单id
 * @param {Object} phones 电话字符串，逗号隔开
 * @param {Object} cn_1 店铺名
 * @param {Object} cn_2 订单状态描述
 * @param {Object} cn_3 订单简介
 * @param {Object} length 数组的长度，用于购物车循环增加销量、发短信
 * @param {Object} i 计数器(批量下单付款时才会用到)
 */
const paySuccess = function(mark, u, tk, appid, orderId, phones, cn_1, cn_2, cn_3, length, i) {
	//调用增加销量接口
	szblPut("/api/sciorder/sales/" + orderId + "?m=" + u + "&tk=" + tk +
		"&state=" + getState()).then(dataJson => {
		//增加销量后通知商家
		szblPost("/api/sms/notice?m=" + u + "&tk=" + tk + "&state=" +
			getState(), {
				"phones": phones,
				"smsid": "1566462939231915455699",
				"appid": appid,
				"cn_1": cn_1,
				"cn_2": cn_2,
				"cn_3": cn_3,
				"cn_4": orderId
			}).then(res2 => {
			if (typeof i == "number") {
				i += 1
				if (i == length - 1) {
					uni.reLaunch({
						url: '/pages/tabBar/member/member'
					})
					return
				}
				return i
			} else {
				if (mark == 0) {
					//跳转至个人中心
					uni.reLaunch({
						url: '/pages/tabBar/member/member'
					})
				} else if (mark == 1) {
					//返回订单付款成功后的状态
					return 4
				}
			}
		}).catch(msg => {
			console.log(msg);
			uni.reLaunch({
				url: '/pages/tabBar/member/member'
			})
		})
	}).catch(function(msg) {
		console.log(msg)
		uni.hideToast();
		return;
	})
}

// 格式化时间戳
const dateFormat = function(time) {
	let Y = time.getFullYear()
	let M = time.getMonth() + 1
	let D = time.getDate()
	let h = time.getHours()
	let m = time.getMinutes()
	let s = time.getSeconds()
	if (M < 10) {
		M = '0' + M
	}
	if (D < 10) {
		D = '0' + D
	}
	if (h < 10) {
		h = '0' + h
	}
	if (m < 10) {
		m = '0' + m
	}
	if (s < 10) {
		s = '0' + s
	}
	return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
}


// 陈开伟
/**
	* @param {Number} delay 轮询时间, 
	* @param {Object} loginFlag 登录标识, 
	* @param {function} callback 需要的回调函数
	* 备注: 该函数应调用在页面中的 onLoad生命周期中
*/
let pageLoadCheckLogin = (delay = 500, loginFlag, callback) => {
	let timer = setInterval(() => {
		if(loginFlag === true && user_msg.userid === null) {
			console.log('继续轮询查找')
		} else if (loginFlag === true && user_msg.userid !== null) {
			clearInterval(timer)
			callback()
		} else if (loginFlag === false) {
			clearInterval(timer)
			console.log('没有登录，跳转至登录页面')
			uni.navigateTo({
				url: '/pages/component/login/login'
			})
		}
	}, delay)
}

let upLoadPhoto = (uploadObj, u, tk, state) => {
	return new Promise((resolve, reject) => {
		szblPost(
			"/api/media/img" +
			"?u=" + u +
			"&tk=" + tk +
			"&state=" + state, uploadObj
		).then(res => {
			resolve(strResToJson(res.data))
		}).catch(err => {
			reject(err)
		})
	})
} 

// 临时变量
let tempVar = {}

let backPage = () => {
	uni.navigateBack({
	    delta: 1,
	    animationType: 'pop-out',
	    animationDuration: 200
	});
} 



export default {
	pageLoadCheckLogin,
	upLoadPhoto,
	tempVar,
	
	urlPrex,
	// appid,
	authUrl,
	szblGet,
	szblGetSync,
	szblPost,
	szblPut,
	szblDel,
	jsonResToStr,
	strResToJson,
	setUserInfo,
	getUserInfo,
	setCUserInfo,
	getCUserInfo,
	setTokenInfo,
	getTokenInfo,
	setJsonLocalInfo,
	getJsonLocalInfo,
	setLocalInfo,
	getLocalInfo,
	setopTimeInfo,
	getopTimeInfo,
	switchrole,
	getGLURQueryParam,
	getUserRoleMenu,
	setSysRoleRpUnit,
	getRoleFlag,
	// addAccount,
	// regAndForgetOrModifyPwd,
	registry,
	loginByPhoneCode,
	autoLogin,
	normalLogin,
	getTokenFromLogin,
	logout,
	getTokenFromAppIdAndSecret,
	getRefreshToken,
	ajaxAuthKeyPost,
	getAuthKey,
	getAuthEncryptStr,
	getPWDEncode,
	getRSAEncryptStr,
	getId,
	getState,
	checkJson,
	checkVarIsEmpty,
	refreshAssign,
	getQueryValue,
	setPMIntegral,
	setAreaList,
	setAppList,
	setUnitList,
	setUserSelectAreaInfo,
	getQueryAreaCode,
	verifyPhone,
	verifySeat_machine,
	verifyNum,
	verifyPasswork,
	verifyIllegalStr,
	getWxPay,
	getWxxcxUserOpenId,
	getWxxcxPay,

	getWxSign,
	getWxPayNative,
	wxPayRefund,
	getWxUserOpenId,
	getWxUserInfo,
	wxShare,
	wxPayToBank,
	wxPayToWallet,

	aliPayRefund,

	linkFilter,
	listPhotoProcess,
	// list_area,
	dateCal,
	numberFormat,
	terminalWechatPay,
	paySuccess,
	dateFormat
}
