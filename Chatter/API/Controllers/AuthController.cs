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

namespace Chatter.API.Controllers
{
    public class AuthController : ApiController
    {
        private ConceptualModelContainer db = new ConceptualModelContainer();

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

            var users =
                db.Users.Where(u => u.Email.Equals(googleIdentity.email, StringComparison.CurrentCultureIgnoreCase))
                    .Select(u => u);


            var user = users.FirstOrDefault();

            if (null != user)
            {
                googleIdentity.userId = user.Id;
            }
            else
            {                
                db.Users.Add(new User() {Email = googleIdentity.email, 
                        FirstName = googleIdentity.given_name,
                        LastName = googleIdentity.family_name,
                        ConnectionID = googleIdentity.id,
                        Nickname = googleIdentity.name});
                db.SaveChanges();
            }

            return googleIdentity;


        }

    }
}
