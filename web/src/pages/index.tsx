import * as React from 'react';
import { Link } from 'gatsby';

import Page from '../components/Page';
import Container from '../components/Container';
import IndexLayout from '../layouts';
import Dropzone from 'react-dropzone'
import { Card, Pagination } from 'react-rainbow-components';
import axios from 'axios';
import {Button, Modal} from "react-rainbow-components/components";
import linepay_icon from '../icons/linepay_logo.png'
const QRCode = require('qrcode.react');

interface ProductsState {
  products: any[],
  openNumber: number | undefined,
}

class IndexPage extends React.Component<{}, ProductsState> {

  constructor(props: any) {
    super(props)
    this.state = {
      products: [],
      openNumber: undefined,
    };
    this.loadContents();
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this)
    this.onFileDrop = this.onFileDrop.bind(this)
  }

  async loadContents(): Promise<any[]> {
    const res = await axios.get( process.env.API_BASE_URL + '/images')
    this.setState({
      products: res.data,
    });
    return this.state.products;
  }

  handleOnClick(product: any) {
    return this.setState({ openNumber: product.image_id });
  }

  handleOnClose() {
    return this.setState({ openNumber: undefined });
  }

  getContent() {
//    const { activePage } = this.state;
//    const lastItem = activePage * this.PER_PAGE;
//    const firstItem = lastItem - this.PER_PAGE;
    return this.state.products.map((product) => (
      <Card
        key={product.image_id}
        title={product.name}
        style={{ width: 240 }}
        className="rainbow-m-bottom_x-large rainbow-m-right_small"
        footer={
          <div>
            <div className="rainbow-font-size-text_large rainbow-color_dark-1">{product.price} {product.currency}</div>
            <Button
              label="購入する"
              onClick={(e) => this.handleOnClick(product)}
              variant="brand"
              className="rainbow-m-around_medium"
            />
          </div>
        }
      >
        <div style={{width: '100%', height: 240, backgroundImage: `url(${product.image_url})`, backgroundSize: 'cover'}} />
        <Modal
            id="modal-1"
            title={product.name}
            isOpen={this.state.openNumber === product.image_id}
            onRequestClose={this.handleOnClose}
        >
          <div className="rainbow-align-content_center">
            <a href={process.env.API_BASE_URL + '/line/pay/reserve?product_id=' + product.image_id}>
              <img
                src={linepay_icon}
              />
            </a>
          </div>
          <div>
            <QRCode value={process.env.API_BASE_URL + '/line/pay/reserve?product_id=' + product.image_id} />
          </div>
        </Modal>
      </Card>
    ));
  }

  onFileDrop(acceptedFiles){
    console.log(acceptedFiles)
    const params = new FormData();
    for(const file of acceptedFiles){
      params.append('file', file);
    }
    axios.post(
      'http://localhost:3000/dev/uploadFile',
      params,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
    ).then((result) => {
      console.log(result);
    });
  }

  render():
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | string
    | number
    | {}
    | React.ReactNodeArray
    | React.ReactPortal
    | boolean
    | null
    | undefined {
      return (
        <IndexLayout>
          <Page>
            <Container>
              <div>
                <div className="rainbow-p-around_xx-large rainbow-align-content_center rainbow-flex_column">
                  <div className="rainbow-flex rainbow-justify_space-around rainbow-flex_wrap">{this.getContent()}</div>
                </div>
              </div>
              <Dropzone
                onDrop={this.onFileDrop}>
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                  </section>
                )}
               </Dropzone>
            </Container>
          </Page>
        </IndexLayout>
    );
  }
}

export default IndexPage

