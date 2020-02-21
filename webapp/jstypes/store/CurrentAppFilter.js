
import {CurrentAppFilter} from "../apiModel";
import api from "../api";
import {findItemIndex} from "../common";

let findUrl = "/api/v1/currentAppFilter";
let readUrl = "/api/v1/currentAppFilter/"; // + id
let createUrl = "/api/v1/currentAppFilter";
let multiCreateUrl = "/api/v1/currentAppFilter/list";
let updateUrl = "/api/v1/currentAppFilter/"; // + id
let multiUpdateUrl = "/api/v1/currentAppFilter/list"; // + id
let deleteUrl = "/api/v1/currentAppFilter/"; // + id
let multiDeleteUrl = "/api/v1/currentAppFilter/list"; // + id
let findOrCreateUrl = "/api/v1/currentAppFilter"; // + id

const currentAppFilter = {
    actions: {
        createCurrentAppFilter(context, {data, filter, header}) {

            let url = createUrl;
            if (Array.isArray && Array.isArray(data)) {
                url = multiCreateUrl
            }

            return api.create(url, data, filter, header)
                .then(function(response) {

                    context.commit("setCurrentAppFilter", response.Model);

                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        deleteCurrentAppFilter(context, {id, header}) {

            let url;
            let dataOrNull = null;

            if (Array.isArray && Array.isArray(id)) {
                url = multiDeleteUrl;
                dataOrNull = id;
            } else {
                url = deleteUrl + id;
            }

            return api.remove(url, header, dataOrNull)
                .then(function(response) {
                    context.commit("clearCurrentAppFilter");
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        findCurrentAppFilter(context, {filter, header, isAppend}) {

            return api.find(findUrl, filter, header)
                .then(function(response) {

                    if (isAppend) {
                        context.commit("appendCurrentAppFilter__List", response.List);
                    } else {
                        context.commit("setCurrentAppFilter__List", response.List);
                    }

                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        loadCurrentAppFilter(context, {id, filter, header}) {

            return api.find(readUrl + id, filter, header)
                .then(function(response) {

                    context.commit("setCurrentAppFilter", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        updateCurrentAppFilter(context, {id, data, filter, header}) {

            let url = updateUrl + id;
            if (Array.isArray && Array.isArray(data)) {
                url = multiUpdateUrl
            }

            return api.update(url, data, filter, header)
                .then(function(response) {

                    context.commit("setCurrentAppFilter", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        findOrCreateCurrentAppFilter(context, {id, data, filter, header}) {

            return api.update(findOrCreateUrl, data, filter, header)
                .then(function(response) {

                    context.commit("setCurrentAppFilter", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        clearListCurrentAppFilter(context) {
            context.commit("clearListCurrentAppFilter");
        },
        clearCurrentAppFilter(context) {
            context.commit("clearCurrentAppFilter");
        },
    },
    getters: {
        getCurrentAppFilter: (state) => {
            return state.CurrentAppFilter;
        },
        getCurrentAppFilterById: state => id => {
            return state.CurrentAppFilter__List.find(item => item.Id === id);
        },
        getListCurrentAppFilter: (state) => {
            return state.CurrentAppFilter__List;
        },
    },
    mutations: {
        setCurrentAppFilter(state, data) {
            state.CurrentAppFilter = data;
        },
        setCurrentAppFilter__List(state, data) {
            state.CurrentAppFilter__List = data || [];
        },
        appendCurrentAppFilter__List(state, data) {

            if (! state.CurrentAppFilter__List) {
                state.CurrentAppFilter__List = [];
            }

            state.CurrentAppFilter__List = state.CurrentAppFilter__List.concat(data);
        },
        clearCurrentAppFilter(state) {
            state.CurrentAppFilter = new CurrentAppFilter();
        },
        clearListCurrentAppFilter(state) {
            state.CurrentAppFilter__List = [];
        },
		updateCurrentAppFilterById(state, data) {
    		let index = findItemIndex(state.CurrentAppFilter__List, function(item) {
	        	return item.Id === data.Id;
	    	});
	    
	    	if (index || index === 0) {
		        state.CurrentAppFilter__List.splice(index, 1, data);
    		}
		},
		deleteCurrentAppFilterFromList(state, id) {
		    let index = findItemIndex(state.CurrentAppFilter__List, function(item) {
		        return item.Id === id;
		    });
		    
		    if (index || index === 0) {
		        state.CurrentAppFilter__List.splice(index, 1);
		    }
		},
		addCurrentAppFilterItemToList(state, item) {

			if (state.CurrentAppFilter__List === null) {
				state.CurrentAppFilter__List = [];
			}

		    state.CurrentAppFilter__List.push(item);
		},
    },
    state: {
        CurrentAppFilter: new CurrentAppFilter(),
        CurrentAppFilter__List: [],
    },
};

export default currentAppFilter;
