var auth = ""


var client_id = secrets_client_id
var redirect_uri = secrets_redirect_uri


console.log(Date(localStorage.token_expires))
if (localStorage.token_expires && new Date().getTime() < new Date(localStorage.token_expires).getTime())
{
	console.log("already authd")
	auth = localStorage.auth;
	document.getElementById("auth_button").classList.add('btn-success')
} else
{
	console.log("need to auth")
	authorize()

}



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
	document.getElementById("auth_button").classList.add('btn-success')
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
	let url = "https://api.spotify.com/v1/me/playlists"
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": auth
	}

	let b = null
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

	for (p in playlists)
	{
		html += '<div class="form-check">	<input class="form-check-input" type="checkbox" value="" id="defaultCheck1" onclick="plChecked(\'' + playlists[p].id + '\')">	<label class="form-check-label" for="defaultCheck1">'
		html += playlists[p].name
		// console.log(playlists[p])
		html += "		</label>		</div>"
	}
	document.getElementById('playlist_list').innerHTML = html;
}

var selectedPlaylists = []
var selectedSongs = []

function plChecked(pl)
{
	// if (document.getElementById('defaultCheck1').checked) {
	selectedPlaylists.push(pl)
	// console.log(selectedPlaylists)

	// }
	// console.log(pl)
}

function viewSelected()
{
	let html = ""
	// console.log(selectedPlaylists)
	for (p in selectedPlaylists)
	{
		html += '<div class="form-check">	<input class="form-check-input" type="checkbox" value="" id="defaultCheck1" onclick="plChecked(\'' + p + '\')">	<label class="form-check-label" for="defaultCheck1">'
		html += p
		// console.log(playlists[p])
		html += "		</label>		</div>"
	}
	document.getElementById('selected_playlist_list').innerHTML = html;
}

async function getSongs()
{
	console.log("getSongs")
	for (i in selectedPlaylists)
	{
		// console.log(selectedPlaylists[i])
		let h = {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": auth
		}

		let b = null
		let tracks = await get('https://api.spotify.com/v1/playlists/' + selectedPlaylists[i] + '/tracks', h, b)
		console.log(tracks)
		for (j in tracks.items)
		{
			// console.log(tracks.items[j].track.id)
			selectedSongs.push(tracks.items[j].track.id)
		}
	}
	console.log(selectedSongs)
}


// function getAccess() {
// 	let url = "https://accounts.spotify.com/authorize"

// 	fetch(url, {
// 			method: "GET",
// 			headers: {
// 				"Accept": "application/json",
// 				"Content-Type": "application/json",
// 				"Authorization": auth
// 			}
// 			body: {
// 				"grant_type":
// 			}
// 	})
// 	.then((response) => response.json())
// 	.then((responseJson) => {
// 		console.log(responseJson);
// 		console.log(JSON.stringify(responseJson))
// 	})
// };