<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Chatter.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" ng-app="chatterApp">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <a href="/api/Default1">/api/Default1</a>
    </div>
    </form>
    <div ng-view></div>
    
    <script type="text/javascript" src="Scripts/angular.min.js"></script>
    <script src="Scripts/angular-route.js"></script>
    <script src="Scripts/app/app.js"></script>
    <script src="Scripts/app/controllers/ctrl.home.js"></script>
    
</body>
</html>
