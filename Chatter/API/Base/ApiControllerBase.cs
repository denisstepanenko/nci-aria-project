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
            CurrentUser = Utils.Utils.GetCurrentUser();
        }

        private ConceptualModelContainer db = new ConceptualModelContainer();

        public User CurrentUser { get; set; }

    }
}
