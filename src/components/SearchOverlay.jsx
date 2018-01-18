import React from 'react';
import Search from './Search.jsx';
import '../style/SearchOverlay.css';
import { Transition } from 'react-transition-group';

export default class SearchOverlay extends React.Component {

	render() {

		const defaultStyle = {
			width: '100%',
			height: '100%',
			position: 'fixed',
			background: 'rgba(0, 0, 0, 0)',
			zIndex: 5,
			transition: 'background 150ms ease-in-out'
		}

		const transitionStyles = {
		  entering: { background: 'rgba(0, 0, 0, 0)' },
		  entered: { background: 'rgba(0, 0, 0, 0.9)' },
		};

		return (
			<Transition appear={true} in={this.props.in} timeout={150}>
		    {(state) => (
		      <div style={{
		        ...defaultStyle,
		        ...transitionStyles[state]
		      }}>
		      	<Search tracklist={this.props.tracklist} playing={this.props.playing} onSelect={this.props.onSelect}/>
		      </div>
		    )}
		  </Transition>
		);
	}
}