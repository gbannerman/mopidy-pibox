import React from 'react';
import SearchBox from './SearchBox.jsx';
import SearchResultItem from './SearchResultItem.jsx';
import '../style/Search.css';
import { getMopidy } from '../App.js';
import { Transition } from 'react-transition-group'

var Spinner = require('react-spinkit');

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      loading: false,
      in: false
    };
  }

  search(e) {
    this.setState({loading: true});
    e.preventDefault();
    let queryParameters = e.target.query.value.split(" ");
    getMopidy().library.search({'any': queryParameters}, ['spotify:'], false).done((results) => {
      if (results[0]) {
        this.setState({tracks: results[0].tracks});
      } else {
        this.setState({tracks: []});
      }
      this.setState({loading: false});
    });
  }

  componentDidMount() {
    this.setState({in: true});
  }

	render() {

		const searchResults = this.state.tracks.map((track, index) => <SearchResultItem key={index} track={track} tracklist={this.props.tracklist} playing={this.props.playing} onSelect={this.props.onSelect}/>);

    const defaultStyle = {
      margin: '0 auto',
      maxWidth: '800px',
      transition: 'width 150ms ease-in-out',
    }

    const transitionStyles = {
      entering: { width: '0%' },
      entered: { width: '100%' },
    };

    let results;

    if (this.state.loading) {
      results = (
        <div className="loading">
          <Spinner fadeIn="none" name="double-bounce" />
        </div>
      );
    } else {
      results = (
        <div className="results">
          { searchResults }
        </div>
      );
    }

		return (
			<div className="search">
        <Transition appear={true} in={this.state.in} timeout={150}>
          {(state) => (
            <div style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
              <SearchBox handleSubmit={ this.search.bind(this) } />
            </div>
          )}
        </Transition>
        { results }
			</div>
		);
	}
}
