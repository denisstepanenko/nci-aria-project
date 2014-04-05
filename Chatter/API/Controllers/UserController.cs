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
            var users = from u in db.Users.ToList()
                        let allowAddFriend = db.Friends.Where(f => f.UserID == currentlyLoggedUserID && f.FriendUserID == u.Id).Count() == 0
                        where IsSearchCriteriaMatchToUser(searchCriteria, u)
                        select new { name = u.FirstName + " " + u.LastName, allowAddFriend, id = u.Id };

            return users;
        }

        [HttpGet]
        public IEnumerable<object> FindMyFriends(string searchCriteria)
        {
            var users = from f in db.Friends.ToList()
                        join u in db.Users.ToList() on f.FriendUserID equals u.Id
                        where f.UserID == currentlyLoggedUserID
                        && (IsSearchCriteriaMatchToUser(searchCriteria, u) || searchCriteria == "all")
                        select new { name = u.FirstName + " " + u.LastName, id = u.Id };

            return users.ToList();
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

        private bool IsSearchCriteriaMatchToUser(string searchCriteria, User user)
        {
            var check1 = searchCriteria.Contains(user.FirstName) 
                || searchCriteria.Contains(user.LastName) 
                || searchCriteria.Contains(user.Email) 
                || searchCriteria.Contains(user.Nickname);

            var check2 = (user.FirstName != null && user.FirstName.Contains(searchCriteria))
                || (user.LastName != null && user.LastName.Contains(searchCriteria))
                || (user.Email != null && user.Email.Contains(searchCriteria))
                || (user.Nickname != null && user.Nickname.Contains(searchCriteria));

            return check1 || check2;
        }

    }
}
