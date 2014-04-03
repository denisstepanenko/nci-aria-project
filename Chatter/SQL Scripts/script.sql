DROP TABLE [dbo].[Users]
GO

CREATE TABLE [dbo].[Users] (
    [Id]        INT            IDENTITY (1, 1) NOT NULL,
    [Nickname]  VARCHAR (50) NOT NULL,
    [FirstName] VARCHAR (50) NOT NULL,
    [LastName]  VARCHAR (50) NOT NULL,
    [Email]     VARCHAR (50) NULL,
	[ConnectionID] VARCHAR(MAX) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

go

insert into Users(nickname, firstname, lastname, email)
values('Nickname1', 'firstname1', 'lastname1', 'email1@local.com')

insert into Users(nickname, firstname, lastname, email)
values('Nickname2', 'firstname2', 'lastname2', 'email2@local.com')

insert into Users(nickname, firstname, lastname, email)
values('Nickname3', 'firstname3', 'lastname3', 'email3@local.com')

insert into Users(nickname, firstname, lastname, email)
values('Nickname4', 'firstname4', 'lastname4', 'email4@local.com')

insert into Users(nickname, firstname, lastname, email)
values('Nickname5', 'firstname5', 'lastname5', 'email5@local.com')

insert into Users(nickname, firstname, lastname, email)
values('Nickname6', 'firstname6', 'lastname6', 'email6@local.com')

insert into Users(nickname, firstname, lastname, email)
values('Nickname7', 'firstname7', 'lastname7', 'email7@local.com')

insert into Users(nickname, firstname, lastname, email)
values('Nickname8', 'firstname8', 'lastname8', 'email8@local.com')
go

CREATE TABLE [dbo].[Friends]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserID] INT NOT NULL, 
    [FriendUserID] INT NOT NULL
)