import React, {Component} from "react";
import propTypes from "prop-types";

import ImageGalleryItem from "../ImageGalleryItem";
import Button from "components/Button";
import Loader from "components/Loader";
import Modal from "components/Modal";
import PixabayFetch from "js/Pixabay";
import styles from "./ImageGallery.module.css";

class ImageGallery extends Component {
    state = {
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

    async componentDidMount() {
        this.pixabayFetcher.setSearch(this.props.searchString);
        await this.fetchImages();     
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.searchString !== this.props.searchString) {
            this.pixabayFetcher.setSearch(this.props.searchString);
            this.setState({ page: 1 }); //reset page to 1
            await this.fetchImages();
        }
        else if (prevState.page !== this.state.page) {
            await this.fetchImages();
            // console.log(`New search string: ${this.props.searchString}`)

            //soft scrolling uses Ref assigned to UL element in render()
            const cardHeight = this.galleryElem.firstElementChild.clientHeight;
            //alternative: this.galleryElem.firstElementChild.getBoundingClientRect().height;
            window.scrollBy({ top: cardHeight * 2 * (this.state.page - 1), behavior: "smooth", }); //scrolling down by 2 rows
        }
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

            if (this.state.page === 1) {
                this.setState({ imageDataArray: response.hits, imagesFound: response.total});
            }
            else {
                this.setState((prevState) => {
                    return { imageDataArray: [...prevState.imageDataArray, ...response.hits], imagesFound: response.total };
                });
            }
            this.setState({ error: null, status: "success" });
            //console.log(this.state.imageDataArray);
        } catch (error) {
            this.setState({ error, status: "error" });    
        }
    }

    render() {
        const { imageDataArray, imagesFound } = this.state;
        
        switch (this.state.status) {
            case "idle":
                return <></>;
            case "loading":
            case "success": {               
                return (<>
                    <ul className={styles.ImageGallery} ref={(galleryUL) => { this.galleryElem = galleryUL }}>
                        {imageDataArray.map((imageData) => <ImageGalleryItem imageData={imageData} key={imageData.id} onModal={this.toggleModalImage} />)}
                    </ul>

                    { (this.state.status === "loading") && <Loader />}

                    {(imageDataArray.length > 0 && this.state.status === "success") && <Button onLoadMore={this.nextPage}
                        disabled={!(imagesFound > imageDataArray.length)} />}
                    
                    {this.state.showModalImage && <Modal onClose={this.toggleModalImage}>
                        <img src={this.state.modalImage} alt={ this.state.modalImageAlt } loading="lazy"/>
                    </Modal>}
                </>
                );
            }
            case "error":
                return <p>{this.state.error.message}</p>;
            default:
                throw new Error("Incorrect status in state of component <ImageGallery>");
        }

    }
}

ImageGallery.propTypes = {
    searchString: propTypes.string,
    // onModal: propTypes.func.isRequired,
}

export default ImageGallery;