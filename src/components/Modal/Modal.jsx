import propTypes from "prop-types";
import React, {Component} from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

const modalRoot = document.querySelector("#modal-root");

export default class Modal extends Component {
    componentDidMount() {
        window.addEventListener('keydown', this.closeOnKeydown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.closeOnKeydown);
    }

    closeOnKeydown = (event) => {       
        if (event.code === "Escape") {
            this.props.onClose();
        }
    }

    closeOnBackdrop = (event) => {
        if (event.target === event.currentTarget) {
            this.props.onClose();
        }     
    }

    render() {
        return createPortal(
            <div className={ styles.Overlay } onClick={this.closeOnBackdrop}>
                <div className={styles.Modal}>
                    {this.props.children}
                </div>
            </div>,
            modalRoot
        ); 
    }
}

Modal.propTypes = {
    children: propTypes.node,
    onClose: propTypes.func.isRequired,
}

// export default Modal;