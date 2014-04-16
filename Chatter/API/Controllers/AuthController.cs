using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using Chatter.Auth;
using Chatter.Data.Models;
using System.Web.Security;
using Chatter.API.Base;

namespace Chatter.API.Controllers
{
    public class AuthController : ApiControllerBase
    {
        private ConceptualModelContainer db = new ConceptualModelContainer();

        [AllowAnonymous]
        [HttpGet]
        public object GetUserId(int authType, string accessToken)
        {

            GoogleIdentity googleIdentity = null;

            var url = String.Format("https://www.googleapis.com/oauth2/v1/userinfo?access_token={0}", accessToken);

            var requestUserInfo = (HttpWebRequest)WebRequest.Create(url);
            var responseUserInfo = (HttpWebResponse)requestUserInfo.GetResponse();
            if (((HttpWebResponse)responseUserInfo).StatusCode == HttpStatusCode.OK)
            {
                using (var receiveStream = responseUserInfo.GetResponseStream())
                {
                    var encode = Encoding.GetEncoding("utf-8");
                    if (receiveStream != null)
                    {
                        using (var readStream = new StreamReader(receiveStream, encode))
                        {
                            googleIdentity = new JavaScriptSerializer().Deserialize<GoogleIdentity>(readStream.ReadToEnd());
                            responseUserInfo.Close();
                            readStream.Close();
                        }
                    }
                }
            }

            //get user from the ASP.NET Membership Provider. Here we'll assume that the user's username is their email address
            //in real world scenario this would be different in that there would be a memberhsip provider table used for OAuth authentication
            if (googleIdentity == null) return null;

            var aspUser = Membership.GetUser(googleIdentity.email) ??
                          Membership.CreateUser(googleIdentity.email, googleIdentity.id, googleIdentity.email);

            FormsAuthentication.SetAuthCookie(aspUser.UserName, true);

            var authCookie = HttpContext.Current.Response.Cookies.Get(".ASPXAUTH");

            if (authCookie != null)
            {
                var csrfToken = new XSRFTokenHelper().GetXsrfTokenFromAuthToken(authCookie.Value);
                var csrfCookie = new HttpCookie("XSRF-TOKEN", csrfToken) { HttpOnly = false };
                HttpContext.Current.Response.Cookies.Add(csrfCookie);
            }

            var user = db.Users.FirstOrDefault(u => u.Email.Equals(googleIdentity.email, StringComparison.OrdinalIgnoreCase));

            if (null == user)
            {
                user = new User()
                {
                    Email = googleIdentity.email,
                    FirstName = googleIdentity.given_name,
                    LastName = googleIdentity.family_name,
                    Nickname = googleIdentity.name
                };

                db.Users.Add(user);
            }
            else
            {
                user.Email = googleIdentity.email;
                user.FirstName = googleIdentity.given_name;
                user.LastName = googleIdentity.family_name;
                user.Nickname = googleIdentity.name;                
            }
            db.SaveChanges();

            googleIdentity.userId = user.Id;

            return googleIdentity;            
        }

        [HttpGet]
        [HttpPost]
        public HttpResponseMessage Logout()
        {
            //return new HttpResponseMessage(HttpStatusCode.OK)
            //{
            //    Content = new ObjectContent<object>(new
            //    {
            //        UserName = User.Identity.Name
            //    }, Configuration.Formatters.JsonFormatter)
            //};

            FormsAuthentication.SignOut();

            HttpContext.Current.Response.Cookies.Remove("XSRF-TOKEN");

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
