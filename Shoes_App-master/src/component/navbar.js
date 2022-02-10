import React from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux'

// import component react-bootstrap
import { Nav, Navbar, Dropdown, Image, Badge, Button } from "react-bootstrap";

// import logo
import { LOGO } from "../assets";

// import action
import { LOG_OUT } from "../action"

class NavigationBar extends React.Component {

  logoutHandle = () => {
    this.props.LOG_OUT()
    localStorage.clear()
  }

  render() {
    return (
      <Navbar
        style={{ backgroundColor: "#0C405E", height: "60px" }}
        expand="lg"
        fixed='top'
      >
        <Navbar.Brand
          style={{
            color: "white",
            borderRight: "2px solid white",
            width: "270px"
          }}
        >
          <Image src={LOGO.default} alt="logo" style={{ height: '50px', marginRight: '15px' }} />
          <strong>Shoes App</strong>
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to='/' style={{ textDecoration: "none", color: "white" }}>
              Home
            </Nav.Link>
          </Nav>
          <Button style={{ marginRight: 20 }} as={Link} to='/cart'>
            <i className="fas fa-shopping-cart" style={{ fontSize: 20, color: 'white' }}></i>
            <Badge variant="warning">{this.props.cart.length}</Badge>
          </Button>
          <Dropdown style={{ marginRight: 50 }}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <i className="fas fa-user-circle" style={{ marginRight: "10px" }} />
              {this.props.email.slice(0, 4) || 'Email'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: 50 }}>
              {
                this.props.email
                  ?
                  <>
                    <Dropdown.Item as={Link} to="/" style={{ textDecoration: "none", color: "#0C405E" }} onClick={this.logoutHandle}>
                      Logout
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/cart" style={{ textDecoration: "none", color: "#0C405E" }}>
                      Cart
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/history" style={{ textDecoration: "none", color: "#0C405E" }}>
                      History
                    </Dropdown.Item>
                  </>
                  :
                  <>
                    <Dropdown.Item as={Link} to="/login" style={{ textDecoration: "none", color: "#0C405E" }} onClick={this.logoutHandle}>
                      Login
                    </Dropdown.Item>
                  </>
              }
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.user.email,
    cart: state.user.cart
  }
}

export default connect(mapStateToProps, { LOG_OUT })(NavigationBar);
