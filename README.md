# Yoga Stat Tracking Server

This repo functions as a REST API for yoga students using a frontend website to track their progress over time. 

I.E. When students do their practice, they log it into my app. They should then be able to retrieve data regarding their practice to track it over time and trend it (the trending would happen on the frontend, the datafeed would come from this API).

## Scope

The database schema will consist of the following entities:

1. Users / Students
2. Profile
3. Poses
4. Sequences
5. Logs
6. Entries


Database relationships:

- 1:1 Users:Profile -- A user only has one profile
- 1:M Users:Poses -- A user can own many poses
- 1:M Users:Sequences -- A user can own many sequence
- N:M Sequences:Poses -- Each sequence holds any number of poses, and each pose can show up in any number of sequences
- 1:M User


Routes:
- Authentication and Authorization using passportJS, local and JWT strategies (respectively)
- User routes for retrieving, creating an account and deleting.
- Profile routes for creating (upon sign-up), retrieving profile (upon sign-in) and deleting (upon deleting user).
- Basic CRUD for Poses
- Basic CRUD for Sequences
- Hooking up a sequence to a Practice Log when it is created - i.e. a Log **must** be created with a Sequence ID/Name.
- Making an Entry within a Practice Log - i.e. an entry **must** belong to a Log and contain a Pose ID/Name which was practiced
