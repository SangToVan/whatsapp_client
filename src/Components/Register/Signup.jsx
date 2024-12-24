import React from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, register } from "../../Redux/Auth/Action";

const Signup = () => {
  const [inputData, setInputData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit", inputData);
    dispatch(register(inputData));
    setOpenSnackbar(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((values) => ({ ...values, [name]: value }));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (auth.reqUser?.full_name) {
      navigate("/");
    }
  }, [auth.reqUser, navigate]);
  return (
    <div>
      <div className="flex flex-col justify-center min-h-screen items-center">
        <div className="w-[30%] p-10 shadow-md bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="mb-2">Full name</p>
              <input
                type="text"
                name="full_name"
                placeholder="Enter full name"
                onChange={handleChange}
                value={inputData.full_name}
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
              />
            </div>

            <div>
              <p className="mb-2">Email</p>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={inputData.email}
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
              />
            </div>

            <div>
              <p className="mb-2">Password</p>
              <input
                type="text"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                value={inputData.password}
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
              />
            </div>

            <div>
              <Button
                type="submit"
                sx={{ bgcolor: green[700], padding: ".5rem 0rem" }}
                className="w-full hover:bg-blue-700"
                variant="contained"
              >
                Sign up
              </Button>
            </div>
          </form>
          <div className="flex space-x-3 items-center mt-5">
            <p className="m-0">Already have account?</p>
            <Button
              className="text-blue-500 hover:text-blue-800 cursor-pointer"
              variant="text"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Your account successfully created!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
