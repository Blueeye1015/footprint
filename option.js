/**
 * Created by Dante on 2015.07.26.
 */
var setting = localStorage.getItem('setting')

$('#setting').val(setting)

$('#save').on('click', function () {
	localStorage.setItem('setting', $('#setting').val())
	location.reload()
})
$('#update').on('click', function () {
	var regular =localStorage.getItem('setting')
	$.ajax({
		url: 'http://120.25.151.196/footprint/regular/upload.php',
		data: {data: regular, token: localStorage.getItem('token')},
		type: 'POST',
		dataType: 'JSON',
		success: function (data, status) {
			console.log(data)
		},
		error: function (error) {
			console.log(error)
		}
	})
})