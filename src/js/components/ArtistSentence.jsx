import React from 'react';

export default class ArtistSentence extends React.Component {

	render() {

		const TEST_URL = "https://i.scdn.co/image/cc8f153161d0a16761db976882614563d2f9e988";

		console.debug(this.props.artists);

		if (!this.props.artists){
			return <span>-</span>;
		}

		return (

			<span className={ this.props.className ? this.props.className+" artist-sentence" : "artist-sentence" }>
				{
					this.props.artists.map((artist, index) => {

						if (!artist){
							return <span>-</span>;
						}

						var separator = null;
						if (index === this.props.artists.length - 2){
							separator = ' and ';
						} else if (index < this.props.artists.length - 2){
							separator = ', ';
						}

						if (!artist){							
							var content = <span>-</span>
						} else if (!artist.uri || this.props.nolinks){
							var content = <span>{ artist }</span>
						}

						return (
							<span key={'artist_'+index}>
								{ content }
								{ separator }
							</span>
						);
					})
				}
			</span>
		);
	}
}