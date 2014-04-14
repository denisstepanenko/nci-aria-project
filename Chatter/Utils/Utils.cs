using Chatter.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chatter.Utils
{
    public class Utils
    {       
        public static User GetCurrentUser()
        {
            ConceptualModelContainer db = new ConceptualModelContainer();

            if (System.Web.HttpContext.Current != null && System.Web.HttpContext.Current.Request.IsAuthenticated)
            {
                return db.Users.Where(u => u.Email == System.Web.HttpContext.Current.User.Identity.Name).FirstOrDefault();
            }
            return null;
        }
    }
}