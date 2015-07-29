'use strict'
$(function () {
	if(localStorage.getItem('isLogin') === 'true') {
		$('#userid').append(localStorage.getItem('userName'))
		$('.user').remove()
	} else {
		$('#userid').append(localStorage.getItem('userId'))
	}

	if(localStorage.getItem('userId') != null) {
		$.get('http://120.25.151.196/footprint/user/myfootprint.php?token=' + localStorage.getItem('token') + '&waiting=true', function (data) {
			$.each(data.data, function () {
				var item = '<div class="item"><input id="' + this.foot.id + '" type="image" class="DeleteButton" src="delete.png" /><a class="NormalLink" href="' + this.foot.url +'">' + this.foot.title + '</a></div>'
				$('.recent-list').append(item)
			})
		})
	}

	$('.recent-list').on('click', function (event) {
		console.log('http://120.25.151.196/footprint/footprint/remove.php?token=' + localStorage.getItem('token') + '&footprintId=' + event.target.id)
		$.get('http://120.25.151.196/footprint/footprint/remove.php?token=' + localStorage.getItem('token') + '&footprintId=' + event.target.id, function (data) {
			location.reload()
		})
	})

	$('#share').on('click', function () {
		$('#share').hide()
		$('#sharing').show()
		chrome.tabs.getSelected(null, function (tab) {
			var params = {
				url: tab.url,
				title: tab.title,
				token: localStorage.getItem('token'),
				initiative: true,
				time: 0
			}
			$.get('http://120.25.151.196/footprint/footprint/logger.php?' + $.param(params), function (data) {
				console.log('http://120.25.151.196/footprint/footprint/logger.php?'+$.param(params))
				localStorage.removeItem('startTime')
				localStorage.removeItem('currentUrl')
				localStorage.removeItem('currentTitle')
				$('#share').show()
				$('#sharing').hide()
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
					$('.error-msg').empty().append(data.error)
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