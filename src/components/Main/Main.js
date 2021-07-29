import React from 'react';
import {Button} from 'react-bootstrap';
import '../Main/styles.css';
// import Web3 from 'web3';
// import {contract, abi} from '../../config';

class Main extends React.Component {



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