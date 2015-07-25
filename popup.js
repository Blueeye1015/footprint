$(function() {
	chrome.tabs.executeScript(
		{code:"var x = 10; x + 1"},
		function(results) {
			console.log(results[0])
		}
	)
	console.log(location.href)
	localStorage.setItem('print', '-.-!')
	$.get("http://www.zhihu.com", function (data) {
		console.log(data)
	})
})