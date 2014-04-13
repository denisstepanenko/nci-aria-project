using Chatter.API.Base;
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
    public class UserController : ApiControllerBase
    {
        private ConceptualModelContainer db = new ConceptualModelContainer();
        
        [HttpGet]
        public object FindFriends(string searchCriteria, int pageNumber = 1, int pageSize = 20)
        {
            var users = from u in db.Users.ToList()
                        let allowAddFriend = db.Friends.Count(f => f.UserID == CurrentUser.Id && f.FriendUserID == u.Id) == 0
                        where IsSearchCriteriaMatchToUser(searchCriteria, u) && u.Id != CurrentUser.Id
                        select new { name = u.FirstName + " " + u.LastName, allowAddFriend, id = u.Id };

            var result = new { totalItems = users.Count(), data = users.Skip((pageNumber - 1) * pageSize).Take(pageSize) };

            return result;
        }

        [HttpGet]        
        public object FindMyFriends(string searchCriteria, int pageNumber = 1, int pageSize = 20)
        {
            var users = from f in db.Friends.ToList()
                        join u in db.Users.ToList() on f.FriendUserID equals u.Id
                        where f.UserID == CurrentUser.Id
                        && (IsSearchCriteriaMatchToUser(searchCriteria, u) || searchCriteria == "all")
                        select new { name = u.FirstName + " " + u.LastName, id = u.Id };

            var result = new { totalItems = users.Count(), data = users.Skip((pageNumber - 1) * pageSize).Take(pageSize) };

            return result;
        }

        [HttpPost]
        public void AddToFriends(AddToFriendsDTO data)
        {
            var friend = db.Friends.FirstOrDefault(f => f.FriendUserID == data.friendUserID && f.UserID == CurrentUser.Id);
            if (friend != null) return;
            friend = new Friend { UserID = CurrentUser.Id, FriendUserID = data.friendUserID };
            db.Friends.Add(friend);
            db.SaveChanges();
        }

        [HttpDelete]
        public void RemoveFriend(int friendUserID)
        {
            var friend = (from f in db.Friends
                          where f.UserID == CurrentUser.Id && f.FriendUserID == friendUserID
                          select f).FirstOrDefault();

            if (friend != null)
            {
                db.Friends.Remove(friend);
                db.SaveChanges();
            }
        }

        [HttpGet]
        public object GetChatHistory(int friendUserID, int pageNumber = 1, int pageSize = 20)
        {
            //cross-site scripting is handeled by AngularJS as it escapes HTML
            var data1 = from m in db.ChatHistories
                        where (m.SenderUserID == CurrentUser.Id && m.RecipientUserID == friendUserID)
                        || (m.RecipientUserID == CurrentUser.Id && m.SenderUserID == friendUserID)
                        orderby m.CreatedDate descending
                        select m;

            var messages = from d in data1.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList()
                           join su in db.Users on d.SenderUserID equals su.Id
                           let senderName = su.Id == CurrentUser.Id ? "me" : su.FirstName + " " + su.LastName
                           orderby d.CreatedDate ascending
                           select new { message = d.Message, datePosted = d.CreatedDate.ToString("dd MMM")+" at "+d.CreatedDate.ToString("HH:mm:ss"), senderName };

            var result = new { totalItems = data1.Count(), data = messages };

            return result;
        }

        [HttpPost]
        public void PostTextMessage(PostTextMessageDTO data)
        {
            var chatHistoryItem = new ChatHistory
            {
                Message = data.message,
                RecipientUserID = data.friendUserID,
                SenderUserID = CurrentUser.Id,
                CreatedDate = DateTime.Now
            };

            db.ChatHistories.Add(chatHistoryItem);
            db.SaveChanges();
        }

        #region "Private Stuff"
        private bool IsSearchCriteriaMatchToUser(string searchCriteria, User user)
        {
            var check1 = searchCriteria.ToLower().Contains(user.FirstName.ToLower())
                || searchCriteria.ToLower().Contains(user.LastName.ToLower())
                || searchCriteria.ToLower().Contains(user.Email.ToLower())
                || searchCriteria.ToLower().Contains(user.Nickname.ToLower());

            var check2 = (user.FirstName != null && user.FirstName.ToLower().Contains(searchCriteria.ToLower()))
                || (user.LastName != null && user.LastName.ToLower().Contains(searchCriteria.ToLower()))
                || (user.Email != null && user.Email.ToLower().Contains(searchCriteria.ToLower()))
                || (user.Nickname != null && user.Nickname.ToLower().Contains(searchCriteria.ToLower()));

            return check1 || check2;
        }
        #endregion

    }
}
