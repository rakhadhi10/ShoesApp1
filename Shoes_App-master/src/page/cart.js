import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { LOG_IN } from '../action'

import {
    Table,
    Button,
    Image,
    Modal
} from 'react-bootstrap'

class CartPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listProd: [],
            selectedIndex: null,
            newQty: 0,
            errQty: false,
            cartEmpty: false,
            toHistory: false,
            reqConf: false
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:2000/products')
            .then(res => this.setState({ listProd: res.data }))
            .catch(err => console.log(err))
    }

    handleDelete = (index) => {
        // console.log(index)
        let tempCart = this.props.cart

        // syntax splice untuk menghapus
        tempCart.splice(index, 1)
        console.log(tempCart)

        Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)

                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                    .then((res) => this.props.LOG_IN(res.data))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    handleMinus = () => {
        if (this.state.newQty === 1) return

        this.setState({ newQty: this.state.newQty - 1 })
    }

    handlePlus = (index) => {
        // get stock from data product that we want to edit
        // tempStock adalah variabel penampung untuk stock product yang ingin kita edit
        let tempStock

        // penampung product yang ingin kita edit di dalam cart
        let tempProdCart = this.props.cart[index]

        // console.log(tempProdCart)
        this.state.listProd.forEach(item => {
            if (item.name === tempProdCart.name) {
                tempStock = item.stock
            }
        })

        if (this.state.newQty === tempStock) return this.setState({ errQty: true })

        this.setState({ newQty: this.state.newQty + 1 })
    }

    handleDone = (index) => {
        // mengganti data pesanan suatu produk berdasarkan index
        // tempProduct adalah tempat penyimpanan sementara data product yang ingin diedit
        let tempProduct = this.props.cart[index]

        // mengganti data cart untuk product yang ingin diganti
        let tempPrice
        // console.log(tempProdCart)
        this.state.listProd.forEach(item => {
            if (item.name === tempProduct.name) {
                tempPrice = item.price
            }
        })

        tempProduct.qty = parseInt(this.state.newQty)
        tempProduct.total = this.state.newQty * tempPrice
        console.log(tempProduct)

        // memasukan object pesanan product yang baru, ke dalam array cart yang lama
        // tempCart adalah tempat penampungan sementara data cart user yang lama
        let tempCart = this.props.cart

        // syntax splice untuk mereplace
        tempCart.splice(index, 1, tempProduct)
        console.log(tempCart)

        // mengirim perubahan ke database json
        Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)

                // update data di redux
                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                    .then((res) => {
                        this.props.LOG_IN(res.data)
                        this.setState({ selectedIndex: null })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    totalPrice = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.total)
        // console.log(counter)
        return counter
    }

    checkOut = () => {
        if (this.props.cart.length === 0) return this.setState({ cartEmpty: true })

        this.setState({ reqConf: true })
    }

    confirm = () => {
        // kurangi stock
        let tempProduct = this.state.listProd
        let tempCart = this.props.cart
        tempProduct.forEach(itemprod => {
            tempCart.forEach(itemcart => {
                if (itemcart.name === itemprod.name) {
                    itemprod.stock -= itemcart.qty
                }
            })
        })
        // console.log(tempProduct)

        // siapkan data
        let history = {
            idUser: localStorage.id,
            email: this.props.email,
            date: new Date().toLocaleString(),
            total: this.totalPrice(),
            product: this.props.cart,
            status: "BELUM DI BAYAR"
        }
        console.log(history)

        // update data history user
        Axios.post('http://localhost:2000/history', history)
            .then((res) => {
                console.log(res.data)

                // kosongkan cart dan update database
                Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: [] })
                    .then((res) => {
                        console.log(res.data)


                        // mengurangi stock
                        tempProduct.forEach((item, index) => {
                            Axios.put(`http://localhost:2000/products/${index + 1}`, item)
                                .then(res => {
                                    console.log(res.data)

                                    // update redux
                                    Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                                        .then((res) => {
                                            console.log(res.data)
                                            this.props.LOG_IN(res.data)
                                            this.setState({ reqConf: false, toHistory: true })
                                        })
                                        .catch((err) => console.log(err))
                                })
                                .catch(err => console.log(err))
                        })
                        
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    renderTHead = () => {
        return (
            <thead style={{ textAlign: "center" }}>
                <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    renderTBody = () => {
        return (
            <tbody>
                {this.props.cart.map((item, index) => {
                    if (this.state.selectedIndex === index) {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: "center" }}>
                                    <Image style={{ width: 120, height: 70 }} src={item.image} rounded />
                                </td>
                                <td>{item.name}</td>
                                <td style={{ textAlign: "center" }}>
                                    <Button onClick={this.handleMinus}>-</Button>
                                    {this.state.newQty}
                                    <Button onClick={() => this.handlePlus(index)}>+</Button>
                                </td>
                                <td style={{ textAlign: "center" }}>IDR {item.total.toLocaleString()}</td>
                                <td style={{ textAlign: "center" }}>
                                    <Button variant='success' onClick={() => this.handleDone(index)} style={{ marginRight: '15px' }}>Done</Button>
                                    <Button variant='danger' onClick={() => this.setState({ selectedIndex: null })}>Cancel</Button>
                                </td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{ textAlign: "center" }}>
                                <Image style={{ width: 120, height: 70 }} src={item.image} rounded />
                            </td>
                            <td>{item.name}</td>
                            <td style={{ textAlign: "center" }}>{item.qty}</td>
                            <td style={{ textAlign: "center" }}>IDR {item.total.toLocaleString()}</td>
                            <td style={{ textAlign: "center" }}>
                                <Button variant='warning' onClick={() => this.setState({ selectedIndex: index, newQty: item.qty })} style={{ marginRight: '15px' }}>Edit</Button>
                                <Button variant='danger' onClick={() => this.handleDelete(index)}>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    render() {
        const { reqConf, errQty, cartEmpty, toHistory } = this.state

        // redirect ke history kalau user berhasil check out
        if (toHistory) return <Redirect to='/history' />
        // console.log(this.props.cart)

        return (
            <div style={{ marginTop: '70px', padding: '0 15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>Ini Cart Page</h1>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button onClick={this.checkOut} variant="success">Checkout</Button>
                    </div>
                </div>
                <Table striped bordered hover variant="dark">
                    {this.renderTHead()}
                    {this.renderTBody()}
                </Table>
                <h1 style={{ textAlign: 'right' }}>Total: IDR {this.totalPrice().toLocaleString()}</h1>
                <Modal show={reqConf} onHide={() => this.setState({ reqConf: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure to checkout?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqConf: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confirm} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errQty} onHide={() => this.setState({ errQty: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Quantity can't be more than stock for this product</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errQty: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={cartEmpty} onHide={() => this.setState({ cartEmpty: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Make Sure Your Cart Is Not Empty!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ cartEmpty: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

// mapStateToProps digunakan ketika kita ingin mengambil data dari redux
const mapStateToProps = (state) => {
    return {
        email: state.user.email,
        cart: state.user.cart,
    }
}

export default connect(mapStateToProps, { LOG_IN })(CartPage)