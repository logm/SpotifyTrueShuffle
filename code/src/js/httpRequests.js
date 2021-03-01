export async function get(url, h, b)
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
			"Authorization": localStorage.auth
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
					throw new Error(error_json.error.status + " " + error_json.error.message)
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


export async function post(url, h, b)
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
			"Authorization": localStorage.auth
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
					throw new Error(error_json.error.status + " " + error_json.error.message)
				})
				.catch(error => { throw error });
			// throw Error('Data received - Network response NOT OK');
		}

	}).catch(error => Error(error));
}

export async function put(url, h, b)
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
			"Authorization": localStorage.auth
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