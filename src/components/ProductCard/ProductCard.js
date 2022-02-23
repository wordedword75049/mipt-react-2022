import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import {ProductSellOptions} from '../Common/ProductSellOptions/ProductSellOptions'
import {ProductRating} from '../Common/ProductRating/ProductRating'

import './ProductCard.css'


export const ProductCard = (props) => {
    let product = props.product;
    return <Container className="product-card">
        <Row>
            <Col md="auto">
                <img height={300} src={product.images[0]} alt={product.title}/>
            </Col>
            <Col>
                <Row>
                    <h1 className="product-card__title">{product.title}</h1>
                    <span className="product-card__author">by {product.attributes.author}</span>
                </Row>
                <Row>
                    <ProductRating ratings={product.ratings}/>
                </Row>
                <Row className="bottom-selloptions">
                    <ProductSellOptions sellOptions={product.sellOptions}/>
                </Row>
            </Col>
        </Row>
        <Row>
            <h2>Product description</h2>
            <p>{product.description}</p>
        </Row>
        <Row>
            <h2>Product details</h2>
            <Table striped bordered hover className="product-details-table">
                <tbody>
                    {
                        Object.entries(product.attributes).map(([key, value]) =>
                            <tr>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </Row>
    </Container>
}