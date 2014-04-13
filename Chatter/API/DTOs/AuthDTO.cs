using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chatter.API.DTOs
{
    public class AuthDTO
    {
        public int AuthType { get; set; }
        public string AccessToken { get; set; }
        public string IdToken { get; set; }
        public string ClientId { get; set; }
        public string Scope { get; set; }
        public string Code { get; set; }
    }
}