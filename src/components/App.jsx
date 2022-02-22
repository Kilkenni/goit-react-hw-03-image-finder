import React, {Component} from "react";
import Searchbar from "./Searchbar";

export default class App extends Component {
  state = {
    searchString: "",
  }

  onSearch = (searchObject) => {
    this.setState(searchObject);
    //TODO search
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
        <Searchbar onSubmit={(searchObject) => {this.onSearch(searchObject)} }></Searchbar>
      </div>
    );
  } 
};
