using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication3.Controllers
{
    using Models;
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
        public JsonResult save(SignUp signup)
        {
            ConnectionController control = new ConnectionController();
            control.SaveSignUpdata(signup);
            return null;
        }
        public JsonResult getList()
        {
            var sign = new List<SignUp>();
            ConnectionController getdata = new ConnectionController();
            sign = getdata.getList();
            return Json(sign, JsonRequestBehavior.AllowGet);
        }

        public JsonResult delete(SignUp sp)
        {
            ConnectionController del = new ConnectionController();
            del.delete(sp.Id);
            return null;
        }
        public JsonResult update(SignUp sign)
        {
            ConnectionController up = new ConnectionController();
            up.update(sign);
            return null;
        }


    }
}
