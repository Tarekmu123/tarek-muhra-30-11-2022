import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';

function Navigation(props) {

	return <Navbar bg="light" expand="md">
		<Container>
			<Navbar.Brand className="fs-4 fw-bolder noselect">
				🌥️ Weather
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="justify-content-evenly text-center w-100">
					<Nav.Link href="/" className={"rounded w-25 " +
						(window.location.pathname === '/' ? 'border disabled' : 'border border-light')}>
						Home
					</Nav.Link>
					<Nav.Link href="/favorites" className={"rounded w-25 " +
						(window.location.pathname === '/favorites' ? 'border disabled' : 'border border-light')}>
						Favorites
					</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>
}

export default Navigation;
