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
		await new Promise(r => setTimeout(r, 1000));
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
		location.reload()
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
	let rs = await response
	if (rs)
	{
		return rs.json()
	}
	return null
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
}

async function put(url, h, b)
{
	let response = await fetch(url, {
		method: "PUT",
		headers: h,
		body: b
	})
	await response
	// let rs = await response
	// if (rs) {
	// 	return rs.json()
	// }
	// return  null
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
	html = ""
	html += '<button type="button" class="btn" onclick="play()">'
	html += '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
	html += '<path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg></button>'


	document.getElementsByClassName("play_toggle")[0].innerHTML = html


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
	html = ""
	html += '<button type="button" class="btn" onclick="pause()">'
	html += '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
	html += '<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/> </svg></button>'
	document.getElementsByClassName("play_toggle")[0].innerHTML = html

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
	document.getElementById("auth_button").innerHTML = user.display_name



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
		html += '<a class="card card-block playlist_card playlist_card_inactive col-4 col-sm-4 col-md-3 col-lg-2 col-xxl-1 text-truncate" id="pl-' + p.id + '" href="javascript:plChecked(\'' + p.id + '\')">'
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
		// html += '<a class="list-group-item list-group-item-action" id="sn-' + song.track.id + '" href="javascript:snChecked(\'' + song.track.id + '\')">'

		html += '<a class="list-group-item list-group-item-action" '
		if (song.track.is_local == false)
		{
			html += 'id="sn-' + song.track.id + ' " href="javascript:snChecked(\'' + song.track.id + '\')">'
		} else
		{
			html += 'id="sn-' + song.track.id + '" href=#">'

		}
		html += song.track.name
		html += '</a>'
	}
	document.getElementById('selected_song_list').innerHTML = html;

}


function snChecked(id)
{
	console.log(id)
	let url = "https://api.spotify.com/v1/me/player/queue"
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth,
	}
	b = null
	url += '?uri=spotify%3Atrack%3A' + id
	post(url, h, b)
}


function shuffle()
{
	console.log("shuffling")
	for (let i = selectedSongs.length - 1; i >= 0; i--)
	{
		const j = Math.floor(Math.random() * (i + 1));
		const temp = selectedSongs[i];
		selectedSongs[i] = selectedSongs[j];
		selectedSongs[j] = temp;
	}
	console.log(selectedSongs)
	viewSongs()
	console.log("done shuffling")
}


async function clearQueue() {
	console.log("clearing")
}


async function addToQueue() {
	for (let i = selectedSongs.length - 1; i >= 0; i--)
	{
		if (selectedSongs[i].track.is_local == false)
			snChecked(selectedSongs[i].track.id)
	}

}


async function updateFooter()
{
	now = Date.now()
	console.log("now playing request")
	let url = "https://api.spotify.com/v1/me/player/currently-playing"
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth
	}

	let b = null
	let playback = await get(url, h, b)
	if (playback == null)
	{
		return
	}
	if (playback.is_playing == false)
	{
		return
	}
	// console.log(playback)
	// lastTimestamp = playback.timestamp
	// lastDuration = playback.item.duration_ms
	document.getElementById("now_playing_name").innerHTML = playback.item.name
	// width = (now - lastTimestamp) / lastDuration * 100
	width = playback.progress_ms / playback.item.duration_ms * 100
	document.getElementsByClassName('progress-bar').item(0).setAttribute('style', 'width: ' + width + '%')


}

setInterval(function ()
{
	updateFooter()
}, 5000);