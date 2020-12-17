import React from 'react';


export class Top extends React.Component
{
	render()
	{
		return (
			<div>
				<h1>Hello react!</h1>
				<Playlists />
			</div>
		);
	}
}

export class Playlists extends React.Component {
	render() {
		return (
			<div>
				<h4>my playlists</h4>
			</div>
		)
	}
}
