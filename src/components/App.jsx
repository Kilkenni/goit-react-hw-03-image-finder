import React, { Component } from "react";

import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";

export default class App extends Component {
  state = {
    searchString: "",
  }

  onSearch = (searchObject) => {
    this.setState(searchObject);
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
        
        {this.state.searchString && <ImageGallery searchString={this.state.searchString }/>}
      </div>
    );
  } 
};
