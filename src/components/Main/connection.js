import Web3 from 'web3';

var connect = async () => {
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
  else if (window.web3) {
  const web3 = window.web3;
  console.log('Injected web3 detected.');
  return web3;
  }
  else {
  alert("No Web3 Provider Detected!")
  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
  const web3 = new Web3(provider);
  console.log('No web3 instance injected, using Local web3.');
  return web3;
  }

  return undefined
}

export default connect;