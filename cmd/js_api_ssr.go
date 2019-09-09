package cmd

const apiSSRContent = `
import axios from "axios";

function BackendApi() {

  this.serverUrl = "http://127.0.0.1:7500";

  this.getRouteUrl = (url) => {
    return this.serverUrl + url;
  };

  return {
    create: (url, data, getParams, headerParams) => {
      return axios.post(this.getRouteUrl(url),data, {params: getParams, headers: headerParams }).then((response) => {
        return response.data;
      });
    },
    find: (url, getParams, headerParams) => {
      return axios.get(this.getRouteUrl(url), {params: getParams, headers: headerParams })
        .then((response) => {
          return response.data;
        });
    },
    getServerUrl: () => {
      return this.serverUrl;
    },
    remove: (url, getParams, headerParams) => {
      return axios.delete(this.getRouteUrl(url), {params: getParams, headers: headerParams }).then((response) => {
        return response.data;
      });
    },
    setServerUrl: (url) => {
      this.serverUrl = url;
      return this;
    },
    update: (url, data, getParams, headerParams) => {
      return axios.put(this.getRouteUrl(url), data, {params: getParams, headers: headerParams }).then((response) => {
        return response.data;
      });
    },
  };
}

let apiSSR = new BackendApi();

export default apiSSR;
`