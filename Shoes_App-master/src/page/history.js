import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

import {
    Accordion,
    Table,
    Image,
    Card,
    Button
} from 'react-bootstrap'

import { getHistory } from '../action'

class HistoryPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            product: []
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:2000/history?idUser=${localStorage.id}`)
            .then((res) => {
                console.log(res.data)
                this.props.getHistory(res.data)

                Axios.get('http://localhost:2000/products')
                    .then(res => {
                        this.setState({ product: res.data })
                    })
                    .catch(err => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    cancel = (idHistory, index) => {
        let prodCart = this.props.history[index].product
        console.log(prodCart)
        console.log(this.state.product)

        prodCart.forEach(cart => {
            this.state.product.forEach(product => {
                if (cart.id === product.id)
                    Axios.patch(`http://localhost:2000/products/${product.id}`, { stock: cart.qty + product.stock })
                        .then(res => console.log(res.data))
                        .catch(err => console.log(err))
            })
        });

        Axios.delete(`http://localhost:2000/history/${idHistory}`)
            .then((res) => {
                console.log(res.data)

                Axios.get(`http://localhost:2000/history?idUser=${localStorage.id}`)
                    .then((res) => {
                        console.log(res.data)
                        this.props.getHistory(res.data)
                    })
                    .catch((err) => console.log(err))
            })
            .catch(err => console.log(err))
    }

    renderTBody = () => {
        return (
            <Accordion>
                {this.props.history.map((item, index) => {
                    return (
                        <Card key={index}>
                            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Accordion.Toggle as={Button} variant="link" eventKey={index + 1}>
                                    Date: {item.date}, Total Purchasing: IDR {item.total.toLocaleString()}, {item.status}
                                </Accordion.Toggle>
                                <Button onClick={() => this.cancel(item.id, index)} variant="danger">Cancel</Button>
                            </Card.Header>
                            <Accordion.Collapse eventKey={index + 1}>
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.product.map((item2, index2) => {
                                            return (
                                                <tr key={index2}>
                                                    <td>{index2 + 1}</td>
                                                    <td>
                                                        <Image src={item2.image} style={{ height: 70, width: 120 }} rounded />
                                                    </td>
                                                    <td>{item2.name}</td>
                                                    <td>{item2.qty}</td>
                                                    <td>IDR {item2.total.toLocaleString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Accordion.Collapse>
                        </Card>
                    )
                })}
            </Accordion>
        )
    }

    render() {
        if (!this.props.email) return <Redirect to='/login' />

        return (
            <div style={{ marginTop: '70px', padding: '0 20px' }}>
                <h1>History Transaction</h1>
                {this.renderTBody()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email,
        history: state.history
    }
}

export default connect(mapStateToProps, { getHistory })(HistoryPage)
