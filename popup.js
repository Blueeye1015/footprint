'use strict'
$(function () {
	if(localStorage.getItem('isLogin') === 'true') {
		$.get('http://120.25.151.196/footprint/user/myfootprint.php?token=' + localStorage.getItem('token') + '&waiting=true', function (data) {
			$.each(data.data, function () {
				var item = '<div><button id="' + this.foot.id + '">删除</button><a href="' + this.foot.url +'">' + this.foot.title + '</a></div>'
				$('.recent-list').append(item)
				console.log(this)
			})
		})
		$('#userid').append(localStorage.getItem('userName'))
		$('.user').remove()
	} else {
		$('#userid').append(localStorage.getItem('userId'))
	}

	$('.recent-list').on('click', function (event) {
		console.log('http://120.25.151.196/footprint/footprint/remove.php?token=' + localStorage.getItem('token') + '&footprintId=' + event.target.id)
		$.get('http://120.25.151.196/footprint/footprint/remove.php?token=' + localStorage.getItem('token') + '&footprintId=' + event.target.id, function (data) {
			console.log(data)
		})
	})

	$('#share').on('click', function () {
		chrome.tabs.getCurrent(function (tab) {
			var params = {
				url: localStorage.getItem('currentUrl'),
				title: localStorage.getItem('currentTitle'),
				token: localStorage.getItem('token'),
				initiative: true,
				time: 0
			}
			var url = 'http://120.25.151.196/footprint/footprint/logger.php' + '?' + $.param(params)
			$.get(url, function (data) {
				console.log(data)
				localStorage.removeItem('startTime')
				localStorage.removeItem('currentUrl')
				localStorage.removeItem('currentTitle')
				location.reload()
			})
		})
	})

	$('.register').submit(function () {
		var userName = $('#userName').val()
		var password = $.md5($('#password').val())
		var BindUserId = $('#BindUserId').val()
		$.ajax({
			url: 'http://120.25.151.196/footprint/user/register.php',
			data: {userName: userName, password: password, BindUserId: BindUserId},
			type: 'POST',
			dataType: 'JSON',
			success: function (data) {
				if(data.ok === 1) {
					localStorage.setItem('userName', userName)
					localStorage.setItem('token', data.data.token)
					localStorage.setItem('isLogin', true)
					location.href = 'popup.html'
				} else {
					$('.error-msg').append(data.error)
				}
			},
			error: function (e) {
				console.error(e)
			}
		})
		return false
	})

	$('.login').submit(function () {
		var userName = $('#userName').val()
		var password = $.md5($('#password').val())
		$.ajax({
			url: 'http://120.25.151.196/footprint/user/login.php',
			data: {userName: userName, password: password},
			type: 'POST',
			dataType: 'JSON',
			success: function (data) {
				console.log(data)
				if(data.ok === 1) {
					localStorage.setItem('userName', userName)
					localStorage.setItem('userId', data.data.userId)
					localStorage.setItem('token', data.data.token)
					localStorage.setItem('isLogin', true)
					location.href = 'popup.html'
				} else {
					$('.error-msg').empty().append(data.error)
				}
			},
			error: function (e) {
				console.error(e)
			}
		})
		return false
	})
})