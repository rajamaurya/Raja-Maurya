'use strict';

/**
Forgot controller.
**/
var ProjectController = (function () {
    function ProjectController(userService, projectService, groupService, parameterService, notificationService) {
        this.userService = userService;
        this.projectService = projectService;
        this.groupService = groupService;
        this.parameterService = parameterService;
        this.notificationService = notificationService;
        this.submitted = false;
        this.trail = {
            
            envconfig: true,
           
        };
        this.projects = [];
        this.project = {
            "Id": null,
            "Name": null,
            "IsActive": false,
            "IsAuditRequired": false
        };
        this.versionControl = [];
        this.toolControl = [];
        this.versionControlName = "";
        this.getProject();
    };

    ProjectController.prototype.getProject = function () {
        var _this = this;
        this.projectService.getProjects().then(function (response) {
            _this.projects = response.data;
        }, function errorCallback() {
            _this.notificationService.error("Please try again or contact administrator.");
        });
    };
 

    ProjectController.prototype.saveVersionControl = function (userForm) {
        var _this = this;
        this.vsubmitted = true;//true
        //// first next submission
           if (!userForm.$valid) return false;
        this.projectService.manage($scope.datas.then(function (response) {
            var responseData = response.data;
            if (responseData.OperationStatus == 0) {
                _this.notificationService.alert("Project has been " + (_this.project.Id ? "modified" : "created") + " successfully.");
                if (!_this.project.Id) _this.project.Id = responseData.Id;
                _this.submitted = true;

              userForm.$setPristine();
              _this.transferToEnvironmentSection();
              $scope.isDisabled = true;
            } else if (responseData == 1) {
                _this.notificationService.warning("Project already exists , please choose correct projectname.");
            } else if (responseData == 2) {
                _this.notificationService.warning("Please try again or contact administrator.");
            }
        }, function errorCallback() {
            _this.notificationService.error("Please try again or contact administrator.");

        }));
        ///////////////////
        // Second next submisssion event
         this.projectEnvironmentConfiguration = {
            "ProjectId": this.project.Id,
            "Envrionment": this.environment.Key,
            "Bowser": this.browser.Key
        };
         
        this.projectService.updateEnvironmentConfig(this.projectEnvironmentConfiguration).then(function (response) {
            _this.esubmitted = true;
         _this.notificationService.alert("Project environment configuration applied successfully.");
          _this.transferToManagementSection();
        }, function errorCallback() {
            _this.notificationService.error("Please try again or contact administrator.");
        });
        /////////////////////////////////////////
        //on Third next submmission
         this.projectManagementConfiguration = {
            "ProjectId": this.project.Id,
            "MgmConfigControl": this.toolControl.name,
            "Url": this.toolControl.url,
            "Username": this.toolControl.username,
            "Password": this.toolControl.password
        };
          this.projectService.updateManagementConfig(this.projectManagementConfiguration).then(function (response) {
          _this.notificationService.alert("Project management configuration applied successfully.");
            _this.msubmitted = false;
            _this.transferToVersionControlSection();
        }, function errorCallback() {
            _this.notificationService.error("Please try again or contact administrator.");
        });
        //////////////////////////////////////////
        //////////////////////////
        var sURL = "";
        //TFS Check
        if (this.versionControlName == "TFS" && this.versionControl.serverpath != "")
            sURL = this.versionControl.url + "|@|" + this.versionControl.serverpath;
        else {
            if(this.versionControl.url.split("|@|").length >1)
                sURL = this.versionControl.url.split("|@|")[0];
            else
                sURL = this.versionControl.url;
        }
  
        
        this.projectVersionControlConfiguration = {
            "ProjectId": this.project.Id,
            "MasterVersionControlId": this.versionControl.name,
            "Url": sURL,
            "Username": this.versionControl.username,
            "Password": this.versionControl.password
        };
       
        this.projectService.updateVersionConfig(this.projectVersionControlConfiguration).then(function (response) {
            _this.vsubmitted = false;
            _this.transferToMainSection();
            _this.notificationService.alert("Project management configuration applied successfully.");
        }, function errorCallback() {
            _this.notificationService.error("Please try again or contact administrator.");
        });
       ////////////////////////////////////////////


   
        return true;
    };

    ProjectController.prototype.transferToEnvironmentSection = function () {
        this.trail = {
            projectcreate: false,
            envconfig: true,
            mngconfig: false,
            versionconfig: false
        };
        this.esubmitted =false;//false
        this.getEnvironment();
        this.getBrowser();
    };

    ProjectController.prototype.transferToManagementSection = function () {
        this.trail = {
            projectcreate: false,
            envconfig: false,
            mngconfig: true,
            versionconfig: false
        };
        this.msubmitted = false;
        this.getManagement();
    };

    ProjectController.prototype.transferToVersionControlSection = function() {
        this.trail = {
            projectcreate: false,
            envconfig: false,
            mngconfig: false,
            versionconfig: true
        };
        this.vsubmitted = false;
        this.getVersionControl();
    };

    ProjectController.prototype.transferToMainSection = function() {
        this.project = {
            "Id": null,
            "Name": null,
            "IsActive": false,
            "IsAuditRequired": false
        };
        this.trail = {
            projectcreate: true,
            envconfig: false,
            mngconfig: false,
            versionconfig: false
        };
        this.getProject();
    };

    ProjectController.prototype.getEnvironment = function () {
        var _this = this;
        this.parameterService.getEnvironmentsWithProject(this.project.Id).then(function (response) {//getEnvironmentsWithProject
            _this.environments = response.data;
            response.data.forEach(function (index) {
                if (index.Selected)
                    _this.environment = index;
            });
        }, function errorCallback() {
            alert("Please try again or contact administrator.");
        });
    };

    ProjectController.prototype.getBrowser = function () {
        var _this = this;
        this.parameterService.getBrowsersWithProject(this.project.Id).then(function (response) {
            _this.browsers = response.data;
            response.data.forEach(function (index) {
                if (index.Selected)
                    _this.browser = index;
            });
        }, function errorCallback() {
            alert("Please try again or contact administrator.");
        });
    };

    ProjectController.prototype.getManagement = function () {
        var _this = this;
        this.parameterService.getManagementConfigs().then(function (response) {
            _this.managements = response.data;
            response.data.forEach(function (index) {
                if (index.Selected)
                    _this.toolControl.name = index.Value;
            });
        }, function errorCallback() {
            alert("Please try again or contact administrator.");
        });
    };

    ProjectController.prototype.getManagementToolData = function () {
        var _this = this;
        if (this.toolControl.name == '') {
            _this.toolControl.url = null;
            _this.toolControl.username = null;
            _this.toolControl.password = null;
            return true;
        }
        _this.projectService.getProjectManagementDetails(this.project.Id, this.toolControl.name).then(function (innerresponse) {
            _this.toolControl.url = innerresponse.data.Url;
            _this.toolControl.username = innerresponse.data.Username;
            _this.toolControl.password = innerresponse.data.Password;
        },
            function errorCallback() {
                alert("Please try again or contact administrator.");
            });
    };

    ProjectController.prototype.getVersionControlData = function (key) {
         var _this = this;
         //_this.versionControl.name = key;

         if (key == "TFS")
             _this.versionControl.IsTFS = true;
         else
             _this.versionControl.IsTFS = false;


         _this.projectService.getProjectVersionControlDetails(_this.project.Id).then(function (innerresponse) {
             var sURL = innerresponse.data.Url.split("|@|");
             if (_this.versionControl.IsTFS && sURL.length > 1) {
                 _this.versionControl.url = sURL[0];
                 _this.versionControl.serverpath = sURL[1];
             }
             else {
                 _this.versionControl.url = innerresponse.data.Url;
                 _this.versionControl.serverpath = "";
             }
            _this.versionControl.username = innerresponse.data.Username;
            _this.versionControl.password = innerresponse.data.Password;
        },
                function errorCallback() {
                    alert("Please try again or contact administrator.");
                });
        //_this.versionControl.versionControlName = key;
        _this.versionControlName = key;
    };

    ProjectController.prototype.getVersionControl = function() {
        var _this = this;
        _this.versionControl.IsTFS = false;
        
        this.parameterService.getVersionsWithProject(this.project.Id).then(function(response) {
            _this.versionControls = response.data;
            response.data.forEach(function(index) {
                if (index.Selected) {
                    _this.versionControl.name = index.Value;
                    _this.versionControlName = index.Key;
                    if (index.Key == "TFS")
                        _this.versionControl.IsTFS = true;
                }
                
            });

            _this.projectService.getProjectVersionControlDetails(_this.project.Id).then(function (innerresponse) {
                var sURL = innerresponse.data.Url.split("|@|");
                if (_this.versionControl.IsTFS && sURL.length > 1) {
                    _this.versionControl.url = sURL[0];
                    _this.versionControl.serverpath = sURL[1];
                }
                else {
                    _this.versionControl.url = innerresponse.data.Url;
                }

                _this.versionControl.username = innerresponse.data.Username;
                _this.versionControl.password = innerresponse.data.Password;
                },
                function errorCallback() {
                    alert("Please try again or contact administrator.");
                });
        }, function errorCallback() {
            alert("Please try again or contact administrator.");
        });
    };

    ProjectController.prototype.edit = function (index) {
        angular.copy(this.projects[index], this.project);
        this.project.IsActive = this.project.IsActive ? "True" : "False";
    };

    
    ProjectController.prototype.reset = function (userForm) {
        var _this = this;
        this.project = {
            "Id": null,
            "Name": null,
            "IsActive": false,
            "IsAuditRequired": false
        };
        this.trail = {
            projectcreate: true,
            envconfig: false,
            mngconfig: false,
            versionconfig: false
        };
        userForm.$setPristine();
    };

    ProjectController.$inject = ['UserService', 'ProjectService', 'GroupService', 'ParameterService', 'notificationService'];
    return ProjectController;
})();

appmodule.controller('ProjectController', ProjectController);
