---
layout: post
title: Updating Multiple Records In A Dataverse Table From A Single Form
---
My department keeps track of a lot of research grants.  However, we discovered some limitations in the central data warehouse that is available across the university.  To solve this problem, I created several tables in Dataverse for Teams to track additional necessary elements.  The basic data structure looks like this:

| Table: Award                                       | Table: User                                        |
| -------------------------------------------------- | -------------------------------------------------- |
| :key: Award ID (Primary Key)                       | :key: User ID (Primary Key)                        |
| Contract                                           | User Name                                          |
| :link: Grant Assignee (LookUp: User.'User ID')     | :link: Assistant Director (LookUp: User.'User ID') |
| :link: Assistant Assignee (LookUp: User.'User ID') | User Title (Choices)                               |
| :link: Assistant Director (LookUp: User.'User ID') |                                                    |

One common issue that the research grant team encounters is how to reassign grants when a staff member leaves or gets promoted.  There can be a large number of grants assigned to one staff member, so editing them individually is tedious.

I designed a solution in Power Apps that allows the user to edit the Grant Assignee, Assistant Assignee, and Assistant Director all at once.

## Solution Steps

1. [Create a new Power App from within Teams](#create-app)
2. [Create a gallery from the User table](#create-user-gallery)
3. [Create a gallery from the Award table](#create-award-gallery)
4. [Create an Edit Form from the Award table](#create-form)
5. [Create a Submit button](#create-button)

### <a name="create-app"></a>Create a new Power App from within Teams

In Teams, navigate to Power Apps.  You may have to search for it if you haven't used it before.

![Power Apps in Teams](/assets/img/2025-05-15-powerapps.png)

### <a name="create-user-gallery"></a>Create a gallery from the User table

Create a new gallery called ``` UserGallery ``` and set the data source to the User table.  Set the *Items* property to: 

```
Sort(Filter(User,'User Title'=1))
```

**Note**: When I created the User table, I set the "User Title" choices to correspond to numbers.  "1" corresponds to the Grant Assignee.  This is the primary relationship that we need to update when a staff member leaves.

### <a name="create-award-gallery"></a>Create a gallery from the Award table

Create a new gallery called ``` AwardGallery ``` next to the first one and set the data source to the Award table.  Set the *Items* property to:

```
Filter(Award, 'Grant Assignee'.UserID=UserGallery.Selected.'User ID')
```

This will show all of the awards with the "Grant Assignee" equal to the current selected user.

Set the *OnSelect* property to:

```
If(AwardGallery.Selected.Contract in AwardCollection.Award, 
Remove(AwardCollection, {Award: AwardGallery.Selected.Contract}), 
Collect(AwardCollection, {Award: AwardGallery.Selected.Contract}))
```

Let's break this down step by step.  We want to create a collection of awards that we can update at once.  To do this in Power Apps, we use:

```
Collect(<CollectionName>, {<NewFieldName>: <GalleryName>.Selected.Value})
```

We want the user to remove an award if they accidentally click on the wrong one when selecting awards.  To do this, we check whether the award that they just clicked on already exists in the collection.  If it does, we call ``` Remove() ```.  Otherwise, we add it to the collection with ``` Collect() ```.

### <a name="create-form"></a>Create an Edit Form from the Award table
Create an Edit Form and set the data source to the Award table.  Go through the fields and remove everything except "Grant Assignee", "Assistant Assignee", and "Assistant Director".  

Do not set the *Item* property yet; we need to create a data structure to hold our selected award data first.

**Note**: We will not actually be submitting this form -- do not use the ``` SubmitForm() ``` function if you are modifying this code!

### <a name="create-button"></a>Create a Submit button

Create a submit button and set the *OnSelect* property to the following:

```
If(Not(IsBlank(DataCardAssistantAssignee.Selected)), ForAll(AwardCollection, 
    Patch(
        Award, 
        LookUp(Award, Contract=Award),
        {
            'Grant Assignee': DataCardGrantAssignee.Selected,
            'Assistant Director': DataCardAssistantDirector.Selected,
            'Assistant Assignee': DataCardAssistantAssignee.Selected
        }
    )
), ForAll(AwardCollection, 
    Patch(
        Award, 
        LookUp(Award, Contract=Award),
        {
            'Grant Assignee': DataCardGrantAssignee.Selected,
            'Assistant Director': DataCardAssistantDirector.Selected
        }
    )
));
```

In my implementation of the Award table, "Assistant Assignee" is an optional field.  We don't want to update it if the user hasn't selected anything.  The ``` If ``` statement checks whether the "Assistant Assignee" field has been filled out and calls the appropriate ``` Patch() ``` function depending on the situation.

How do we know that this code updates every selected award?  Because we used ``` ForAll() ```.  This will iterate through every item in the collection that we created in Step 3, calling ``` Patch() ``` for each one.  The data should refresh fairly instantly, and the user will see the awards under the new "Grant Assignee" in the ``` UserGallery ```.