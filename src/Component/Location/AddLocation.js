import React, { useContext } from "react";
import "../Item/Item.css";
import { useEffect, useState } from "react";
import { City, Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import LocationServices from "../../Service/LocationServices";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../TokenDetails/AuthContext";
import { Button } from "@mui/material";

export default function AddLocation() {
  const { token } = useContext(AuthContext);

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();

  const [location, setLocation] = useState({
    locationId: "",
    locationDesc: "",
    locationType: "",
    pickupAllowed: false,
    shippingAllowed: false,
    deliveryAllowed: false,
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const saveLocation = (event) => {
    event.preventDefault();
    let newLocation = {
      locationId: location.locationId,
      locationDesc: location.locationDesc,
      locationType: location.locationType,
      pickupAllowed: location.pickupAllowed,
      shippingAllowed: location.shippingAllowed,
      deliveryAllowed: location.deliveryAllowed,
      addressLine1: location.addressLine1,
      addressLine2: location.addressLine2,
      addressLine3: location.addressLine3,
      city: selectedCity,
      state: selectedState,
      country: selectedCountry,
      pinCode: location.pinCode,
    };

    if (id === "-1") {
      LocationServices.createLocation(
        sessionStorage.getItem("organizationId"),
        newLocation,
        token
      ).then((response) => {
        toast.success("Location Created!", {
          onClose: () => navigate("/location"),
        });
      });
    } else {
      LocationServices.updateLocation(
        sessionStorage.getItem("organizationId"),
        id,
        newLocation,
        token
      )
        .then((response) => {
          toast.success("Location updated!", {
            onClose: () => navigate("/location"),
          });
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  useEffect(() => {
    if (id === "-1") {
      return;
    } else {
      LocationServices.getLocationByLocationId(
        sessionStorage.getItem("organizationId"),
        id,
        token
      ).then((response) => {
        let existLocation = response.data;
        setLocation(existLocation);
      });
    }
  }, [id, token]);

  const onChangeLocationId = (event) => {
    setLocation({ ...location, locationId: event.target.value });
  };
  const onChangeLocationDesc = (event) => {
    setLocation({ ...location, locationDesc: event.target.value });
  };
  const onChangeLocationType = (event) => {
    setLocation({ ...location, locationType: event.target.value });
  };
  const onChangeAddressLine1 = (event) => {
    setLocation({ ...location, addressLine1: event.target.value });
  };
  const onChangeAddressLine2 = (event) => {
    setLocation({ ...location, addressLine2: event.target.value });
  };
  const onChangeAddressLine3 = (event) => {
    setLocation({ ...location, addressLine3: event.target.value });
  };

  const onChangePinCode = (event) => {
    setLocation({ ...location, pinCode: event.target.value });
  };

  const onChangePickup = (event) => {
    var pickup = document.getElementById("pickup");
    if (pickup.checked) {
      setLocation({ ...location, pickupAllowed: true });
    } else {
      setLocation({ ...location, pickupAllowed: false });
    }
  };
  const onChangeShipping = (event) => {
    var shipping = document.getElementById("shipping");
    if (shipping.checked) {
      setLocation({ ...location, shippingAllowed: true });
    } else {
      setLocation({ ...location, shippingAllowed: false });
    }
  };
  const onChangeDelivery = (event) => {
    var deliver = document.getElementById("deliver");
    if (deliver.checked) {
      setLocation({ ...location, deliveryAllowed: true });
    } else {
      setLocation({ ...location, deliveryAllowed: false });
    }
  };

  return (
    <>
      <ToastContainer position="bottom-left" />
      <div className="container mt-5">
        <form className="mt-3 p-3 shadow addItems" onSubmit={saveLocation}>
          <div className=" row mb-3">
            <div className="form-group col-md-6">
              <label htmlFor="LocationId">Location Id</label>
              <input
                type="text"
                className="form-control"
                id="LocationId"
                placeholder="Enter Location Id"
                required
                value={location.locationId}
                onChange={onChangeLocationId}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="Description">Description</label>
              <input
                data-testid="Description"
                type="text"
                className="form-control"
                id="Description"
                placeholder="Enter Location Description"
                required
                value={location.locationDesc}
                onChange={onChangeLocationDesc}
              />
            </div>
          </div>
          <div className=" row mb-3">
            <div className="form-group col-md-6">
              <label htmlFor="locationType">Type</label>
              <input
                type="text"
                className="form-control "
                id="locationType"
                placeholder="Enter Location Type"
                required
                value={location.locationType}
                onChange={onChangeLocationType}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                type="text"
                className="form-control "
                id="addressLine1"
                placeholder="Enter Address Line 1"
                required
                value={location.addressLine1}
                onChange={onChangeAddressLine1}
              />
            </div>
          </div>

          <div className=" row mb-3">
            <div className="form-group col-md-6">
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                type="text"
                className="form-control "
                id="addressLine2"
                placeholder="Enter Address Line 2"
                required
                value={location.addressLine2}
                onChange={onChangeAddressLine2}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="addressLine3">Address Line 3</label>
              <input
                type="text"
                className="form-control"
                id="addressLine3"
                placeholder="Enter Address Line 3"
                value={location.addressLine3}
                onChange={onChangeAddressLine3}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-6">
              <label htmlFor="Country">Country</label>
              <select
                className="form-control "
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                required
              >
                <option value="">Select a country</option>
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="Country">State</label>
              <select
                className="form-control "
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                required
              >
                <option value="">Select a state</option>
                {selectedCountry &&
                  State.getStatesOfCountry(selectedCountry).map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="city">City</label>
              <select
                className="form-control"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
              >
                <option value="">Select a city</option>
                {selectedState &&
                  City.getCitiesOfState(selectedCountry, selectedState).map(
                    (city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    )
                  )}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="pincode">Pin Code</label>
              <input
                type="text"
                className="form-control "
                id="pincode"
                placeholder="pin code or Area code"
                required
                value={location.pinCode}
                onChange={onChangePinCode}
              />
            </div>
          </div>

          <div className="form-row row mt-3">
            <div className="form-group col-md-3">
              <label htmlFor="shippingAllowed" className="me-4">
                Delivery Allowed
              </label>
              <input
                type="checkbox"
                className="inset-shadow"
                id="deliver"
                name="deliveryAllowed"
                value={location.deliveryAllowed}
                onChange={onChangeDelivery}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="pickupAllowed" className="me-4">
                Pickup Allowed
              </label>
              <input
                type="checkbox"
                className=""
                id="pickup"
                name="pickupAllowed"
                value={location.pickupAllowed}
                onChange={onChangePickup}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="shippingAllowed" className="me-4">
                Shipping Allowed
              </label>
              <input
                type="checkbox"
                className=""
                id="shipping"
                name="shippingAllowed"
                value={location.shippingAllowed}
                onChange={onChangeShipping}
              />
            </div>
          </div>

          <Button
            variant="contained"
            className="bg-info text-black"
            type="submit"
            sx={{ mt: 2 }}
          >
            {id === "-1" ? "Add Location" : "Update Location"}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ ml: 2, mt: 2 }}
            onClick={() => navigate("/location")}
          >
            Cancel
          </Button>
        </form>
      </div>
    </>
  );
}
