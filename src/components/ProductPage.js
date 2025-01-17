import React, {useEffect, useState} from 'react';
import {useParams, Link} from "react-router-dom";
import {Result, Button, Space, Image, Card, Typography, Rate, Popover, Progress, Breadcrumb, Spin} from 'antd';
import Icon, { BarcodeOutlined, IdcardOutlined, CopyOutlined,  BookOutlined, TranslationOutlined, FieldNumberOutlined, FullscreenOutlined } from '@ant-design/icons';
import {findTag, emptyProduct} from "../utils";
import {ProductForm} from "./ProductForm";
import { DataModel } from "./DataModel.tsx"
const { Title } = Typography;



export const ProductPage = () => {

    const [editFormVisible, setEditFormVisible] = useState(false)

    const params = useParams();

    const attributesIcons = {
        "isbn-10": BarcodeOutlined,
        "author": IdcardOutlined,
        "publisher": CopyOutlined,
        "paperback": BookOutlined,
        "language": TranslationOutlined,
        "isbn-13": FieldNumberOutlined,
        "dimensions": FullscreenOutlined
    }
    const [dataLoaded, setDataLoaded] = useState(false)
    const [product, setProduct] = useState(emptyProduct)
    useEffect(() =>{
        DataModel.getProduct(params.usin)
            .then(product => {
                setProduct(product);
                setDataLoaded(true);
            })
            .catch(err => console.error(err))
    }, [params.usin])

    if (!product) {
        return <Result
            status="404"
            title="404"
            subTitle="Sorry, the product you are trying to find does not exist."
            extra={<Link to={'/products'}><Button type="primary">Back Home</Button></Link>}
        />
    }

    let tags = null
    if (findTag(product.tag)) {
        let tags_r = [findTag(product.tag).title];
        let t_parent = findTag(product.tag).parent
        while (t_parent) {
            tags_r.push(findTag(t_parent).title)
            t_parent = findTag(t_parent).parent
        }
        tags = tags_r.reverse()
    }

    let totalRatings = product.ratings ? product.ratings.reduce((a, b) => (
            {
                sum: a.sum + b.rate * b.amount,
                amount: a.amount + b.amount
            }
        ),
        {
            sum: 0,
            amount: 0
        }
    ) : {
        sum: 0,
        amount: 0
    };
    const overallRating = product.ratings ? (totalRatings.sum / totalRatings.amount).toFixed(2) : 0;

    const closeEditForm = () => {
        setEditFormVisible(false)
    }

    const deleteProduct = (usin) => {
        console.log("Here was an attempt to delete product #"+usin)
    }

    return  <>
        {editFormVisible && <ProductForm product={product} close_form={closeEditForm} formVisible={editFormVisible}/>}
        {tags !== null && <Breadcrumb style={{marginBottom: 15}}>
            {tags.map(tag => <Breadcrumb.Item>{tag}</Breadcrumb.Item>)}
        </Breadcrumb>}
        {dataLoaded === true ?
        <Space align="start">
            <Space direction="vertical" align="center">
                <Image
                    width={300}
                    src={product.images[0]}
                />
                <Button style={{width: 300}} onClick={() => {setEditFormVisible(true)}}>Edit this product</Button>
                <Button style={{width: 300}} danger onClick={() => {deleteProduct(product.usin)}}>Delete product</Button>
            </Space>
            <div style={{ width: "calc(90vw - 500px)"}}>
                <Title ellipsis={{ rows: 2, expandable: true }} level={3}>{product.title}</Title>
            <Card bordered={false} title={
                <Space direction="vertical">
                    {"Author(s): "+product.attributes.author}
                    { product.ratings && <Popover content={
                            product.ratings.map(rating =>
                                <div>{rating.rate}<Progress strokeColor={{from:'#ffa500', to:'#ffff00'}} percent={Math.round((rating.amount / totalRatings.amount).toFixed(2)*100)}/></div>
                            )
                    } title={'Rating statistics'}>
                        <div>{overallRating.toString()+' '}<Rate allowHalf disabled defaultValue={ Math.round(overallRating*2)/2}/></div>
                    </Popover> }
                </Space>
                }>
                <Space direction="vertical" align="start">
                    <Space>
                        {product.sellOptions.map(option => <Button shape="round" style={{height: 80}}>
                            <Space direction="vertical" align="center">
                                <b>{option.type}</b>
                                <div>{option.price}{option.currency === "EUR" ? '€' : option.currency}</div>
                            </Space>
                            </Button>)}
                    </Space>
                    {product.description}
                    <Space align="start">
                        {Object.entries(product.attributes).map(([key, value]) =>
                            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", alignContent: "space-between" }}>
                                <Icon component={attributesIcons[key]}/>
                                <b>{key}</b>
                                {value}
                            </div>)
                        }
                    </Space>
                </Space>
            </Card>
            </div>
        </Space> : <Space style={{width: "100%"}} direction="vertical" align="center"> <Spin size="large" tip="Loading..." /> </Space>}
    </>
}