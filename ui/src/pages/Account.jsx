import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  CircularProgress,
  Divider,
  Grid,
  CardContent,
} from "@mui/material";
import { getCookie } from "../lib/cookie";
import Layout from "../components/Layout";
import { apiHost } from "../lib/api";

export default function Account() {
  let navigate = useNavigate();
  let [profile, setProfile] = useState(null);
  let getProfile = async () => {
    let data = await (
      await fetch(`${apiHost}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    console.log(data);
    setProfile(data.data);
  };

  useEffect(() => {
    if (getCookie("token")) {
      getProfile();
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/account");
      return;
    }
  }, []);

  return (
    <>
      <Typography>Account Information</Typography>

      {profile ? (
        <Card>
          <CardContent>
            <Typography>User ID:</Typography>
            <Typography variant="h6">{profile.id}</Typography>
            <Divider />
            <Typography>Names:</Typography>
            <Typography variant="h5">{profile.names}</Typography>
            <Divider />

            <Typography>Email Address:</Typography>
            <Typography variant="h6">{profile.email}</Typography>
            <Divider />

            <Typography>Phone Number:</Typography>
            <Typography variant="h6">{profile.phone || ""}</Typography>
            <Divider />

            <Typography>Role:</Typography>
            <Typography variant="h6">{profile.role}</Typography>
            <Divider />

            <Typography>Assigned Facility:</Typography>
            <Typography variant="h5">{profile.facilityName || ""}</Typography>
            <Divider />

            <Typography>Facility Code:</Typography>
            <Typography variant="h5">{profile.kmhflCode || ""}</Typography>
            <Divider />

            <Typography>Created At:</Typography>
            <Typography variant="h6">
              {new Date(profile.createdAt).toLocaleString()}
            </Typography>
            <Divider />

            <Typography>Last Updated At:</Typography>
            <Typography variant="h6">
              {new Date(profile.updatedAt).toLocaleString()}
            </Typography>
            <Divider />
          </CardContent>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
