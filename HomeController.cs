using MvcCrudApplication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcCrudApplication.Controllers
{
    using Models;

    public class HomeController : Controller
    {
       
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public JsonResult getAll()
        {
            using (LogDatabaseEntities1 dataContext = new LogDatabaseEntities1())
            {
                var logList = dataContext.SignUps.ToList();
                return Json(logList, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult getUserId(string getId)
        {
            using (LogDatabaseEntities1 dataContext = new LogDatabaseEntities1())
            {
                int no = Convert.ToInt32(getId);
                var logList = dataContext.SignUps.Find(no);
                return Json(logList, JsonRequestBehavior.AllowGet);
            }
        }
        public string UpdateUser(SignUp log)
        {
            if (log != null)
            {
                using (LogDatabaseEntities1 dataContext = new LogDatabaseEntities1())
                {
                    int no = Convert.ToInt32(log.Id);
                    var logList = dataContext.SignUps.Where(x => x.Id == no).FirstOrDefault();
                    logList.Id = log.Id;
                    logList.FirstName = log.FirstName;
                    logList.LastName = log.LastName;
                    logList.UserName = log.UserName;
                    logList.Email = log.Email;
                    logList.MobileNo = log.MobileNo;
                    logList.Password = log.Password;
                    logList.Sex = log.Sex;
                    logList.DateOfBirth = log.DateOfBirth;
                    dataContext.SaveChanges();
                    return "User Updated";
                }
            }
            else
            {
                return "Invalid User";
            }
        }
        public string AddUser(SignUp log)
        {
            if (log != null)
            {
                using (LogDatabaseEntities1 dataContext = new LogDatabaseEntities1())
                {
                    dataContext.SignUps.Add(log);
                    dataContext.SaveChanges();
                    return "User Updated";
                }
            }
            else
            {
                return "Invalid User";
            }
        }

        public string DeleteUser(SignUp log)
        {
            if (log != null)
            {
                using (LogDatabaseEntities1 dataContext = new LogDatabaseEntities1())
                {
                    int no = Convert.ToInt32(log.Id);
                    var UserList = dataContext.SignUps.Where(x => x.Id == no).FirstOrDefault();
                    dataContext.SignUps.Remove(UserList);
                    dataContext.SaveChanges();
                    return "User Deleted";
                }
            }
            else
            {
                return "Invalid User";
            }
        }
     
    }
}