import './App.css';
import Header from './components/Navbar/Navbar'
import './custom.scss';
import {Container, Modal, Button} from 'react-bootstrap';
import Main from "./components/Main/Main";
import Web3 from 'web3';
import React from 'react';
import {contract_addr, abi, token_address, token_abi} from './config';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class App extends React.Component {


  constructor(){
    super()

    this.state = {
      web3:undefined,
      contract:undefined,
      apy:80,
      staked:0,
      pendingReward:0,
      addr:"",
      amount:0,
      show_modal:false,
    }

  

    this.connectWallet = this.connectWallet.bind(this)
    this.disconnectWallet = this.disconnectWallet.bind(this)
    this.setWeb3 = this.setWeb3.bind(this)
    this.setContract = this.setContract.bind(this)
    this.stake = this.stake.bind(this)
    this.unstake = this.unstake.bind(this)
    this.harvest = this.harvest.bind(this)
    this.setAddr = this.setAddr.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.update = this.update.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)

  }
  handleClose(){
    this.setState({show_modal : false});
  }
  handleShow(){
    this.setState({show_modal : true})
  }
  
  setAddr(account, web3){
    if(this.state.addr !== ''){
      this.notify('Account Changed', 'info')
    }
    this.setState({addr : account}, () => {
      if(this.state.addr !== ''){
        this.setWeb3(web3)
      }
      
    })
    console.log("addr changed")
  }

  async disconnectWallet(){
    if(this.provider.close){
      await this.provider.close()
    }
    this.setState({addr : ''})
    this.setState({web3 : undefined})
  }

  async connectWallet() {
  

  const providerOptions = {
    metamask: {
      display: {
        name: "Injected",
        description: "Connect with the provider in your Browser"
      },
      package: null
    },
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          56 : 'https://bsc-dataseed1.defibit.io/'
        },
        network: 'binance'
      }
    }
  };

  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    disableInjectedProvider: false,
    providerOptions // required
  })
  web3Modal.clearCachedProvider();
  //var provider

  this.provider = await web3Modal.connect();
  const web3 = new Web3(this.provider);
  this.provider.on('error', e => {
    console.log(e)
  });
  this.provider.on('end', e => console.error('WS End', e));

  this.provider.on('disconnect', (error) => {
    web3Modal.clearCachedProvider();
    this.setState({addr : ''}, () => {
      this.notify('Disconnected Wallet!', 'error')
    })
  });
  this.provider.on('connect', (info) => {
    this.notify(info, 'success')
    console.log('CONNECTED');
  });
  this.provider.on("accountsChanged", (accounts) => {
    this.setAddr(accounts[0], web3)
  });

  const addr = await web3.eth.getAccounts();
  console.log(addr)
  this.setAddr(addr[0], web3)
  
    
  }

  setWeb3(tempWeb3){
    this.setState({web3 : tempWeb3}, () =>{
      var temp = new this.state.web3.eth.Contract(abi, contract_addr)
      this.setContract(temp)
    })
  }

  setContract(tempContract){
    this.setState({contract : tempContract}, async () => {
      var result = await this.state.contract.methods.rewardAPY().call();
      var total = await this.state.contract.methods.userInfo(this.state.addr).call();
      var reward = await this.state.contract.methods.pendingReward(this.state.addr).call();
      this.setState({apy: result})
      
      var temp = total.amount / Math.pow(10, 18)
      var tempPending = reward / Math.pow(10, 18)
      this.setState({staked: temp}) 
      this.setState({pendingReward: tempPending.toFixed(6)})
      console.log("total staked ",temp)
      console.log("reward ",tempPending)
    })
  }

  async update(){
      var result = await this.state.contract.methods.rewardAPY().call();
      var total = await this.state.contract.methods.userInfo(this.state.addr).call();
      var reward = await this.state.contract.methods.pendingReward(this.state.addr).call();
      this.setState({apy: result})
      
      var temp = total.amount / Math.pow(10, 18)
      var tempPending = reward / Math.pow(10, 18)
      this.setState({staked: temp}) 
      this.setState({pendingReward: tempPending.toFixed(6)})
      console.log("total staked ",temp)
      console.log("reward ",tempPending)
  }

  handleChange(event){
    this.setState({amount : event.target.value})
  }

  async stake(){
    if(this.state.addr === ''){
      this.notify('Please Connect Your Wallet', 'error')
      return;
    }

    if(this.state.amount < 1 || this.state.amount === ''){
      this.notify('Enter An Amount Greater Than 1 STF', 'error')
      return;
    }
    var amount = Web3.utils.toBN(String(Math.floor(this.state.amount)) + "0".repeat(18))
    var tokenContract = new this.state.web3.eth.Contract(token_abi, token_address)

    this.notify('Approve Transaction To Allow STF Spending', 'dark')

    tokenContract.methods.approve(contract_addr, amount).send({from:this.state.addr})
    .on('receipt', receipt => {
      this.notify('Please Wait Till The Transaction Suceeds', 'info')
      this.state.contract.methods.deposit(amount, this.state.addr).send({from : this.state.addr})
        .on('receipt', receipt => {
          this.notify('Deposit Success - Amount:'+this.state.amount, 'success')
          this.update()
        })
        .on('error', (error, receipt) => {
          this.notify(error.message, 'error')
          console.log(error)
        })   
    })
    .on('error', (error, receipt) => {
      this.notify(error.message, 'error')
      console.log(error)
    })  
  }

  async unstake(){
    if(this.state.addr === ''){
      this.notify('Please Connect Your Wallet', 'error')
      return;
    }
    if(this.state.amount < 1 || this.state.amount === ''){
      this.notify('Enter An Amount Greater Than 1 STF', 'error')
      return;
    }


    var amount = Web3.utils.toBN(String(Math.floor(this.state.amount)) + "0".repeat(18))
    this.notify('Please Wait Till The Transaction Suceeds', 'info')
    this.state.contract.methods.withdraw(amount, this.state.addr).send({from:this.state.addr})
    .on('receipt', receipt => {
      this.notify('Withdrawal Success - Amount:'+this.state.amount, 'success')
      this.notify('Please Note Withdrawal Includes Current Reward Obtained!', 'info')
      this.update()
    })
    .on("error", (error, reciept) => {
      this.notify(error.message, 'error')
      console.log(error)
    })

  }


  async harvest(){
    if(this.state.addr === ''){
      this.notify('Please Connect Your Wallet', 'error')
      return;
    }

    
    this.state.contract.methods.harvest(this.state.addr).send({from:this.state.addr})
    .on('receipt', receipt => {
      this.notify('Your Reward Has Been Sent To Your Wallet', 'success')
      this.update()
    })
    .on('error', (error, receipt) => {
      console.error(receipt)
      this.notify(error.message, 'error')
    })
  }


  notify = (message, type) => {
    switch(type){
      case 'error':
        toast.error(message)
        break;
      case 'warning':
        toast.warning(message)
        break;
      case 'success':
        toast.success(message)
        break;
      case 'info':
        toast.info(message)
        break;
      default:
        toast.dark(message)
    }
  }
  
  render(){
    return (

      <div className="App" style={{backgroundImage:`url('bg-main-2.svg')`}}>
        <ToastContainer position="top-center" hideProgressBar={false} autoClose={5000}/>
        <Container>
            <Header addr={this.state.addr} wallet={this.connectWallet} disconnectWallet={this.disconnectWallet}/>
            <div className="layout">
            <Modal show={this.state.show_modal} onHide={this.handleClose}>
              <Modal.Header>
                <Modal.Title>Steps To Stake Your STF</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Container className="d-flex flex-column align-items-center">
                    <h5 style={{fontSize:"20px"}}>1. Approve Transaction To Enable Spending Of STFs</h5>
                    <Button>Approve</Button>

                    <h5 style={{fontSize:"20px", marginTop:"15px"}}>2. After Transaction Is Successful, Now Deposit</h5>
                    <Button disabled >Deposit</Button>
                    
                  </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button className="ml-4" variant="primary" onClick={this.handleClose}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
              <Main 
              apy={this.state.apy}
              total={this.state.staked} 
              stake={this.stake}
              unstake={this.unstake}
              harvest={this.harvest} 
              pendingReward={this.state.pendingReward}
              amount={this.handleChange}>
                
              </Main>
            </div>
          
        </Container>
        
      </div>
      
    );
  }
  
}

export default App;
