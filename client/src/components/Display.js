import React,{ useState } from "react";
import PropTypes from "prop-types";
import "./Secondfile.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [showData, setShowData] = useState(true);

  const getdata = async () => {
    let dataArray;
    // const addressInput = document.querySelector(".address");
    const addressInput = "0x0c7E5d8D5C2e9b0D0A55C09380F9eD0247F5bA3b";

    // const Otheraddress = addressInput ? addressInput.value : "";
    const Otheraddress = "0x48e8a9c944c1bcc9387cd24c1ac4e05689478c9e";

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
    }
    // const isEmpty = Object.keys(dataArray).length === 0;
    const isEmpty = false;


    if (!isEmpty) {
      const str = String(dataArray);
      const str_array = str.split(",");
      console.log(str);
      console.log(str_array);const images = str_array.map((item, i) => {
        const images = str_array.map((item, i) => {
          const image = `https://cloudflare-ipfs.com/ipfs/${item.substring(6)}`;
          console.log(`Image URL: ${image}`);
          return (
            <div key={i} className="image-container">
            {/* <div key={i}> */}

              <button className="delete-button" onClick={() => deleteFile(i)}>
                <i className="fa-solid fa-trash fa-beat" style={{ color: "#007bff" }}></i>
              </button>
              <a href={item} target="_blank" rel="noreferrer">
                <img
                  src={image}
                  alt=""
                />
              </a>
            </div>
          );
        });
      });

      setData(images);
      setShowData(true);
    } else {
      alert("No image to display");
    }
  };

  const deleteFile = async (index) => {
    try {
      await contract.deleteUrl(index);
      alert("Image deleted successfully");
      getdata();
    } catch (e) {
      alert("Error deleting image");
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
      <div className="search-bar">
        <input
          type="text"
          className="address"
          placeholder="Enter the Account address"
        />
        <button
          className="search-button"
          onClick={() => {
            getdata();
            toggleData(true);
          }}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      {showData && data.length > 0 && (
        <div className="blank-container">
          <div className="image-grid">
            {data}
            <button className="close-container" onClick={closeContainer}>
              <i className="fa-sharp fa-solid fa-circle-xmark fa-2xl"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

Display.propTypes = {
  contract: PropTypes.shape({
    display: PropTypes.string, // Update the prop type according to the expected type
    deleteUrl: PropTypes.string, // Update the prop type according to the expected type
  }),
  account: PropTypes.string, // Update the prop type according to the expected type
};
export default Display;

