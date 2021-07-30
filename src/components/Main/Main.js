import React from 'react';
import {Button} from 'react-bootstrap';
import '../Main/styles.css';

function Main({apy, total,stake,unstake, harvest,pendingReward, amount}) {


      return(
        <div className="row align-items-center">
            <div className="col-md-6">
                <h1 className="text-primary main-heading">
                    STAKE YOUR STF TO EARN MORE STF!
                </h1>

                <div className="mt-5" >
                    <h3 className="mt-2" style={{fontWeight:"700"}}>
                        APY : <span className="text-primary">{apy}%</span>
                    </h3>
                </div>
                <div style={{width:"75%",marginTop:"40px"}}>
                    <input type="number" style={{height:"60px", borderRadius:"15px", borderWidth:"3px",}} 
                    className="form-control bg-secondary" id="amount" name="amount" 
                    onChange={amount}
                    placeholder="Enter Amount To Stake/Unstake"/>
                </div>
                <div className="d-flex justify-content-start mt-3">   
                    <Button className="stake" onClick={stake} variant="primary">Stake </Button>
                    <Button className="stake" onClick={unstake} style={{marginLeft:"15px",}} variant="secondary">Unstake</Button>
                </div>
                

            </div>

            <div className="col-md-6" >
                <div className="d-flex bg-primary box flex-column justify-content-center">
                    <div className="inside bg-secondary pb-3 pt-3">
                        <h4>STF STAKED</h4>
                        <h3 className="numbers" style={{textAlign:"right"}}>{total} STF</h3>
                    </div>
                    <div className="inside bg-secondary pb-3 pt-3">
                        <h4>STF EARNED</h4>
                        <h3 className="numbers" style={{textAlign:"right"}}>{pendingReward}</h3>
                        <div className="d-flex justify-content-center">
                            <Button onClick={harvest} className="stake" variant="primary">Collect</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

export default Main;