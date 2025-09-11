import axiosClient from '../axiosClient';

class locationAPI {
  static CreateCountry(data: {code: string; name: string;}){
    return axiosClient.post('/countries', data);
  }

  static UpdateCountry(_id: string, data: { code: string; name: string; }) {
    return axiosClient.patch(`/countries/${_id}`, data);
  }

  static getAllCountries(params = {}) {
    return axiosClient.get("/countries", { params });
  }

  static getCountryById(id: string) {
    return axiosClient.get(`/countries/${id}`);
  }

  static DeleteCountry(id: string) {
    return axiosClient.delete(`/countries/${id}`);
  }

  static CreateCity(data: { countryId: string; name: string; }) { 
    return axiosClient.post('/cities', data); 
  }

  static UpdateCity(id: string, data: { countryId: string; name: string; }) { 
    return axiosClient.patch(`/cities/${id}`, data); 
  }

  static getAllCities(params = {}) { 
    return axiosClient.get("/cities", { params }); 
  }

  static DeleteCity(id: string) { 
    return axiosClient.delete(`/cities/${id}`); 
  }
}

export default locationAPI;
