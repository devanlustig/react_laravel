const initialState = {
	value: 1,
};

function reducer(state = initialState, action){
	switch(action.type){
	 case 'INCREMENT':
	 return { value : state.value + 1 };
	 case 'DECREMENT':
	 return { value : state.value - 1 };
	 default :
	 return state;
	}
}

export default reducer;