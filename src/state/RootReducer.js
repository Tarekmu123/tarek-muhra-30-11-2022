
const initialState = {
	selectedCity: "",
	favorites: []
	//favorites: mockFavorites
}

export default function RootReducer(state = initialState, action) {
	switch (action.type) {

		case 'city/select': {
			return {
				...state,
				selectedCity: action.payload
			}
		}

		case 'city/add': {
			if (state.favorites.find(x => x?.basic?.Key === action.payload.Key)) {
				console.log("Cant add " + action.payload.Key);
				// Basic object exists
				return {
					...state
				}
			}

			return {
				...state,
				favorites: [...state.favorites,
					{ basic: action.payload.basic, current: action.payload.current, fiveDay: action.payload.fiveDay }
				]
			}
		}

		case 'city/remove': {
			if (!state.favorites.find(x => x?.basic?.Key === action.payload)) {
				// Object doesn't exists
				return {
					...state
				}
			}

			return {
				...state,
				favorites: state.favorites.filter(x => x.basic.Key !== action.payload)
			}
		}

		default:
			return state;
	}
}