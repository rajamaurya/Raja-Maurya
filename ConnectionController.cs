using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;


namespace WebApplication3.Controllers
{
    using Models;
    public class ConnectionController : Controller 
    {
        
        // GET: /Connection/
        static string connectionString = @"Data Source=H48TXC2\SQLEXPRESS;Initial Catalog=LogDatabase;Integrated Security=True;Connect Timeout=15;Encrypt=False;TrustServerCertificate=False";   
    
        SqlConnection connection  = new SqlConnection(connectionString);
        public void SaveSignUpdata(SignUp signup)
        { 
                     
                  connection.Open();

                  //string save = "insert into SignUp values('raja', 'maurya', 'male',' rkm', 'krgfcfg', Convert(DateTime,'19820626',112), 464644,64644)";
                  string save = "insert into SignUp values(@FirstName, @LastName, @Sex,  @UserName, @Email, @DateOfBirth, @MobileNo, @Password)";
                      SqlCommand cmnd = new SqlCommand(save, connection);
                      cmnd.Parameters.AddWithValue("@FirstName", signup.FirstName);
                      cmnd.Parameters.AddWithValue("@LastName", signup.LastName);
                      cmnd.Parameters.AddWithValue("@Sex", signup.sexid);
                      cmnd.Parameters.AddWithValue("@UserName", signup.UserName);

                      cmnd.Parameters.AddWithValue("@Email", signup.Email);
                      cmnd.Parameters.AddWithValue("@DateOfBirth",System.DateTime.Now);
                      cmnd.Parameters.AddWithValue("@MobileNo", signup.MobileNo);
                      cmnd.Parameters.AddWithValue("@Password", signup.Key);
                      cmnd.ExecuteNonQuery();
                  
                    
          
        }
     
        public List<SignUp> getList()
        {
           


                connection.Open();
                var signList = new List<SignUp>();
                string get = "select * from dbo.SignUp";
                SqlCommand cmd = new SqlCommand(get, connection);
                SqlDataReader dr = cmd.ExecuteReader();
                 while (dr.Read())
                  {

                      SignUp e = new SignUp();


                      e.FirstName = Convert.ToString(dr[0]);
                           e.LastName = Convert.ToString(dr[1]);
                           e.FirstName = Convert.ToString(dr[2]);
                           e.Id = Convert.ToInt16(dr[6]);
                          //e.sexid = Convert.ToInt32(dr[2]);
                           e.UserName = Convert.ToString(dr[4]);
                           e.Key = Convert.ToString(dr[5]);
                           //e.Email = dr.GetString(5);
                           //e.date = Convert.ToDateTime(dr[6]);
                           //e.MobileNo = dr.GetInt64(7); ;
                          
                      signList.Add(e);
                  } 
        
           

                return signList;

        }

        public void delete(int data)
        {
            connection.Open();
            string query = "delete from SignUp where Id=@Id";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@Id", data);
            cmd.ExecuteNonQuery();
            connection.Close();
        }
        public void update(SignUp sign)
        {
            connection.Open();
            string save = "update SignUp set FirstName=@FirstName,MobileNo=@MobileNo where Id=@Id";
            SqlCommand cmd = new SqlCommand(save, connection);
           cmd.Parameters.AddWithValue("@Id", sign.Id);
            cmd.Parameters.AddWithValue("@FirstName", sign.FirstName);
         //   cmd.Parameters.AddWithValue("@Password", sign.Key);
            cmd.Parameters.AddWithValue("@MobileNo", sign.MobileNo);
            cmd.ExecuteNonQuery();
            connection.Close();
        }
        public ActionResult Index()
        {
            return View();
        }
	}
}