/**
 * Created by Dante on 15/7/25.
 */
if(localStorage.getItem('userId') === null) {
	$.get("http://120.25.151.196/footprint/user/create.php", function (data) {
		var userInfo = JSON.parse(data)
		localStorage.setItem('userId', userInfo.userId)
		localStorage.setItem('token', userInfo.token)
	})
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status != 'complete')
		return;
	chrome.tabs.executeScript(tabId, {
		code: 'timerStart()'
	});
});

chrome.tabs.onRemoved.addListener(function(tabId, changeInfo, tab) {
	chrome.tabs.executeScript(tabId, {
		code: 'share()'
	});
});