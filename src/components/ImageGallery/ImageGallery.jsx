import React, {Component} from "react";
import propTypes from "prop-types";

import ImageGalleryItem from "../ImageGalleryItem";
import Button from "components/Button";
import Loader from "components/Loader";
import PixabayFetch from "js/Pixabay";
import styles from "./ImageGallery.module.css";



class ImageGallery extends Component {
    state = {
        page: 1,
        imagesFound: 0,
        imageDataArray: [],
        error: null,
        status: "idle", // idle|loading|error|success
    }

    pixabayFetcher = new PixabayFetch();

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
        } catch (error) {
            this.setState({ error, status: "error" });    
        }
    }

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
        }
    }

    componentWillUnmount() {
        this.pixabayFetcher.abortFetch();
    }

    render() {
        const { imageDataArray, imagesFound } = this.state;
        
        switch (this.state.status) {
            case "idle":
                return <></>;
            case "loading":
                return <Loader />;
            case "error": 
                return <p>{this.state.error.message}</p>;
            case "success": 
                return (<>
                    <ul className={styles.ImageGallery}>
                        {imageDataArray.map((imageData) => <ImageGalleryItem imageData={imageData} key={imageData.id} />)}
                    </ul>
                    {(imageDataArray.length > 0) && <Button onLoadMore={this.nextPage}
                        disabled={ !(imagesFound > imageDataArray.length)}/>}
                </>
                    );
            default:
                throw new Error("Incorrect status in state of component <ImageGallery>");
        }

    }
}

ImageGallery.propTypes = {
    searchString: propTypes.string,
}

export default ImageGallery;