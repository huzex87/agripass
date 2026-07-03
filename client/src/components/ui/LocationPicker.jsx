import React, { useState, useEffect } from "react";
import api from "../../utils/Api";

const LocationPicker = ({ value = {}, onChange, error }) => {
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);
  const [pollingUnits, setPollingUnits] = useState([]);

  const [loading, setLoading] = useState({
    states: false,
    lgas: false,
    wards: false,
    pollingUnits: false,
  });

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoading((prev) => ({ ...prev, states: true }));
      try {
        const res = await api.get("/api/v1/location/states");
        if (res.data?.status === "success") {
          setStates(res.data.data);
        }
      } catch (err) {
        console.error("Error loading states:", err);
      } finally {
        setLoading((prev) => ({ ...prev, states: false }));
      }
    };
    fetchStates();
  }, []);

  // Fetch LGAs when state changes
  useEffect(() => {
    if (!value.state) {
      setLgas([]);
      return;
    }
    const fetchLgas = async () => {
      setLoading((prev) => ({ ...prev, lgas: true }));
      try {
        const res = await api.get(`/api/v1/location/lgas?state=${value.state}`);
        if (res.data?.status === "success") {
          setLgas(res.data.data);
        }
      } catch (err) {
        console.error("Error loading LGAs:", err);
      } finally {
        setLoading((prev) => ({ ...prev, lgas: false }));
      }
    };
    fetchLgas();
  }, [value.state]);

  // Fetch Wards when LGA changes
  useEffect(() => {
    if (!value.state || !value.lga) {
      setWards([]);
      return;
    }
    const fetchWards = async () => {
      setLoading((prev) => ({ ...prev, wards: true }));
      try {
        const res = await api.get(
          `/api/v1/location/wards?state=${value.state}&lga=${value.lga}`
        );
        if (res.data?.status === "success") {
          setWards(res.data.data);
        }
      } catch (err) {
        console.error("Error loading Wards:", err);
      } finally {
        setLoading((prev) => ({ ...prev, wards: false }));
      }
    };
    fetchWards();
  }, [value.state, value.lga]);

  // Fetch Polling Units when Ward changes
  useEffect(() => {
    if (!value.state || !value.lga || !value.ward) {
      setPollingUnits([]);
      return;
    }
    const fetchPollingUnits = async () => {
      setLoading((prev) => ({ ...prev, pollingUnits: true }));
      try {
        const res = await api.get(
          `/api/v1/location/polling-units?state=${value.state}&lga=${value.lga}&ward=${value.ward}`
        );
        if (res.data?.status === "success") {
          setPollingUnits(res.data.data);
        }
      } catch (err) {
        console.error("Error loading Polling Units:", err);
      } finally {
        setLoading((prev) => ({ ...prev, pollingUnits: false }));
      }
    };
    fetchPollingUnits();
  }, [value.state, value.lga, value.ward]);

  const handleSelectChange = (field, selectedValue) => {
    const updatedValue = { ...value, [field]: selectedValue };
    
    // Clear child fields on parent change
    if (field === "state") {
      updatedValue.lga = "";
      updatedValue.ward = "";
      updatedValue.pollingUnit = "";
    } else if (field === "lga") {
      updatedValue.ward = "";
      updatedValue.pollingUnit = "";
    } else if (field === "ward") {
      updatedValue.pollingUnit = "";
    }

    onChange(updatedValue);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            State
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={value.state || ""}
            onChange={(e) => handleSelectChange("state", e.target.value)}
            disabled={loading.states}
          >
            <option value="">Select State</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* LGA */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            LGA
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            value={value.lga || ""}
            onChange={(e) => handleSelectChange("lga", e.target.value)}
            disabled={!value.state || loading.lgas}
          >
            <option value="">Select LGA</option>
            {lgas.map((lg) => (
              <option key={lg} value={lg}>
                {lg}
              </option>
            ))}
          </select>
        </div>

        {/* Ward */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Ward
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            value={value.ward || ""}
            onChange={(e) => handleSelectChange("ward", e.target.value)}
            disabled={!value.lga || loading.wards}
          >
            <option value="">Select Ward</option>
            {wards.map((wd) => (
              <option key={wd} value={wd}>
                {wd}
              </option>
            ))}
          </select>
        </div>

        {/* Polling Unit */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Polling Unit
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            value={value.pollingUnit || ""}
            onChange={(e) => handleSelectChange("pollingUnit", e.target.value)}
            disabled={!value.ward || loading.pollingUnits}
          >
            <option value="">Select Polling Unit</option>
            {pollingUnits.map((pu) => (
              <option key={pu} value={pu}>
                {pu}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default LocationPicker;
