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
    this.setState({tracks: results[0].tracks});
  }

	render() {

		const searchResults = this.state.tracks.map((track, index) => <SearchResultItem key={index} track={track}/>);

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
