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

		var playButton = (
			<button type="button" class="btn" onClick={ this.pause }>
				<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" /> </svg></button>
		)

		var pauseButton = (
			<button button type="button" class="btn" onClick={ this.play }>
				<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg></button>
		)


		this.state = {
			nowPlayingName: "Not Playing",
			nowPlayingWidth: '0%',
			playButtonStatus: playButton,
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
		post(url, null, null)

	}

	previous()
	{
		let url = "https://api.spotify.com/v1/me/player/next"
		post(url, null, null)

	}

	pause()
	{
		console.log("pause")
		let url = "https://api.spotify.com/v1/me/player/pause"
		try
		{
			put(url, null, null)
			this.setState({
				playButtonStatus: this.state.pauseButton
			})
		} catch (error)
		{
			console.log("asd")
			console.log(error + " pause error")
			// throw error
		}
	}


	play()
	{
		console.log("play")
		let url = "https://api.spotify.com/v1/me/player/play"
		try
		{
			put(url, null, null)
			this.setState({
				playButtonStatus: this.state.playButton
			})
		} catch (error)
		{
			console.log("fgd")
			throw error
			// if (error instanceof )
		}
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


	async updateFooter()
	{
		console.log("now playing request")
		let url = "https://api.spotify.com/v1/me/player/currently-playing"
		let playback = null
		let width = this.state.width
		try
		{
			playback = await get(url, null, null)
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
					playButtonStatus: this.state.pauseButton,
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
			<footer class="container fixed-bottom footer-area">
				<div class="progress m-1">
					<div class="progress-bar now_playing_progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={ { width: this.state.nowPlayingWidth } }></div>
					{/* <div class="progress-bar now_playing_progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={ this.state.nowPlayingWidth }></div> */ }
				</div>
				<div class="row">
					<div id="now_playing_name" class="text-muted col mr-auto d-inline-block text-truncate">
						{ this.state.nowPlayingName }
					</div>
					<div class="btn-group text-right col-auto mb-2" role="group" aria-label="Basic example">
						<button type="button" class="btn" onClick={ this.clearQueue }>
							<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
							</svg>
						</button>
						<button type="button" class="btn" onClick={ this.addToQueue }>
							<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1h-2z" />
								<path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
							</svg>
						</button>
						<button type="button" class="btn" onClick={ this.shuffle }>
							<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-shuffle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z" />
								<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
							</svg>
						</button>
						<button type="button" class="btn" onClick={ this.previous }>
							<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-skip-backward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z" />
								<path d="M.904 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.692-1.01-1.233-.696L.904 7.304a.802.802 0 0 0 0 1.393z" />
								<path d="M8.404 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.693-1.01-1.233-.696L8.404 7.304a.802.802 0 0 0 0 1.393z" />
							</svg>
						</button>
						{ this.state.playButtonStatus }

						<button type="button" class="btn" onClick={ this.next }>
							<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-skip-forward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
								<path d="M7.596 8.697l-6.363 3.692C.693 12.702 0 12.322 0 11.692V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
								<path d="M15.096 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
							</svg>
						</button>
					</div>
				</div>


			</footer>
		)

	}
}
