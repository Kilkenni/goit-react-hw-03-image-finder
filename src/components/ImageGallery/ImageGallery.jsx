import React, {Component} from "react";
import propTypes from "prop-types";

import ImageGalleryItem from "../ImageGalleryItem";
import PixabayFetch from "js/Pixabay";
import styles from "./ImageGallery.module.css";



class ImageGallery extends Component {
    state = {
        page: 1,
        imageDataArray: [],
        error: null,
        status: "idle", // idle|loading|error|success
    }

    pixabayFetcher = new PixabayFetch(this.props.searchString);

    async fetchImages() {
        this.setState({ status: "loading" });

        this.pixabayFetcher.setSearch(this.props.searchString);

        // console.log(PixabayFetcher.composeQuery());
        try {
            const response = await this.pixabayFetcher.fetchImages(this.state.page);

            if (this.state.page === 1) {
                this.setState({ imageDataArray: response.hits });
            }
            else {
                this.setState((prevState) => {
                    return { imageDataArray: [...prevState.imageDataArray, ...response.hits] };
                });
            }
            this.setState({ error: null, status: "success" });
        } catch (error) {
            this.setState({ error, status: "error" });    
        }
    }

    async componentDidMount() {
        await this.fetchImages();     
    }

    async componentDidUpdate(prevProps, prevState) {
        if ((prevProps.searchString !== this.props.searchString) || (prevState.page !== this.state.page)) {
            await this.fetchImages();
            // console.log(`New search string: ${this.props.searchString}`)
        }
    }

    componentWillUnmount() {
        this.pixabayFetcher.abortFetch();
    }

    render() {
        const { imageDataArray } = this.state;
        
        switch (this.state.status) {
            case "idle":
                return <></>;
            case "loading": 
                return <p>Loading...</p>
            case "error": 
                return <p>{this.state.error.message}</p>;
            case "success": 
                return (<ul className={styles.ImageGallery}>
                    {imageDataArray.map((imageData) => <ImageGalleryItem imageData={imageData} key={imageData.id} />)}
                </ul>);
            default:
                throw new Error("Incorrect status in state of <ImageGallery>");
        }

    }
}

ImageGallery.propTypes = {
    searchString: propTypes.string,
}

export default ImageGallery;