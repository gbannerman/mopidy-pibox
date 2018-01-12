import React from 'react';
import SearchBox from './SearchBox.jsx';
import SearchResultItem from './SearchResultItem.jsx';
import '../style/Search.css';

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
    };
  }

  search(results) {
  	if (results[0]) {
    	this.setState({tracks: results[0].tracks});
    } else {
    	this.setState({tracks: []});
    }
  }

	render() {

		const searchResults = this.state.tracks.map((track, index) => <SearchResultItem key={index} track={track} tracklist={this.props.tracklist}/>);

		return (
			<div>
				<SearchBox handleSubmit={ this.search.bind(this) } />
				<div className="results">
					<table>
            <tbody>
						  { searchResults }
            </tbody>
					</table>
				</div>
			</div>
		);
	}
}
