var auth = ""


var client_id = secrets_client_id
var redirect_uri = secrets_redirect_uri


console.log(Date(localStorage.token_expires))
if (localStorage.token_expires && new Date().getTime() < new Date(localStorage.token_expires).getTime())
{
	console.log("already authd")
	auth = localStorage.auth;
} else
{
	console.log("need to auth")
	auth = authorize()

}




viewPlaylists()
updateFooter()


async function authorize()
{
	if (auth === "")
	{

		let scope = "user-modify-playback-state user-read-playback-state playlist-read-private playlist-read-collaborative streaming user-read-email"

		let url = 'https://accounts.spotify.com/authorize';
		url += '?response_type=token';
		url += '&client_id=' + encodeURIComponent(client_id);
		url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
		url += '&scope=' + encodeURIComponent(scope);
		popup = window.open(url, "mywindow", "width=350,height=250");
		await new Promise(r => setTimeout(r, 2000));
		// console.log(popup.location.href)
		let auth_token = popup.location.href.split("=")[1].split("&")[0];
		// console.log(auth)
		let token_type = popup.location.href.split('=')[2].split("&")[0];
		// console.log(token_type)
		auth = token_type + " " + auth_token
		console.log(auth)
		let now = new Date()
		now.setSeconds(now.getSeconds() + 3600)
		localStorage.setItem("auth", auth)
		localStorage.setItem("token_expires", now)
	} else
	{
		console.log("auth exists")
	}

	return auth
}

async function get(url, h, b)
{
	let response = await fetch(url, {
		method: "GET",
		headers: h,
		body: b
	})
	let js = await response.json()
	return js
	// .then((response) => response.json())
	// .then((responseJson) =>
	// {
	// 	console.log(responseJson);
	// 	// console.log(JSON.stringify(responseJson))
	// 	return responseJson
	// })
}

async function post(url, h, b)
{

	let response = await fetch(url, {
		method: "POST",
		headers: h,
		body: b
	})
	let js = await response.json
	return js
}

async function put(url, h, b)
{
	let response = await fetch(url, {
		method: "PUT",
		headers: h,
		body: b
	})
	let js = await response.json
	return js
}

function next()
{
	let url = "https://api.spotify.com/v1/me/player/next"
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth
	}

	let b = null
	post(url, h, b)

}


function pause()
{
	let url = "https://api.spotify.com/v1/me/player/pause"
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth
	}

	let b = null
	put(url, h, b)

}


function play()
{
	let url = "https://api.spotify.com/v1/me/player/play"
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth
	}

	let b = null
	put(url, h, b)

}


function playerCommand(str)
{
	let url = "https://api.spotify.com/v1/me/player/" + str
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth
	}

	let b = null
	post(url, h, b)
}

async function getPlaylists()
{
	let url = "	https://api.spotify.com/v1/me"
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth
	}

	let b = null
	let user = await get(url, h, b)
	document.getElementById("auth_button").classList.add('btn-outline-success')
	document.getElementById("auth_button").classList.remove('btn-primary')
	document.getElementById("auth_button").innerHTML =  user.display_name



	url = "https://api.spotify.com/v1/me/playlists"
	let playlists = await get(url, h, b)
	// console.log(playlists)
	let items = playlists.items
	// console.log(items)
	// console.log(JSON.stringify(items))
	return items
}

async function viewPlaylists()
{
	let playlists = await getPlaylists()
	// console.log(playlists)
	let html = ""
	for (p of playlists)
	{
		html += '<a class="card card-block playlist_card playlist_card_inactive col-2" id="pl-' + p.id + '" href="javascript:plChecked(\'' + p.id + '\')">'
		// html += '<div class="card" id="playlist_cards">'
		html += '<img src="' + p.images[0].url + '" class="card-img-top border-0" alt="...">'
		html += '<div class="card-body">'
		html += '<h5 class="card-title">' + p.name + '</h5>'
		html += '<p class="card-text"><span class="badge badge-pill badge-secondary">' + p.tracks.total + '</span></p>'
		html += '</div>'
		// html += '</div>'
		html += '</a>'
	}
	document.getElementById('playlist_list').innerHTML = html;
}

var selectedPlaylists = []
var selectedSongs = []

async function plChecked(plid)
{


	if (document.getElementById('pl-' + plid).classList.contains('playlist_card_active'))
	{
		document.getElementById('pl-' + plid).classList.remove('playlist_card_active')
		document.getElementById('pl-' + plid).classList.add('playlist_card_inactive')
		selectedPlaylists = selectedPlaylists.filter(e => e.id != plid)
	} else
	{
		let url = "https://api.spotify.com/v1/playlists/" + plid
		let h = {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": auth
		}
		let b = null
		let pl = await get(url, h, b)
		selectedPlaylists.push(pl)
		document.getElementById('pl-' + plid).classList.add('playlist_card_active')
		document.getElementById('pl-' + plid).classList.remove('playlist_card_inactive')

	}
	getSongs()
}


async function getSongs()
{
	console.log("getSongs")
	selectedSongs = []
	for (pl of selectedPlaylists)
	{
		for (song of pl.tracks.items)
		{
			selectedSongs.push(song)
		}
	}

	viewSongs()
}

function viewSongs()
{
	document.getElementById('selected_song_list').innerHTML = "";
	html = ""
	for (song of selectedSongs)
	{
		html += '<a class="list-group-item list-group-item-action" id="sn-' + song.track.id + '" href="javascript:snChecked(\'' + song.track.id + '\')">'
		html += song.track.name
		html += '</a>'
	}
	document.getElementById('selected_song_list').innerHTML = html;

}

function shuffle()
{
	console.log("shuffling")
	for (var i = selectedSongs.length - 1; i > 0; i--)
	{
		var j = Math.floor(Math.random() * (i + 1));
		var temp = selectedSongs[i];
		selectedSongs[i] = selectedSongs[j];
		selectedSongs[j] = temp;
	}
	console.log(selectedSongs)
	viewSongs()
	console.log("done shuffling")
}

async function updateFooter() {
	let url = "https://api.spotify.com/v1/me/player"
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth
	}

	let b = null
	let playback = await get(url, h, b)

	// document.getElementsByClassName('progress-bar').att




}

setInterval(function() {
	updateFooter()
},10000);