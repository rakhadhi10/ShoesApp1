import React from "react";

import Navigation from '../component/navbar'
import Products from '../component/products'

class Home extends React.Component {
  render() {
    return (
      <div>
        <Navigation />
        <Products />
      </div>
    );
  }
}

export default Home;
