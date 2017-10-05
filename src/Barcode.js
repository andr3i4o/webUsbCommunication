import React, { Component } from "react";
import "./Barcode.css";
class Barcode extends Component {
    constructor(props) {
        super(props);

        this.state = {            
            chars: [],
            barcodeValue: '',
            pressed: false
        };   

        
        this.bindToInput = this.bindToInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }    

    componentDidMount (){
        this.bindToInput();
    }

    bindToInput() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
        var self = this,
            newChars = this.state.chars;

        if (e.which >= 48 && e.which <= 57) {
            newChars.push(String.fromCharCode(e.which));
        }

        if ( e.which === 13 ) {
            e.preventDefault();
        }

        if (self.state.pressed === false) {
            self.setState({chars: newChars});

            setTimeout(function() {
                if (self.state.chars.length >= 10) {
                    let value = self.state.chars.join('');
                    self.setState({barcodeValue: value});
                }

                self.setState({
                    chars: [],
                    pressed: false
                });
            }, 500);
        }

        self.setState({
            pressed: true
        });
    }    

    render() {
        const {            
            barcodeValue
        } = this.state;

        return (
	      <div>	        
	        <label htmlFor="barcode">Barcode: </label>
	        <input type="text" name="barcode" id="barcode" value={barcodeValue} />
	      </div>
	    );
    }
}

export default Barcode;