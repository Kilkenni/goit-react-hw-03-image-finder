import propTypes from "prop-types";

import styles from "./ImageGalleryItem.module.css";

const ImageGalleryItem = ({ imageData }) => {
    const { webformatURL, tags} = imageData;

    return (
        <li className={styles.ImageGalleryItem}>
            <img src={webformatURL} alt={tags} loading="lazy" className={ styles["ImageGalleryItem-image"]}/>
        </li>
    );
}

ImageGalleryItem.propTypes = {
    imageData: propTypes.shape({
        // id: propTypes.number.isRequired,
        webformatURL: propTypes.string.isRequired,
        tags: propTypes.string.isRequired,
    }).isRequired,
}

export default ImageGalleryItem;