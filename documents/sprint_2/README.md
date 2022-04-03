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

# Sprint 2

## Story Point: Forecast and Rationale

### The forecast for the sprint 2 includes:

Total Forecasted : 36

Total Points Completed : 23

Moved to next sprint : 13

### Rationale

#### Completed tasks: 

To update the hostile rating to the user's db.

Create Group Enhancements.

As a user, I want to delete accounts and activities.

Allow the user to edit or add to their profile including their list of interests/activities.

Allow users to join a group using the searching and filtering group feature.

#### Moved Tasks:

Build a group dashboard to display current group members and group activities.

As a user, I want to rate my peer user.


## Kanban Board: Product Backlog

#### [Kanban Board in Trello](https://trello.com/b/y7M64Ako/kanban-template)

## Sprint Board

#### [Sprint2 Board in Trello](https://trello.com/b/2cmtpM1p/sprint-2-programming-project)

## Burndown Chart

![Burndown sprint 2 ws](https://user-images.githubusercontent.com/99055144/161398089-cc5fd553-58d3-41f4-8555-de254244f0c5.PNG)

## Daily Scrums

https://kennesawedu-my.sharepoint.com/:x:/g/personal/mgouni_students_kennesaw_edu/EWdagea_pfVDhuGbD7pEmucBKBc0l73t9oKTBF_o-9PirQ?e=bO7aPq

## Tests
need to create 

## Mob Programming Video



https://user-images.githubusercontent.com/99055144/161397810-d33cd029-d424-46bb-a833-c9ca318ab979.mp4



## Sprint Review Video


https://user-images.githubusercontent.com/99055144/161397679-70d6bdfd-a82a-4dd1-a996-f546bbe7a777.mp4


## Continuous Integration & Continous Deployment
Team developed CI and CD using Github Actions. When user create pull request, the system run a workflow that run all test cases and create temporary demo page when all tests are passes. Team members can test the new features in the demo page and review the code accordingly. The following link shows the CI script:
https://github.com/deepbig/boon-companion/blob/main/.github/workflows/firebase-hosting-pull-request.yml

Also, when a team member merges his/her code to the main branch, the system will test all changes and deploy to the hosting server automatically. The following link shows the CD script:
https://github.com/deepbig/boon-companion/blob/main/.github/workflows/firebase-hosting-merge.yml
