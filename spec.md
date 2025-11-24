# Project Spec Proposal
Author: Elliott Cepin
Date: 2025-11-24
Version: 0.0

## 1.0 Introduction
This document exists to clarify the scope of the project and the delegation of responsibilities. In class, we agreed that we would build a booking system where users can set up one of three types of account: Venue, Host, or Attendee. These will act as the three modules required by the project spec. 

## 2.0 Fulfilling Project Requirements
Each of the following items are required by the spec.
- [Modules](#modules)
- [User Authentication](#auth)
- [Session management](#session)
- [Data persistence](#persistence)
- [Logical navigation between pages/modules](#nav)
- [A working frontend using HTML, CSS, and JavaScript](#front)
- [A working backend code using the technologies taught in class](#back)

<a id="modules"></a>
## 2.1 Structuring our data
For all users, we'll need some fields for [authentication](#auth). That includes username, salt, and password. Attendees will need a list of their tickets, Hosts will need a list of their reservations, and Venues will need a list of their listings. These can each fall under a "user" category. Tickets, reservations, and listings will have their own, separate databases. Note that, "A unique id" is only unique to the particular type of entity (there will be a "ticket 1" and a "user 1". The database should enforce that no email/user-type combo is repeated (i.e you should be able to sign up as a host and as an attendee with the same email, but there shouldn't be two hosts with the same email).

### 2.1.1 Structure of a user
A user has the following attributes:
- username
- email
- password
- password salt
- user type
- list of IDs 

### 2.1.2 Structure of a ticket
A ticket has the following attributes:
- unique ID
- reservation ID
- seat#

### 2.1.3 Structure of a reservation
A reservation has the following attributes:
- unique ID
- name
- listing ID
- capacity
- ticket cost
- time slot

### 2.1.4 Structure of a listing
A listing has the following attributes:
- unique ID
- name
- capacity
- list of avaliable time-slots
- location

<a id="auth"></a>
## 2.2 User Authentication
For passwords, we can use the [crypto](https://www.w3schools.com/nodejs/nodejs_crypto.asp) module. 

<a id="session"></a>
## 2.3 Session management
For secures session management, we can use [http only cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies) to keep users logged in between reloads and page changes.

<a id="persistence"></a>
## 2.4 Data persistence
For the structure of data, see [Section 2.1](#modules). We will be implementing data persistence with [MongoDB](https://www.w3schools.com/nodejs/nodejs_mongodb.asp). 

<a id="nav"></a>
## 2.5 Logical navigation between pages/modules
For logical navigation between pages, we should separate pages out into two different sections: header and body. The header should be consistent across pages (drawn from the same header.html file) and the body can be drawn from a separate html file for the given page.

<a id="front"></a>
## 2.6 A working frontend using HTML, CSS, and JavaScript
This portion is self explanitory. 

<a id="back"></a>
## 2.7 A working backend code using technologies taught in class
We will use express.js for routing.

## 3.0 Website Design
Our website will need at least three pages: a home page, a user profile, and a page for handling business logic (listings, tickets, and reservations). We can either have a different "business logic" page for each type of user, or we can have the page dynamically react to the type of user.

### 3.1 Home page

### 3.2 User profile

### 3.3 Business logic



