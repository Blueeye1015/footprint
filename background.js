/**
 * Created by Dante on 15/7/25.
 */
if(localStorage.getItem('userId') === null) {
	$.get("http://120.25.151.196/footprint/user/create.php", function (data) {
		var userInfo = JSON.parse(data)
		if(userInfo.ok === 1) {
			localStorage.setItem('userId', userInfo.data.userId)
			localStorage.setItem('token', userInfo.data.token)
		} else {
			console.warn('API error!')
		}
	})
}

if(localStorage.getItem('setting') === null) {
	$.get("http://120.25.151.196/footprint/regular/list.php?token=11223", function (data) {
		localStorage.setItem('setting', JSON.stringify(data.data))
	})
}

var whiteList = JSON.parse(localStorage.getItem('setting'));

function share() {
	var time = Date.parse(new Date()) - localStorage.getItem('startTime')
	var params = {
		url: localStorage.getItem('currentUrl'),
		title: localStorage.getItem('currentTitle'),
		token: localStorage.getItem('token'),
		initiative: false,
		time: time
	}
	var url = 'http://120.25.151.196/footprint/footprint/logger.php' + '?' + $.param(params)
	$.get(url, function (data) {
		console.log(data)
		cleanInfo() //分享成功后要清理数据
	})
}

function checkInfo() { // 检查LocalStorage
	if(localStorage.getItem('startTime') != null
	&& localStorage.getItem('currentUrl') != null
	&& localStorage.getItem('currentTitle') != null) {
		return true
	} else {
		return false
	}
}

function cleanInfo() { //清理LocalStorage数据
	localStorage.removeItem('startTime')
	localStorage.removeItem('currentUrl')
	localStorage.removeItem('currentTitle')
}

function isInWhileList(url) {  //白名单检测
	var result = false
	var time = Date.parse(new Date()) - localStorage.getItem('startTime')
	for(var key in whiteList) {
		if(url.indexOf(whiteList[key].host) != -1 && time > url.indexOf(whiteList[key].threshold)) {
			result = true
		}
	}
	return result
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == 'complete' && localStorage.getItem('currentTitle') != '') {
		if(checkInfo() && isInWhileList(localStorage.getItem('currentUrl'))) {
			share()
		}
		localStorage.setItem('startTime', Date.parse(new Date()))
		localStorage.setItem('currentUrl', tab.url)
		localStorage.setItem('currentTitle', tab.title)
	}
})

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
	chrome.tabs.get(tabId, function (tab) {
		localStorage.setItem('startTime', Date.parse(new Date()))
		localStorage.setItem('currentUrl', tab.url)
		localStorage.setItem('currentTitle', tab.title)
	})
})

chrome.tabs.onRemoved.addListener(function(tabId, changeInfo, tab) {
	if(checkInfo() && isInWhileList(localStorage.getItem('currentUrl'))) {
		share()
	}
});