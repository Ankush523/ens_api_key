import React, { useState, useEffect } from 'react';
import crypto from 'crypto';
import { ethers } from 'ethers';
import { useAccount } from "wagmi"
import { useWalletClient } from 'wagmi'
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Nameseek() {

    const contractAddress = '0x837fF5B0ef415e8c79cD49535F6A5D35E8a743b4'
    const contractABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                }
            ],
            "name": "mintNFT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]

    const [mail, setMail] = useState('');
    const [eoaAddress, setEoaAddress] = useState('');
    const [randomKey, setRandomKey] = useState('');
    const [signedApiKey, setSignedApiKey] = useState('');
    const [apiProvider, setApiProvider] = useState<null | ethers.providers.Web3Provider>(null);
    const [nftAddress, setNftAddress] = useState('');  // For storing NFT Address
    const [nftTokenId, setNftTokenId] = useState('');  // For storing NFT Token ID



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

    const handleNFTSubmit = async (e : any) => {
        e.preventDefault();
    
        if (apiProvider && smartAccount) {
            const signer = apiProvider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
            try {
                let mintTx = await contract.mintNFT(smartAccount.address);
                const receipt = await mintTx.wait();
    
                let tokenId;
                for (let i = 0; i < receipt.events?.length; i++) {
                    const event = receipt.events[i];
                    if (event.event === "Transfer") {
                        tokenId = event.args?.[2];
                        break;
                    }
                }
    
                if (!tokenId) {
                    console.error("Failed to find tokenId from Transfer event");
                    return;
                }
    
                setNftAddress(contractAddress);
                setNftTokenId(tokenId.toString());
            } catch (error) {
                console.error("Failed to mint NFT:", error);
            }
        }
    };
    
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8 bg-gray-900 h-screen">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Welcome to NAMESEEK API
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST" onSubmit={handleNFTSubmit}>
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

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-500">
                    Smart Wallet Address
                  </label>
                </div>
                <div className="mt-2">
                    {scwLoading && <p className='mt-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>Loading Smart Account...</p>}
                    {scwAddress && (
                        <div>
                            <p className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>{scwAddress}</p>
                        </div>
                    )}
                </div>
              </div>

  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Generate API key
                </button>
              </div>
            </form>
          </div>
            {/* {signedApiKey && (
            <div className="mt-14 mx-[15%] p-2 rounded-md border border-blue-200 bg-white">
                <h2 className="text-lg text-center font-bold mb-2 text-blue-800">Your Signed API Key:</h2>
                <p className="text-sm text-center text-gray-600">{signedApiKey}</p>
            </div>
            )} */}
            {nftAddress&&(
                <div className="mt-14 mx-[30%] p-2 rounded-md border border-blue-200 bg-white">
                    <h2 className="text-lg text-center font-bold mb-2 text-blue-800">Your API Key:</h2>
                    <p className="text-sm text-center text-gray-600">{nftAddress}{nftTokenId}</p>
                </div>
            )}
        </div>
      </>
    )
}