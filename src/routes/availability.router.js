const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const { createAvailabilityDto } = require('../dtos/availability.dto');
const AvailabilityService = require('../services/availability.service');

const router = express.Router();
const service = new AvailabilityService();

router.post('/',
  validatorHandler(createAvailabilityDto, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req;
      const availability = await service.create(body);
      console.log('availability', availability);
      res.json(availability);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
