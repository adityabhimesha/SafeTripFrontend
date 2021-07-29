import React from 'react';
import {Button} from 'react-bootstrap';
import '../Main/styles.css';
import Web3 from 'web3';
import {contract, abi} from '../../config';

class Main extends React.Component {


    async componentDidMount(){
        this.web3 = await this.connectWallet();

        this.contract = new this.web3.eth.Contract(abi, contract)

        console.log(this.contract)
    }

    async connectWallet(){

        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
              await window.ethereum.enable();
              // Acccounts now exposed
              return web3;
            } catch (error) {
              console.error(error);
            }
          }
          // Legacy dapp browsers...
          else if (window.web3) {
            // Use Mist/MetaMask's provider.
            const web3 = window.web3;
            console.log('Injected web3 detected.');
            return web3;
          }
          // Fallback to localhost; use dev console port by default...
          else {
            alert("No Web3 Provider Detected!")
            const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
            const web3 = new Web3(provider);
            console.log('No web3 instance injected, using Local web3.');
            return web3;
          }
    }

    render() {
      return(
        <div className="row align-items-center">
            <div className="col-md-6">
                <h1 className="text-primary main-heading">
                    STAKE YOUR STF TO EARN MORE STF!
                </h1>

                <h4 className="text-primary text-50 mt-4" style={{fontWeight:"400"}}>
                    Works Just Like Magic!
                </h4>

                <div className="mt-3" >
                    <h3 style={{fontWeight:"700"}}>
                        Total Staked : <span className="text-primary">53,352 STF</span>
                    </h3>

                    <h3 className="mt-2" style={{fontWeight:"700"}}>
                        APR : <span className="text-primary">6.3%</span>
                    </h3>
                </div>
                <div className="d-flex justify-content-start mt-3">   
                    <Button className="stake" variant="primary">Stake </Button>
                    <Button className="stake" style={{marginLeft:"15px",}} variant="secondary">Unstake</Button>
                </div>
                

            </div>

            <div className="col-md-6" >
                <div className="d-flex bg-primary box flex-column justify-content-center">
                    <div className="inside bg-secondary pb-3 pt-3">
                        <h4>STF STAKED</h4>
                        <h3 className="numbers" style={{textAlign:"right"}}>0.0</h3>
                    </div>
                    <div className="inside bg-secondary pb-3 pt-3">
                        <h4>STF EARNED</h4>
                        <h3 className="numbers" style={{textAlign:"right"}}>0.0</h3>
                        <div className="d-flex justify-content-center">
                            <Button className="stake" variant="primary">Collect</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    }
  }

export default Main;