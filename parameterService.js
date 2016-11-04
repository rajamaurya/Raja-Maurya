'use strict';

/**
Parameter service class.
**/
var ParameterService = (function () {
    function ParameterService($http, urlConstants) {
        this.$http = $http;
        this.urlConstants = urlConstants;
    };

    ParameterService.prototype.getEnvironments = function () {
        return this.$http.get(this.urlConstants.parameterURL + "/environment");
    };

    ParameterService.prototype.getBrowsers = function () {
        return this.$http.get(this.urlConstants.parameterURL + "/browser");
    };

    ParameterService.prototype.getManagementConfigs = function () {
        return this.$http.get(this.urlConstants.parameterURL + "/managementconfig");
    };

    ParameterService.prototype.getVersionControls = function () {
        return this.$http.get(this.urlConstants.parameterURL + "/versioncontrol");
    };

    ParameterService.prototype.getEnvironmentsWithProject = function (projectid) {
        return this.$http.get(this.urlConstants.parameterURL + "/environment/" + projectid);
    };

    ParameterService.prototype.getBrowsersWithProject = function (projectid) {
        return this.$http.get(this.urlConstants.parameterURL + "/browser/" + projectid);
    };

    ParameterService.prototype.getVersionsWithProject = function (projectid) {
        return this.$http.get(this.urlConstants.parameterURL + "/versioncontrol/" + projectid);
    };

    ParameterService.prototype.getParamtersOfUserProject = function (userid,projectid,configname) {
        return this.$http.get(this.urlConstants.parameterURL + "/userproject/" + userid + "/" + projectid + "/" + configname);
    };

    ParameterService.prototype.updateParamtersOfUserProject = function (parameterConfiguration) {
        return this.$http.post(this.urlConstants.parameterURL + "/userproject/", parameterConfiguration);
    };

    ParameterService.$inject = ['$http', 'urlConstants'];

    return ParameterService;
})();

angular.module("appmodule").service('ParameterService', ParameterService);