import React from 'react';

var redirect_uri = "http://localhost:3000/redirect"


export  class Auth extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			client_id: this.props.client_id
		}
		this.authorize = this.authorize.bind(this)
	}

	async authorize()
	{
		await this.setState({client_id: this.props.client_id})
		console.log(this.state.client_id)
		localStorage.setItem("client_id", this.state.client_id)
		let scope = "user-modify-playback-state user-read-playback-state playlist-read-private playlist-read-collaborative streaming user-read-email"

		let url = 'https://accounts.spotify.com/authorize';
		url += '?response_type=token';
		url += '&client_id=' + encodeURIComponent(this.state.client_id);
		url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
		url += '&scope=' + encodeURIComponent(scope);
		let popup = window.open(url, "width=350,height=250");
		// popup = window.open(url);
		await new Promise(r => setTimeout(r, 2000));
		console.log(popup.location.href)
		let auth_token = popup.location.href.split("=")[1].split("&")[0];
		let token_type = popup.location.href.split('=')[2].split("&")[0];
		let auth = token_type + " " + auth_token
		console.log(auth)
		let now = new Date()
		now.setSeconds(now.getSeconds() + 3600)
		localStorage.setItem("auth", auth)
		localStorage.setItem("token_expires", now)
		// location.reload()
		window.open('/', '_self')
	}


	render()
	{
		return (
			<div>
				<h2>not auth'd</h2>
				<button disabled={this.props.client_id === ""} onClick={this.authorize}>login</button>
			</div>
			)
	}
}


export class ClientId extends React.Component{
	constructor(props)
	{
		super(props);
		this.handleChange = this.handleChange.bind(this)
		this.submit = this.submit.bind(this)
		this.state = {
			id: "",
		}
	}

	handleChange(e) {
		this.setState({id: e.target.value})

	}

	submit() {
		console.log("submiting")
		this.props.handle_client_id_change(this.state.id)
	}

    render(){
        return(
        <div>
			{/* <input value={id} onChange={this.handleChange}>client</input> */}
            <form onSubmit = {this.submit}>
			<input type="text" placeholder="client_id" name="client_id" value={this.state.id} onChange={this.handleChange}/>
                <input type = "submit" value = "Submit" disabled={this.state.id === ""}/>
            </form>
			{this.state.id}
        </div>

        )
    }
}

export class Redirect extends React.Component{
	constructor(props) {
		super(props)
		this.close_page = this.close_page.bind(this)
		this.close_page()
	}

	async close_page() {
		await new Promise(r => setTimeout(r, 2200));
		window.close()
	}

    render() {
        return(
        <div>
			<h1>Please wait...closing</h1>
        </div>
        )
    }
}