import React from 'react';
import SearchBox from './SearchBox.jsx';
import SearchResultItem from './SearchResultItem.jsx';
import '../style/Search.css';
import { getMopidy } from '../App.js';

var Spinner = require('react-spinkit');

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      loading: true
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

	render() {

		const searchResults = this.state.tracks.map((track, index) => <SearchResultItem key={index} track={track} tracklist={this.props.tracklist}/>);

    let results;

    if (this.state.loading) {
      results = (
        <div className="loading">
            <h3>searching...</h3>
            <Spinner fadeIn="quarter" name="double-bounce" />
        </div>
      );
    } else {
      results = (
        <div className="results">
          <table>
            <tbody>
              { searchResults }
            </tbody>
          </table>
        </div>
      );
    }

		return (
			<div>
				<SearchBox handleSubmit={ this.search.bind(this) } />
        { results }
			</div>
		);
	}
}
