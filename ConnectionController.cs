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

                  string save = "insert into SignUp values('raja', 'maurya', 'male',' rkm', 'krgfcfg', Convert(DateTime,'19820626',112), 464644,64644)";
                  //string save = "insert into SignUp values(@[First Name], @[Last Name], @sex,  @[User Name], @Email, @[Date Of Birth], @[Mobile No], @Passowrd)";
                      SqlCommand cmnd = new SqlCommand(save, connection);
                    //  cmnd.Parameters.AddWithValue("@[First Name]", signup.FirstName);
                    //  cmnd.Parameters.AddWithValue("@[Last Name]", signup.LastName);
                    //  cmnd.Parameters.AddWithValue("@sex", signup.sexid);
                    //  cmnd.Parameters.AddWithValue("@[User Name]", signup.UserName);
                      
                    //  cmnd.Parameters.AddWithValue("@Email", signup.Email);
                    //  cmnd.Parameters.AddWithValue("@[Date Of Birth]", signup.date);
                    //  cmnd.Parameters.AddWithValue("@[Mobile No]", signup.MobileNo);
                    //cmnd.Parameters.AddWithValue("@Passowrd", signup.Key);
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
                 //   e.sexid = Convert.ToInt32(dr[2]);
                    e.UserName = Convert.ToString(dr[3]);
                    e.Key = Convert.ToString(dr[4]);
                    e.Email = Convert.ToString(dr[5]);
                    e.date =Convert.ToInt32(dr[6]);
                    e.MobileNo = Convert.ToInt32(dr[7]);
                    
                    signList.Add(e);
                }
                
            
            

            return signList;

        }

        public void delete(int data)
        {
            connection.Open();
            string query = "delete from SignUp where Id=@Id";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@id", data);
            cmd.ExecuteNonQuery();
            connection.Close();
        }
        public void update(SignUp sign)
        {
            connection.Open();
            string save = "update SignUp set FirstName=@[First Name], Password=@Pasword, MobileNo=@[Mobile No] where Id=@Id";
            SqlCommand cmd = new SqlCommand(save, connection);
            cmd.Parameters.AddWithValue("@Id", sign.Id);
            cmd.Parameters.AddWithValue("@[First Name]", sign.FirstName);
            cmd.Parameters.AddWithValue("@Key", sign.Key);
            cmd.Parameters.AddWithValue("@[Mobile No]", sign.MobileNo);
            cmd.ExecuteNonQuery();
            connection.Close();
        }
        public ActionResult Index()
        {
            return View();
        }
	}
}