

var auth = ""
var client_id = ""


console.log(Date(localStorage.token_expires))
if (localStorage.token_expires && new Date().getTime() < new Date(localStorage.token_expires).getTime())
{
	console.log("already authd")
	auth = localStorage.auth;
	client_id = localStorage.client_id
} else
{
	console.log("need to auth")
	window.open('/auth/index.html', '_self')
	// auth = authorize()

}

auth = localStorage.auth


viewPlaylists()



async function get(url, h, b)
{
	if (!url)
	{
		Error("No URL given - get()")
	}
	if (!h)
	{
		h = {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": auth
		}
	}
	return fetch(url, {
		method: "GET",
		headers: h,
		body: b
	}).then(response =>
	{
		if (!response.ok)
		{
			response.json()
				.then(error_json =>
				{
					throw (error_json.error.status + " " + error_json.error.message)
				})
				.catch(error => { throw error });

			// throw Error('Data received - Network response NOT OK');
		}
		return response.json()
			.then(data =>
			{
				// console.log(data)
				return data
			})
			.catch(error => { throw error });
	}).catch(error => Error(error));
}


async function post(url, h, b)
{
	if (!url)
	{
		Error("No URL given - post()")
	}
	if (!h)
	{
		h = {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": auth
		}
	}
	fetch(url, {
		method: "POST",
		headers: h,
		body: b
	}).then(response =>
	{
		if (!response.ok)
		{
			response.json()
				.then(error_json =>
				{
					throw (error_json.error.status + " " + error_json.error.message)
				})
				.catch(error => { throw error });
			// throw Error('Data received - Network response NOT OK');
		}

	}).catch(error => Error(error));
}

async function put(url, h, b)
{
	if (!url)
	{
		Error("No URL given - put()")
	}
	if (!h)
	{
		h = {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": auth
		}
	}


	fetch(url, {
		method: "PUT",
		headers: h,
		body: b
	}).then(response =>
	{
		if (!response.ok)
		{
			response.json()
				.then(error_json =>
				{
					throw Error(error_json.error.status + " " + error_json.error.message)
				})
				.catch(error => { throw error });
			// throw Error('Data received - Network response NOT OK');
		}

	}).catch(error => Error(error));
}

function next()
{
	let url = "https://api.spotify.com/v1/me/player/next"
	post(url, null, null)

}


function pause()
{
	let url = "https://api.spotify.com/v1/me/player/pause"
	put(url, null, null)
	html = ""
	html += '<button type="button" class="btn" onclick="play()">'
	html += '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
	html += '<path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg></button>'


	document.getElementsByClassName("play_toggle")[0].innerHTML = html


}


function play()
{
	let url = "https://api.spotify.com/v1/me/player/play"
	put(url, null, null)
	html = ""
	html += '<button type="button" class="btn" onclick="pause()">'
	html += '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
	html += '<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/> </svg></button>'
	document.getElementsByClassName("play_toggle")[0].innerHTML = html

}


async function getPlaylists()
{
	let url = "	https://api.spotify.com/v1/me"
	let user = await get(url, null, null)

	document.getElementById("auth_button").classList.add('btn-outline-success')
	document.getElementById("auth_button").classList.remove('btn-primary')
	document.getElementById("auth_button").innerHTML = user.display_name



	url = "https://api.spotify.com/v1/me/playlists"
	let playlists = await get(url, null, null)
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

		let pl = await get(url, null, null)
		selectedPlaylists.push(pl)
		document.getElementById('pl-' + plid).classList.add('playlist_card_active')
		document.getElementById('pl-' + plid).classList.remove('playlist_card_inactive')

	}
	viewSongs()
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

}

function viewSongs()
{
	getSongs()
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
	url += '?uri=spotify%3Atrack%3A' + id
	post(url, null, null)
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


async function clearQueue()
{
	console.log("clearing")
}


async function addToQueue()
{
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

	let playback = await get(url, null, null)
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