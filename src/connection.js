
import React from 'react'
import {Button} from 'react-bootstrap';
import { useWallet, UseWalletProvider } from 'use-wallet'
import './custom.scss';


function Wallet() {
  const wallet = useWallet()

  var addr = wallet.account

  return (
    <>
      {wallet.status === 'connected' ? (
        <div>
          <Button className="connect" onClick={() => wallet.reset()}>{addr}</Button>
        </div>
      ) : (
        <div>
          <Button onClick={() => wallet.connect()}>CONNECT</Button>
        </div>
      )}
    </>
  )
}

//BSC chain ID is 56
export default () => (
  <UseWalletProvider
    chainId={56}
    connectors={{
      // This is how connectors get configured
      portis: { dAppId: 'my-dapp-id-123-xyz' },
    }}
  >
    <Wallet />
  </UseWalletProvider>
)