import React, { Component } from "react";

import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
//import Modal from "components/Modal";

export default class App extends Component {
  state = {
    searchString: "",
    // showModalImage: false,
    // modalImageId: undefined,
  }

  onSearch = (searchObject) => {
    this.setState(searchObject);
  }

  toggleModalImage = (imageID = undefined) => {

    if (imageID !== undefined) {
      this.setState({
        showModalImage: true,
        modalImageId: imageID,
      });
    }
    else {
      this.setState({
        showModalImage: false,
        modalImageId: undefined,
      })
    }
  }

  render() {
    return (
      <div
        style={{
          height: '100vh',
          // display: 'flex',
          // justifyContent: 'center',
          // alignItems: 'center',
          fontSize: 20,
          // textTransform: 'uppercase',
          color: '#010101',
        }}
      >
        {/* React homework template */}
        <Searchbar onSubmit={(searchObject) => { this.onSearch(searchObject) }}></Searchbar>
        
        {this.state.searchString && <ImageGallery searchString={this.state.searchString} />}

        {/* onModal={this.toggleModalImage} */}

        {/* {this.state.showModalImage && <Modal onClose={this.toggleModal}>
            <img src={largeImageURL} alt={ tags } loading="lazy"/>
        </Modal>} */}
      </div>
    );
  } 
};
