import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { PersistGate } from 'redux-persist/integration/react';
import { Store, Persistor } from './state/Store';
import { Provider } from 'react-redux';

import Navigation from './components/Navigation';

import Weather from './pages/Weather';
import Favorites from './pages/Favorites';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';

const root = ReactDOMClient.createRoot(document.getElementById('root'));
root.render(
	<Provider store={Store}>
		<PersistGate loading={null} persistor={Persistor}>
			<React.StrictMode>
				<BrowserRouter>
					<div className="d-flex flex-column h-100">
						<Navigation></Navigation>
						<Routes>
							<Route path="/" element={<Weather />} />
							<Route path="/favorites" element={<Favorites />} />
						</Routes>
					</div>
				</BrowserRouter>
			</React.StrictMode>
		</PersistGate>
	</Provider>
);