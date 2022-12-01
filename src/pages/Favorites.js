import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';

function Favorites(props) {
	
	const dispatch = useDispatch();
	const dayjs = require("dayjs");
	const [confirmModal, setConfirmModal] = useState(false);
	const [removalTarget, setRemovalTarget] = useState("");

	function selectCity(cityKey) {
		dispatch({ type: 'city/select', payload: cityKey});
	}

	function updateCity(cityKey) {
		//dispatch({ type: 'city/remove', payload: cityKey});
	}

	function promptRemoveCity(cityKey) {
		setRemovalTarget(cityKey);
		setConfirmModal(true);
	}

	function removeCity() {
		dispatch({ type: 'city/remove', payload: removalTarget});
		setRemovalTarget("");
		setConfirmModal(false);
		console.log('removed city ' + removalTarget);
	}

	console.log(props.favorites)

	return <div className="container-fluid d-flex flex-row justify-content-center flex-wrap gap-4 p-4">
			{props.favorites.map((item, index) => (
				item?.basic?.hasOwnProperty("LocalizedName") ?
				<React.Fragment key={index}>
					<div className="d-flex justify-content-center text-center g-0">
						<div className="card w-100">
							<div className="card-body">
								<h5 className="card-title">{item?.basic?.LocalizedName}</h5>
								<p className="card-text">
									{item?.current?.Temperature?.Metric?.Value ? item?.current?.Temperature?.Metric?.Value + " C" : "No Data - Force Update"}
								</p>
								<hr/>
								<div className="d-flex justify-content-evenly gap-3">
									<button type="button" className="btn btn-outline-primary w-100"
										onClick={() => selectCity(item?.basic?.Key)}
										disabled={props.selectedCity === item.basic.Key}>
										Use
									</button>
									<button type="button" className="btn btn-outline-success w-100"
										onClick={() => updateCity(item?.basic?.Key)}>
										Force Update
									</button>
									<button type="button" className="btn btn-outline-danger w-100"
										onClick={() => promptRemoveCity(item?.basic?.Key)}>
										Remove
									</button>
								</div>
							</div>
							<div className="card-footer d-flex flex-column text-muted bg-white">
								<div><b>Key:</b> {item.basic.Key}</div>
								<div><b>Time:</b> {dayjs.unix(item?.current?.EpochTime).format("h:m A - DD.MM.YYYY")}</div>
							</div>
						</div>
					</div>
				</React.Fragment> : null
			))}

		<Modal show={confirmModal} onHide={() => setConfirmModal(false)} backdrop="static" keyboard={false}
			dialogClassName="modal-75w" centered>
			<div className="d-flex flex-column justify-content-center align-items-center p-4 gap-2">
				<h4>Are you sure?</h4>
				<p>This will cost valuable API calls.</p>
				<div className="d-flex flex-row justify-content-center w-100 pt-4 gap-5">
					<button type="submit" className="btn btn-secondary w-100" onClick={() => setConfirmModal(false)}>Cancel</button>
					<button type="submit" className="btn btn-danger w-100" onClick={removeCity}>Remove</button>
				</div>
			</div>
		</Modal>

	</div>
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(Favorites);