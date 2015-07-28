/**
 * Created by Dante on 2015.07.26.
 */
var setting = localStorage.getItem('setting')

$('#setting').val(setting)

$('#save').on('click', function () {
	localStorage.setItem('setting', $('#setting').val())
	location.reload()
})