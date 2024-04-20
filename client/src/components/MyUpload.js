import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json"; // Add this import
import Navbar from "./Navbar";
import "./Secondfile.css";
import "./FileUpload.css";
import FileUpload from "./FileUpload";
import Modal from "./Modal";
import Discordsvg from "./Discordsvg";
import Twittersvg from "./Twittersvg";
import Instagramsvg from "./Instagramsvg";
import SecureUpload from "./images/Secure Upload.png";
import ShareShield from "./images/Share Shield.png";
import AccessLock from "./images/Acesslock.png";

const MyUpload = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [data, setData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const contractAddress = "0x6C8E8Cad23186F1cf9e47DbEbb212AbE8b8908B8";
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        setContract(contract);
        setProvider(provider);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };

    loadBlockchainData();
  }, []);

  const getdata = async (address) => {
    try {
      let dataArray;
      if (address) {
        dataArray = await contract.display(address);
      } else {
        dataArray = await contract.display(account);
      }

      if (dataArray && dataArray.length > 0) {
        setData(dataArray.map(item => `https://cloudflare-ipfs.com/ipfs/${item.substring(6)}`));
        setShowData(true);
      } else {
        alert("No images to display");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    }
  };

  const deleteFile = async (index) => {
    try {
      await contract.deleteUrl(index);
      alert("Image deleted successfully");
      getdata();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const toggleData = () => {
    setShowData(!showData);
  };

  const closeContainer = () => {
    setShowData(false);
  };

  return (
    <>
      <div className="navbar-section">
        <Navbar />
      </div>
      <div className="upload-check-section">
        <h2 className="check-head">My Uploads</h2>
        <p className="check-para">
          The &apos;My Uploads &apos; section of our decentralized image storage platform
          allows you to view all the images you have uploaded by clicking the
          search button. If someone has shared an image with you, you can also
          view it by entering the account address of the user who shared it into
          the search bar field. This will display all the images that have been
          shared with you by that user.
        </p>
        <div className="search-bar">
          <input
            type="text"
            className="address"
            placeholder="Enter the Account address"
          />
          <button
            className="search-button"
            onClick={() => {
              const addressInput = document.querySelector(".address").value;
              getdata(addressInput);
              toggleData(true);
            }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        {showData && data.length > 0 && (
          <div className="blank-container">
            <div className="image-grid">
              {data.map((item, index) => (
                <div key={index} className="image-container">
                  <button
                    className="delete-button"
                    onClick={() => deleteFile(index)}
                  >
                    <i className="fa-solid fa-trash fa-beat" style={{ color: "#007bff" }}></i>
                  </button>
                  <a href={item} target="_blank" rel="noreferrer">
                    <img src={item} alt="" />
                  </a>
                </div>
              ))}
              <button className="close-container" onClick={closeContainer}>
                <i className="fa-sharp fa-solid fa-circle-xmark fa-2xl"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyUpload;
