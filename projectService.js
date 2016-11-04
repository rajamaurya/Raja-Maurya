'use strict';

/**
Project management service class.
**/
var ProjectService = (function () {
    function ProjectService($http, urlConstants) {
        this.$http = $http;
        this.urlConstants = urlConstants;
    };

    ProjectService.prototype.getProjects = function () {
        return this.$http.get(this.urlConstants.projectURL);
    };

    ProjectService.prototype.manage = function (project) {
      //  $scope.isDisabled = false;
        var res = this.$http.post(this.urlConstants.projectURL, project);
      //  $scope.isDisabled = true;
        return res;//this.$http.post(this.urlConstants.projectURL, project);
    };

    ProjectService.prototype.updateEnvironmentConfig = function (config) {
        return this.$http.post(this.urlConstants.projectURL + "/environmentconfiguration", config);
    };

    ProjectService.prototype.updateManagementConfig = function (config) {
        return this.$http.post(this.urlConstants.projectURL + "/managementconfiguration", config);
    };

    ProjectService.prototype.updateVersionConfig = function (config) {
        return this.$http.post(this.urlConstants.projectURL + "/versionconfiguration", config);
    };

    ProjectService.prototype.getProjectVersionControlDetails = function (projectid) {
        return this.$http.get(this.urlConstants.projectURL + "/versionconfiguration/" + projectid);
    };

    ProjectService.prototype.getProjectManagementDetails = function (projectid, managementToolName) {
        return this.$http.get(this.urlConstants.projectURL + "/managementconfiguration/" + projectid + "/" + managementToolName);
    };
    ProjectService.prototype.getUserProject = function (userid, projectid) {
        return this.$http.get(this.urlConstants.projectURL + "/getuserproject/" + userid + "/" + projectid);
    };
    ProjectService.prototype.updateUserProject = function (userproject) {
        return this.$http.post(this.urlConstants.projectURL + "/manageuserproject", userproject);
    };

    ProjectService.$inject = ['$http', 'urlConstants'];

    return ProjectService;
})();

angular.module("appmodule").service('ProjectService', ProjectService);