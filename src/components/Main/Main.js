import React from 'react';
import {Button} from 'react-bootstrap';
import '../Main/styles.css';


class Main extends React.Component {
    render() {
      return(
        <div className="row">
            <div className="col-md-6">
                <h1 className="text-primary main-heading">
                    STAKE YOUR STF TO EARN MORE STF!
                </h1>

                <h4 className="text-primary text-50 mt-4" style={{fontWeight:"400"}}>
                    Works Just Like Magic!
                </h4>

                <div className="mt-5">
                    <h3 style={{fontWeight:"700"}}>
                        Total Staked : <span className="text-primary">53,352 STF</span>
                    </h3>

                    <h3 className="mt-3" style={{fontWeight:"700"}}>
                        APR : <span className="text-primary">6.3%</span>
                    </h3>
                </div>
                <div className="d-flex justify-content-start">   
                    <Button className="stake" variant="primary">Stake</Button>
                    <Button className="stake" style={{marginLeft:"15px",}} variant="secondary">Unstake</Button>
                </div>
                

            </div>

            <div className="col-md-6" >
                <div className="d-flex bg-primary box flex-column align-items-stretch justify-content-center">
                    <div className="inside bg-secondary">
                        <h3>STF STAKED</h3>
                        <h3 className="text-right">0.0</h3>
                    </div>
                    <div className="inside bg-secondary">
                        <h3>STF STAKED</h3>
                        <h3 className="text-right">0.0</h3>
                    </div>
                </div>
            </div>
        </div>
      );
    }
  }

export default Main;