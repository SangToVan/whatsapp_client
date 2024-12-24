import { Avatar, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../Redux/Chat/Action";

const NewGroup = ({ groupMember, setIsGroup }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [groupName, setGroupName] = useState();
  const [groupImage, setGroupImage] = useState();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleCreateGroup = () => {
    let userIds = [];
    for (let user of groupMember) {
      userIds.push(user);
    }
    const group = {
      userIds,
      chat_name: groupName,
      chat_image: groupImage,
    };
    const data = {
      group,
      token,
    };
    dispatch(createGroupChat(data));
    setIsGroup(false);
  };

  const uploadToCloudinary = (pics) => {
    setIsImageUploading(true);
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
        setGroupImage(data.url.toString());
        setIsImageUploading(false);
      });
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft className="cursor-pointer text-2xl font-bold" />
        <p className="text-xl font-semibold">New Group</p>
      </div>

      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput" className="relative cursor-pointer">
          <Avatar
            alt="group image"
            sx={{ width: "18rem", height: "18rem" }}
            src={
              groupImage ||
              "https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_960_720.png"
            }
          />
          {isImageUploading && (
            <CircularProgress className="absolute top-[5rem] left-[6rem]" />
          )}
        </label>
        <input
          type="file"
          id="imgInput"
          className="hidden"
          onChange={(e) => uploadToCloudinary(e.target.files[0])}
        />
      </div>
      <div className="w-full flex justify-between items-center py-2 px-5">
        <input
          className="w-full outline-none border-b-2 border-green-700 px-2 bg-transparent"
          type="text"
          placeholder="Group Subject"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
      {groupName && (
        <div className="py-10 bg-slate-200 flex items-center justify-center">
          <Button onClick={handleCreateGroup}>
            <div className="bg-[#0c977d] rounded-full p-4">
              <BsCheck2 className="text-white font-bold text-3xl" />
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewGroup;
