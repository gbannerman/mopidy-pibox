import React from 'react';
import { Field, reduxForm } from 'redux-form'
import '../style/SearchBox.css';

class SearchBox extends React.Component {

	componentDidMount() {
		this.refs.queryRef.getRenderedComponent().focus()
	}

	render() {

		return (
			<form className="search-box-form" onSubmit={this.props.handleSubmit}>
				<Field
					withRef
					ref="queryRef"
					component="input" 
					name="query" 
					type="text" 
					autoComplete="off" 
					autoCorrect="off" 
					autoCapitalize="off" 
					spellCheck="false" 
					autofocus="on" 
					id="searchField" />
	    </form>
		);
	}
}

SearchBox = reduxForm({
  form: 'search',
  destroyOnUnmount: false
})(SearchBox)

export default SearchBox;
