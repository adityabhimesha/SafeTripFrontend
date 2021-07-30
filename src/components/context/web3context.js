import React,{createContext} from 'react';
import Web3 from 'web3';


export const Web3Context = createContext();

class Web3Provider extends React.Component{

    state = {
        web3 : undefined,
        connect : false,
        
    }


    connectWallet = async() => {

        if(this.state.connect === true){

            console.log("disconnected")
            this.setState({connect : false})
            this.setState({web3 : undefined})

            return;
        }

        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
              await window.ethereum.enable();
              // Acccounts now exposed
              this.state.web3 = web3;
            } catch (error) {
              console.error(error);
            }
        }
        else if (window.web3) {
            const web3 = window.web3;
            console.log('Injected web3 detected.');
            this.state.web3 = web3;
        }
        else {
            alert("No Web3 Provider Detected!")
            const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
            const web3 = new Web3(provider);
            console.log('No web3 instance injected, using Local web3.');
            this.state.web3 = web3;
        }

        this.setState({connect : true})

    }

    render(){
        return(
            <Web3Context.Provider value={{state:this.state, sike:this.connectWallet}}>
                {this.props.children}
            </Web3Context.Provider>
        )
    }
}

export default Web3Provider;