using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Chatter.Data.Models;

namespace Chatter.SignalR
{
    public class ChatHub : Hub
    {
        //API:http://www.asp.net/signalr/overview/signalr-1x/hubs-api/hubs-api-guide-server
        //Tutorial: http://www.asp.net/signalr/overview/signalr-1x/getting-started-with-aspnet-signalr/tutorial-getting-started-with-signalr

        //Once the user logs in, the ConnectionID will be set.
        //The users will have a list of users who they are friends with, values of the list items will be Users.ID
        
        //when a user decides to call a friend, they will send a SignalR to CallRequest(destinationUserID, clientID)
        //the server will redirect that call to a user if that user is online, otherwise will return false right away
        //if the user is online, they will be notified of the call request and if they decide to accept the call, they will use
        //that token to call the requestor using peerjs.
              
        private ConceptualModelContainer db = new ConceptualModelContainer();

        public void ImOnline()
        {
            var currentUser = Utils.Utils.GetCurrentUser();//can't make it a class level due to the funny way this hub is initialized
            var user = db.Users.Where(u => u.Id == currentUser.Id).FirstOrDefault();

            user.ConnectionID = Context.ConnectionId;

            db.SaveChanges();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="destinationUserID"></param>
        /// <param name="destPeerID"></param>        
        public void CallRequest(int destinationUserID, string destPeerID)
        {
            //check if there is a link between a current user and the destination user
            var user = GetDestinationUser(destinationUserID);
            var currentUser = Utils.Utils.GetCurrentUser();

            if (user !=null)
            {
                Clients.Client(user.ConnectionID).incomingCall(destPeerID, currentUser.Id);
            }
        }

        public void CallTerminated(int destinationUserID)
        {
            var user = GetDestinationUser(destinationUserID);

            if (user != null)
            {
                Clients.Client(user.ConnectionID).callEndRequest();
            }
        }

        public void SendTextMessage(int destUserID, string message)
        {
            var user = GetDestinationUser(destUserID);
            var currentUser = Utils.Utils.GetCurrentUser();

            if (user != null)
            {
                var senderFullName = currentUser.FirstName + " " + currentUser.LastName;
                Clients.Client(user.ConnectionID).incomingTextMessage(message, currentUser.Id, senderFullName);
            }

        }

        private User GetDestinationUser(int destUserID)
        {
            User user = null;
            try
            {

                var currentUser = Utils.Utils.GetCurrentUser();//can't make it a class level due to the funny way this hub is initialized
                //check if there is a link between a current user and the destination user
                
                var friendUser = db.Friends.Where(f => f.UserID == currentUser.Id && f.FriendUserID == destUserID).FirstOrDefault();
                user = db.Users.Where(u => u.Id == friendUser.FriendUserID).FirstOrDefault();                                
            }
            catch
            {
                user = null;
            }

            return user;
        }      
    }
}