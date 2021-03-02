import React from 'react';
// import { get, post, put } from '../js/httpRequests';
import { get,post } from '../js/httpRequests';


export class Main extends React.Component
{

	constructor(props)
	{
		super(props)
		this.getPlaylists = this.getPlaylists.bind(this)
		this.selectedPlaylist = this.selectedPlaylist.bind(this)
		this.state = {
			playlists: [],
			username: "loading",
			selectedPlaylists: [],
			songs: [],
			selectedSongs: []
		}
	}


	componentDidMount()
	{
		this.getPlaylists()
	}

	async getPlaylists()
	{
		console.log("getting playlists")

		let url = "	https://api.spotify.com/v1/me"
		let user = await get(url, null, null)
		url = "https://api.spotify.com/v1/me/playlists"
		let playlist = await get(url, null, null)
		this.setState({
			playlists: playlist.items,
			// playlists: [...this.state.playlists, ...tmp],
			username: user.display_name,
		})
	}


	async selectedPlaylist(plid)
	{
		// TODO:
		//see if playlist is already selectedPlaylists
		//if it is then uncheck it
		let url = "https://api.spotify.com/v1/playlists/" + plid

		let pl = await get(url, null, null)
		var tmp = this.state.selectedPlaylists
		tmp.push(pl)
		this.setState({
			selectedPlaylists: tmp
		})
		tmp = this.state.songs
		for (var song of pl.tracks.items)
		{
			tmp.push(song)
		}
		this.setState({
			songs: tmp
		})
	}




	render()
	{
		return (
			<div>
				<div className="container-fluid sticky-top mx-2 py-5 top-playlists">
					<h1>Hello { this.state.username }</h1>
					<div className="row playlists">
						{ this.state.playlists.length > 0 && <Playlists playlists={ this.state.playlists } selectedPlaylist={ this.selectedPlaylist } /> }
					</div>
				</div>
				<div className="container overflow-auto">
					<div className="row overflow-auto">
						<SongList songs={ this.state.songs } />
					</div>
				</div>
			</div>

		);
	}
}

export class Playlists extends React.Component
{
	constructor(props)
	{
		super(props)

	}

	render()
	{
		if (this.state === undefined)
		{
			return (
				<h1>uiop</h1>
			)
		}
		return (
			<div className="card-deck" id="playlist_list">
				<h4>my playlists</h4>
				{this.props.playlists.map((p) =>
				{
					return (
						<Playlist id={ p.id } name={ p.name } artwork={ p.images[0].url } total={ p.tracks.total } selectedPlaylist={ this.props.selectedPlaylist } />
					)
				}) }
			</div>
		)
	}
}


export class Playlist extends React.Component
{
	constructor(props)
	{
		super(props)
		this.handleClick = this.handleClick.bind(this);

	}


	handleClick()
	{
		this.props.selectedPlaylist(this.props.id)
	}
	render()
	{

		return (
			<a className="card card-block playlist_card playlist_card_inactive col-4 col-sm-4 col-md-3 col-lg-2 col-xxl-1 text-truncate" id={ this.props.id } href="#" onClick={ this.handleClick }>
				<img src={ this.props.artwork } className="card-img-top border-0" alt="..." />
				<div className="card-body">
					<h5 className="card-title">{ this.props.name }</h5>
					<p className="card-text">
						<span className="badge badge-pill badge-secondary"> { this.props.total }</span>
					</p>
				</div>
			</a>
		)

	}
}

export class SongList extends React.Component
{
	constructor(props)
	{
		super(props)

	}
	render()
	{
		if (this.state === undefined)
		{
			return (
				<h1>uiop</h1>
			)
		}
		return (
				<div className="col-sm overflow-auto" id="selected_song_list">
				{this.props.songs.map((s) =>
				{
					return (
						<Song name={ s.track.name } id={ s.track.id } is_local={ s.track.is_local } />
					)
				}) }
				</div>
		)
	}
}

export class Song extends React.Component
{
	constructor(props)
	{
		super(props)
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick()
	{
		if (this.props.is_local) {
			return
		} else {
			let url = "https://api.spotify.com/v1/me/player/queue"
			url += '?uri=spotify%3Atrack%3A' + this.props.id
			post(url, null, null)
		}
	}
	render()
	{

		return (
			<a className="list-group-item list-group-item-action" id={this.props.is_local ? "sn-null" : ""} href="#" onClick={ this.handleClick }>{ this.props.name }</a>
			// {!this.props.local && <a className="list-group-item list-group-item-action"  href="#" onClick={ this.handleClick }>{ this.props.name }</a>}

		)

	}
}