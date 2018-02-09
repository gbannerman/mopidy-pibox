import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { MenuItem } from 'material-ui/Menu';
import '../style/SessionForm.css';
import { Select, TextField } from 'redux-form-material-ui';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: theme.typography.caption,
});

class SessionForm extends React.Component {

	componentDidMount() {
		this.props.loadPlaylists();
	}

	render() {

		const menuItems = this.props.session.playlists.map((playlist, index) => <MenuItem value={playlist.uri}>{ playlist.name }</MenuItem>);

		return (
			<form className="session-form" onSubmit={this.props.handleSubmit}>

				<h2 className="no-song-heading">pibox</h2>

				<Field
					className="session-form-field"
					component={TextField}
					label="Number of skips required"
					name="skips" 
					type="number"
					parse={value => !value ? null : Number(value)}
					placeholder="Number of skips required" />


				<div className="session-form-field">
					<Typography className={this.props.classes.root} variant="display3" gutterBottom align="left">Playlist</Typography>
					<Field 
						className="session-form-field-select"
						name="playlist" 
						component={Select}
						autoWidth
						placeholder="Select a playlist" >
						{menuItems}
					</Field>
				</div>

				<Button 
					className="session-form-field"
					raised
					disabled={this.props.session.sending}
					color="primary" 
					type="fab">
					Start
				</Button>

	    </form>
		);
	}
}

SessionForm = reduxForm({
  form: 'session',
  destroyOnUnmount: false
})(SessionForm)

export default withStyles(styles)(SessionForm);
