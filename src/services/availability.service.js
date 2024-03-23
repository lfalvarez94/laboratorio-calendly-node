// const Schedule = require('./../database/entities/schedule.entity');
// const Availability = require('./../database/entities/availability.entity');
// const boom = require('@hapi/boom');
// const { format, parse, addMinutes, isBefore, isEqual } = require('date-fns');

// class AvailabilityService {
//   async create(dto) {
//     const schedule = await Schedule.findById(dto.scheduleId);
//     if (!schedule) {
//       throw boom.notFound('Schedule not found');
//     }
//     const day = this.getDay(dto.date);
//     const availability = this.getAvailabilityByDay(schedule.availability, day);
//     if (availability === undefined) {
//       throw boom.notFound('Availability not found');
//     }
//     const slots = availability.intervals.map((interval) => {
//       const start = this.createDate(dto.date, interval.startTime);
//       const end = this.createDate(dto.date, interval.endTime);
//       const slots = this.generateSlots(start, end, schedule.duration, schedule.margin);
//       return slots;
//     });
//     return slots.flat();
//   }

//   getDay(date) {
//     return format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE').toLowerCase();
//   }

//   createDate(date, slotTime){
//     const [year, month, day] = date.split('-').map((item) => parseInt(item));
//     const [hours, minutes] = slotTime.split(':').map((item) => parseInt(item));
//     return new Date(year, month -1, day, hours, minutes, 0);
//   }

//   getAvailabilityByDay(availability, day) {
//     return availability.find((item) => item.day === day);
//   }

//   generateSlots(startDate, endDate, duration, margin) {
//     const slots = [];
//     let processing = true;
//     let start = startDate;
//     let end = null;
//     while (processing) {
//       end = addMinutes(start, duration);
//       processing = isBefore(end, endDate) || isEqual(end, endDate);
//       if (processing) {
//         slots.push({ start, end, status: 'on' });
//         start = addMinutes(end, margin);
//       }
//     }
//     return [...slots];
//   }

//   getAll() {
//     return Availability.find();
//   }

//   getBySchedule(scheduleId) {
//     return Availability.find({ schedule: scheduleId });
//   }

//   getById(id) {
//     return Availability.findById(id);
//   }
// }

// module.exports = AvailabilityService;

const Schedule = require('./../database/entities/schedule.entity');
const Availability = require('./../database/entities/availability.entity');
const boom = require('@hapi/boom');
const { format, parse, addMinute, isBefore, isEqual } = require('@formkit/tempo');

class AvailabilityService {
  async create(dto) {
    const schedule = await Schedule.findById(dto.scheduleId);
    if (!schedule) {
      throw boom.notFound('Schedule not found');
    }
    const day = this.getDay(dto.date);
    const availability = this.getAvailabilityByDay(schedule.availability, day);
    if (availability === undefined) {
      throw boom.notFound('Availability not found');
    }
    const slots = availability.intervals.map((interval) => {
      const start = this.createDate(dto.date, interval.startTime);
      const end = this.createDate(dto.date, interval.endTime);
      const slots = this.generateSlots(start, end, schedule.duration, schedule.margin);
      return slots;
    });
    return slots.flat();
    // const day = this.getDay(dto.date);
    // const availability = this.getAvailabilityByDay(schedule.availability, day);
    // if (availability === undefined) {
    //   throw boom.notFound('Availability not found');
    // }
    // const slots = availability.intervals.map((interval) => {
    //   const start = this.createDate(dto.date, interval.startTime);
    //   const end = this.createDate(dto.date, interval.endTime);
    //   const slots = this.generateSlots(start, end, schedule.duration, schedule.margin);
    //   return slots;
    // });
    // return slots.flat();
  }

  getDay(date) {
    //return format(parse(date, 'YYYY-MM-DD', new Date()), 'EEEE').toLowerCase();
    return format(date, "full", 'en').split(',')[0].toLowerCase();
    // console.log(day.split(',')[0]);
  }

  createDate(date, slotTime){
    const [year, month, day] = date.split('-').map((item) => parseInt(item));
    const [hours, minutes] = slotTime.split(':').map((item) => parseInt(item));
    return new Date(year, month -1, day, hours, minutes, 0);
  }

  getAvailabilityByDay(availability, day) {
    return availability.find((item) => item.day === day);
  }

  generateSlots(startDate, endDate, duration, margin) {
    const slots = [];
    let processing = true;
    let start = startDate;
    let end = null;
    while (processing) {
      end = addMinute(start, duration);
      processing = isBefore(end, endDate) || isEqual(end, endDate);
      if (processing) {
        slots.push({ start, end, status: 'on' });
        start = addMinute(end, margin);
      }
    }
    return [...slots];
  }

  getAll() {
    return Availability.find();
  }

  getBySchedule(scheduleId) {
    return Availability.find({ schedule: scheduleId });
  }

  getById(id) {
    return Availability.findById(id);
  }
}

module.exports = AvailabilityService;
