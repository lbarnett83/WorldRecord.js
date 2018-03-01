# WorldRecord.js
World Record Scraper module for PhantomBot

CHANGELOG MARCH 1st, 2018

- Added categoryName and gameName variables.
- When finding if streamTitle includes a category, check with both being force into lowercase.
- Set categoryName when the the category find function finds a category.
- Return from the caegory finding function once it gets a hit, instead of looping through the rest.
- Retrive the `primary` time variable instead of the `realtime` varible, because in some cases realtime will return `null`.
- Updated wroldrecordMessage text.
