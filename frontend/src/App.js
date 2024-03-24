import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [photo, setPhoto] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPhoto(file);
  };

  const handleCreate = async () => {
    try {
      if (!photo) {
        console.log("No image selected");
        return;
      }

      const formData = new FormData();
      formData.append("image", photo);

      const response = await axios.post("http://localhost:5000/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (
        response.data &&
        response.data.image &&
        response.data.count !== undefined
      ) {
        console.log("Image uploaded successfully");
        setResponseData(response.data); // Set response data to state
      } else {
        console.log("Error occurred while uploading image");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Function to create color boxes
  const renderColorBoxes = () => {
    const colorBoxes = [];
    for (let i = 0; i < 400; i++) {
      colorBoxes.push(<div key={i} className="colorBox" />);
    }
    return colorBoxes;
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center align-middle gap-5 overflow-x-hidden bg-black text-white">
      {/* Color boxes container */}
      <div className="bgAnimation" id="bgAnimation">
        {renderColorBoxes()}
      </div>

      {/* Input image and response data */}
      <div className="ml-5 p-2 flex flex-col align-middle gap-2 z-10 w-fit h-fit">
        <div>
          {photo && (
            <div>
              <img
                src={URL.createObjectURL(photo)}
                alt="product_photo"
                height={"200px"}
                className="img img-responsive"
              />
            </div>
          )}
        </div>

        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-md w-full focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleCreate}
          className="text-sm rounded-md border-orange-300 border-2 py-1 px-2"
        >
          Upload Image
        </button>
      </div>

      {/* Display response data */}
      {responseData && (
        <div className="w-[50%] p-2 mr-3 z-10 w-fit h-fit">
          <div className="text-center">
            <img
              src={`data:image/jpeg;base64,${responseData.image}`}
              alt="detected_objects"
              className="img img-responsive"
            />
          </div>
          <p>TruckCount: {responseData.specific_object_counts["truck"]}</p>
          <p>CarCount: {responseData.specific_object_counts["car"]}</p>
        </div>
      )}
    </div>
  );
};

export default App;
