import React, { useState, useEffect } from "react";
import api from "../../utils/Api";

const LocationPicker = ({ value, onChange, error }) => {
  const val = value || {};
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
    if (!val.state) {
      setLgas([]);
      return;
    }
    const fetchLgas = async () => {
      setLoading((prev) => ({ ...prev, lgas: true }));
      try {
        const res = await api.get(`/api/v1/location/lgas?state=${val.state}`);
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
  }, [val.state]);

  // Fetch Wards when LGA changes
  useEffect(() => {
    if (!val.state || !val.lga) {
      setWards([]);
      return;
    }
    const fetchWards = async () => {
      setLoading((prev) => ({ ...prev, wards: true }));
      try {
        const res = await api.get(
          `/api/v1/location/wards?state=${val.state}&lga=${val.lga}`
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
  }, [val.state, val.lga]);

  // Fetch Polling Units when Ward changes
  useEffect(() => {
    if (!val.state || !val.lga || !val.ward) {
      setPollingUnits([]);
      return;
    }
    const fetchPollingUnits = async () => {
      setLoading((prev) => ({ ...prev, pollingUnits: true }));
      try {
        const res = await api.get(
          `/api/v1/location/polling-units?state=${val.state}&lga=${val.lga}&ward=${val.ward}`
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
  }, [val.state, val.lga, val.ward]);

  const handleSelectChange = (field, selectedValue) => {
    const updatedValue = { ...val, [field]: selectedValue };
    
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

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50";

  // Renders a dropdown when reference options exist; otherwise falls back to a
  // free-text field so registration is never blocked when the location
  // reference data is empty (e.g. a fresh deployment / live demo).
  const renderField = (label, field, options, isLoading, enabled) => {
    const useText = enabled && !isLoading && options.length === 0;
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {useText ? (
          <input
            type="text"
            className={inputClass}
            value={val[field] || ""}
            disabled={!enabled}
            placeholder={`Enter ${label}`}
            onChange={(e) => handleSelectChange(field, e.target.value)}
          />
        ) : (
          <select
            className={inputClass}
            value={val[field] || ""}
            disabled={!enabled || isLoading}
            onChange={(e) => handleSelectChange(field, e.target.value)}
          >
            <option value="">{isLoading ? "Loading…" : `Select ${label}`}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField("State", "state", states, loading.states, true)}
        {renderField("LGA", "lga", lgas, loading.lgas, !!val.state)}
        {renderField("Ward", "ward", wards, loading.wards, !!val.lga)}
        {renderField("Polling Unit", "pollingUnit", pollingUnits, loading.pollingUnits, !!val.ward)}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default LocationPicker;
