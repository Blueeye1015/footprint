/**
 * Created by Dante on 2015.07.26.
 */
var whiteList = JSON.parse(localStorage.getItem('whiteList'))
var threshold = localStorage.getItem('threshold')

$('.threshold').append(threshold)
for(var key in whiteList) {
	$('.whiteList').append('<li id=' + key +'>' + whiteList[key] + '</li>')
}