import axiosClient from '../axiosClient';

class SchedularAPI {
  static CreateSchedule(data: any) {
    return axiosClient.post('/schedules', data);
  }

  static UpdateSchedule(id: string, data: any) {
    return axiosClient.patch(`/schedules/${id}`, data);
  }

  static getAll(params = {}) {
    return axiosClient.get('/schedules', { params });
  }

  static GetScheduleById(id: string) {
    return axiosClient.get(`/schedules/${id}`);
  }

  static getByDateRange(startDate: string, endDate: string) {
    return axiosClient.get(`/schedules`, {
      params: {
        "startDate[gte]": startDate,
        "endDate[lte]": endDate,
      },
    });
  }

  static deleteSchedule(id: string) {
    return axiosClient.delete(`/schedules/${id}`);
  }
}

export default SchedularAPI;
