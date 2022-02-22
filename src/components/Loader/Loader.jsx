import { Hearts } from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import styles from "./Loader.module.css";

const Loader = () => {
    return <div className={styles.loader}>
                <Hearts
                    color="red"
                    height="200"
                    width="200"
                    ariaLabel='Loading images'                  
                />
            </div>;
}

export default Loader;