import React from "react";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import {
  BsEmojiSmile,
  BsFilter,
  BsMicFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { TbCircleDashed } from "react-icons/tb";
import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import { ImAttachment } from "react-icons/im";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CreateGroup from "./Group/CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logout, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessage } from "../Redux/Message/Action";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";

const HomePage = () => {
  const [querys, setQuerys] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isGroup, setIsGroup] = useState(false);
  const dispatch = useDispatch();
  const { auth, chat, message } = useSelector((store) => store);
  const token = localStorage.getItem("token");

  const [stompClient, setStompClient] = useState();
  const [isConnect, setIsConnect] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = () => {
    const sock = new SockJS("http://localhost:5454/websocket");
    const temp = over(sock);
    setStompClient(temp);

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    };

    temp.connect(headers, onConnect, onError);
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const onError = (error) => {
    console.log("on error ", error);
  };

  const onConnect = () => {
    setIsConnect(true);
  };

  useEffect(() => {
    if (message.newMessage && stompClient) {
      setMessages([...messages, message.newMessage]);
      stompClient?.send("/app/message", {}, JSON.stringify(message.newMessage));
    }
  }, [message.newMessage]);

  const onMessageReceive = (payload) => {
    console.log("receive message:", JSON.parse(payload.body));
    const receivedMessage = JSON.parse(payload.body);
    setMessages([...messages, receivedMessage]);
  };

  useEffect(() => {
    if (isConnect && stompClient && auth.reqUser && currentChat) {
      const subcription = stompClient.subcribe(
        "/group/" + currentChat.id.toString,
        onMessageReceive
      );
      return () => {
        subcription.unsubcribe();
      };
    }
  });

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    setMessages(message.messages);
  }, [message.messages]);

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };
  const handleClickOnChatCard = (userId) => {
    setCurrentChat(true);
    dispatch(createChat({ token, data: { userId } }));
    setQuerys("");
  };

  const handleCreateNewMessage = () => {
    dispatch(
      createMessage({
        token,
        data: { chatId: currentChat.id, content: content },
      })
    );
  };
  const handleOpenProfile = () => {
    // navigate("/profile");
    setIsProfile(true);
    setAnchorEl(null);
  };
  const handleCloseProfile = () => {
    setIsProfile(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateGroup = () => {
    setIsGroup(true);
    setAnchorEl(null);
  };

  const handleCloseGroup = () => {
    setIsGroup(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const handleCurrentChat = (item) => {
    setCurrentChat(item);
  };

  useEffect(() => {
    if (!auth.reqUser) {
      navigate("/signup");
    }
  }, [auth.reqUser, navigate]);

  useEffect(() => {
    dispatch(currentUser(token));
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(getUsersChat({ token }));
  }, [chat.createChat, chat.createGroup]);

  useEffect(() => {
    if (currentChat?.id) {
      dispatch(getAllMessage({ token, chatId: currentChat.id }));
    }
  }, [currentChat, messages]);
  return (
    <div className="relative">
      <div className="w-full py-14 bg-[#00a994] "></div>
      <div className="flex bg-[#f0f2f5] h-[90vh] absolute top-[5vh] left-[2vw] w-[96vw]">
        <div className="left w-[30%] bg-[#e8e9ec] h-full">
          {/* profile */}
          {isGroup && (
            <CreateGroup
              setIsGroup={setIsGroup}
              handleCloseGroup={handleCloseGroup}
            />
          )}
          {isProfile && (
            <div className="w-full h-full">
              <Profile handleCloseProfile={handleCloseProfile} />
            </div>
          )}
          {!isProfile && !isGroup && (
            <div className="w-full">
              {/* home */}
              <div className="flex justify-between items-center p-3">
                <div
                  onClick={handleOpenProfile}
                  className="flex items-center space-x-3"
                >
                  <img
                    className="rounded-full w-10 h-10 cursor-pointer"
                    src={
                      auth.reqUser?.profile_picture ||
                      "https://cdn.pixabay.com/photo/2024/07/01/07/11/cats-8864617_640.jpg"
                    }
                    alt=""
                  />
                  <p>{auth.reqUser?.full_name}</p>
                </div>
                <div className="space-x-3 text-2xl flex">
                  <TbCircleDashed
                    className="cursor-pointer"
                    onClick={() => navigate("/status")}
                  />
                  <BiCommentDetail />

                  <div>
                    <BsThreeDotsVertical
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    />

                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
                      <MenuItem onClick={handleCreateGroup}>
                        Create Group
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center items-center bg-white py-4 px-3">
                <input
                  className="border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2"
                  type="text"
                  placeholder="Search or start new Chat"
                  onChange={(e) => {
                    setQuerys(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  value={querys}
                />
                <AiOutlineSearch className="left-5 top-7 absolute" />
                <div>
                  <BsFilter className="ml-4 text-3xl" />
                </div>
              </div>
              {/* all user */}
              <div className="bg-white overflow-y-scroll h-[74vh] px-3">
                {querys &&
                  auth.searchUser?.map((item) => (
                    <div onClick={() => handleClickOnChatCard(item.id)}>
                      {" "}
                      <hr />
                      <ChatCard
                        name={item.full_name}
                        userImg={
                          item.profile_picture ||
                          "https://cdn.pixabay.com/photo/2024/07/01/07/11/cats-8864617_640.jpg"
                        }
                      />
                    </div>
                  ))}

                {chat.chats.length > 0 &&
                  !querys &&
                  chat.chats?.map((item) => (
                    <div onClick={() => handleCurrentChat(item)}>
                      {" "}
                      <hr />
                      {item.is_group ? (
                        <ChatCard
                          name={item.chat_name}
                          userImg={
                            item.chat_image ||
                            "https://cdn.pixabay.com/photo/2024/07/01/07/11/cats-8864617_640.jpg"
                          }
                        />
                      ) : (
                        <ChatCard
                          isChat={true}
                          name={
                            auth.reqUser?.id !== item.users[0]?.id
                              ? item.users[0].full_name
                              : item.users[1].full_name
                          }
                          userImg={
                            auth.reqUser.id !== item.users[0].id
                              ? item.users[0].profile_picture ||
                                "https://cdn.pixabay.com/photo/2024/07/01/07/11/cats-8864617_640.jpg"
                              : item.users[1].profile_picture ||
                                "https://cdn.pixabay.com/photo/2024/07/01/07/11/cats-8864617_640.jpg"
                          }
                          // notification={notifications.length}
                          // isNotification={
                          //   notifications[0]?.chat?.id === item.id
                          // }
                          // message={
                          //   (item.id ===
                          //     messages[messages.length - 1]?.chat?.id &&
                          //     messages[messages.length - 1]?.content) ||
                          //   (item.id === notifications[0]?.chat?.id &&
                          //     notifications[0]?.content)
                          // }
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* default whats up page */}
        {!currentChat && (
          <div className="w-[70%] flex flex-col items-center justify-center h-full">
            <div className="max-w-[70%] text-center">
              <img
                src="https://res.cloudinary.com/dnhxdubzr/image/upload/v1734182970/whatsapp_multi_device_support_update_image_1636207150180_hlmhpa.png"
                alt=""
              />
              <h1 className="text-4xl text-gray-600">WhatsApp Web</h1>
              <p className="my-9">
                Send and receive message without keeping your phone online. Use
                WhatsApp on up to 4 linked devices and one phone at the same
                time.
              </p>
            </div>
          </div>
        )}

        {/* message part  */}
        {currentChat && (
          <div className="w-[70%] relative bg-blue-200">
            <div className="header absolute top-0 w-full bg-[#f0f3f5]">
              <div className="flex justify-between">
                <div className="py-3 space-x-4 flex items-center px-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={
                      currentChat.is_group
                        ? currentChat.chat_image
                        : auth.reqUser.id !== currentChat.users[0].id
                        ? currentChat.users[0].profile_picture ||
                          "https://cdn.pixabay.com/photo/2024/07/01/07/11/cats-8864617_640.jpg"
                        : currentChat.users[1].profile_picture ||
                          "https://cdn.pixabay.com/photo/2024/07/01/07/11/cats-8864617_640.jpg"
                    }
                    alt=""
                  />
                  <p>
                    {currentChat.is_group
                      ? currentChat.chat_name
                      : auth.reqUser?.id === currentChat.users[0].id
                      ? currentChat.users[1].full_name
                      : currentChat.users[0].full_name}
                  </p>
                </div>
                <div className="py-1 flex space-x-4 items-center px-3">
                  <AiOutlineSearch />
                  <BsThreeDotsVertical />
                </div>
              </div>
            </div>

            {/* message section */}
            <div className="px-10 h-[80vh] overflow-y-scroll ">
              <div className="space-y-1 flex flex-col justify-center mt-20 py-2">
                {messages.length > 0 &&
                  messages?.map((item, i) => (
                    <MessageCard
                      isReqUserMessage={item.user.id !== auth.reqUser.id}
                      content={item.content}
                    />
                  ))}
              </div>
            </div>

            {/* footer part */}
            <div className="footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl">
              <div className="flex justify-between items-center px-5 relative">
                <BsEmojiSmile className="cursor-pointer" />
                <ImAttachment />

                <input
                  className="py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]"
                  type="text"
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type message"
                  value={content}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreateNewMessage();
                      setContent("");
                    }
                  }}
                />
                <BsMicFill />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
