import propTypes from "prop-types";

import styles from "./Button.module.css";

const Button = ({onLoadMore, disabled}) => {
    return (
        <button type="button" onClick={onLoadMore} className={styles.Button} disabled={disabled}>Load moar</button>  
    );
}

Button.propTypes = {
    onLoadMore: propTypes.func.isRequired,
    disabled: propTypes.bool.isRequired,
}

export default Button;