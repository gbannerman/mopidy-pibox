import React from 'react';
import SearchBox from './SearchBox.jsx';
import SearchResultItem from './SearchResultItem.jsx';
import '../style/Search.css';
import { Transition } from 'react-transition-group'

var Spinner = require('react-spinkit');

export default class Search extends React.Component {

  search(values) {
    console.log(values);
    let queryParameters = values.query.split(" ");
    this.props.onSearch(queryParameters);
  }

	render() {

		const searchResults = this.props.search.results.map((track, index) => 
      <SearchResultItem 
      key={index} 
      track={track} 
      tracklist={this.props.tracklist} 
      playbackState={this.props.playbackState} 
      queueTrack={this.props.queueTrack} />
    );

    const defaultStyle = {
      margin: '0 auto',
      maxWidth: '800px',
      transition: 'width 100ms ease-in-out',
    }

    const transitionStyles = {
      entering: { width: '0%' },
      entered: { width: '100%' },
    };

    let results;

    if (this.props.search.fetching) {
      results = (
        <div className="loading">
          <Spinner fadeIn="none" name="double-bounce" color="white" />
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
        <Transition appear={true} in={true} timeout={100}>
          {(state) => (
            <div style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
              <SearchBox onSubmit={ this.search.bind(this) } term={ this.props.search.term }/>
              { results }
            </div>
          )}
        </Transition>
			</div>
		);
	}
}
