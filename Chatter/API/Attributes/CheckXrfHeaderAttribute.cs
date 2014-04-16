using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using Chatter.Auth;

namespace Chatter.API.Attributes 
{
    public class CheckXrfHeaderAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext context)
        {
            var authCookie = HttpContext.Current.Request.Cookies[".ASPXAUTH"];
            if (authCookie == null) return false;

            var cookieToken = authCookie.Value;
            var xsrfToken = context.Request.Headers.GetValues("X-XSRF-TOKEN").FirstOrDefault();

            return (!String.IsNullOrEmpty(xsrfToken) &&
                    XSRFTokenHelper.CheckXsrfTokenAgainstAuthToken(xsrfToken, cookieToken));
        }
    }
}