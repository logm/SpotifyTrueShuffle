var redirect_uri = "http://localhost:3000/redirect"


async function authorize()
{
	var client_id = document.getElementById("client_id_form").value
	console.log(client_id)
	localStorage.setItem("client_id", client_id)
	let scope = "user-modify-playback-state user-read-playback-state playlist-read-private playlist-read-collaborative streaming user-read-email"

	let url = 'https://accounts.spotify.com/authorize';
	url += '?response_type=token';
	url += '&client_id=' + encodeURIComponent(client_id);
	url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
	url += '&scope=' + encodeURIComponent(scope);
	popup = window.open(url, "width=350,height=250");
	// popup = window.open(url);
	await new Promise(r => setTimeout(r, 2000));
	console.log(popup.location.href)
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
	// location.reload()
	window.open('../index.html', '_self')


}
