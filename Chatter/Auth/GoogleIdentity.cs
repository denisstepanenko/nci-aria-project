using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chatter.Auth
{
    public class GoogleIdentity
    {
        public String id { get; set; }
        public String email { get; set; }
        public Boolean verified_email { get; set; }
        public String name { get; set; }
        public String given_name { get; set; }
        public String family_name { get; set; }
        public String link { get; set; }
        public String picture { get; set; }
        public String gender { get; set; }
        public String locale { get; set; }
        public int userId { get; set; }
    }
}