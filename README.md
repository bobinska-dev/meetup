# Saskia Bobinska's demo Studio

This particular branch is mainly showcasing the recycling bin solution. Please check the main branches readMe or the other branches for more examples.

## Recycling Bin

When you delete a published document in the Studio or via an API, you can restore it by navigating back to the document in the structure and clicking on the "Restore" button. This will restore the document to its previous version.

In order to make it easier for editors to restore documents, I have created a custom recycling bin solution. This solution allows editors to view all deleted documents in a separate view, making it easier to find and restore them.

<br>

| ![Screenshot 2025-05-21 at 19 07 39](https://github.com/user-attachments/assets/4dc1025c-1b92-4cbc-82d1-09e4d9b90bf9) |
| :-------------------------------------------------------------------------------------------------------------------: |
|                _With this solution any published document that is deleted can be restored by editors._                |

<br>

## Full guide

You can find a guide with all the steps and explanations in this guide: [Create a recycling bin for logging and restoring deleted documents](https://www.sanity.io/guides/bin-for-restoring-deleted-documents)

### Webhook template

You can use [this webhook template for your own project](<https://www.sanity.io/manage/webhooks/share?name=recycling_bin&description=&url=https%3A%2F%2F%3CYOUR_PROJECT_ID%3E.api.sanity.io%2Fv2025-03-01%2Fdata%2Fmutate%2F%3CYOUR_DATASET%3E&on=delete&filter=_type%20in%20%5B%20%3CYOUR%20DOCUMENT%20TYPES%3E%20%5D%20%26%26%20delta%3A%3Aoperation()%20%3D%3D%20%27delete%27&projection=%7B%0A%20%20%22mutations%22%3A%20%5B%0A%20%20%20%20%2F%2F%20first%20we%20patch%20the%20array%20of%20id%20strings%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22patch%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22query%22%3A%20%22*%5B_type%20%3D%3D%20%27deletedDocs.bin%27%20%26%26%20_id%20%3D%3D%20%27deletedDocs.bin%27%5D%22%2C%0A%20%20%20%20%20%20%20%20%22setIfMissing%22%3A%20%7B%27deletedDocIds%27%3A%20%5B%5D%7D%2C%0A%20%20%20%20%20%20%20%20%22insert%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22before%22%3A%20%22deletedDocIds%5B0%5D%22%2C%0A%20%20%20%20%20%20%20%20%20%20%22items%22%3A%20%5B_id%5D%0A%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%0A%20%20%20%20%2F%2F%20then%20we%20do%20the%20same%20for%20the%20logs%20array%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22patch%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22query%22%3A%20%22*%5B_type%20%3D%3D%20%27deletedDocs.bin%27%20%26%26%20_id%20%3D%3D%20%27deletedDocs.bin%27%5D%22%2C%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%22setIfMissing%22%3A%20%7B%27deletedDocLogs%27%3A%20%5B%5D%7D%2C%0A%20%20%20%20%20%20%20%20%22insert%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22before%22%3A%20%22deletedDocLogs%5B0%5D%22%2C%0A%20%20%20%20%20%20%20%20%20%20%22items%22%3A%20%5B%7B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20we%20use%20the%20deleted%20doc%20_id%2C%20_type%2C%20title%20or%20name%2C%20as%20well%20as%20the%20revision%20ID%20as%20the%20item%20values%20and%20add%20a%20now()%20value%20from%20GROQ%20to%20also%20add%20the%20datetime%20we%20need%0A%20%20%20%20%20%20%20%20%20%20%20%20%22docId%22%3A%20_id%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22deletedAt%22%3A%20now()%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%22type%22%3A%20_type%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%22documentTitle%22%3A%20coalesce(title%2C%20name)%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%22_key%22%3A%20_rev%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22deletedBy%22%3A%20identity()%0A%20%20%20%20%20%20%20%20%20%20%7D%5D%2C%0A%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D&httpMethod=POST&apiVersion=v2021-03-25&includeDrafts=&includeAllVersions=&headers=%7B%7D>).

**_Make sure to replace the placeholders with your own project ID and dataset name, and follow the instructions in the guide [regarding authentication in the headers](https://arc.net/l/quote/afalrnit)._**
<br>
<br>

### Special thanks

Thanks to [@BWeineff](https://github.com/BWeineff) and [@nkgentile](https://github.com/nkgentile) for their help with the first idea for this solution.
