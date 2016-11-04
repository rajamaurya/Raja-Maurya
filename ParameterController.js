using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Pyramid.AFM.Tool.Abstractions;
using Pyramid.AFM.Tool.Abstractions.ViewModels;

namespace Pyramid.AFM.Tool.Web.Controllers
{
    public class ParameterController : ApiController
    {
        private readonly IMasterConfigParameterService _configParameterService;
        private readonly IProjectManagementService _projectManagementService;
        private readonly IParameterService _parameterService;
        private readonly ILogger _logger;

        public ParameterController(IMasterConfigParameterService configParameterService
            , ILogger logger
            , IProjectManagementService projectManagementService
            , IParameterService parameterService)
        {
            _configParameterService = configParameterService;
            _logger = logger;
            _projectManagementService = projectManagementService;
            _parameterService = parameterService;
        }

        [Route("parameter/environment")]
        [HttpGet]
        public IEnumerable<KeyValue> GetEnvironments()
        {
            return _configParameterService.GetEnvironments();
        }

        [Route("parameter/browser")]
        [HttpGet]
        public IEnumerable<KeyValue> GetBrowsers()
        {
            return _configParameterService.GetBrowsers();
        }

        [Route("parameter/managementconfig")]
        [HttpGet]
        public IEnumerable<KeyValue> GetManagementConfigs()
        {
            return _configParameterService.GetManagementConfigs();
        }

        [Route("parameter/versioncontrol")]
        [HttpGet]
        public IEnumerable<KeyValue> GetVesionControls()
        {
            return _configParameterService.GetVesionControls();
        }

        [Route("parameter/environment/{projectid}")]
        [HttpGet]
        public IEnumerable<KeyValue> GetEnvironmentsWithSelectedProject(long projectid)
        {
            var projectConfig = _projectManagementService.GetProjectConfigById(projectid).First(x => x.Name == "Config");
            var projectConfigParameter =
                _projectManagementService.GetProjectConfigParameterById(projectConfig.Id)
                    .First(x => x.KeyName == "strEnvironment");
            var environments = _configParameterService.GetEnvironments();
            foreach (var environment in environments)
            {
                environment.Selected = environment.Value == projectConfigParameter.Value;
            }
            return environments;
        }

        [Route("parameter/browser/{projectid}")]
        [HttpGet]
        public IEnumerable<KeyValue> GetBrowsersWithSelectedProject(long projectid)
        {
            var projectConfig = _projectManagementService.GetProjectConfigById(projectid).First(x => x.Name == "Config");
            var projectConfigParameter =
                _projectManagementService.GetProjectConfigParameterById(projectConfig.Id)
                    .First(x => x.KeyName == "strBrowserType");
            var browsers = _configParameterService.GetBrowsers();
            foreach (var browser in browsers)
            {
                browser.Selected = browser.Value == projectConfigParameter.Value;
            }
            return browsers;
        }

        [Route("parameter/versioncontrol/{projectid}")]
        [HttpGet]
        public IEnumerable<KeyValue> GetVesionControlsWithSelectedProject(long projectid)
        {
            var project = _projectManagementService.GetProjectById(projectid);
            var versions = _configParameterService.GetVesionControls();
            if (project.MasterVersionRepository == null) return versions;
            var masterVersionInProject = project.MasterVersionRepository.Id.ToString(CultureInfo.InvariantCulture);
            foreach (var version in versions)
            {
                version.Selected = version.Value == masterVersionInProject;
            }
            return versions;
        }

        [Route("parameter/userproject/{userid}/{projectid}/{configname}")]
        [HttpGet]
        public ParameterConfiguration GetParameters(long userid, long projectid,string configname)
        {
            return _parameterService.GetParameters(new ParameterConfiguration()
            {
                UserId = userid,
                ProjectId = projectid,
                ConfigName = configname
            });
        }

        [Route("parameter/userproject")]
        [HttpPost]
        public void UpdateParameters(ParameterConfiguration parameterConfiguration)
        {
            _parameterService.UpdateParameters(parameterConfiguration);
        }
    }
}
