import React from 'react'
import { Auth, ClientId } from './Auth'
import { Main } from './spotify-components'

export default class App extends React.Component
{
	constructor (props)
	{
		super(props)
		this.handle_client_id_change = this.handle_client_id_change.bind(this)
		this.check_is_auth = this.check_is_auth.bind(this)
		let init_id = ''
		if (localStorage.client_id)
		{
			init_id = localStorage.client_id
		}
		this.state = {
			auth: '',
			client_id: init_id,
			is_auth: false
		}
	}

	handle_client_id_change(id)
	{
		console.log(id)
		this.setState({ client_id: id })

	}

	check_is_auth()
	{
		if (this.state.is_auth)
		{
			return true
		}
		if (localStorage.token_expires && new Date().getTime() < new Date(localStorage.token_expires).getTime())
		{
			console.log("already authd")
			this.setState({ auth: localStorage.auth })
			this.setState({ client_id: localStorage.client_id })
			this.setState({ is_auth: true })

			return true
		} else
		{
			console.log("need to auth")
			return false

		}

	}

	render()
	{
		if (this.state.client_id === "")
		{
			return (
				<ClientId client_id={ this.state.client_id } handle_client_id_change={ this.handle_client_id_change } />
			)
		} else if (this.check_is_auth())
		{
			return (
				<Main />
			)
		} else
		{
			return (
				<Auth client_id={ this.state.client_id } />
			)
		}
	}
}
