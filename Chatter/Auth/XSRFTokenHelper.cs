using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Chatter.Auth
{
    public class XSRFTokenHelper
    {
        const string Salt = "nb@PRv)jsgSt&kdI";

        public string GetXsrfTokenFromAuthToken(string authToken)
        {
            return BakeCookie(authToken);
        }

        public static bool CheckXsrfTokenAgainstAuthToken(string xsrfToken, string authToken)
        {
            return xsrfToken == BakeCookie(authToken);
        }

        private static string BakeCookie(string authToken)
        {
            using (var sha = SHA256.Create())
            {
                var computedHash = sha.ComputeHash(Encoding.Unicode.GetBytes(authToken + Salt));
                var cookie = HttpServerUtility.UrlTokenEncode(computedHash);
                return cookie;
            }
        }
    }
}