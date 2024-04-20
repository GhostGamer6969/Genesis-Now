import React, { useState } from 'react';
import Web3 from 'web3';
import Navbar from './Navbar';
import './Ownership.css';
import './Secondfile.css';
import './FileUpload.css';

function Ownership() {
    const [walletAddress, setWalletAddress] = useState('');
    const [message, setMessage] = useState('');
    const [storedMessage, setStoredMessage] = useState('');

    const connectMetamask = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert("Please install Metamask to use this feature.");
            return;
        }

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const walletAddress = accounts[0];
            setWalletAddress(walletAddress);
        } catch (error) {
            alert("An error occurred while connecting Metamask.");
            console.error(error);
        }
    };

    const storeMessage = async () => {
        if (!message) {
            alert("Please enter a message.");
            return;
        }

        try {
            if (typeof window.ethereum === 'undefined') {
                alert("Please install Metamask to use this feature.");
                return;
            }

            const web3 = new Web3(window.ethereum);
            const contractAddress = '0x14F32Aaf81CaCCa74223bd8c75A1f9771519B385';
            const contractABI = [
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_inputString",
                            "type": "string"
                        }
                    ],
                    "name": "storeString",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const from = accounts[0];

            // Call the storeString function
            await contract.methods.storeString(message).send({ from });

            alert("Message stored successfully!");
        } catch (error) {
            alert("An error occurred while storing the message.");
            console.error(error);
        }
    };

    const displayStoredMessage = async () => {
        try {
            if (typeof window.ethereum === 'undefined') {
                alert("Please install Metamask to use this feature.");
                return;
            }

            const web3 = new Web3(window.ethereum);
            const contractAddress = '0x14F32Aaf81CaCCa74223bd8c75A1f9771519B385';
            const contractABI = [
                {
                    "inputs": [],
                    "name": "getString",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ];
            const contract = new web3.eth.Contract(contractABI, contractAddress);

            // Call the getString function to get the stored message
            const message = await contract.methods.getString().call();

            // Update storedMessage state
            setStoredMessage(message);
        } catch (error) {
            alert("An error occurred while fetching the message.");
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className = 'test'>
            <button onClick={connectMetamask} className="btn">Connect Metamask</button><br /><br />
            <div id="walletAddress">Connected Wallet Address: {walletAddress}</div><br />
            <label htmlFor="message">Message:</label>
            <input className="btn" type="text" id="message" value={message} onChange={(e) => setMessage(e.target.value)} /><br /><br />
            <button onClick={storeMessage}className="btn">Store Message</button>
            <button onClick={displayStoredMessage}className="btn">Display Message</button>
            <div id="displayedMessage">Stored Message: <a href="/payment">{storedMessage}</a> </div>
            </div>
        </>
    );
}

export default Ownership;
