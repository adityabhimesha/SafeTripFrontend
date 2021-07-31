import './App.css';
import Header from './components/Navbar/Navbar'
import './custom.scss';
import {Container} from 'react-bootstrap';
import Main from "./components/Main/Main";
import Web3 from 'web3';
import React from 'react';
import {contract_addr, abi, token_address, token_abi} from './config';

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
    }

    this.connectWallet = this.connectWallet.bind(this)
    this.setWeb3 = this.setWeb3.bind(this)
    this.setContract = this.setContract.bind(this)
    this.stake = this.stake.bind(this)
    this.unstake = this.unstake.bind(this)
    this.harvest = this.harvest.bind(this)
    this.setAddr = this.setAddr.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.update = this.update.bind(this)

  }
  
  setAddr(accounts){
    this.notify('Account Changed', 'info')
    this.setState({addr : accounts[0]})
    console.log("addr changed")
  }
  

  async connectWallet() {

    if (window.ethereum) {
        
        try{
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setState({addr: accounts[0]})
            const tempWeb3 = new Web3(window.ethereum);
            this.setWeb3(tempWeb3)
        }
        catch{
          this.notify('Please Allow Access To Wallet')
          console.log("USER ACCESS DENIED")
          return;
        }
          
    }
    else if (window.web3) {
        const tempWeb3 = window.web3;
        console.log('Injected web3 detected.');
        this.setWeb3(tempWeb3)
    }
    else {
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
        const tempWeb3 = new Web3(provider);
        this.notify('No Web3 Provider Detected!', 'error')
        this.notify('Please Use Chrome or Any Browser Supporting Wallets', 'dark')
        this.setWeb3(tempWeb3)
    }
    
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


  async componentDidMount(){
    this.connectWallet();

    if(window.ethereum){
      
      window.ethereum.on('accountsChanged', this.setAddr)

      window.ethereum.on('disconnected', () => {
        console.log("disconnected")
        this.notify('Disconnected Wallet', 'info')
      })
      
    }

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

    tokenContract.methods.approve(contract_addr, amount).send({from:this.state.addr})
    .on('receipt', receipt => {
      this.notify('Approve Transaction To Allow STF Spending', 'dark')
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
    //console.log(this.state.contract)
    return (

      <div className="App" style={{backgroundImage:`url('bg-main-2.svg')`}}>
        <ToastContainer position="bottom-center" hideProgressBar={false} autoClose={5000}/>
        <Container>
            <Header addr={this.state.addr} wallet={this.connectWallet}/>
  
            <div className="layout">
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
