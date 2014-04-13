using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Script.Serialization;
using Chatter.API.DTOs;
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
                    var encode = System.Text.Encoding.GetEncoding("utf-8");
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
            MembershipUser aspUser = Membership.GetUser(googleIdentity.email);
            if (aspUser == null)
            {
                aspUser = Membership.CreateUser(googleIdentity.email, googleIdentity.id, googleIdentity.email);
            }
            FormsAuthentication.SetAuthCookie(aspUser.UserName, true);
            
            User user = db.Users.Where(u => u.Email.Equals(googleIdentity.email, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
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
                db.SaveChanges();
            }

            googleIdentity.userId = user.Id;

            return googleIdentity;            
        }

    }
}
