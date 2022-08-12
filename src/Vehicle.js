import React from 'react';
import ReactDOM from 'react-dom/client';

class Car extends React.Component {
    constructor (props) {
        super();
        this.state = {
            size: props.size,
            plate: props.plate,
            assignedLot: 0,
            entered: null,
            exited: null,
            fee: 0
        }

    }
    render() {
        return <p> {this.state.plate } </p> 
    }
}

export default Car;