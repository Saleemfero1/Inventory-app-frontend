import React, { useContext, useEffect, useState } from "react";
import "../Item/Item.css";
import { Link } from "react-router-dom";
import DemandServices from "../../Service/DemandServices";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import DemandTable from "./DemandTable";
import { AuthContext } from "../../TokenDetails/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export default function Demand() {
  const [search, setSearch] = React.useState("");
  const { token, demandData, setDemandData } = useContext(AuthContext);
  const headings = [
    "Demand Id",
    "Item Id",
    "Location Id",
    "Demand Type",
    "Quantity",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    DemandServices.getDemand(sessionStorage.getItem("organizationId"), token)
      .then((response) => {
        setDemandData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setDemandData, token]);
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const deleteDemand = (demandId) => {
    if (window.confirm("want to delete demand for:" + demandId + " ?")) {
      DemandServices.deleteDemand(
        sessionStorage.getItem("organizationId"),
        demandId,
        token
      )
        .then((response) => {
          toast.success("Item deletd!");
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }
  };

  const updateDemand = (demandId) => {
    const object = demandData.find((obj) => obj.id === demandId);
    if (object != undefined) {
      navigate(`/demand/add?id=${demandId}`);
    } else {
      console.log("demand  not found");
    }
  };

  return (
    <>
      <ToastContainer position="bottom-center" />
      <div className="container">
        <div className=" mt-3">
          <h3 variant="h3" className="text-center">
            Demand Details
          </h3>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <div class="col-md-6">
              <input
                type="text"
                class="search form-control"
                placeholder="Search Demand By ItemId"
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="col-6 ">
            <Link to="/demand/add?id=-1" className="text-decoration-none">
              <Button
                variant="contained"
                className="text-black bg-info align-right"
              >
                Add Demand
              </Button>
            </Link>
          </div>
        </div>
        <DemandTable
          headings={headings}
          demandData={demandData}
          deleteFun={deleteDemand}
          updateFun={updateDemand}
          search={search}
        />
      </div>
    </>
  );
}
