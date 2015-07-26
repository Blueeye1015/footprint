'use strict'
$(function () {
	if(localStorage.getItem('isLogin') === 'true') {
		$('#userid').append(localStorage.getItem('userName'))
		$('.user').remove()
	} else {
		$('#userid').append(localStorage.getItem('userId'))
	}

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
					$('.error-msg').append(data.error)
				}
			},
			error: function (e) {
				console.error(e)
			}
		})
		return false
	})
})