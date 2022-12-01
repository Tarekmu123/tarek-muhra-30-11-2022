import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

const SelectedCity = require('./../helper/SelectedCity');

function Weather(props) {

	const dispatch = useDispatch();
	const dayjs = require("dayjs");

	const [searchModal, setSearchModal] = useState(false);
	const [formState, setFormState] = useState({searchQuery: ""});
	const [searchButtonProgress, setSearchButtonProgress] = useState(false);
	const [cityButtonProgress, setCityButtonProgress] = useState(false);
	const [searchResult, setSearchResult] = useState([]);
	const [errorMsg, setErrorMsg] = useState("");

	function onChange(event) {
		setFormState({ ...formState, [event.target.name]: event.target.value });
	}

	function searchForCity(event) {
		event.preventDefault();
		setSearchButtonProgress(true);
		axios.get('http://dataservice.accuweather.com/locations/v1/cities/autocomplete', {
			params: {
					apikey: process.env.REACT_APP_ACCU_WEATHER_API_KEY,
					q: formState.searchQuery,
					language: "en-us"
				}
			})
			.then((response) => {
				setSearchResult(response.data);
				setSearchButtonProgress(false);
			})
			.catch((error) => {
				setErrorMsg(error?.response?.data || 'Unexpected Error');
				setSearchButtonProgress(false);
			});
	}

	async function addCity(cityKey) {
		setCityButtonProgress(true);

		// GET Basic
		const basicData = searchResult.find(x => x.Key === cityKey);

		// GET Current
		const currentData = await axios.get("http://dataservice.accuweather.com/currentconditions/v1/" + cityKey, {
			params: { apikey: process.env.REACT_APP_ACCU_WEATHER_API_KEY }
		});

		// GET Five Day
		const fiveDayData = await axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + cityKey, {
			params: { apikey: process.env.REACT_APP_ACCU_WEATHER_API_KEY, metric: true }
		});

		dispatch({ type: 'city/add', payload: {basic: basicData, current: currentData.data[0], fiveDay: fiveDayData.data} });

		setCityButtonProgress(false);
	}

	function removeCity(cityKey) {
		console.log(props.favorites);
		dispatch({ type: 'city/remove', payload: cityKey });
		console.log(props.favorites);
	}

	return <div className="container-fluid flex-fill p-4">
		{ /* Search Button */}
		<div className="row d-flex justify-content-center text-center pb-5 g-0">
			<div className="col-md-6">
				<button type="button" className="btn btn-lg btn-primary" onClick={() => setSearchModal(true)}>Search for Cities</button>
			</div>
		</div>
		{ /* Selected City */}
		<div className="row d-flex justify-content-center text-center g-0">
			<div className="col-md-6">
				<div className="card">
					<div className="card-body">
						<h5 className="card-title display-4">{SelectedCity.basic()?.LocalizedName || "Select a City"}</h5>
						<hr />
						<p className="card-text display-5 fw-normal">
							{SelectedCity.current()?.Temperature?.Metric?.Value ? SelectedCity.current()?.Temperature?.Metric?.Value + " C" : "-"}
						</p>
						<h5 className="display-6">{SelectedCity.current()?.WeatherText || "-"}</h5>
					</div>
				</div>
			</div>
		</div>
		{ /* 5 Day Weather Forecast */}
		<div className="row d-flex justify-content-center text-center gap-3 pt-5 g-0">
			{SelectedCity.fiveDay() ? SelectedCity.fiveDay().DailyForecasts.map((item, index) => (
				<React.Fragment key={index}>
					<div className="col-md-2">
						<div className="card">
							<div className="card-body">
								<h4 className="card-title display-5">{dayjs.unix(item.EpochDate).format("ddd")}</h4>
								<p className="card-text display-6 fw-normal">{Math.round(item.Temperature.Maximum.Value)}C</p>
							</div>
						</div>
					</div>
				</React.Fragment>
			)) : null}
		</div>
		{ /* Search Modal*/}
		<Modal show={searchModal} onHide={() => setSearchModal(false)}
			dialogClassName="modal-75w" centered>
			<div className="d-flex flex-column justify-content-center align-items-center p-5">
				{ /* Error Message */}
				{errorMsg !== "" ?
					<div className="row w-100 g-3">
						<div className="col-md-12">
							<Alert variant="danger" className="p-2 text-center">
								{errorMsg}
							</Alert>
						</div>
					</div> : null
				}
				{ /* Search Bar */}
				<form className="row col-md-12 g-3">
					<div className="col-md-8">
						<input type="text" className="form-control" placeholder="Type a city name"
							name="searchQuery"
							onChange={onChange}
						/>
					</div>
					<div className="col-md-4">
						<button type="submit" className="btn btn-primary w-100 mb-3"
							onClick={searchForCity}
							disabled={searchButtonProgress}>
							Search
						</button>
					</div>
				</form>
				{ /* Search Results */}
				<div className="row w-100 flex-fill overflow-auto">
					<div className="d-flex flex-column justify-content-start align-items-center">
						{searchResult.map((item, index) => (
							item.hasOwnProperty("LocalizedName") ?
							<React.Fragment key={index}>
								<div className="alert alert-light border-secondary w-100">
									<div className="d-flex flex-row justify-content-between">
										<p className="my-auto m-0">{item?.LocalizedName}, {item?.Country?.LocalizedName}</p>
										{
											!props.favorites.find(x => x.basic.Key === item?.Key) ?
												<button type="submit" className="btn btn-outline-primary"
													onClick={() => addCity(item?.Key)}
													disabled={cityButtonProgress}>
													Add
												</button>
												:
												<button type="submit" className="btn btn-outline-danger"
													onClick={() => removeCity(item?.Key)}
													disabled={cityButtonProgress}>
													Remove
												</button>
										}
									</div>
								</div>
							</React.Fragment> : null
						))}
					</div>
				</div>
			</div>
		</Modal>
	</div>
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(Weather);