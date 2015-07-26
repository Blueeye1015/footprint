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

if(localStorage.getItem('whiteList') === null) {
	localStorage.setItem('whiteList', JSON.stringify(config.whiteList))
	localStorage.setItem('threshold', config.threshold)
}

function share(time) {
	if(isInWhileList(localStorage.getItem('currentUrl'))) {
		var params = {
			url: localStorage.getItem('currentUrl'),
			title: localStorage.getItem('currentTitle'),
			token: localStorage.getItem('token'),
			initiative: false,
			time: time
		}
		var url = 'http://120.25.151.196/footprint/footprint/logger.php' + '?' + $.param(params)
		$.get(url, function (data) {
			cleanInfo() //分享成功后要清理数据
			console.log(data)
		})
	} else {
		console.warn("Not in White List...")
		cleanInfo()
		return
	}
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
	for(var key in config.whiteList) {
		if(url.indexOf(config.whiteList[key]) != -1) {
			result = true
		}
	}
	return result
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(checkInfo()) {
		var time = Date.parse(new Date()) - localStorage.getItem('startTime')
		if(time > config.threshold && checkInfo()) {
			share(time)
		}
	}
	localStorage.setItem('startTime', Date.parse(new Date()))
	localStorage.setItem('currentUrl', tab.url)
	localStorage.setItem('currentTitle', tab.title)
})

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
	chrome.tabs.get(tabId, function (tab) {
		localStorage.setItem('startTime', Date.parse(new Date()))
		localStorage.setItem('currentUrl', tab.url)
		localStorage.setItem('currentTitle', tab.title)
	})
})

chrome.tabs.onRemoved.addListener(function(tabId, changeInfo, tab) {
	var time = Date.parse(new Date()) - localStorage.getItem('startTime')
	if(time > config.threshold && checkInfo()) {
		share(time)
	}
});