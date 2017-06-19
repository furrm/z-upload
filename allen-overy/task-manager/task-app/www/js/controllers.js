angular.module('app.controllers', ['ng.kanbanery.config'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        $scope.$on('project-updated', function(event, args) {

            console.log(event,args);
        });

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })
    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })
    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })
    .controller('SettingsCtrl', ['$scope', '$state', 'KanbaneryConfig', 'KanbaneryDataAcess', 'CacheService', '$ionicLoading', '$ionicPopup',
        function ($scope, $state, KanbaneryConfig, KanbaneryDataAcess, CacheService, $ionicLoading,$ionicPopup) {

            // API Token: c0c5e2812d5fed2057869610e91c697d95110c7d

            $scope.settings = KanbaneryConfig.getConfig();

//            $scope.disableSave = true;
            $scope.disableTest = true;

            $scope.owner = "";

            $scope.$watch("settings.workspaceName", function (newVal, oldVal) {

                if (newVal !== oldVal) {
                    $scope.settings.workspaceUrl = "https://" + newVal + ".kanbanery.com";
                    $scope.settings.apiEndpoint = "https://" + newVal + ".kanbanery.com/api/v1";

                    // enable the test button
                    $scope.disableTest = false;
                }

            });


            $scope.test = function () {

                $ionicLoading.show({"template":"Testing Connection..."});

                KanbaneryDataAcess.endpointTest($scope.settings.apiEndpoint, $scope.settings.apiToken).then(
                    function (response) { // successful response from the api call

                        $ionicLoading.hide();

                        $scope.owner = response.data;

                        $ionicPopup.confirm({
                            "title":"Test Successful!",
                            "template": "<div style='text-align: center'>Your connectivity has been successfully tested and verified.  Please save your settings before proceeding.</div>",
                            "buttons":[
                                {
                                    "text":"Cancel",
                                    "onTap": function(e){

                                        return false;

                                    }

                                },
                                {
                                    "text":"<b>Save</b>",
                                    "type": "button-positive",
                                    "onTap": function(e){

                                        return true;

                                    }
                                }
                            ]
                        }).then(
                            function(res){

                                var save = res;

                                if(save){ // save clicked

                                    try {

                                        KanbaneryConfig.setConfig($scope.settings);

                                        CacheService.localStorage.write("owner", JSON.stringify($scope.owner));

                                        // redirect user back to the main settings page
                                        $state.go("app.settings");

                                    } catch (e) {

                                        alert("ERROR!");
                                    }

                                }
                                else { // cancel clicked



                                }
                            }
                        );


                    },
                    function (error) { // error response from the api call

                        console.log("ERROR", error); // todo: delete me

                        $ionicLoading.hide();

                        $ionicPopup.confirm({
                            "title":"Test Failed!",
                            "template": "<div style='text-align: center'>An error has been encountered while testing and validating your connection.  Please ensure that you are connected to the internet.</div>",
                            "buttons":[
                                {
                                    "text":"Cancel",
                                    "onTap": function(e){

                                        return false;

                                    }

                                },
                                {
                                    "text":"<b>Try Again</b>",
                                    "type": "button-positive",
                                    "onTap": function(e){

                                        return true;

                                    }
                                }
                            ]
                        }).then(
                            function(res){
                                console.log(res); // todo: delete me

                                var tryAgain = res;

                                if(tryAgain){ // try again clicked

                                    $scope.test();

                                }
                                else { // cancel clicked



                                }
                            }
                        );

                    }
                );

            };

            $scope.save = function (settings) {

                $state.go("app.settings");

            };


        }])
    .controller('SettingsProjectCtrl',
    ['$scope', 'KanbaneryConfig', 'KanbaneryDataAcess', '$ionicLoading', 'CacheService',
        function ($scope, KanbaneryConfig, KanbaneryDataAcess, $ionicLoading, CacheService) {

            $scope.settings = KanbaneryConfig.getConfig();

            $scope.projects;

            $ionicLoading.show({
                template: 'Loading Projects...'
            });


            KanbaneryDataAcess.getProjects().then(
                function (response) {

                    $scope.projects = response.data;

                    console.log("response", response); // todo: delete me

                    if (response.status == 200) {

                        CacheService.localStorage.write("projects", JSON.stringify(response.data));

                    }

                    $ionicLoading.hide();

                },
                function (error) {

                    $ionicLoading.hide();

                    alert(error);
                    console.log("ERROR: ", error); // todo: delete me

                },
                function () {

                });

            $scope.selectProject = function (project) {

                $scope.settings.projectId = project.id;

                try {

                    KanbaneryConfig.setConfig($scope.settings);

                    $scope.$broadcast('project-updated', project);
                    $scope.$emit('project-updated', project);

                } catch (e) {
                    //todo: error handling
                }

//                try {
//                    CacheService.localStorage.write("selected-project", JSON.stringify(project));
//                } catch (e) {
//                    alert("An error has been encountered while attempting to save project data.")
//                }

            }
        }])
    .controller('TasksCtrl', ['$scope', 'KanbaneryDataAcess', '$q', '$ionicLoading',
        function ($scope, KanbaneryDataAcess, $q, $ionicLoading) {

            $scope.list = {
                "showDelete": false
            }

//        $scope.name = KanbaneryDataAcess.getArchivedTasks();

            $scope.tasks;


            $ionicLoading.show({
                template: 'Loading Archived Tasks...'
            });

            KanbaneryDataAcess.getArchivedTasks().then(
                function (response) {

                    response.data = _.without(response.data, response.data[0]);
                    $scope.tasks = response.data;

                    $ionicLoading.hide();

                }, function (error) {
                    $scope.tasks = error;
                    $ionicLoading.hide();

                }, function () {

                });

            $scope.deleteTasks = function () {

                if ($scope.tasks) {

                    $ionicLoading.show({
                        template: 'Deleting Archived Tasks...'
                    });

//                KanbaneryDataAcess.f1($scope.tasks)
                    KanbaneryDataAcess.deleteArchivedTasks($scope.tasks)
                        .then(
                        function (message) {
                            $ionicLoading.hide();
//                        alert(message);
                            alert("DELETED!!");
                        },
                        function () {
                            $ionicLoading.hide();
                        },
                        function (message) {
                            $ionicLoading.show({
                                template: message
                            });
                        }
                    );


                }
                else {

                    alert("NOTHING TO DELETE!!");

                }
            }

            $scope.deleteTask = function (task) {

                $ionicLoading.show({
                    template: 'Deleting task ' + task.id
                });

                KanbaneryDataAcess.deleteTask(task).then(
                    function (response) {
                        console.log("DELETE TASK SUCCESS RESPONSE", response); // todo: delete me
                        $scope.tasks = _.without($scope.tasks, task);
                        $ionicLoading.hide();

                    },
                    function (error) {

                        console.log("DELETE TASK ERROR RESPONSE", error); // todo: delete me
                        $ionicLoading.hide();

                    }
                );

            }

        }])
    .controller('ArchiveCtrl', ['$scope', 'KanbaneryDataAcess', 'CacheService', '$q', '$ionicLoading',
        function ($scope, KanbaneryDataAcess, CacheService, $q, $ionicLoading) {

            var loadingMessage = 'Loading Archived Tasks...';
            var cacheKey = 'archive';


            $scope.list = {
                // show/hide delete button for each item
                "showDelete": false
            }


            $scope.tasks;


            $ionicLoading.show({
                template: loadingMessage
            });

            var cachedData = CacheService.localStorage.read(cacheKey);

            if (cachedData) {

                $scope.tasks = JSON.parse(cachedData);

                $ionicLoading.hide();

            }
            else {

                KanbaneryDataAcess.getArchivedTasks().then(
                    function (response) {

//                    response.data = _.without(response.data, response.data[0]);

                        CacheService.localStorage.write(cacheKey, JSON.stringify(response.data));

                        $scope.tasks = response.data;

                        $ionicLoading.hide();


                    }, function (error) {
                        $scope.tasks = error;
                        $ionicLoading.hide();

                    }, function () {

                    });

            }


            $scope.deleteTask = function (task) {

                $ionicLoading.show({
                    template: 'Deleting task ' + task.id
                });

                KanbaneryDataAcess.deleteTask(task).then(
                    function (response) {
                        console.log("DELETE TASK SUCCESS RESPONSE", response); // todo: delete me
                        $scope.tasks = _.without($scope.tasks, task);
                        $ionicLoading.hide();

                    },
                    function (error) {

                        console.log("DELETE TASK ERROR RESPONSE", error); // todo: delete me
                        $ionicLoading.hide();

                    }
                );

            }

        }])
    .controller('IceboxCtrl', ['$scope', 'KanbaneryDataAcess', '$q', '$ionicLoading',
        function ($scope, KanbaneryDataAcess, $q, $ionicLoading) {


            $scope.list = {
                // show/hide delete button for each item
                "showDelete": false
            }


            $scope.tasks;


            $ionicLoading.show({
                template: 'Loading Icebox Tasks...'
            });

            KanbaneryDataAcess.getIceboxTasks().then(
                function (response) {

//                    response.data = _.without(response.data, response.data[0]);
                    $scope.tasks = response.data;

                    $ionicLoading.hide();

                }, function (error) {
                    $scope.tasks = error;
                    $ionicLoading.hide();

                }, function () {

                });


            $scope.deleteTask = function (task) {

                $ionicLoading.show({
                    template: 'Deleting task ' + task.id
                });

                KanbaneryDataAcess.deleteTask(task).then(
                    function (response) {
                        console.log("DELETE TASK SUCCESS RESPONSE", response); // todo: delete me
                        $scope.tasks = _.without($scope.tasks, task);
                        $ionicLoading.hide();

                    },
                    function (error) {

                        console.log("DELETE TASK ERROR RESPONSE", error); // todo: delete me
                        $ionicLoading.hide();

                    }
                );

            }

        }])
    .controller('ExampleController', ['$scope', function ($scope) {
        $scope.name = 'ExampleController';

        $scope.list = [];
        $scope.text = 'hello';
        $scope.submit = function () {
            if ($scope.text) {
                $scope.list.push(this.text);
                $scope.text = '';
            }
        };
    }])
;
