# Boon Companion

## Working Prototype and Code

Prototype URL: https://boon-companion.web.app/

Code URl: https://github.com/deepbig/boon-companion/tree/main

## Project Documents

Documents URL: https://github.com/deepbig/boon-companion/tree/main/documents

## Team: 4

### Team Members:

Mani Kumar Gouni<br/>
Deepthi Pottipally<br/>
Sai Krupa Bariki Vidura<br/>
Aparna Sykam<br/>
Hongsuk Ryu<br/>

# Sprint 3

## Story Point: Forecast and Rationale

### The forecast for the sprint 3 includes:

Total Forecasted : 27

Total Points Completed : 27

### Rationale
**Story:** To update the hostile rating to the user's db.<br/>
**Rationale:** In this story, we implemented a small hostile algorithm to detect unfriendly or aggressive words whenever a user uses them. In the application, the user's hostile rating will be incremented under the hostileRating column in the database. To indicate that the higher the rating, the more unfriendly or aggressive the user is.<br/>
**Story:** Create Group Enhancements (Range Sliders, Logged-in User's Data)<br/>
**Rationale:** By implementing this story, a user can create a group by utilizing the following parameters: list of activities, age, gender, peer rating, hostile rating, and level of experience. Along with these parameters to filter to find the most appropriate matches, the user is allowed to give their own name and title to the group created.<br/>
**Story:** As a user, I want to delete accounts and activities.<br/>
**Rationale:** By implementing this story, users can delete their profiles when they are no longer interested in the application or for any other reason. When a user clicks on the "Delete Account" button, the complete user information will be deleted, including activities.<br/>
**Story:** Allow the user to edit or add to their profile including their list of interests/activities.<br/>
**Rationale:** By implementing this story, users can be allowed to update or add new activities to their user profile data. This makes the application gather more recent information, helps form groups and keeps connecting users.<br/>
**Story:** Allow users to join a group using the searching and filtering group feature.<br/>
**Rationale:** By implementing this story, users can join a group by utilizing the following parameters: list of activities, age, gender, peer rating, hostile rating, and level of experience. These parameters allow the user to filter and find the most appropriate group match.<br/>

In this sprint, we completely focused on allowing users to update and delete user profiles. Along with these, we concentrated on executing some key functionalities like allowing users to create groups using certain criteria and allowing users to join groups based on selected criteria.
 



#### Completed tasks: 

Create a component and service to make a rest call with given request

Verify Everywhere user enters a bad in the app.

Display the tips in reverse chronological order and also display user name for each tip in the group dashboard

Create query to fetch the data based on mentioned conditions.

Create component for rating save into db using service. Fetch rates respective to each user to display on board

Write select query to fetch list of profiles with similar activity/interest

Display and update the activity performance section when a user adds an activity.

Display tips shared by the group members in group dashboard.

Create a form to add a tip in the group dashboard.

Unit Testing

Integrationn Testing

## Kanban Board: Product Backlog

#### [Kanban Board in Trello](https://trello.com/b/y7M64Ako/kanban-template)

## Sprint Board

#### [Sprint3 Board in Trello](https://trello.com/b/x1RlD6q8/sprint-3-programming-project)

## Burndown Chart

![burndown](https://user-images.githubusercontent.com/99055144/164597805-2b87fa39-60ca-4c2b-9d97-b8191c29260f.png)


## Daily Scrums


## Tests


## Mob Programming Video



https://user-images.githubusercontent.com/99055144/164845134-1df73e96-f66e-4f42-ba5b-11dab5b3f1eb.mp4



## Sprint Review Video



https://user-images.githubusercontent.com/99055144/164845137-0e56f2c3-4509-4b8d-9ca9-5078ab848add.mp4



## Continuous Integration & Continous Deployment
Team developed CI and CD using Github Actions. When user create pull request, the system run a workflow that run all test cases and create temporary demo page when all tests are passes. Team members can test the new features in the demo page and review the code accordingly. The following link shows the CI script:
https://github.com/deepbig/boon-companion/blob/main/.github/workflows/firebase-hosting-pull-request.yml

Evidence:

![Screenshot (9)](https://user-images.githubusercontent.com/99055144/164845467-4d584650-a758-47a3-aee8-2102f641db7f.png)



Also, when a team member merges his/her code to the main branch, the system will test all changes and deploy to the hosting server automatically. The following link shows the CD script:
https://github.com/deepbig/boon-companion/blob/main/.github/workflows/firebase-hosting-merge.yml

Evidence:

![Screenshot (8)](https://user-images.githubusercontent.com/99055144/164845424-ae06e09c-a941-48d3-a93c-d3bfdc0f6c87.png)
