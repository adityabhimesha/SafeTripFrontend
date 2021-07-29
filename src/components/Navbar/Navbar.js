import React from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import Wallet from '../../connection';


class Header extends React.Component {
    render() {
      return(
        <Navbar className="d-flex justify-content-between"variant="dark" expand="md">
            <Navbar.Brand href="/" className="d-flex" style={{color:"var(--color-text)" }}>
                <img
                alt="LOGO"
                src="logo.svg"
                width="60"
                height="60"
                className="d-inline-block align-top"
                />{'  '}
                <span className="align-self-center text-primary" style={{fontWeight:"800", marginLeft:"9px",}}>SAFE TRIP FINANCE</span>
            </Navbar.Brand>
            {/* <Nav.Link><Button onclick className="custom-btn-1">CONNECT</Button></Nav.Link> */}
            <Nav.Link><Wallet></Wallet></Nav.Link>

            
      </Navbar>
      );
    }
  }

export default Header;