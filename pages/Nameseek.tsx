import React, { useState, useEffect } from 'react';
import crypto from 'crypto';
import { ethers } from 'ethers';
import { useAccount } from "wagmi"
import { useWalletClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";

declare global {
  interface Window {
    ethereum: any;
  }
}


export default function Nameseek() {
    const [mail, setMail] = useState('');
    const [eoaAddress, setEoaAddress] = useState('');
    const [randomKey, setRandomKey] = useState('');
    const [signedApiKey, setSignedApiKey] = useState('');
    const [apiProvider, setApiProvider] = useState<null | ethers.providers.Web3Provider>(null);

    const { data: walletClient } = useWalletClient();
    const { address } = useAccount();
    const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
    const [scwAddress, setScwAddress] = useState("");
    const [scwLoading, setScwLoading] = useState(false);
    const [swAddress, setSwAddress] = useState("");

    const sAddress = smartAccount?.address;
    console.log("address", sAddress);

    useEffect(() => {
        async function setupSmartAccount() {
          setScwAddress("");
          setScwLoading(true);
          if (!!walletClient && !!address) {
            const walletProvider = new ethers.providers.Web3Provider(walletClient as any);
            const smartAccount = new SmartAccount(walletProvider, {
              activeNetworkId: ChainId.POLYGON_MUMBAI,
              supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
            });
            await smartAccount.init();
            const context = smartAccount.getSmartAccountContext();
            setScwAddress(context.baseWallet.getAddress());
            console.log("Smart Account Address", context.baseWallet.getAddress());
            setSmartAccount(smartAccount);
            console.log("Smart Account", smartAccount.address);
            setSwAddress(smartAccount.address);
            setScwLoading(false);
          }
        }
        if (!!walletClient && !!address) {
          setupSmartAccount();
          console.log("Provider...", walletClient);
        }
      }, [address, walletClient]);
      



    useEffect(() => {
        if (window.ethereum) {
            setApiProvider(new ethers.providers.Web3Provider(window.ethereum));
        }
    }, []);

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        try {
            const generatedKey = crypto.randomBytes(16).toString('hex');
            setRandomKey(generatedKey);

            if (apiProvider) {
                const signer = apiProvider.getSigner();
                const signature = await signer.signMessage(generatedKey);
                setSignedApiKey(signature);

                // Verify the signature
                const recoveredAddress = ethers.utils.verifyMessage(generatedKey, signature);
                if (recoveredAddress !== eoaAddress) {
                    console.error('Signature verification failed');
                    setSignedApiKey('');
                }
            }
        } catch (error) {
            console.error('An error occurred: ', error);
        }
    };

    return (
      <>
        <ConnectButton/>
        <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8 bg-gray-900 h-screen">
        {scwLoading && <h2 className='text-xl text-white bg-purple-800 my-[25px] px-[20px] rounded-lg shadow-2xl border border-purple-800 '>Loading Smart Account...</h2>}
        {scwAddress && (
            <div>
                <p className='text-xl text-white bg-purple-800 my-[10px] py-[10px] px-[20px] rounded-lg shadow-2xl border border-purple-800 '>Smart Account Address : {(swAddress.toString()).slice(0,8)}...{(swAddress.toString()).slice(37)}</p>
            </div>
        )}
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Welcome to NAMESEEK API
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-500">
                    Wallet Address
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    name="wallet_address"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={eoaAddress}
                    onChange={(e) => setEoaAddress(e.target.value)}
                  />
                </div>
              </div>
  
              {/* <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Generate API key
                </button>
              </div> */}
            </form>
            {/* {randomKey && (
            <div className="mt-10 p-2 rounded-md border border-blue-200 bg-white">
                <h2 className="text-lg text-center font-bold mb-2 text-blue-800">Your Random Key:</h2>
                <p className="text-sm text-center text-gray-600">{randomKey}</p>
            </div>
            )} */}
          </div>
            {/* {signedApiKey && (
            <div className="mt-14 mx-[15%] p-2 rounded-md border border-blue-200 bg-white">
                <h2 className="text-lg text-center font-bold mb-2 text-blue-800">Your Signed API Key:</h2>
                <p className="text-sm text-center text-gray-600">{signedApiKey}</p>
            </div>
        )} */}
        </div>
      </>
    )
}