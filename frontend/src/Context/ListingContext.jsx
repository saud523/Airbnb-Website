import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const listingDataContext = createContext();

function ListingContext({ children }) {
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);

  // ====== Form Fields ======
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [category, setCategory] = useState("");

  // Backend images
  const [backEndImage1, setBackEndImage1] = useState(null);
  const [backEndImage2, setBackEndImage2] = useState(null);
  const [backEndImage3, setBackEndImage3] = useState(null);

  // Frontend preview images
  const [frontEndImage1, setFrontEndImage1] = useState(null);
  const [frontEndImage2, setFrontEndImage2] = useState(null);
  const [frontEndImage3, setFrontEndImage3] = useState(null);

  // ====== Loading States ======
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ====== Data States ======
  const [listingData, setListingData] = useState([]);
  const [newListData, setNewListData] = useState([]);
  const [cardDetails, setCardDetails] = useState(null);
  const [searchData, setSearchData] = useState([]);

  // ====== Helper: Reset Form ======
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRent("");
    setCity("");
    setLandmark("");
    setCategory("");
    setBackEndImage1(null);
    setBackEndImage2(null);
    setBackEndImage3(null);
    setFrontEndImage1(null);
    setFrontEndImage2(null);
    setFrontEndImage3(null);
  };

  // ====== Add Listing ======
  const handleAddListing = async () => {
  if (!title || !description || !rent || !city || !landmark || !category) {
    toast.error("All fields are required");
    return;
  }

  if (!backEndImage1 || !backEndImage2 || !backEndImage3) {
    toast.error("All 3 images are required");
    return;
  }

  setAdding(true);
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("rent", rent);
    formData.append("city", city);
    formData.append("landmark", landmark);   // ✅ FIXED spelling
    formData.append("category", category);

    // Images
    formData.append("image1", backEndImage1);
    formData.append("image2", backEndImage2);
    formData.append("image3", backEndImage3);

    await axios.post(`${serverUrl}/api/listing/add`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" }  // ✅ REQUIRED
    });

    toast.success("Listing Added!");
    resetForm();
    getListing();
    navigate("/");
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error adding listing");
  } finally {
    setAdding(false);
  }
};


  // ====== View Card Details ======
  const handleViewCard = async (id) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/listing/findlistingbyid/${id}`,
        { withCredentials: true }
      );
      setCardDetails(result.data);
      navigate("/viewcard");
    } catch (error) {
      console.error(error);
      toast.error("Unable to load details");
    }
  };

  // ====== Search Listings ======
  const handleSearch = async (text) => {
    const query = text.trim();
    if (!query) {
      setSearchData([]);
      return;
    }

    try {
      const result = await axios.get(`${serverUrl}/api/listing/search`, {
        params: { query },
      });
      setSearchData(result.data);
    } catch (error) {
      console.error(error);
      setSearchData([]);
    }
  };

  // ====== Get All Listings ======
  const getListing = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/listing/get`);
      setListingData(result.data);
      setNewListData(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getListing();
  }, [adding, updating, deleting]);

  // ====== Context Value ======
  const value = {
    title,
    setTitle,
    description,
    setDescription,
    rent,
    setRent,
    city,
    setCity,
    landmark,
    setLandmark,
    category,
    setCategory,

    backEndImage1,
    setBackEndImage1,
    backEndImage2,
    setBackEndImage2,
    backEndImage3,
    setBackEndImage3,

    frontEndImage1,
    setFrontEndImage1,
    frontEndImage2,
    setFrontEndImage2,
    frontEndImage3,
    setFrontEndImage3,

    adding,
    setAdding,
    updating,
    setUpdating,
    deleting,
    setDeleting,

    listingData,
    setListingData,
    newListData,
    setNewListData,
    cardDetails,
    setCardDetails,
    searchData,
    setSearchData,

    handleAddListing,
    handleViewCard,
    handleSearch,
    getListing,
  };

  return (
    <listingDataContext.Provider value={value}>
      {children}
    </listingDataContext.Provider>
  );
}

export default ListingContext;