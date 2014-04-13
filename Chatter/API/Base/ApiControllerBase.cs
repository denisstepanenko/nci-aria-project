using Chatter.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Security;

namespace Chatter.API.Base
{
    [Authorize]
    public class ApiControllerBase : ApiController
    {
        public ApiControllerBase()
        {
            if (System.Web.HttpContext.Current.Request.IsAuthenticated)
            {
                CurrentUser = db.Users.Where(u => u.Email == System.Web.HttpContext.Current.User.Identity.Name).FirstOrDefault();
            }
        }

        private ConceptualModelContainer db = new ConceptualModelContainer();

        public User CurrentUser { get; set; }

    }
}
