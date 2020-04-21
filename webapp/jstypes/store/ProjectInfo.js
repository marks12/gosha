
import {ProjectInfo} from "../apiModel";
import api from "../api";
import {findItemIndex} from "../common";

let findUrl = "/api/v1/projectInfo";
let readUrl = "/api/v1/projectInfo/"; // + id
let createUrl = "/api/v1/projectInfo";
let multiCreateUrl = "/api/v1/projectInfo/list";
let updateUrl = "/api/v1/projectInfo/"; // + id
let multiUpdateUrl = "/api/v1/projectInfo/list"; // + id
let deleteUrl = "/api/v1/projectInfo/"; // + id
let multiDeleteUrl = "/api/v1/projectInfo/list"; // + id
let findOrCreateUrl = "/api/v1/projectInfo"; // + id

const projectInfo = {
    actions: {
        createProjectInfo(context, {data, filter, header}) {

            let url = createUrl;
            if (Array.isArray && Array.isArray(data)) {
                url = multiCreateUrl
            }

            return api.create(url, data, filter, header)
                .then(function(response) {

                    context.commit("setProjectInfo", response.Model);

                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        deleteProjectInfo(context, {id, header}) {

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
                    context.commit("clearProjectInfo");
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        findProjectInfo(context, {filter, header, isAppend}) {

            return api.find(findUrl, filter, header)
                .then(function(response) {

                    if (isAppend) {
                        context.commit("appendProjectInfo__List", response.List);
                    } else {
                        context.commit("setProjectInfo__List", response.List);
                    }

                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        loadProjectInfo(context, {id, filter, header}) {

            return api.find(readUrl + id, filter, header)
                .then(function(response) {

                    context.commit("setProjectInfo", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        updateProjectInfo(context, {id, data, filter, header}) {

            let url = updateUrl + id;
            if (Array.isArray && Array.isArray(data)) {
                url = multiUpdateUrl
            }

            return api.update(url, data, filter, header)
                .then(function(response) {

                    context.commit("setProjectInfo", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        findOrCreateProjectInfo(context, {id, data, filter, header}) {

            return api.update(findOrCreateUrl, data, filter, header)
                .then(function(response) {

                    context.commit("setProjectInfo", response.Model);
                    return response;
                })
                .catch(function(err) {
                    console.error(err);
                    throw(err);
                });
        },
        clearListProjectInfo(context) {
            context.commit("clearListProjectInfo");
        },
        clearProjectInfo(context) {
            context.commit("clearProjectInfo");
        },
    },
    getters: {
        getProjectInfo: (state) => {
            return state.ProjectInfo;
        },
        getProjectInfoById: state => id => {
            return state.ProjectInfo__List.find(item => item.Id === id);
        },
        getListProjectInfo: (state) => {
            return state.ProjectInfo__List;
        },
        getRoute__ProjectInfo: state => action => {
            return state.ProjectInfo__Routes[action];
        },
        getRoutes__ProjectInfo: state => {
            return state.ProjectInfo__Routes;
        },
    },
    mutations: {
        setProjectInfo(state, data) {
            state.ProjectInfo = data;
        },
        setProjectInfo__List(state, data) {
            state.ProjectInfo__List = data || [];
        },
        appendProjectInfo__List(state, data) {

            if (! state.ProjectInfo__List) {
                state.ProjectInfo__List = [];
            }

            state.ProjectInfo__List = state.ProjectInfo__List.concat(data);
        },
        clearProjectInfo(state) {
            state.ProjectInfo = new ProjectInfo();
        },
        clearListProjectInfo(state) {
            state.ProjectInfo__List = [];
        },
		updateProjectInfoById(state, data) {
    		let index = findItemIndex(state.ProjectInfo__List, function(item) {
	        	return item.Id === data.Id;
	    	});
	    
	    	if (index || index === 0) {
		        state.ProjectInfo__List.splice(index, 1, data);
    		}
		},
		deleteProjectInfoFromList(state, id) {
		    let index = findItemIndex(state.ProjectInfo__List, function(item) {
		        return item.Id === id;
		    });
		    
		    if (index || index === 0) {
		        state.ProjectInfo__List.splice(index, 1);
		    }
		},
		addProjectInfoItemToList(state, item) {

			if (state.ProjectInfo__List === null) {
				state.ProjectInfo__List = [];
			}

		    state.ProjectInfo__List.push(item);
		},
    },
    state: {
        ProjectInfo: new ProjectInfo(),
        ProjectInfo__List: [],
        ProjectInfo__Routes: {
            find: findUrl,
            read: readUrl,
            create: createUrl,
            multiCreate: multiCreateUrl,
            update: updateUrl,
            multiUpdate: multiUpdateUrl,
            delete: deleteUrl,
            multiDelete: multiDeleteUrl,
            findOrCreate: findOrCreateUrl,
        },
    },
};

export default projectInfo;
