import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import * as  web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { useEffect } from "react";
import { ExternalLinkIcon } from "@heroicons/react/outline";


const Starter = () => {

    const [amount, setAmount] = useState(0);
    const [account , setAccount] = useState("");
    const [balance,setBalance] = useState(0);
    const [txSig,setTxSig] = useState("");

    // get account information 
     const {connection} = useConnection();
     const  {publicKey,sendTransaction} = useWallet(); 
     
     const handleTransaction = async () => {
        if(!publicKey || !connection) {
              showError("Please connect to your wallet.")
              return;
        }

        const transaction = new web3.Transaction();
        const instruction = web3.SystemProgram.transfer(
            {
                fromPubkey : publicKey,
                lamports : amount * LAMPORTS_PER_SOL,
                toPubkey : account,
            }
        );

        transaction.add(instruction);

        try {
             const signature = await sendTransaction(transaction,connection);

             setTxSig(signature);

        } catch(error) {
             showError("Error happened : " + error)
        }
        
     };

     useEffect(()=>{
        // get info of user with existed address and show the balance. 
         const getInfo = async () => {
            if(connection && publicKey) {
                const info = await connection.getAccountInfo(publicKey);
                setBalance(info.lamports / web3.LAMPORTS_PER_SOL);
            }
         }
         getInfo();
     },[connection,publicKey]);

    


     function showError(message) {
        toast.error(message || "Something went wrong")
     }

     const outputs = [
        {
            title : "Account Balance..",
            dependency : balance,
        },
        {
            title : "Transaction Signature...",
            dependency : txSig,
            href : `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
        },
     ]

    return (
       <main className="min-h-screen max-w-7xl">
        <section className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4">
               <form>
                  <div>
                         <h2>
                            Send Sol💸
                        </h2> 
                        <button 
                        onClick={(event)=> {
                            event.preventDefault();
                            handleTransaction();}}
                        disabled={!account || !amount}
                        className='disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#fa6ece] bg-[#fa6ece] rounded-lg w-24 py-1 font-semibold transition-all duration-200 hover:bg-transparent border-2 border-transparent hover:border-[#fa6ece]'
                        >
                            Submit       
                        </button>
                  </div>
                  <div className="mt-6">
                      <h3>
                         Address of the receiver
                      </h3> 
                      <input 
                      id="account"
                      type="text" 
                      placeholder="Public key of receiver"
                      onChange={event => setAccount(event.target.value)}
                      />          
                  </div>
                  <div className="mt-6">
                      <h3>
                         Number amount
                      </h3> 
                      <input 
                      id="amount"
                      type="number" 
                      placeholder="Amount of sol"
                      onChange={event => setAmount(parseFloat(event.target.value))}
                      />          
                  </div>
                  <div>
                    <ul>
                        {outputs.map(({title , dependency , href},index)=> (
                           <li key={title} className={`flex justify-between items-center ${index !== 0 && 'mt-4'}`}>
                                <p className="tracking-wider">{title}</p>
                            {
                                dependency && 
                                <a href={href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={`flex text-[#80ebff] italic ${href && "hover:text-white"} transition-all duration-200`}
                                >
                                    {dependency.toString().slice(0,25)}
                                    {href && <ExternalLinkIcon className="w-5 ml-1"/>}
                                </a>
                            }
                            </li>
                            
                        ))}
                    </ul>
                  </div>
               </form> 
        </section>

       </main>
    )
}

export default Starter;


// tranasfer sol from one address to another
