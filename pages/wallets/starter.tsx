import react, { useEffect, useState } from "react";
// library we use to interact with the solana json rpc api
import * as web3 from '@solana/web3.js';
// allows us access to methods and components which give us access to the solana json rpc api and user's wallet data
import * as walletAdapterReact from '@solana/wallet-adapter-react'; 
// allows us to choose from the available wallets supported by the wallet adapter
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
// imports a component which can be rendered in the browser
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// applies the styling to the components which are rendered on the browser
require('@solana/wallet-adapter-react-ui/styles.css');
// imports methods for deriving data from the wallet's data store
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const Starter = () => {
    const [balance,setBalance] = useState<number | null>();

    const endpoint = web3.clusterApiUrl('devnet'); // to confirm which cluster we are gonna work with
 
    const walletAdapter = [
        new walletAdapterWallets.PhantomWalletAdapter(),
    ]

    const {connection} = useConnection();

    const {publicKey} = useWallet();

    useEffect(()=>{
       const getInfo = async () =>{
        if (publicKey && connection) {
            const info = await connection.getAccountInfo(publicKey);
            setBalance(info!.lamports  / web3.LAMPORTS_PER_SOL)
        }
       
       }
        getInfo()
    },[publicKey,connection])

   return (
     <>
    
       <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
         <walletAdapterReact.WalletProvider wallets={walletAdapter}>
            <WalletModalProvider>
                <main className="min-h-screen text-white p-4">
                  {/* {Header div} */ } 
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 end-4">
                    <div className="col-span-1 lg:col-span-2 lg:col-end-4 rounded-lg bg-neutral-700 h-60 p-4"> 
                      <div className="flex justify-between items-center">
                         <h2 className="text-3xl ">
                             account info?
                         </h2>
                         <WalletMultiButton
                             className='!bg-helius-orange !rounded-xl hover:!bg-[#161b19] transition-all duration-200'
                         />
                      </div>
                      {/* Body */}
                        <div className='mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2'>
                        <ul className="p-2">
                            <li className="flex justify-between">
                                <p className="tracking-wider">
                                    Wallet is Connected....
                                </p>
                                <p className="text-helius-orange italic font-bold">
                                    {publicKey ? 'yes' : "no"}
                                </p>
                            </li>
                            <li className="text-sm mt-4 flex justify-between">
                                <p className="tracking-wider">
                                    Balance....
                                </p>
                                <p className="text-helius-orange italic font-bold">
                                    {balance}
                                </p>
                            </li>
                        </ul>      
                        </div>
                       </div>
                    
                    </div>
                </main>
            </WalletModalProvider>
         </walletAdapterReact.WalletProvider>
       </walletAdapterReact.ConnectionProvider>

     </>
   )
   }


export default Starter;