<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Chatter.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" ng-app="chatterApp">
<head runat="server">
    <title>Chatter</title>
    <link href="/Content/chatter.css" rel="stylesheet" />
    <link href="/Content/bootstrap.min.css" rel="stylesheet" />
    <link href="/Content/bootstrap-theme.min.css" rel="stylesheet" />
    <link href="/Content/app/styles.css" rel="stylesheet" />
</head>
<body>
    <div style="display: none;" ng-app="directive.googlePlusAuth">
        <google-plus-auth clientid="1010812378845-5p0490hr5lksssl20n2fj01plb185rpc.apps.googleusercontent.com"></google-plus-auth>
    </div>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">Chatter</a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li><a href="/">Home</a></li>
                    <li ng-show="loggedOn"><a href="#chat">Chat</a></li>
                    <%--<li><a href="#demo">Demo</a></li>--%>

                    <li ng-show="!loggedOn"><a href="#login">Login</a></li>

                    <li ng-show="loggedOn"><a href="#profile">Profile</a></li>

                </ul>
                <%--          <form class="navbar-form navbar-right" role="form">
            <div class="form-group">
              <input type="text" placeholder="Email" class="form-control">
            </div>
            <div class="form-group">
              <input type="password" placeholder="Password" class="form-control">
            </div>
            <button type="submit" class="btn btn-success">Sign in</button>
          </form>--%>
            </div>
            <!--/.navbar-collapse -->
        </div>
    </div>
    <div ng-view></div>

    <script src="/Scripts/jquery-2.1.0.min.js"></script>
    <script src="/Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="/Scripts/angular.min.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>
    <script src="http://cdn.peerjs.com/0.3/peer.js"></script>
    <script src="/Scripts/angular-route.js"></script>
    <script src="/Scripts/ui-bootstrap-tpls-0.10.0.min.js"></script>
    <script src="/Scripts/pagination.js"></script>
    <script src="/Scripts/app/app.js"></script>
    <script src="Scripts/app/config/config.chatter.js"></script>
    <script src="/Scripts/app/controllers/ctrl.home.js"></script>
    <script src="/Scripts/app/controllers/ctrl.login.js"></script>
    <script src="/Scripts/app/controllers/ctrl.chat.js"></script>
    <script src="/Scripts/app/controllers/ctrl.demo.js"></script>
    <script src="/Scripts/app/directives/google-plus-auth.js"></script>
    <script src="/Scripts/toastr.min.js"></script>
    <link href="/Content/toastr.min.css" rel="stylesheet" />
</body>
</html>
