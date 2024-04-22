---
layout: post
title: Adding an Export to CSV Option to a Power App
---
I encountered a scenario at work where my team needs an interface to keep track of audits.  They want to be able to enter new audit records and view existing ones.  Most importantly, they want to be able to export audit records based on self-selected filters and view this data in Excel.

During Phase I of this project, I built two Microsoft Power Apps and embedded them into a PowerBI report.  Based on initial feedback, it became clear that for Phase II, the ability to export to Excel was a critical function.

I found several helpful videos about how to use the experimental feature "Ask in Power Apps" to achieve this; however, this functionality is no longer supported.  I wanted to build something based on standard components that are unlikely to change or disappear.  I had some great formatting and syntax help from [Matthew Devaney's blog](https://www.matthewdevaney.com/powerapps-collections-cookbook/export-a-collection-to-a-json/) and [Daniel Christian's Youtube](https://www.youtube.com/watch?v=QTbVMu6DIfQ), but because my case was a little more specific, I'm writing this article to help close the gap.

Here are the basic steps to export Power Apps data to a CSV file:

1. [Transform the data source into JSON data](#transform-data)
2. [Create a Power Automate Flow that creates a CSV file in SharePoint from that JSON data](#create-flow)
3. [Send the JSON data to Power Automate](#send-power-automate)

### <a name="transform-data"></a>Transform the data source

Transforming the data turned out to be the most difficult step of the process for me because most of the examples used a simple data source.  My team's data is stored in a SharePoint list, and I display this list in Power Apps as a gallery with filters.  Initially, I tried transforming "\<GalleryName\>.Visible", hoping that this would recognize the filters.  Unfortunately, I quickly realized that the gallery only contains a few data elements from the SharePoint list, and I need every column.

Here is the transformation solution I came up with, and I'll break it down step by step.

In my existing Power App interface, I added a download icon and put the following code into the "OnSelect" property:

```
// transform data into collection
ClearCollect(varData,
    ForAll(
        Filter(
            'Data Source Name',
            ItemID.Selected.Value=Blank() Or 'Item ID'=ItemID.Selected.Value,
            Year.Selected.Value=Blank() Or 'Fiscal Year of Audit'=Year.Selected.Value
            ),
        {
            'Item ID': If(IsBlank(ThisRecord.'Item ID'),"",ThisRecord.'Item ID'),
            'Fiscal Year of Audit': If(IsBlank(ThisRecord.'Fiscal Year of Audit'),"",ThisRecord.'Fiscal Year of Audit')
        }
    )
);

// collection to JSON
Set(jsonData, JSON(varData));
```

What are these functions doing?  Let's start with the innermost function and work our way outwards.

**Filter()** is already being used on the "Visible" attribute of the gallery, so I simply copied this code over.  Basically, it will only return values in the data source that match the selected filters.

**ForAll()** is a [Power Platform function](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-forall) that iterates through each row of the data and allows you to make transformations on that data.  Used in the format above, it allows us to shape the result so that we can convert it to JSON.  The logic in the {} portion checks if the column for that record is blank and fills with "".  This is necessary because not all columns are required in my dataset, and I was getting errors when the column values were blank.

**ClearCollect()** is another [Power Platform function](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-clear-collect-clearcollect).  It creates a collection named varData to store the results of our data transformations in ForAll().  The "Clear" portion clears any previous values stored in varData.

Finally, we set the variable jsonData to hold the JSON-formatted version of the variable varData.

### <a name="create-flow"></a>Create a Power Automate Flow
The reason we need to create a Power Automate flow is because we will be creating a CSV file in the cloud and using that link for download.  At this time, Power Apps doesn't have the functionality necessary to create and download a file without using Power Automate.  I had difficulty here because there were many existing help articles and videos for a previous version of the Power Apps operation.  This version contained a functionality called "Ask in Power Apps", which is experimental.

I wasn't able to access this experimental functionality and didn't want to build an app used for critical data on a feature that might disappear.  After some searching, I found [Daniel Christian's tutorial](https://www.youtube.com/watch?v=QTbVMu6DIfQ) that explained how to use the "input" portion of the "Power Apps (V2)" operation.  Here is a summary of the operations I used to create the flow:

![Power Automate flow](/assets/img/2024-04-19-power-automate.png)

Daniel Christian's tutorial gives a thorough overview of how to create each of these steps, so I encourage you to watch that if you are looking for a step-by-step guide.  One part that I will elaborate on further is the first operation, PowerApps (V2):

![Power Apps V2 Step](/assets/img/2024-04-19-power-apps-step.png)

I thought that you had to enter the input from within Power Automate, which would make passing data from the Power App impossible.  This is, fortunately, not the case!  The name that you give the input simply serves as a variable name for the data that you will pass from the Power App.  Enter your variable name in the first box.  Do not enter anything in the box that says "Please enter your input".

Once you have finished creating the flow, save it and navigate back to the Power App.

### <a name="send-power-automate"></a>Send to Power Automate
On the left-hand side of the Power App edit view, click the 3 lines to expand the menu and select "Power Automate":

![Power Apps Menu](/assets/img/2024-04-19-menu.png)

Click the "Add flow" button and select the flow that you created in the previous step.

Return to your download icon's OnSelect property.  Under your existing code, add these lines:

```
// run the flow
Set(
    varCSVFile,
    PowerAutomateFlowName.Run(jsonData).linkoutput
);

// download the file to Excel
Download(varCSVFile)
```

**PowerAutomateFlowName.Run()** calls the Power Automate flow that we created and sends it the variable jsonData.  On the Power Automate side, this will be stored under the input "JsonInput" and used to run the rest of the flow.

Let's take a closer look at the final step of the Power Automate flow:

![Power Automate link step](/assets/img/2024-04-19-link.png)

In this step, we created a variable, LinkOutput, to store the link to the CSV file that we created in SharePoint.  This variable is not case-sensitive in Power Apps, so that's why you see it tacked on to the Run() function as ".linkoutput".

**Download()** saves the link to the user's computer.

**Note:** I did encounter some difficulty with permissions issues when creating the file in SharePoint.  If the person using the Power App hasn't used SharePoint for a while, they might encounter an error when they initially click the download icon. In testing, my team solved this problem by simply clicking on the icon again.