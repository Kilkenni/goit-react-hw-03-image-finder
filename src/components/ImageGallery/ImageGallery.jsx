import propTypes from "prop-types";

import ImageGalleryItem from "../ImageGalleryItem";
import Button from "components/Button";
import Loader from "components/Loader";
//import Modal from "components/Modal";
//import PixabayFetch from "js/Pixabay";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({ imageDataArray, imagesFound, onModal, onNextPage, loading }) => {          
    return (<>
        <ul className={styles.ImageGallery}>
            {imageDataArray.map((imageData) => <ImageGalleryItem imageData={imageData} key={imageData.id} onModal={onModal} />)}
        </ul>

        { loading && <Loader />}

        {!loading && <Button onLoadMore={onNextPage}
            disabled={!(imagesFound > imageDataArray.length)} />}
    </>
    );
}

ImageGallery.propTypes = {
    imageDataArray: propTypes.arrayOf(
        propTypes.shape({
            id: propTypes.number.isRequired,
        })
    ).isRequired,
    imagesFound: propTypes.number.isRequired,
    onModal: propTypes.func.isRequired,
    onNextPage: propTypes.func.isRequired,
    loading: propTypes.bool,
}

export default ImageGallery;