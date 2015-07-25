/**
 * Created by Dante on 15/7/25.
 */
var toShare = false
var startAt;

function setFlag() {
	toShare = true;
	startAt = Date.parse(new Date())
	console.log("This page is going to be shared...")
}

function share() {
	if(toShare) {
		var params = {
			url: location.href,
			title: $('title').text(),
			token: 'dsfsdf',
			initiative: false,
			time: Date.parse(new Date()) - startAt + 3000
		}
		var url = 'http://120.25.151.196/footprint/footprint/logger.php' + '?' + $.param(params)
		$.get(url, function (data) {
			console.log(data)
		})
	} else {
		return
	}
}

function timerStart() {
	setTimeout(setFlag, 3000)
}
