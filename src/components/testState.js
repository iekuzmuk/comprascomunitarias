import React, { useState } from 'react';
import Row from './Row';
export default function Greetings(props){
	const [name, setName] = useState('mary');

	function handleNameChange(e){
		setName(e.target.value);
	}

return(
	<section>
	<Row label={name}>
	<input
	value="name"
	onChange={handleNameChange}
	/>
	</Row>
	</section>
	);
}
