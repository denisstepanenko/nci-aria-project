using Chatter.API.DTOs;
using Chatter.Data.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Chatter.API.Controllers
{
    public class UserController : ApiController
    {
        private ConceptualModelContainer db = new ConceptualModelContainer();
        private int currentlyLoggedUserID = 1;//TODO: fix after authentication is done
        
        [HttpGet]
        public IEnumerable<object> FindFriend(string searchCriteria)
        {
            var users = from u in db.Users
                        let allowAddFriend = db.Friends.Where(f => f.UserID == currentlyLoggedUserID && f.FriendUserID == u.Id).Count() == 0
                        where searchCriteria.Contains(u.FirstName) || searchCriteria.Contains(u.LastName) || searchCriteria.Contains(u.Email) || searchCriteria.Contains(u.Nickname)
                        select new { name = u.FirstName + " " + u.LastName, allowAddFriend, id = u.Id };

            return users;
        }

        [HttpPost]
        public void AddToFriends(AddToFriendsDTO data)
        {            
            var friend = db.Friends.Where(f => f.FriendUserID == data.friendUserID && f.UserID == currentlyLoggedUserID).FirstOrDefault();
            if (friend == null)
            {
                friend = new Friend();
                friend.UserID = currentlyLoggedUserID;
                friend.FriendUserID = data.friendUserID;

                db.Friends.Add(friend);
                db.SaveChanges();
            }

            //return "";
        }

    }
}
