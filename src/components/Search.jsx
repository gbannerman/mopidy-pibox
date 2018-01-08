import React from 'react';
import SearchBox from './SearchBox.jsx';
import SearchResultItem from './SearchResultItem.jsx';
import '../style/Search.css';

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: null,
    };
  }

  search(results) {
    console.log(results)[0].tracks;
    this.setState({tracks: results[0].tracks});
  }

	render() {

		const TEST_TRACKLIST = [
      {
        uri: "spotify:nxsisiwi1",
        title: "Grown Up",
        artists: ["Danny Brown"],
        album: "Grown Up"
      },
      {
        uri: "spotify:nxsisiwi2",
        title: "After Light",
        artists: ["Rustie"],
        album: "Glass Swords"
      },
      {
        uri: "spotify:nxsisiwi3",
        title: "Janene",
        artists: ["Edwin Organ"],
        album: "Janene"
      }
    ];

		const searchResults = TEST_TRACKLIST.map((track, index) => <SearchResultItem key={index} track={track}/>);

		return (
			<div>
				<SearchBox handleSubmit={ this.search } />
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