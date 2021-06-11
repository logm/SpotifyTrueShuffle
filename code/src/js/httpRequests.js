export async function get(url)
{
	if (!url)
	{
		throw Error("No URL given")
	}
	let h = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": localStorage.auth
	}
	return fetch(url, { method: "GET", headers: h }).then(handleResponse)


}


export async function post(url, h, b)
{
	if (!url)
	{
		throw Error("No URL given")
	}
	if (!h)
	{
		h = {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": localStorage.auth
		}
	}
	return fetch(url, { method: "POST", headers: h, body: b }).then(handleResponse)
}

export async function put(url, h, b)
{
	if (!url)
	{
		throw Error("No URL given")
	}
	if (!h)
	{
		h = {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": localStorage.auth
		}
	}
	return fetch(url, { method: "PUT", headers: h, body: b }).then(handleResponse)
}


function handleResponse(response)
{
	return response.text().then(text =>
	{
		const data = text && JSON.parse(text)

		if (!response.ok)
		{
			const error = (data && data.error.message) || response.statusText
			return Promise.reject(error)
		}

		return data
	})
}

export function spotifyExceptions(exception)
{
	console.log("spotifyExceptions")
	console.log(exception)

	// Uncaught API rate limit exceeded



	if (exception === "Player command failed: No active device found")
	{
		console.log("player not found")
		//do a popup to prompt user for device selection
	} else
	{
		console.log("uncaught exception" + exception)
		throw exception
	}

}