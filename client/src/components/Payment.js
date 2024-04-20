import React, { useState } from 'react';
import Navbar from './Navbar';
import Web3 from 'web3';
import './Ownership.css';
import './Secondfile.css';
import './FileUpload.css';

function Payment() {
    const [walletAddress, setWalletAddress] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
    const [transferButtonDisabled, setTransferButtonDisabled] = useState(true);

    const connectMetamask = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install Metamask to use this feature.');
            return;
        }

        try {
            await window.ethereum.enable();
            setWalletAddress('Connected Wallet Address: ' + window.ethereum.selectedAddress);
            setIsMetamaskConnected(true);
            setTransferButtonDisabled(false);
            alert('Metamask connected!');
        } catch (error) {
            console.error('Error connecting Metamask:', error);
            alert('Error connecting Metamask. Please try again.');
        }
    };

    const transfer = async () => {
        try {
            if (!isMetamaskConnected) {
                alert('Please connect Metamask first.');
                return;
            }

            const web3 = new Web3(window.ethereum);
            const contractAddress = '0xb5046Fbe93567b0CC19917e744220B4CA567c439';
            const contractABI = [
                {
                    inputs: [
                        {
                            internalType: 'address payable',
                            name: '_to',
                            type: 'address',
                        },
                    ],
                    name: 'sendViaTransfer',
                    outputs: [],
                    stateMutability: 'payable',
                    type: 'function',
                },
            ];

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const amountInEther = amount; // Assuming amount is in ether
            await contract.methods.sendViaTransfer(receiverAddress).send({
                from: window.ethereum.selectedAddress,
                value: web3.utils.toWei(amountInEther, 'ether'),
            });

            alert('Transfer successful!');
            
            
        } catch (error) {
            console.error('Error transferring funds:', error);
            alert('Error transferring funds. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className= "test">
            <button className="hero-button-text" onClick={connectMetamask}>
                Connect Metamask
            </button>
            <br />
            <br />
            <div id="walletAddress">{walletAddress}</div>
            <br />
            <form>
                <input type="text" id="receiverAddress" className="hero-button-text"value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} />
                <br />
                <br />
                <input type="number" id="amount" min="0" className="hero-button-text" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <br />
                <br />
            </form>
            <button onClick={transfer} id="transferButton" className="hero-button-text" disabled={transferButtonDisabled}>
                Transfer
            </button>
            </div>
        </>
    );
}

export default Payment;
