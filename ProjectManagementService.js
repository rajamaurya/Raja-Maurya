using System.Data;
using System.Data.SqlClient;
using Pyramid.AFM.Tool.Abstractions;
using Pyramid.AFM.Tool.Abstractions.DomainModels;
using Pyramid.AFM.Tool.Abstractions.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using Pyramid.AFM.Tool.Abstractions.ViewModels;

namespace Pyramid.AFM.Tool.Core
{
    public class ProjectManagementService : IProjectManagementService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        
        public ProjectManagementService(
            IUnitOfWork unitOfWork,
            ILogger logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public IEnumerable<ProjectInformation> GetUserProjects(string username)
        {
            _logger.Info("ProjectManagementService.GetUserProjects method called.");
            username = username.ToUpper();
            try
            {
                var projectRepository = _unitOfWork.GetRepository<Project>();
                var userProjectRepository = _unitOfWork.GetRepository<UserProject>();
                var projects = from p in projectRepository.Get()
                               join up in userProjectRepository.Get()
                               on p.Id equals up.Project.Id
                               where up.User.Name.ToUpper() == username
                               select new ProjectInformation()
                               {
                                   Id = p.Id,
                                   IsActive = p.IsActive,
                                   IsAuditRequired = p.IsAuditRequired,
                                   Name = p.Name,
                                   IsSetup = up.IsSetup
                               };
                return projects.AsEnumerable();
            }
            catch (Exception)
            {
                return null;
            }
        }
        public UserProjectInformation GetUserProject(int userid, int projectid)
        {
            _logger.Info("ProjectManagementService.GetUserProjects method called.");
            try
            {
                var userProjectRepository = _unitOfWork.GetRepository<UserProject>();

                var userproject = (from up in userProjectRepository.Get()
                                   let up1 = up
                                   let project = userProjectRepository.Get(filter: x => x.User.Id == userid && x.Project.Id == projectid).Select(x => x.Project).First()
                                   let user = userProjectRepository.Get(filter: x => x.User.Id == userid && x.Project.Id == projectid).Select(x => x.User).First()
                                   let masterversionrepository = userProjectRepository.Get(filter: x => x.User.Id == userid && x.Project.Id == projectid).Select(x => x.MasterVersionRepository).First()
                                   where up.User.Id == userid && up.Project.Id == projectid
                                   select new UserProjectInformation()
                                   {
                                       Id = up.Id,
                                       FrameworkPath = up.FrameworkPath,
                                       Project = project,
                                       User = user,
                                       MasterVersionRepository = masterversionrepository,
                                       VersionRepositoryPassword = up.VersionRepositoryPassword,
                                       VersionRepositoryUsername = up.VersionRepositoryUsername,
                                       IsActive = up.IsActive,
                                       IsSetup = up.IsSetup,
                                       LastUpdatedDate = up.LastUpdatedDate

                                   }
                    );

                return userproject.FirstOrDefault();
            }
            catch (Exception)
            {
                return null;
            }
        }
        public IEnumerable<ProjectInformation> GetProjects()
        {
            var projectRepository = _unitOfWork.GetRepository<Project>();
            var projects = projectRepository.Get();
            return projects.Select(project => new ProjectInformation()
            {
                Id = project.Id,
                Name = project.Name,
                IsAuditRequired = project.IsAuditRequired,
                IsActive = project.IsActive
            }).ToList();
        }

        public long CreateProject(ProjectInformation projectInformation)
        {
            
            var projectRepository = _unitOfWork.GetRepository<Project>();
            var project = new Project()
            {
                IsActive = projectInformation.IsActive,
                IsAuditRequired = projectInformation.IsAuditRequired,
                Name = projectInformation.Name,
                LastUpdatedDate = System.DateTime.Now
            };
            var insertedProject = projectRepository.Insert(project);
           _unitOfWork.Save();
            /*project parameter copy*/
           
                projectRepository.ExecuteStoreProcedure("Exec dbo.ProjectSetup @projectId",
                    new SqlParameter("projectId", SqlDbType.BigInt) { Value = insertedProject.Id });

              ///  _unitOfWork.Commit();
          //  if(insertedProject.Id==null)
                _unitOfWork.Commit();
               
                
            
                
            return insertedProject.Id;
        }

        public Project GetProjectByName(ProjectInformation projectInformation)
        {
            var projectRepository = _unitOfWork.GetRepository<Project>();
            //return projectRepository.Get(x => x.Name == projectInformation.Name).First();
            return projectInformation.Id != null
                ? projectRepository.Get(x => x.Id != projectInformation.Id && x.Name == projectInformation.Name)
                    .FirstOrDefault()
                : projectRepository.Get(x => x.Name == projectInformation.Name).FirstOrDefault();
        }

        public bool UpdateProject(ProjectInformation projectInformation)
        {
            var projectRepository = _unitOfWork.GetRepository<Project>();
            var project = projectRepository.Get(x => x.Id == projectInformation.Id).First();
            project.Name = projectInformation.Name;
            project.IsActive = projectInformation.IsActive;
            project.IsAuditRequired = projectInformation.IsAuditRequired;
            projectRepository.Update(project);
            _unitOfWork.Save();
            _unitOfWork.Commit();
            return true;
        }

        public void UpdateEnvironmentConfiguration(ProjectEnvironmentConfiguration projectEnvironmentConfiguration)
        {
            var mCp =
                _unitOfWork.GetRepository<ProjectConfig>()
                    .Get(x => x.Project.Id == projectEnvironmentConfiguration.ProjectId && x.Name == "Config")
                    .First();
            var pCpRepository = _unitOfWork.GetRepository<ProjectConfigParameter>();
            var configEnvironment =
                pCpRepository.Get(x => x.ProjectConfig.Id == mCp.Id && x.KeyName == "strEnvironment").First();
            configEnvironment.Value = projectEnvironmentConfiguration.Envrionment;
            var configBrowse =
                pCpRepository.Get(x => x.ProjectConfig.Id == mCp.Id && x.KeyName == "strBrowserType").First();
            configBrowse.Value = projectEnvironmentConfiguration.Bowser;
            pCpRepository.Update(configEnvironment);
            pCpRepository.Update(configBrowse);
            _unitOfWork.Save();
            _unitOfWork.Commit();
        }

        public void UpdateManagementConfiguration(ProjectManagementConfiguration projectManagementConfiguration)
        {
            var mCp =
                _unitOfWork.GetRepository<ProjectConfig>()
                    .Get(
                        x => x.Project.Id == projectManagementConfiguration.ProjectId &&
                             x.Name.ToUpper() == projectManagementConfiguration.MgmConfigControl.ToUpper())
                    .First();
            var pCpRepository = _unitOfWork.GetRepository<ProjectConfigParameter>();
            var configUrl =
                pCpRepository.Get(x => x.ProjectConfig.Id == mCp.Id && x.KeyName.ToUpper() == "URL").First();
            configUrl.Value = projectManagementConfiguration.Url;
            var configUsername =
                pCpRepository.Get(x => x.ProjectConfig.Id == mCp.Id && x.KeyName.ToUpper() == "USERNAME").First();
            configUsername.Value = projectManagementConfiguration.Username;
            var configBrowse =
                pCpRepository.Get(x => x.ProjectConfig.Id == mCp.Id && x.KeyName.ToUpper() == "PASSWORD").First();
            configBrowse.Value = projectManagementConfiguration.Password;
            pCpRepository.Update(configUrl);
            pCpRepository.Update(configUsername);
            pCpRepository.Update(configBrowse);
            _unitOfWork.Save();
            _unitOfWork.Commit();
        }

        public void UpdateVersionControl(ProjectVersionControlConfiguration projectVersionControlConfiguration)
        {
            var projectRepsitory = _unitOfWork.GetRepository<Project>();
            var project = projectRepsitory.Get(x => x.Id == projectVersionControlConfiguration.ProjectId).First();
            project.MasterVersionRepository =
                _unitOfWork.GetRepository<MasterVersionRepository>()
                    .Get(x => x.Id == projectVersionControlConfiguration.MasterVersionControlId).First();
            project.VersionRepositoryUrl = projectVersionControlConfiguration.Url;
            project.VersionRepositoryUsername = projectVersionControlConfiguration.Username;
            project.VersionRepositoryPassword = projectVersionControlConfiguration.Password;
            projectRepsitory.Update(project);
            _unitOfWork.Save();
            _unitOfWork.Commit();
        }

        public IEnumerable<ProjectConfig> GetProjectConfigById(long projectid)
        {
            return _unitOfWork.GetRepository<ProjectConfig>().Get(x => x.Project.Id == projectid);
        }

        public IEnumerable<ProjectConfigParameter> GetProjectConfigParameterById(long projectConfigId)
        {
            return _unitOfWork.GetRepository<ProjectConfigParameter>().Get(x => x.ProjectConfig.Id == projectConfigId);
        }

        public Project GetProjectById(long id)
        {
            return _unitOfWork.GetRepository<Project>().Get(x => x.Id == id).First();
        }

        public void UpdateUserProjectDetail(UserProjectCustInfo userprojectinfo)
        {

            try
            {
                var userProjectRepository = _unitOfWork.GetRepository<UserProject>();
                var userproject =
                    userProjectRepository.Get(
                        x => x.User.Id == userprojectinfo.UserId && x.Project.Id == userprojectinfo.ProjectId).First();
                userproject.IsSetup = userprojectinfo.IsSetup;
                userproject.VersionRepositoryUrl = userprojectinfo.VersionRepositoryUrl;
                userproject.VersionRepositoryUsername = userprojectinfo.VersionRepositoryUsername;
                userproject.VersionRepositoryPassword = userprojectinfo.VersionRepositoryPassword;
                userproject.FrameworkPath = userprojectinfo.FrameworkPath;
                userProjectRepository.Update(userproject);

                _unitOfWork.Save();
                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
        public UserProject GetVersionProject(string username)
        {
            _logger.Info("ProjectManagementService.GetVersionProject method called.");
            username = username.ToUpper();
            try
            {
                var projectRepository = _unitOfWork.GetRepository<Project>();
                var userProjectRepository = _unitOfWork.GetRepository<UserProject>();
                var projects = from p in projectRepository.Get()
                               join up in userProjectRepository.Get()
                               on p.Id equals up.Project.Id
                               where up.User.Name.ToUpper() == username
                               select up;
                return projects.OrderByDescending(m => m.LastUpdatedDate).FirstOrDefault();
            }
            catch (Exception)
            {
                return null;
            }
        }
        public bool IsVersionSetup(bool isSetup, long id)
        {
            _logger.Info("ProjectManagementService.IsVersionSetup method called.");

            try
            {
                var userProjectRepository = _unitOfWork.GetRepository<UserProject>();
                var userproject =
                    userProjectRepository.Get(
                        x => x.Id == id).First();
                userproject.IsSetup = isSetup;
                userProjectRepository.Update(userproject);
                _unitOfWork.Save();
                _unitOfWork.Commit();
                return true;
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                return false;
            }
        }
    }
}
