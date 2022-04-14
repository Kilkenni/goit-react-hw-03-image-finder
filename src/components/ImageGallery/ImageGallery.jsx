import propTypes from "prop-types";

import ImageGalleryItem from "../ImageGalleryItem";
//import Modal from "components/Modal";
//import PixabayFetch from "js/Pixabay";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({ imageDataArray, onModal }) => {          
    return (<>
        <ul className={styles.ImageGallery}>
            {imageDataArray.map((imageData) => <ImageGalleryItem imageData={imageData} key={imageData.id} onModal={onModal} />)}
        </ul>
    </>
    );
}

ImageGallery.propTypes = {
    imageDataArray: propTypes.arrayOf(
        propTypes.shape({
            id: propTypes.number.isRequired,
        })
    ).isRequired,
    onModal: propTypes.func.isRequired,
}

export default ImageGallery;