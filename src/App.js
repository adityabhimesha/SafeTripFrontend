import './App.css';
import Header from './components/Navbar/Navbar'
import './custom.scss';
import {Container} from 'react-bootstrap';
import Main from "./components/Main/Main";
import Web3 from 'web3';
import React from 'react';
import {contract_addr, abi, token_address, token_abi} from './config';

class App extends React.Component {

  

  constructor(){
    super()

    this.state = {
      web3:undefined,
      contract:undefined,
      apy:0,
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

  }
  
  setAddr(accounts){
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
        alert("No Web3 Provider Detected!")
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
        const tempWeb3 = new Web3(provider);
        console.log('No web3 instance injected, using Local web3.');
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


  async componentDidMount(){
    this.connectWallet();

    if(window.ethereum){
      window.ethereum.on('accountsChanged', this.setAddr)
    }

  }
  handleChange(event){
    console.log(event.target.value)
    this.setState({amount : event.target.value})
  }

  async stake(){
    if(this.state.addr === ''){
      alert("Please Connect Wallet")
      return;
    }

    if(this.state.amount === 0 || this.state.amount === ''){
      alert("Please Enter An Amount More Than 1 STF")
      return;
    }


    var amount = Web3.utils.toBN(String(Math.floor(this.state.amount)) + "0".repeat(18))
    console.log(amount)

    var tokenContract = new this.state.web3.eth.Contract(token_abi, token_address)
    console.log(tokenContract)

    tokenContract.methods.approve(contract_addr, amount).send({from:this.state.addr})
    .on('receipt', receipt => {
      console.log(receipt)
      this.state.contract.methods.deposit(amount, this.state.addr).send({from : this.state.addr})
        .on('receipt', receipt => {
            console.log(receipt)
        })
        .on('error', (error, receipt) => {
            console.log(receipt)
            alert(error)
        })
    .on('error', (error, receipt) => {
      console.log(error)
      alert(error)
    })
    })  
  }

  async unstake(){
    if(this.state.addr === ''){
      alert("Please Connect Wallet")
      return;
    }
    if(this.state.amount === 0 || this.state.amount === ''){
      alert("Please Enter An Amount More Than 1 STF")
      return;
    }


    var amount = Web3.utils.toBN(String(Math.floor(this.state.amount)) + "0".repeat(18))
    console.log(amount)
    this.state.contract.methods.withdraw(amount, this.state.addr).send({from:this.state.addr})
    .on('receipt', receipt => {
      console.log("SUCCESS", receipt)
    })
    .on("error", (error, reciept) => {
      console.log(error)
    })

  }


  async harvest(){
    if(this.state.addr === ''){
      alert("Please Connect Wallet")
      return;
    }

    var result = await this.state.contract.methods.harvest(this.state.addr).send({from:this.state.addr});
    console.log(result)
  }



  render(){
    //console.log(this.state.contract)
    return (

      <div className="App" style={{backgroundImage:`url('bg-main-2.svg')`}}>
  
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
