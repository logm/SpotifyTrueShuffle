import React from 'react'
import { get, post, spotifyExceptions } from '../js/httpRequests'
import { NowPlayingFooter } from './NowPlayingFooter'


export class Main extends React.Component
{

	constructor (props)
	{
		super(props)
		this.getPlaylists = this.getPlaylists.bind(this)
		this.selectedPlaylist = this.selectedPlaylist.bind(this)
		this.shuffle = this.shuffle.bind(this)
		this.addToQueue = this.addToQueue.bind(this)
		this.addToQueueNumHandler = this.addToQueueNumHandler.bind(this)
		this.state = {
			playlists: [],
			username: "loading",
			selectedPlaylists: new Set(),
			songs: new Set(),
			queuedSongIndex: 0,
			addToQueueNum: 0

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
			username: user.display_name,
		})
	}

	async selectedPlaylist(plid)
	{

		let url = "https://api.spotify.com/v1/playlists/" + plid
		let pl = await get(url, null, null)
		var tmp = []
		for (let song of pl.tracks.items)
		{
			tmp.push(song)
		}

		var tmpPlaylist = this.state.selectedPlaylists
		var tmpSongList = this.state.songs
		if (tmpPlaylist.has(plid))
		{
			tmpPlaylist.delete(plid)
			for (let s of tmpSongList)
			{
				for (let song of tmp)
				{
					if (s.id === song.id)
					{
						tmpSongList.delete(s)
					}
				}
			}
		} else
		{
			tmpPlaylist.add(plid)
			for (let song of tmp)
			{
				tmpSongList.add(song)
			}
		}
		this.setState({
			selectedPlaylists: tmpPlaylist,
			songs: tmpSongList
		})
	}
	componentDidCatch(error, info)
	{
		console.log("maaaain")
		console.log(error)
		console.log(info)
	}

	shuffle()
	{
		console.log("shuffling")
		let tmpList = Array.from(this.state.songs)
		for (let i = tmpList.length - 1; i >= 0; i--)
		{
			const j = Math.floor(Math.random() * (i + 1))
			const temp = tmpList[i]
			tmpList[i] = tmpList[j]
			tmpList[j] = temp
		}
		let tmpSet = new Set(tmpList)
		this.setState({
			songs: tmpSet,
			queuedSongIndex: 0
		})
	}


	async addToQueue()
	{
		let maxIndex = this.state.addToQueueNum === 0 ? this.state.songs.size : this.state.addToQueueNum
		if (this.state.songs.length === 0)
		{
			return
		}
		for (let i = this.state.queuedSongIndex; i < maxIndex; i++)
		{
			if (i >= this.state.songs.length)
			{
				break
			}
			let song = Array.from(this.state.songs)[i]
			if (!song.is_local)
			{
				let url = 'https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A' + song.track.id

				await post(url, null, null).catch(e => spotifyExceptions(e))
				this.setState({
					queuedSongIndex: this.state.queuedSongIndex + 1
				})

			} else
			{
				console.log("cant play local song")
			}
		}
	}

	addToQueueNumHandler(num)
	{
		this.setState({
			addToQueueNum: parseInt(num)
		})
	}


	render()
	{
		return (
			<div>
				<div className="container-fluid sticky-top mx-2 pt-md-5 spotify-top">
					{/* <h1>Hello { this.state.username }</h1> */ }
					<div className="row playlists">
						{ this.state.playlists.length > 0 && <Playlists playlists={ this.state.playlists } selectedPlaylist={ this.selectedPlaylist } selectedPlaylistList={ this.state.selectedPlaylists } /> }
					</div>
				</div>
				<div className="container overflow-hidden pt-4">
					<div className="row overflow-hidden">
						<SongList songs={ this.state.songs } />
					</div>
				</div>
				<NowPlayingFooter addToQueueNumHandler={ this.addToQueueNumHandler } addToQueue={ this.addToQueue } addToQueueNum={ this.addToQueueNum } shuffle={ this.shuffle } />
			</div>

		)
	}
}

export class Playlists extends React.Component
{
	render()
	{
		return (
			<div className="card-deck" >
				{ this.props.playlists.map((p) =>
				{
					return (
						<Playlist key={ p.id } id={ p.id } name={ p.name } artwork={ p.images[0].url } total={ p.tracks.total } selectedPlaylist={ this.props.selectedPlaylist } />
					)
				}) }
			</div>
		)
	}
}


export class Playlist extends React.Component
{
	constructor (props)
	{
		super(props)
		this.handleClick = this.handleClick.bind(this)
		this.state = {
			active: false
		}
	}


	handleClick()
	{
		this.props.selectedPlaylist(this.props.id)
		this.setState({
			active: !this.state.active
		})
	}
	render()
	{

		return (
			<div className={ `card card-block playlist_card col-5 col-sm-4 col-md-3 col-lg-2 col-xxl-1 text-truncate ${this.state.active ? "playlist_card_active" : "playlist_card_inactive"}` } onClick={ this.handleClick }>
				<img src={ this.props.artwork } className="card-img-top border-0" alt="..." />
				<div className="card-body">
					<h5 className="card-title">{ this.props.name }</h5>
					<p className="card-text">
						<span className="badge badge-pill badge-secondary">{ this.props.total }</span>
					</p>
				</div>
			</div>
		)

	}
}

export class SongList extends React.Component
{
	render()
	{
		return (
			<div className="col-sm selected_song_list">
				{ Array.from(this.props.songs).map((s) =>
				{
					return (
						<Song key={ s.track.uri } name={ s.track.name } id={ s.track.id } is_local={ s.track.is_local } />
					)
				}) }
			</div>
		)
	}
}

export class Song extends React.Component
{
	constructor (props)
	{
		super(props)
		this.handleClick = this.handleClick.bind(this)

	}

	handleClick()
	{
		if (this.props.is_local)
		{
			console.log("trying to play local song, spotify does not support that yet :(")
			return
		} else
		{
			let url = "https://api.spotify.com/v1/me/player/queue"
			url += '?uri=spotify%3Atrack%3A' + this.props.id
			post(url, null, null)
		}
	}
	render()
	{
		return (
			<span className="list-group-item list-group-item-action user-select-none" id={ this.props.is_local ? "sn-local" : "sn-available" } onClick={ this.handleClick }>{ this.props.name }</span>

		)

	}
}
