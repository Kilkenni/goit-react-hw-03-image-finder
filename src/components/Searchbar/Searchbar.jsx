import React, { Component } from "react";
import propTypes from "prop-types";

import styles from "./Searchbar.module.css"

export default class Searchbar extends Component {
    state = {
        searchString: "",
    }

    onInputChange = (event) => {
        const { value } = event.target;
        this.setState({searchString: value,});
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit({...this.state});
        this.setState({ searchString: "", }); //reset form
    }

    render() {
        return (
            <header className={styles.Searchbar}>
                <form action="submit" className={styles.SearchForm} onSubmit={this.onFormSubmit}>
                    <input 
                        type="text" 
                        name="Search" 
                        className={styles["SearchForm-input"]} 
                        value={this.state.searchString} 
                        onChange={this.onInputChange} 
                        autocomplete="off" 
                        autofocus
                        placeholder="Search images and photos"/>
                    <button type="submit" className={styles['SearchForm-button']}>
                        <span className={styles['SearchForm-button-label']}>Search</span>
                    </button>
                </form>
            </header>         
        );
    }
}

Searchbar.propTypes = {
    onSubmit: propTypes.func,
}