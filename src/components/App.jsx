import React, { Component } from "react";

import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
import Modal from "./Modal";
import Button from "components/Button";
import Loader from "components/Loader";
import PixabayFetch from "js/Pixabay";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default class App extends Component {
  state = {
    searchString: "",
    page: 1,
    imagesFound: 0,
    imageDataArray: [],
    error: null,
    status: "idle", // idle|loading|error|success
    showModalImage: false,
    modalImage: undefined,
    modalImageAlt: undefined,
  }

  pixabayFetcher = new PixabayFetch();

  async componentDidUpdate(prevProps, prevState) {
    if ((prevState.searchString !== this.state.searchString) || (prevState.page !== this.state.page)) {
      this.pixabayFetcher.setSearch(this.state.searchString);
      //await this.setState({ page: 1 }); //reset page to 1
      await this.fetchImages();
    }
    //else if (prevState.page !== this.state.page) {
      //await this.fetchImages();
      // console.log(`New search string: ${this.props.searchString}`)

      /*
      //soft scrolling uses Ref assigned to UL element in render()
      const cardHeight = this.galleryElem.firstElementChild.clientHeight;
      //alternative: this.galleryElem.firstElementChild.getBoundingClientRect().height;
      window.scrollBy({ top: cardHeight * 2 * (this.state.page - 1), behavior: "smooth", }); //scrolling down by 2 rows
      */
    //}
  }

  componentWillUnmount() {
      this.pixabayFetcher.abortFetch();
  }

  toggleModalImage = (imageID = undefined) => {
    if (imageID !== undefined) {
      const modalImageData = this.state.imageDataArray.find((imageData) => {
          return imageData.id === imageID;
      });

      this.setState({
        showModalImage: true,
        modalImage: modalImageData.largeImageURL,
        modalImageAlt: modalImageData.tags,
      });
    }
    else {
      this.setState({
        showModalImage: false,
        modalImage: undefined,
        modalImageAlt: undefined,
      })
    }
  } 

  nextPage = () => {
      //switch to next page only if there is one
      if (this.state.imagesFound > this.state.imageDataArray.length) {
          this.setState((prevState) => {
              return { page: prevState.page + 1 };
          });
      }  
  }

  async fetchImages() {
      this.setState({ status: "loading" });

      // this.pixabayFetcher.setSearch(this.props.searchString);

      // console.log(PixabayFetcher.composeQuery());
      try {
        const response = await this.pixabayFetcher.fetchImages(this.state.page);

        //pick from response.hits only the fields we actually use to avoid cluttering state
        const filteredImageDataArray = response.hits.map(({id, largeImageURL, webformatURL, tags}) => {
          return {id, largeImageURL, webformatURL, tags};
        });

        if (this.state.page === 1) {
            this.setState({ imageDataArray: filteredImageDataArray, imagesFound: response.total});
        }
        else {
            this.setState((prevState) => {
                return { imageDataArray: [...prevState.imageDataArray, ...filteredImageDataArray], imagesFound: response.total };
            });
        }
        this.setState({ error: null, status: "success" });
        //console.log(this.state.imageDataArray);
        if (this.state.imagesFound === 0) {
          toast.warning("No images found matching this request.");
        }
      } catch (error) {
        this.setState({ error, status: "error" });
        toast.error("Unable to retrieve images from the server. Try again?");
      }
  }

  onSearch = (searchObject) => {
    this.setState({ ...searchObject, page: 1 });
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

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        {(this.state.imageDataArray.length > 0) && <ImageGallery
          imageDataArray={this.state.imageDataArray}
          onModal={this.toggleModalImage} />}
        
        {(this.state.status === "loading") && <Loader />}
      
        {(this.state.status === "success") && <Button onLoadMore={this.nextPage}
            disabled={!(this.state.imagesFound > this.state.imageDataArray.length)} />}

        {this.state.showModalImage && <Modal onClose={this.toggleModalImage}>
            <img src={this.state.modalImage} alt={ this.state.modalImageAlt } loading="lazy"/>
        </Modal>}

      </div>
    );
  } 
};
