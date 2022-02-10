import React from "react";
import Axios from "axios";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";

import { InputGroup, FormControl, Button, Form } from "react-bootstrap";

import { LOG_IN } from "../action";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      loginErr: ''
    };
  }

  handleLogin = () => {
    let email = this.refs.email.value;
    let password = this.refs.password.value;
    // console.log(email, password);

    let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) return this.setState({ loginErr: "*Email not valid" })
    if (regex.test(email)) this.setState({ loginErr: "" })

    let symb = /[!@#$%^&*:]/
    let numb = /[0-9]/

    if (!symb.test(password) || !numb.test(password) || password.length < 6) return this.setState({ loginErr: "*Password must include symbol, number, min 6 char" })
    if (symb.test(password) || numb.test(password) || !password.length < 6) this.setState({ loginErr: "" })


    Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
      .then((res) => {
        console.log(res.data);

        if (res.data.length === 0) {
          Axios.post('http://localhost:2000/users', { email, password, cart: [] })
            .then((res) => {
              Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
                .then((res) => {
                  localStorage.setItem("id", res.data[0].id);
                  this.props.LOG_IN(res.data[0]);
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
        else {
          localStorage.setItem("id", res.data[0].id);
          this.props.LOG_IN(res.data[0]);
        }
      })
      .catch((err) => console.log(err));

    this.refs.email.value = "";
    this.refs.password.value = "";
  };

  render() {
    const { showPassword, loginErr } = this.state;

    if (this.props.email) return <Redirect to="/" />;

    return (
      <div style={styles.mainCont}>
        <div style={styles.center}>
          <div style={{ marginBottom: 10 }}>
            <h1>Login</h1>
          </div>
          <div style={{ ...styles.item, textAlign: "center" }}>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" style={{ width: "45px" }}>
                  <i className="fas fa-user-circle"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Email"
                aria-label="Email"
                aria-describedby="basic-addon1"
                style={{ height: "45px" }}
                ref="email"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text
                  id="basic-addon2"
                  style={{ width: "45px", cursor: "pointer" }}
                >
                  {this.state.showPassword ? (
                    <i
                      className="fas fa-eye"
                      onClick={() =>
                        this.setState({
                          showPassword: !showPassword,
                        })
                      }
                    ></i>
                  ) : (
                      <i
                        className="fas fa-eye-slash"
                        onClick={() =>
                          this.setState({
                            showPassword: !showPassword,
                          })
                        }
                      ></i>
                    )}
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Password"
                aria-label="Username"
                aria-describedby="basic-addon1"
                style={{ height: "45px" }}
                type={showPassword ? "text" : "password"}
                ref="password"
              />
            </InputGroup>
            <Form.Text style={{ textAlign: "left", color: "red", fontSize: '15px' }}>
              {loginErr}
            </Form.Text>
            <Button onClick={this.handleLogin} style={{ margin: "10px" }}>
              Login
              <i className="fas fa-sign-in-alt" style={{ marginLeft: "8px" }} />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  mainCont: {
    background:
      "url(https://images.unsplash.com/photo-1517519610343-021766b185c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1510&q=80) no-repeat center",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    height: "100vh",
  },
  center: {
    marginTop: 100,
    padding: "10px 30px",
    width: 350,
    height: "50vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid gray",
    borderRadius: "30px",
    backgroundColor: "rgba(255, 255, 255, .7)",
  },
  item: {
    width: "100%",
    height: "auto",
    marginBottom: 5,
  },
};

const mapStateToProps = (state) => {
  return {
    email: state.user.email,
  };
};

export default connect(mapStateToProps, { LOG_IN })(LoginPage);
