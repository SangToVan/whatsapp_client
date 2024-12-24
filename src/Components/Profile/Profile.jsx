import React, { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../Redux/Auth/Action";
import { useDispatch, useSelector } from "react-redux";

const Profile = ({ handleCloseProfile }) => {
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [tempPicture, setTempPicture] = useState(null);
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleFlag = () => {
    setFlag(true);
  };
  const handleCheckClick = () => {
    const data = {
      id: auth.reqUser?.id,
      token: localStorage.getItem("token"),
      data: { full_name: username },
    };
    setFlag(false);
    dispatch(updateUser(data));
  };

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCheckClick();
    }
  };

  const uploadToCloudinary = (pics) => {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "whatsapp");
    data.append("cloud_name", "dnhxdubzr");
    fetch("https://api.cloudinary.com/v1_1/dnhxdubzr/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setTempPicture(data.url.toString());
        console.log("imgurl", data.url.toString());
        const dataa = {
          id: auth.reqUser?.id,
          token: localStorage.getItem("token"),
          data: { profile_picture: data.url.toString() },
        };
        dispatch(updateUser(dataa));
      });
  };
  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft
          className="cursor-pointer text-2xl font-bold"
          onClick={handleCloseProfile}
        />
        <p className="cursor-pointer font-semibold">Profile</p>
      </div>

      {/* update profile picture section */}
      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput">
          <img
            className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
            src={
              tempPicture ||
              auth.reqUser?.profile_picture ||
              "https://cdn.pixabay.com/photo/2024/11/08/05/28/man-9182458_1280.jpg"
            }
            alt=""
          />
        </label>

        <input
          onChange={(e) => uploadToCloudinary(e.target.files[0])}
          type="file"
          id="imgInput"
          className="hidden"
        />
      </div>

      {/* name section */}
      <div className="bg-white px-3">
        <p className="py-3">Your Name</p>

        {!flag && (
          <div className="w-full flex justify-between items-center">
            <p className="py-3">{username || auth.reqUser?.full_name || "username"}</p>
            <BsPencil onClick={handleFlag} className="cursor-pointer" />
          </div>
        )}
        {flag && (
          <div className="w-full flex justify-between items-center py-2">
            <input
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={handleChange}
              className="w-[80%] outline-none border-b-2 border-blue-700 p-2"
              type="text"
              placeholder="Enter your name"
            />
            <BsCheck2
              onClick={handleCheckClick}
              className="cursor-pointer text-2xl"
            />
          </div>
        )}
      </div>
      <div className="px-3 my-5">
        <p className="py-10">
          This is not your username, this name will be visible to your whatsapp
          contects.
        </p>
      </div>
    </div>
  );
};

export default Profile;
