import React from 'react'
import { get, post, put } from '../js/httpRequests'



export class NowPlayingFooter extends React.Component
{



	constructor (props)
	{
		super(props)
		this.next = this.next.bind(this)
		this.previous = this.previous.bind(this)
		this.pause = this.pause.bind(this)
		this.play = this.play.bind(this)
		this.shuffle = this.shuffle.bind(this)
		this.clearQueue = this.clearQueue.bind(this)
		this.addToQueue = this.addToQueue.bind(this)
		this.updateFooter = this.updateFooter.bind(this)
		this.spotifyExceptions = this.spotifyExceptions.bind(this)

		var playButton = (
			<button type="button" className="btn btn-block bi bi-pause-fill spotify-buttons" onClick={ this.pause }>
			</button>
		)

		var pauseButton = (
			<button button type="button" className="btn btn-block bi bi-play-fill spotify-buttons" onClick={ this.play }>
			</button>
		)


		this.state = {
			nowPlayingName: "Not Playing",
			nowPlayingWidth: '0%',
			playButtonStatus: true,
			playButton: playButton,
			pauseButton: pauseButton,
		}
	}

	// TODO:
	// - complete/fix playback button functions
	// - add hover indicator on ones that aren't supported/not completed
	// - add device selector
	// 	- look for device before trying to play
	// - reconfigure playlist heights at various screen widths
	componentDidCatch(error, info)
	{
		console.log("yooyoo")
		console.log(error)
		console.log(info)
	}


	next()
	{
		let url = "https://api.spotify.com/v1/me/player/next"
		post(url, null, null).catch(e => this.spotifyExceptions(e))

	}

	previous()
	{
		let url = "https://api.spotify.com/v1/me/player/next"
		post(url, null, null).catch(e => this.spotifyExceptions(e))

	}

	pause()
	{
		console.log("pause")
		let url = "https://api.spotify.com/v1/me/player/pause"

		put(url, null, null).catch(e => this.spotifyExceptions(e))
		this.setState({
			playButtonStatus: true
		})

	}


	play()
	{
		console.log("play")
		let url = "https://api.spotify.com/v1/me/player/play"
		put(url, null, null).catch(e => this.spotifyExceptions(e))
		this.setState({
			playButtonStatus: false
		})

	}



	shuffle()
	{
		console.log("shuffling")
		// for (let i = selectedSongs.length - 1; i >= 0; i--)
		// {
		// 	const j = Math.floor(Math.random() * (i + 1));
		// 	const temp = selectedSongs[i];
		// 	selectedSongs[i] = selectedSongs[j];
		// 	selectedSongs[j] = temp;
		// }
		// console.log(selectedSongs)
		// viewSongs()
		// console.log("done shuffling")
	}


	async clearQueue()
	{
		console.log("clearing")
	}

	async addToQueue()
	{
		console.log("adding to queue")
	}

	spotifyExceptions(exception)
	{
		console.log("spotifyExceptions")
		console.log(exception)

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


	async updateFooter()
	{
		console.log("now playing request")
		let url = "https://api.spotify.com/v1/me/player/currently-playing"
		let playback = null
		let width = this.state.width
		try
		{
			playback = await get(url, null, null).catch(e => this.spotifyExceptions(e))
			width = playback.progress_ms / playback.item.duration_ms * 100
			width = width + '%'
			this.setState({
				nowPlayingWidth: width,
				nowPlayingName: playback.item.name,
			})

		} catch (error)
		{
			if (error instanceof TypeError)
			{
				//not playing right now
				//TODO: change delay to reduce api calls
				// console.log("Type error in update updateFooter")
				this.setState({
					playButtonStatus: false,
					nowPlayingName: "Not Playing"
				})

			} else if (error === "")
			{
				console.log("error is weird")
			}
			else
			{
				console.log("blah blah")
				throw error
			}
		}

	}


	componentDidMount()
	{
		console.log("componentDidMount")
		this.interval = setInterval(() => this.updateFooter(), 1000)
	}
	componentWillUnmount()
	{
		console.log("componentWillUnmount")
		clearInterval(this.interval)
	}


	render()
	{
		return (
			<footer className="container fixed-bottom footer-area">
				<div className="progress m-1">
					<div className="progress-bar now_playing_progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={ { width: this.state.nowPlayingWidth } }></div>
				</div>
				<div className="row col-12">
					<div id="now_playing_name" className="text-muted col-md-6 col-sm-12 mr-auto d-inline-block text-truncate">
						{ this.state.nowPlayingName }
					</div>
					<div className="btn-group text-right col-md-4 col-lg-3 col-sm-12 col-xs-12 mb-2 " role="group">

						<button type="button" className="btn btn-block bi bi-x-circle-fill  spotify-buttons" onClick={ this.clearQueue }>
						</button>
						<button type="button" className="btn btn-block bi bi-box-arrow-down spotify-buttons" onClick={ this.addToQueue }>
						</button>
						<button type="button" className="btn btn-block bi bi-shuffle spotify-buttons" onClick={ this.shuffle }>
						</button>
						<button type="button" className="btn btn-block bi bi-skip-backward-fill spotify-buttons" onClick={ this.previous }>
						</button>
						{ this.state.playButtonStatus ? this.state.playButton : this.state.pauseButton }
						<button type="button" className="btn btn-block bi bi-skip-forward-fill spotify-buttons" onClick={ this.next }>
						</button>
					</div>
				</div>
			</footer>

		)

	}
}
