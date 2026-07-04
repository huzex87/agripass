const AppError = require("../utils/AppError");
const { LocationReference } = require("../Database_Models/Models");

// Retrieve unique list of states
const getStates = async (req, res, next) => {
  try {
    const states = await LocationReference.distinct("state");
    return res.status(200).json({
      status: "success",
      data: states
    });
  } catch (error) {
    return next(error);
  }
};

// Retrieve unique list of LGAs for a state
const getLgas = async (req, res, next) => {
  try {
    const { state } = req.query;
    if (!state) {
      return next(new AppError("State query parameter is required", 400));
    }

    const lgas = await LocationReference.distinct("lga", { state });
    return res.status(200).json({
      status: "success",
      data: lgas
    });
  } catch (error) {
    return next(error);
  }
};

// Retrieve list of Wards for a state and LGA
const getWards = async (req, res, next) => {
  try {
    const { state, lga } = req.query;
    if (!state || !lga) {
      return next(new AppError("State and LGA query parameters are required", 400));
    }

    const wards = await LocationReference.distinct("ward", { state, lga });
    return res.status(200).json({
      status: "success",
      data: wards
    });
  } catch (error) {
    return next(error);
  }
};

// Retrieve list of Polling Units for a state, LGA, and Ward
const getPollingUnits = async (req, res, next) => {
  try {
    const { state, lga, ward } = req.query;
    if (!state || !lga || !ward) {
      return next(new AppError("State, LGA, and Ward query parameters are required", 400));
    }

    const reference = await LocationReference.findOne({ state, lga, ward });

    return res.status(200).json({
      status: "success",
      data: reference ? reference.pollingUnits : []
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStates,
  getLgas,
  getWards,
  getPollingUnits
};
