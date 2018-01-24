import React from 'react';
import { Field, reduxForm } from 'redux-form'
import '../style/SearchBox.css';

let SearchBox = props => {

	return (
		<form className="search-box-form" onSubmit={props.handleSubmit}>
			<Field 
				component="input" 
				name="query" 
				type="text" 
				autoComplete="off" 
				autoCorrect="off" 
				autoCapitalize="off" 
				spellCheck="false" 
				autofocus="true" 
				id="searchField" />
    </form>
	);
}

SearchBox = reduxForm({
  form: 'search'
})(SearchBox)

export default SearchBox;
