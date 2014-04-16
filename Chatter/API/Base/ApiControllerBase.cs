using Chatter.API.Attributes;
using Chatter.Data.Models;
using System.Web.Http;

namespace Chatter.API.Base
{
    [CheckXrfHeader]
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
