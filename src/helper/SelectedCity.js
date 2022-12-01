
import { Store } from "../state/Store";

export function basic() {
	const state = Store.getState();
	var x = state.favorites.find(x => x.basic.Key === state.selectedCity);
	return x?.basic || null;
}

export function current() {
	const state = Store.getState();
	var x = state.favorites.find(x => x.basic.Key === state.selectedCity);
	return x?.current || null;
}

export function fiveDay() {
	const state = Store.getState();
	var x = state.favorites.find(x => x.basic.Key === state.selectedCity);
	return x?.fiveDay || null;
}
