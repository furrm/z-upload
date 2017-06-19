// dependencies:
// ng-config
// todo: add dependency in the bower package file
// todo: is there a caching library already available?

angular.module('ng.kanbanery.config', [])

    .value('kanbaneryConfig', {
        "workspaceName": "",
        "workspaceUrl": "",
        "apiEndpoint": "http://valueEndpoint",
        "apiToken": "",
        "projectId": ""
    })

//    .config(function ($provide, $httpProvider) {
//
//        // Intercept http calls.
//        $provide.factory('kanbaneryInterceptor', ['$q', 'CacheService', function ($q, CacheService) {
//
//            var cachedData = JSON.parse(CacheService.localStorage.read("appSettings"))
//
//            return {
//                // On request success
//                request: function (config) {
//
//                    // Add the Contentful API token to the header.
//                    config.headers['X-Kanbanery-ApiToken'] = cachedData.apiToken;
//
//                    // Return the config or wrap it in a promise if blank.
//                    return config || $q.when(config);
//
//                },
//
//                // On request failure
//                requestError: function (rejection) {
//                    // console.log(rejection); // Contains the data about the error on the request.
//
//                    // Return the promise rejection.
//                    return $q.reject(rejection);
//                },
//
//                // On response success
//                response: function (response) {
//                    // console.log(response); // Contains the data from the response.
//
//                    // Return the response or promise.
//                    return response || $q.when(response);
//                },
//
//                // On response failture
//                responseError: function (rejection) {
//                    // console.log(rejection); // Contains the data about the error.
//
//                    // Return the promise rejection.
//                    return $q.reject(rejection);
//                }
//            };
//        }]);
//
//        // Add the interceptor to the $httpProvider.
//        $httpProvider.interceptors.push('kanbaneryInterceptor');
//
//    })
;

angular.module('ng.kanbanery', [
    'ng.kanbanery.config'
])
    .factory('KanbaneryConfig', ['CacheService', function (CacheService) {

        return{
            "getConfig": getConfig,
            "setConfig": setConfig
        }

//        function getConfig(){
//            return {
//                "workspaceName":"",
//                "workspaceUrl":"",
//                "apiEndpoint":"http://endpoint",
//                "apiToken": "",
//                "projectId": ""
//            }
//        }

        function getConfig() {

            try {
                var cachedData = JSON.parse(CacheService.localStorage.read("app-settings")); // todo: key needs to be a constant

                if (cachedData) {

                    return cachedData
                }
                else {
                    return {
                        "workspaceName": "",
                        "workspaceUrl": "",
                        "apiEndpoint": "",
                        "apiToken": "",
                        "projectId": ""
                    }
                }

            }
            catch (ex) {
                throw ex;
            }

        }

        function setConfig(data) {
            try {
                CacheService.localStorage.write("app-settings", JSON.stringify(data)); // todo: key needs to be a constant
            } catch (ex) {
                throw ex;
            }
        }

    }])
    .factory('KanbaneryDataAcess', ['$timeout', '$http', '$q', 'KanbaneryConfig',
        function ($timeout, $http, $q, KanbaneryConfig) {
            return{
                "name": 'KanbaneryDataAcess',
                "endpointTest": endpointTest,
                "getProjects": getProjects,
                "getIceboxTasks": getIceboxTasks,
                "getArchivedTasks": getArchivedTasks,
                "deleteArchivedTasks": deleteTasksAsync,
                "deleteTask": deleteTask
            };

            function endpointTest(url, apiToken){

                var testUrl = url + "/user.json";
                return getData(testUrl, apiToken);

            }

            // Gets all projects for a given account.
            function getProjects() {

                var config = KanbaneryConfig.getConfig();

                var url = config.apiEndpoint + "/projects";

                return getData(url, config.apiToken);

            }

            function getIceboxTasks() {

                var config = KanbaneryConfig.getConfig();

                var url = KanbaneryConfig.apiEndpoint + "/projects/6365/icebox/tasks.json";
//            var archivedTasksUrl = "http://localhost:63342/task-manager/task-app/www/data/tasks-archived.json";

                // returns a promise.
                return getData(url);

            }


            function getArchivedTasks() {

                var url = kanbaneryConfig.apiEndpoint + "/projects/6365/archive/tasks.json";
//            var archivedTasksUrl = "http://localhost:63342/task-manager/task-app/www/data/tasks-archived.json";

                // returns a promise.
                return getData(url);

            }

            function deleteTasksAsync(tasks) {

                var deferred = $q.defer();

                try {
                    deleteTasks(tasks);
                } catch (e) {

                } finally {
                    deferred.resolve("deleteTasksAsync COMPLETE");
                }


                return deferred.promise;

            }

            function deleteTasks(tasks) {

                console.log("TASKS TO DELETE", tasks.length); // todo: delete me

//            _.forEach(tasks, function(task){
//                console.log(task.id); // todo: delete me

                var taskToDelete = tasks[0];

                console.log("TASK TO DELETE:", taskToDelete); // todo: delete me

                var remainingTasks = _.without(tasks, taskToDelete);

                console.log("REMAINING TASKS:", remainingTasks.length); // todo: delete me

                // process the task to delete
//            deferred.notify("Deleting task ", taskToDelete.id);
                asyncFunc(taskToDelete.id).then(
                    function (response) {

                        if (remainingTasks.length > 0) {
                            return deleteTasks(remainingTasks);
                        }
                        else {
                            // return or resolve?
                            return;
                        }

                    },
                    function (error) {
                    }
                );

//            });

            }

            function deleteTask(task) {

                var deferred = $q.defer();

                var deleteTaskUrl = kanbaneryConfig.apiEndpoint + "/tasks/" + task.id + ".json";

//            return deleteData(deleteTaskUrl);

                // Make the API call
                deleteData(deleteTaskUrl).then(
                    function (response) {

                        deferred.resolve(response);

                    },
                    function (error) {

                        deferred.reject(error);

                    }
                );

                return deferred.promise;
            }

            function getData(url, apiToken, params) {

                console.log("Getting data from: ", url); // todo: delete me

                return $http({
                    method: 'GET',
                    url: url,
                    params: params,
                    headers: {
                        "X-Kanbanery-ApiToken":apiToken
                    }
                });
            }

            function deleteData(url) {
                return $http({
                    method: 'DELETE',
                    url: url
                });
            }

        }])
;