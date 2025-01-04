const express = require("express");
const router = express.Router();

const overBookingController = require("../../../controllers/MasterData/GeneralSettings/overBookingController");

router.get("/over-bookings", overBookingController.getAllOverBookings);
router.post("/over-bookings", overBookingController.addOverBooking);
router.put("/over-bookings/:id", overBookingController.updateOverBooking);
router.delete("/over-bookings/:id", overBookingController.deleteOverBooking);
router.get("/over-bookings/doctor/:doctorId", overBookingController.getOverBookingByDoctor);

module.exports = router;
