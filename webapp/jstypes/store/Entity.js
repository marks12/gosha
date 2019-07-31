
import {Entity} from "../apiModel";
import api from "../api";
import {findItemIndex} from "../common";

let findUrl = "/api/v1/entity";
let readUrl = "/api/v1/entity/"; // + id
let createUrl = "/api/v1/entity";
let updateUrl = "/api/v1/entity/"; // + id
let deleteUrl = "/api/v1/entity/"; // + id
let findOrCreateUrl = "/api/v1/entity"; // + id

const entity = {
    actions: {
        createEntity(context, {data, filter, header}) {

            return api.create(createUrl, data, filter, header)
                .then(function(response) {

                    context.commit("setEntity", response.Model);

                    return response;
                })
                .catch(function(err) {
                    return err;
                });
        },
        deleteEntity(context, {id, header}) {

            return api.remove(deleteUrl + id, header)
                .then(function(response) {
                    context.commit("clearEntity");
                    return response;
                })
                .catch(function(err) {
                    return err;
                });
        },
        findEntity(context, {filter, header}) {

            return api.find(findUrl, filter, header)
                .then(function(response) {

                    context.commit("setEntityList", response.List);

                    return response;
                })
                .catch(function(err) {
                    return err;
                });
        },
        loadEntity(context, {id, filter, header}) {

            return api.find(readUrl + id, filter, header)
                .then(function(response) {

                    context.commit("setEntity", response.Model);

                    return response;
                })
                .catch(function(err) {
                    return err;
                });
        },
        updateEntity(context, {id, data, filter, header}) {

            return api.update(updateUrl + id, data, filter, header)
                .then(function(response) {

                    context.commit("setEntity", response.Model);

                    return response;
                })
                .catch(function(err) {
                    return err;
                });
        },
        findOrCreateEntity(context, {id, data, filter, header}) {

            return api.update(findOrCreateUrl, data, filter, header)
                .then(function(response) {

                    context.commit("setEntity", response.Model);

                    return response;
                })
                .catch(function(err) {
                    return err;
                });
        },
        clearListEntity(context) {
            context.commit("clearListEntity");
        },
    },
    getters: {
        getEntity: (state) => {
            return state.Entity;
        },
        getListEntity: (state) => {
            return state.EntityList;
        },
    },
    mutations: {
        setEntity(state, data) {
            state.Entity = data;
        },
        setEntityList(state, data) {
            state.EntityList = data;
        },
        clearEntity(state) {
            state.Entity = new Entity();
        },
        clearListEntity(state) {
            state.EntityList = [];
        },
		updateEntityById(state, data) {
    		let index = findItemIndex(state.EntityList, function(item) {
	        	return item.Id === data.Id;
	    	});
	    
	    	if (index || index === 0) {
		        state.EntityList.splice(index, 1, data);
    		}
		},
		deleteEntityFromList(state, id) {
		    let index = findItemIndex(state.EntityList, function(item) {
		        return item.Id === id;
		    });
		    
		    if (index || index === 0) {
		        state.EntityList.splice(index, 1);
		    }
		},
		addEntityItemToList(state, item) {

			if (state.EntityList === null) {
				state.EntityList = [];
			}

		    state.EntityList.push(item);
		},
    },
    state: {
        Entity: new Entity(),
        EntityList: [],
    },
};

export default entity;
