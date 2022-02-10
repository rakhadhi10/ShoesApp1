import React from 'react'
import Axios from 'axios'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

// import component
import Navbar from './component/navbar'

// import page
import Home from './page/home'
import LoginPage from './page/login'
import CartPage from './page/cart'
import HistoryPage from './page/history'

// import action
import { LOG_IN, getHistory } from "./action"

class App extends React.Component {
  componentDidMount() {
    Axios.get(`http://localhost:2000/users?id=${localStorage.getItem('id')}`)
      .then(res => {
        this.props.LOG_IN(res.data[0])

        Axios.get(`http://localhost:2000/history?idUser=${localStorage.getItem('id')}`)
          .then(res => {
            this.props.getHistory(res.data)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/login' component={LoginPage} />
          <Route path='/cart' component={CartPage} />
          <Route path='/history' component={HistoryPage} />
        </Switch>
      </div>
    );
  }
}

export default connect(null, { LOG_IN, getHistory })(App);
