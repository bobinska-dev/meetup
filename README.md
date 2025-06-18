# Saskia Bobinska's demo Studio

In this repo, you will find a couple of interesting studio solutions - Each branch has its own focus.
If you want to see the most extensive one (where all other branches come together), please skip to [Personalisation](#personalisation).

## Branches

### Rebasing drafts with release published documents

Check out [rebasing-releases-and-drafts branch](https://github.com/bobinska-dev/meetup/tree/rebasing-releases-and-drafts)

When drafts and release versions exist and are edited at the same time, they can diverge from each other in unexpected ways. When the release is then published, the existing draft can become out of sync. Those out of sync drafts can then override existing release-based and already published changes -> `lastPublishedAt` values could help with simple comparisons.
<br/>

| ![image](https://github.com/user-attachments/assets/7b4a15e7-2080-44c7-92c1-370a84cc7c80) |
| :------------------------------------------------------------------------------------------------------------------------------------: |
|                  _Drafts and releases can get out of sync - and there is a simple soluiton to make sure unintentional changes are published_                   |
<br/>
This branch shows how to use the `lastPublishedAt` value to rebase the draft with the latest published document. This is a very useful solution for teams that work with drafts and releases at the same time.

| ![image](https://github.com/user-attachments/assets/353aebc5-5f89-40f0-91d3-16cf4727a89a) |
| :------------------------------------------------------------------------------------------------------------------------------------: |
|                  _Example from the studio - and preview of the solution in action_                   |
<br/>
<br/>

### Main

Check out [main branch](https://github.com/bobinska-dev/meetup/tree/main)

Main is the most minimal one and contains only the basic setup.

### dynamic-lists

Check out [dynamic-lists branch](https://github.com/bobinska-dev/meetup/tree/dynamic-lists)

This branch shows how to create a dynamic list of options that does not require developer intervention to edit.
<br>

| ![Dynamic list options based on listOption documents](https://github.com/user-attachments/assets/02494dc1-1b43-45cf-88f4-1fa8dbce8b96) |
| :------------------------------------------------------------------------------------------------------------------------------------: |
|                  _Dynamic list options based on listOption documents, which have fields for description and more..._                   |

<br>
<br>

### dynamic-languages

Check out [dynamic-languages branch](https://github.com/bobinska-dev/meetup/tree/dynmic-languages)

In this step, I add some complexity and implement the same mechanism of document-based configs to handle languages in the Studio -> even plugins and structures are dynamically configured based on the languages you have in your dataset.
As you can see below, all language documents will be available to the document- and field-level i18n plugins.
<br>

| ![Screenshot 2025-03-20 at 18 54 14](https://github.com/user-attachments/assets/18ab4802-3629-4aad-a8f3-9bcfe09f2dcd) |
| :-------------------------------------------------------------------------------------------------------------------: |
|                     _Language documents are used to control internationalisation from the Studio_                     |

<br>

|                                                                               ![Screenshot 2025-03-20 at 18 55 00](https://github.com/user-attachments/assets/c02f4d40-cafa-4c00-b721-1607b2d10714)                                                                               |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| _Those languages will be directly used in both i18n plugins and the structure for a better experience when working with languages. Another good thing about this approach is that we can internationalist other parts of the Studio, such as the list of options titles and more_ |

<br>
<br>

### dynamic-markets

Check out [dynamic-markets branch](https://github.com/bobinska-dev/meetup/tree/dynamic-markets)

uses the setup of the dynamic languages and adds a new layer of complexity by adding markets to the mix. those markets reference languages, and the Studio uses those markets and languages to dynamically create workspaces, with the market's languages also playing into plugins and structures.
<br>
<br>

| ![Screenshot 2025-03-20 at 18 59 30](https://github.com/user-attachments/assets/c6c8a781-2eb8-464d-aade-67ca039c9bb2) |
| :-------------------------------------------------------------------------------------------------------------------: |
|                             _Markets get used to generate dynamic workspaces on runtime_                              |

<br>

| ![Screenshot 2025-03-20 at 19 00 13](https://github.com/user-attachments/assets/e5bcddaf-d437-4e20-8e86-ccd6abc01ab5) |
| :-------------------------------------------------------------------------------------------------------------------: |
|           _A markets languages are then also used to generate dynamic structures for each market workspace_           |

<br>
<br>

### Personalisation

Check out [personalisation branch](https://github.com/bobinska-dev/meetup/tree/personalisation)

When it comes to personalising the Studio, I added a bit more complexity to the mix. This means that the Studio will now automagically create `person` documents for each Studio member and allow members to add bookmarks and languages to their `person`. This document can be extended to meet all other needs as well and can be fed into permission with content permissions because we can now use the language settings for every member to remove write access from specific translated documents without the need to do this in the manage console.
<br>

|                                                                                            ![Screenshot 2025-03-20 at 19 01 10](https://github.com/user-attachments/assets/74f7d281-0866-41a3-8c9a-cae3e0c70443)                                                                                             |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| _Adding more personalisation options for editors can mean a lot less work for you in the long term. A minimal example would be the ability to bookmark other documents and also configure languages to remove those an editor does not speak to remove accidental mistakes and clutter in their structures._ |

<br>
<br>

### recycling bin

Check out [recycling-bin branch](https://github.com/bobinska-dev/meetup/tree/recycling-bin)

Here we take a step back from all the personalisation and dynamic stuff and focus on a more basic setup, but one that is very useful. This branch shows how to create a recycling bin for your deleted published documents. You can find more about this solution in the branches readme or this guide: <https://www.sanity.io/guides/bin-for-restoring-deleted-documents>
<br>

| ![Screenshot 2025-05-21 at 19 07 39](https://github.com/user-attachments/assets/4dc1025c-1b92-4cbc-82d1-09e4d9b90bf9) |
| :-------------------------------------------------------------------------------------------------------------------: |
|                _With this solution any published document that is deleted can be restored by editors._                |

<br>
<br>

#### Specials

It's worth hovering over some of the parts of the custom components because there are a lot of user-shortcuts and hidden features.
<br>

##### Bookmark inspector

On top of all those goodies, I also added a **bookmark inspector**, which can be opened in all documents (button in the document header) and shows all bookmarks the current user has.
Document inspectors can be used for a huge range of solutions like inline documentation, a table of contents, todos, helpers, and many more.
<br>

| ![Screenshot 2025-03-20 at 18 47 48](https://github.com/user-attachments/assets/7d847024-0291-4d9b-ba88-26804abd5380) |
| :-------------------------------------------------------------------------------------------------------------------: |
|               _Document inspectors are an amazing way to display data wherever the editor is working._                |

<br>
<br>
  
##### Personalised Dashboard

A handy **dashboard** helps to add more personalisation, but the same is also possible in the structure now.

A custom tool, like this dashboard, is one of the most useful but underused components. Instead of building super complex lists for the structure, you can help your editors work more efficiently by allowing them to see things in one visual representation. Since you can build this from scratch you can also add bulk editing and other things into the mix, allow complex multi-document data to be visible in a table, and so much more
<br>

|                       ![Screenshot 2025-03-20 at 18 45 44](https://github.com/user-attachments/assets/d1b783d6-44bf-4d24-bbc4-45a4caa6b307)                        |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| _Structured content can be hard to always understand - help your editors by condensing information which is split across documents into a simple react interface._ |

<br>
<br>
