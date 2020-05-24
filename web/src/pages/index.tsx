import * as React from 'react';
import { Link } from 'gatsby';

import Page from '../components/Page';
import Container from '../components/Container';
import IndexLayout from '../layouts';
import Dropzone from 'react-dropzone'
import axios from 'axios';

class IndexPage extends React.Component {

  constructor(props: any) {
    super(props)
    this.onFileDrop = this.onFileDrop.bind(this)
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
              <h1>Hi people</h1>
              <p>Welcome to your new Gatsby site.</p>
              <p>Now go build something great.</p>
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

