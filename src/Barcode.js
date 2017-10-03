import React, { Component } from "react";
import "./Barcode.css";
class Barcode extends Component {
    constructor(props) {
        super(props);

        this.USB_FILTERS = [
            { vendorId: 0x046D, productId: 0xC31C } // 10lb barcode
        ];

        this.state = {
            connected: false,
            device: null,
            shouldRead: null,
            weight: "?",
            unit: "",
            barcodeState: "",
            errorMsg: null,
            chars: [],
            barcodeValue: 33,
            presed: false
        };

        if (navigator.usb) {
            navigator.usb.getDevices({ filters: this.USB_FILTERS }).then(devices => {
                devices.forEach(device => {
                    this.bindDevice(device);
                });
            });

            navigator.usb.addEventListener("connect", e => {
                console.log("device connected", e);
                this.bindDevice(e.device);
            });

            navigator.usb.addEventListener("disconnect", e => {
                console.log("device lost", e);
                this.disconnect();
            });

            this.connect = () => {
                navigator.usb
                    .requestDevice({ filters: this.USB_FILTERS })
                    .then(device => this.bindDevice(device))
                    .catch(error => {
                        console.error(error);
                        this.disconnect();
                    });
            };
        }

        this.bindDevice = this.bindDevice.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.bindToInput = this.bindToInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    bindDevice(device) {
        device
            .open()
            .then(() => {
                console.log(
                    `Connected ${device.productName} ${device.manufacturerName}`,
                    device
                );
                this.setState({ connected: true, device: device });

                if (device.configuration === null) {
                    return device.selectConfiguration(1);
                }
            })
            .then(() => device.claimInterface(0))
            .then(() => this.bindToInput())
            .catch(err => {
                console.error("USB Error", err);
                this.setState({ errorMsg: err.message });
            });
    }

    bindToInput() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
        var self = this;
        console.log(this);
        if (e.which >= 48 && e.which <= 57) {
            self.state.chars.push(String.fromCharCode(e.which));
        }

        if (self.pressed === false) {
            setTimeout(function() {
                if (self.state.chars.length >= 10) {
                    self.barcodeValue = self.state.chars.join("");
                }

                self.chars = [];
                self.pressed = false;
        		console.log(self.barcodeValue)
            }, 500);
        }
        this.pressed = true;
    }

    disconnect() {
        this.setState({
            device: null,
            connected: false,
            barcodeState: "",
            errorMsg: "",
            barcodeValue: null
        });
    }

    render() {
        const {
            device,
            connected,
            barcodeState,
            errorMsg,
            barcodeValue
        } = this.state;

        return (
	      <div>
	        {errorMsg &&
	          <p>
	            {errorMsg}
	          </p>}
	          {!device && <button onClick={this.connect}>Register Device</button>}
	         <label htmlFor="barcode">Barcode: </label>
	        <input type="text" name="barcode" id="barcode" value={this.barcodeValue} />
	      </div>
	    );
    }
}

export default Barcode;