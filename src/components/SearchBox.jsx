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
				autofocus="on" 
				id="searchField" />
    </form>
	);
}

SearchBox = reduxForm({
  form: 'search',
  destroyOnUnmount: false
})(SearchBox)

export default SearchBox;
