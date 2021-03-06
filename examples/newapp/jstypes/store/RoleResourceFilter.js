
import {RoleResourceFilter} from "../apiModel";
import api from "../api";
import {findItemIndex} from "../common";

let findUrl = "/api/v1/roleResourceFilter";
let readUrl = "/api/v1/roleResourceFilter/"; // + id
let createUrl = "/api/v1/roleResourceFilter";
let multiCreateUrl = "/api/v1/roleResourceFilter/list";
let updateUrl = "/api/v1/roleResourceFilter/"; // + id
let multiUpdateUrl = "/api/v1/roleResourceFilter/list"; // + id
let deleteUrl = "/api/v1/roleResourceFilter/"; // + id
let multiDeleteUrl = "/api/v1/roleResourceFilter/list"; // + id
let findOrCreateUrl = "/api/v1/roleResourceFilter"; // + id

const roleResourceFilter = {
    actions: {
        createRoleResourceFilter(context, {data, filter, header}) {

            let url = createUrl;
            if (Array.isArray && Array.isArray(data)) {
                url = multiCreateUrl
            }

            return api.create(url, data, filter, header)
                .then(function(response) {

                    context.commit("setRoleResourceFilter", response.Model);

                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        deleteRoleResourceFilter(context, {id, header}) {

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
                    context.commit("clearRoleResourceFilter");
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        findRoleResourceFilter(context, {filter, header, isAppend}) {

            return api.find(findUrl, filter, header)
                .then(function(response) {

                    if (isAppend) {
                        context.commit("appendRoleResourceFilter__List", response.List);
                    } else {
                        context.commit("setRoleResourceFilter__List", response.List);
                    }

                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        loadRoleResourceFilter(context, {id, filter, header}) {

            return api.find(readUrl + id, filter, header)
                .then(function(response) {

                    context.commit("setRoleResourceFilter", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        updateRoleResourceFilter(context, {id, data, filter, header}) {

            let url = updateUrl + id;
            if (Array.isArray && Array.isArray(data)) {
                url = multiUpdateUrl
            }

            return api.update(url, data, filter, header)
                .then(function(response) {

                    context.commit("setRoleResourceFilter", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        findOrCreateRoleResourceFilter(context, {id, data, filter, header}) {

            return api.update(findOrCreateUrl, data, filter, header)
                .then(function(response) {

                    context.commit("setRoleResourceFilter", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        clearListRoleResourceFilter(context) {
            context.commit("clearListRoleResourceFilter");
        },
        clearRoleResourceFilter(context) {
            context.commit("clearRoleResourceFilter");
        },
    },
    getters: {
        getRoleResourceFilter: (state) => {
            return state.RoleResourceFilter;
        },
        getRoleResourceFilterById: state => id => {
            return state.RoleResourceFilter__List.find(item => item.Id === id);
        },
        getListRoleResourceFilter: (state) => {
            return state.RoleResourceFilter__List;
        },
    },
    mutations: {
        setRoleResourceFilter(state, data) {
            state.RoleResourceFilter = data;
        },
        setRoleResourceFilter__List(state, data) {
            state.RoleResourceFilter__List = data || [];
        },
        appendRoleResourceFilter__List(state, data) {

            if (! state.RoleResourceFilter__List) {
                state.RoleResourceFilter__List = [];
            }

            state.RoleResourceFilter__List = state.RoleResourceFilter__List.concat(data);
        },
        clearRoleResourceFilter(state) {
            state.RoleResourceFilter = new RoleResourceFilter();
        },
        clearListRoleResourceFilter(state) {
            state.RoleResourceFilter__List = [];
        },
		updateRoleResourceFilterById(state, data) {
    		let index = findItemIndex(state.RoleResourceFilter__List, function(item) {
	        	return item.Id === data.Id;
	    	});
	    
	    	if (index || index === 0) {
		        state.RoleResourceFilter__List.splice(index, 1, data);
    		}
		},
		deleteRoleResourceFilterFromList(state, id) {
		    let index = findItemIndex(state.RoleResourceFilter__List, function(item) {
		        return item.Id === id;
		    });
		    
		    if (index || index === 0) {
		        state.RoleResourceFilter__List.splice(index, 1);
		    }
		},
		addRoleResourceFilterItemToList(state, item) {

			if (state.RoleResourceFilter__List === null) {
				state.RoleResourceFilter__List = [];
			}

		    state.RoleResourceFilter__List.push(item);
		},
    },
    state: {
        RoleResourceFilter: new RoleResourceFilter(),
        RoleResourceFilter__List: [],
    },
};

export default roleResourceFilter;
