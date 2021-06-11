import React from 'react'
import { get, post, put, spotifyExceptions } from '../js/httpRequests'
import $ from 'jquery'



export class NowPlayingFooter extends React.Component
{



	constructor (props)
	{
		super(props)
		this.next = this.next.bind(this)
		this.previous = this.previous.bind(this)
		this.pause = this.pause.bind(this)
		this.play = this.play.bind(this)
		this.clearQueue = this.clearQueue.bind(this)
		this.updateFooter = this.updateFooter.bind(this)
		this.handleModalShowClick = this.handleModalShowClick.bind(this)
		this.handleModalCloseClick = this.handleModalCloseClick.bind(this)

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
			showModal: false
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
		post(url, null, null).catch(e => spotifyExceptions(e))

	}

	previous()
	{
		let url = "https://api.spotify.com/v1/me/player/next"
		post(url, null, null).catch(e => spotifyExceptions(e))

	}

	pause()
	{
		console.log("pause")
		let url = "https://api.spotify.com/v1/me/player/pause"

		put(url, null, null).catch(e => spotifyExceptions(e))
		this.setState({
			playButtonStatus: true
		})

	}


	play()
	{
		console.log("play")
		let url = "https://api.spotify.com/v1/me/player/play"
		put(url, null, null).catch(e => spotifyExceptions(e))
		this.setState({
			playButtonStatus: false
		})

	}






	async clearQueue()
	{
		console.log("clearing")
	}




	handleModalShowClick(e)
	{
		e.preventDefault()
		this.setState({
			showModal: true
		})
	}

	handleModalCloseClick()
	{
		this.setState({
			showModal: false
		})
	}





	async updateFooter()
	{
		let url = "https://api.spotify.com/v1/me/player/currently-playing"
		let playback = null
		let width = this.state.width
		try
		{
			playback = await get(url, null, null).catch(e => spotifyExceptions(e))
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
		this.interval = setInterval(() => this.updateFooter(), 2000)
	}
	componentWillUnmount()
	{
		console.log("componentWillUnmount")
		clearInterval(this.interval)
	}


	render()
	{
		return (<div>
			{ this.state.showModal ? (<Modal handleModalCloseClick={ this.handleModalCloseClick } addToQueueNumHandler={ this.props.addToQueueNumHandler } />) : null }
			<footer className="container fixed-bottom footer-area">
				<div className="progress m-1">
					<div className="progress-bar now_playing_progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={ { width: this.state.nowPlayingWidth } }></div>
				</div>
				<div className="row col-12">
					<div id="now_playing_name" className="text-muted col-md-6 col-sm-12 mr-auto d-inline-block text-truncate">
						{ this.state.nowPlayingName }
					</div>
					<div className="btn-group text-right col-md-4 col-lg-3 col-sm-12 col-xs-12 mb-2 " role="group">
						<button type="button" className="btn btn-block bi bi-three-dots spotify-buttons" onClick={ this.handleModalShowClick }>
						</button>
						{/* <button type="button" className="btn btn-block bi bi-x-circle-fill  spotify-buttons" onClick={ this.clearQueue }></button> */ }
						<button type="button" className="btn btn-block bi bi-plus-square spotify-buttons" onClick={ this.props.addToQueue }>
						</button>
						<button type="button" className="btn btn-block bi bi-shuffle spotify-buttons" onClick={ this.props.shuffle }>
						</button>
						<button type="button" className="btn btn-block bi bi-skip-backward-fill spotify-buttons" onClick={ this.previous }>
						</button>
						{ this.state.playButtonStatus ? this.state.playButton : this.state.pauseButton }
						<button type="button" className="btn btn-block bi bi-skip-forward-fill spotify-buttons" onClick={ this.next }>
						</button>
					</div>
				</div>
			</footer >
		</div>

		)

	}
}


class Modal extends React.Component
{
	constructor (props)
	{
		super(props)
		this.handleCloseClick = this.handleCloseClick.bind(this)
		this.handleRangeSlider = this.handleRangeSlider.bind(this)
		this.getDeviceList = this.getDeviceList.bind(this)
		this.handleQueueNumSelector = this.handleQueueNumSelector.bind(this)
		this.handleDeviceInput = this.handleDeviceInput.bind(this)

		this.state = {
			rangeSliderValue: 2,
			devices: [],
			savedDeviceID: '',
			savedAddToQueueNum: ''
		}
	}
	componentDidMount()
	{
		this.getDeviceList()
		const { handleModalCloseClick } = this.props
		$(this.modal).modal('show')
		$(this.modal).on('hidden.bs.modal', handleModalCloseClick)

	}
	handleCloseClick()
	{
		const { handleModalCloseClick } = this.props
		$(this.modal).modal('hide')
		handleModalCloseClick()
		this.props.addToQueueNumHandler(this.state.savedAddToQueueNum)

	}

	handleRangeSlider(event)
	{
		this.setState({ rangeSliderValue: event.target.value })
	}


	async getDeviceList()
	{
		let url = "https://api.spotify.com/v1/me/player/devices"
		let deviceList = await get(url, null, null)
		this.setState({
			devices: deviceList.devices
		})
	}

	handleDeviceInput(event)
	{
		this.setState({ savedDeviceID: event.target.value })
	}

	handleQueueNumSelector(event)
	{
		this.setState({ savedAddToQueueNum: event.target.value })
	}


	render()
	{
		return (
			<div>
				<div className="modal fade " ref={ modal => this.modal = modal } id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-body">
								<div className="form-group">
									Device Selector
									<select className="custom-select form-control" multiple onChange={ this.handleDeviceInput }>
										{ this.state.devices.map((d) =>
										{
											return (
												<option key={ d.id } value={ d.id } selected={ (d.is_active) ? "selected" : "" }>{ d.name }</option>
											)
										})
										}
									</select>
									<label for="queueSelector">Number of songs to add to queue: <em> (0=all)</em></label>
									<input type="number" className="form-control" id="queueSelector" name="tentacles" min="0" max="25" onChange={ this.handleQueueNumSelector }></input>
									{/* <label for="customRange3">Example range</label>
								<input type="range" className="custom-range" min="0" max="5" step="1" id="customRange3" value={ this.state.rangeSliderValue } onChange={ this.handleRangeSlider }></input>
								{ this.state.rangeSliderValue } */}
									{/* Clear Queue Nutton */ }
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={ this.handleCloseClick }>Save</button>
							</div>
						</div>
					</div>
				</div>
			</div >
		)
	}
}
