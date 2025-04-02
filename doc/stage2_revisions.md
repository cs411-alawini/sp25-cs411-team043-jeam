We removed the roster entity and made it a many to many relation instead. We created
a fifth entity named department that holds the department name, location for the main
office, and the number of students in the department. This was to address the following
comment “- if Roster represents the relationship b/t Students and RSOs, you won't have
5 entities”.
We updated the remaining questions to match the changes to our entities. We also
removed the foreign keys in our ER/UML diagrams in response to the comment “- FKs
should not be in ER/UML diagram”.
We added in the studentInterestId for Student Interests to our schema in response to
this comment “- For Student Interests, your schema doesn't have studentInterestId,
breaking the 1-to-many relationship”.
We implemented a composite PK for roster due to this comment “- Roster should
represent the many-to-many relationship b/t students and RSOs, having a composite
PK”.
We removed RSOName as a primary key of RSOInterests and made it a FK instead in
response to this comment, “- why does RSOInterests have its PK as RSOInterestID and
RSOName? Can an RSO have multiple rows of interests in RSOInterests?”.
