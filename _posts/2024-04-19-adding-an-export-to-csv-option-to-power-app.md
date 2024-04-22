---
layout: post
title: Adding an Export to CSV Option to a Power App
---
I encountered a scenario at work where my team needs an interface to keep track of audits.  They want to be able to enter new audit records and view existing ones.  Most importantly, they want to be able to export audit records based on self-selected filters and view this data in Excel.

During Phase I of this project, I built two Microsoft Power Apps and embedded them in a PowerBI report.  Based on initial feedback, it became clear that for Phase II, the ability to export to Excel was a critical function.

I found several helpful videos about how to use the experimental feature "Ask in Power Apps" to achieve this; however, this functionality is no longer supported.  I wanted to build something based on standard components that are unlikely to change or disappear.  I had some great formatting and syntax help from [Matthew Devaney's blog](https://www.matthewdevaney.com/powerapps-collections-cookbook/export-a-collection-to-a-json/) and [Daniel Christian's Youtube](https://www.youtube.com/watch?v=QTbVMu6DIfQ), but because my case was a little more specific, I'm writing this article to help close the gap.

Here are the basic steps to export Power Apps data to a CSV file:

1. [Transform the data source into JSON data](#transform-data)
2. [Send the JSON data to Power Automate](#send-power-automate)
3. [Create a Power Automate Flow that creates a CSV file in SharePoint](#create-flow)
4. [Send the SharePoint file link back to the Power App](#send-link)

### <a name="transform-data"></a>Transform the data source

Transforming the data turned out to be the most difficult step of the process for me because most of the examples used a simple data source.  My team's data is stored in a SharePoint list, and I display this list in Power Apps as a gallery with filters.  Initially, I tried transforming "\<GalleryName\>.Visible", hoping that this would recognize the filters.  Unfortunately, I quickly realized that the gallery only contains a few data elements from the SharePoint list, and I need every column.

Here is the transformation solution I came up with, and I'll break it down step by step:

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

### <a name="send-power-automate"></a>Send to Power Automate

### <a name="create-flow"></a>Create a Power Automate Flow

### <a name="send-link"></a>Send the file link back to Power Apps