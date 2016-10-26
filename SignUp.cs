using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class SignUp
    {
        public int Id { get; set; }
       public  string FirstName { get; set; }
       public  string LastName { get; set; }
       public int sexid { get; set; }
       public string UserName { get; set; }
       public string Key { get; set; }
       public string Email { get; set; }
       public int date { get; set; }
       public Int64 MobileNo { get; set; }
    }
}