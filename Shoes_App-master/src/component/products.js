import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
    Card,
    Button,
    Modal,
    Image,
    Toast
} from 'react-bootstrap'

import { LOG_IN } from '../action'

class Products extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            detail: false,
            qty: 1,
            slctdProduct: {},
            loginFirst: false,
            toCart: false,
            success: false
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:2000/products')
            .then((res) => {
                // console.log(res.data)
                this.setState({ data: res.data })
            })
            .catch((err) => console.log(err))
    }

    selectProduct = (index) => {
        if (!this.props.email) return this.setState({ loginFirst: true })
        this.setState({ detail: true, slctdProduct: this.state.data[index] })
    }

    addToCart = () => {
        const { qty, slctdProduct } = this.state

        // proteksi stock product yg ingin dibeli
        let tempCart = this.props.cart
        let tempQty
        tempCart.forEach(element => {
            if (element.name === slctdProduct.name) {
                tempQty = element.qty
            }
        });
        // kalau stock product yg ingin dibeli melebihi, maka muncul alert
        if(qty + tempQty > slctdProduct.stock) return alert('Pembelian melebihi stock')

        // menyiapkan data
        let cartData = {
            id: slctdProduct.id,
            name: slctdProduct.name,
            image: slctdProduct.img,
            qty,
            total: qty * slctdProduct.price
        }
        // console.log(cartData)

        // untuk mengecek apakah di cart sudah ada product yg sama dengan yg kita ingin masukan ke cart
        let tempCart2 = this.props.cart
        let ada = false
        tempCart2.forEach(element => {
            if (element.name === cartData.name) {
                ada = true
                element.qty += qty
            }
        });
        if (!ada) tempCart2.push(cartData)
        // console.log(tempCart2)

        Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: tempCart2 })
            .then((res) => {
                // console.log(res.data)
                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                    .then((res) => {
                        console.log(res.data)
                        this.props.LOG_IN(res.data)
                        this.setState({ success: true, detail: false })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    minus = () => {
        if (this.state.qty === 1) return
        this.setState({ qty: this.state.qty - 1 })
    }

    plus = () => {
        if (this.state.qty === this.state.slctdProduct.stock) return
        this.setState({ qty: this.state.qty + 1 })
    }

    render() {
        const { data, detail, qty, slctdProduct, loginFirst, toCart, success } = this.state
        console.log(slctdProduct)

        if (toCart) return <Redirect to='/cart' />

        return (
            <div style={{ margin: "60px 20px" }}>
                <h1>Products</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {data.map((item, index) => {
                        return (
                            <Card key={index} style={{ width: '18rem', marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                                <Card.Img variant="top" src={item.img} style={{ height: 250 }} />
                                <Card.Body style={styles.cardBody}>
                                    <Card.Title style={{}}>{item.name}</Card.Title>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div>
                                            IDR {item.price.toLocaleString()}
                                        </div>
                                        <div>
                                            Stock: {item.stock}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <Button style={{ width: '80px' }} variant="warning" >
                                            <i className="far fa-heart"></i>
                                        </Button>
                                        <Button variant="primary" onClick={() => this.selectProduct(index)} >Buy Now</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
                <Modal centered show={detail} onHide={() => this.setState({ detail: false, qty: 1 })} size="lg" style={{}}>
                    <Modal.Header closeButton>
                        <Modal.Title>{slctdProduct ? slctdProduct.name : ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Image src={slctdProduct ? slctdProduct.img : ''} style={{ height: 270, width: 350 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
                            <strong>IDR {slctdProduct ? slctdProduct.price : ''}</strong>
                            <strong>Stock: {slctdProduct ? slctdProduct.stock : ''}</strong>
                            <strong>Description: </strong>
                            <p>{slctdProduct ? slctdProduct.description : ''}</p>
                            <div style={{ display: 'flex', width: 120, justifyContent: 'space-between' }}>
                                <Button onClick={this.minus}>-</Button>
                                <h3>{qty}</h3>
                                <Button onClick={this.plus}>+</Button>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ detail: false, qty: 1 })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.addToCart}>
                            Add To Cart
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={loginFirst} onHide={() => this.setState({ loginFirst: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You must login to process this action!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ loginFirst: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Toast autohide show={success} onClose={() => this.setState({ toCart: true, success: false })}>
                    <Toast.Header style={{ backgroundColor: 'salmon', color: 'white' }}>
                        <strong className="mr-auto">Success!</strong>
                        <small>Less than a minute ago</small>
                    </Toast.Header>
                    <Toast.Body>Your product is added to cart</Toast.Body>
                </Toast>
            </div>
        )
    }
}

const styles = {
    cardBody: {
        // backgroundColor: 'lightgreen',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email,
        cart: state.user.cart
    }
}

export default connect(mapStateToProps, { LOG_IN })(Products)