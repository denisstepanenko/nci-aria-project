using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chatter.API.DTOs
{
    public class PostTextMessageDTO
    {
        public int friendUserID;
        public string message;
    }
}