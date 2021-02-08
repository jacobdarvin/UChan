*** Settings ***
Documentation       A test suite with a test for managing a Moderator.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary


*** Test Cases ***
Add Board
        Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
        Maximize Browser Window
        Set Selenium Speed  2
        Page Should Contain Element  id-login
        Input Text  id-login  admin
        Input Text  password-login    123456789
        Click Button  class:btn
        Element Text Should Be  css:h2  Boards
        Click Element     xpath=(//a[contains(text(),' Moderators ')])
        Page Should Contain Element  xpath=(//td[contains(text(),'mei')])
        Wait Until Element Is Enabled  xpath=(//td[contains(text(),'mei')])
        Set Focus To Element  xpath=(//td[contains(text(),'mei')])
        Click Element     xpath=(//td[contains(text(),'mei')])
        Wait Until Element is Enabled   toAddBoard
        Set Focus to Element    toAddBoard
        Click Element   toAddBoard
        Select From List By Value  toAddBoard  inv
        Click Button    addBoard
        Element Text Should Be  moderatorDeletedMessage  Board inv successfully added to mei
        Click Button  moderator-remove-close-btn

Remove Board
        Page Should Contain Element  xpath=(//td[contains(text(),'mei')])
        Wait Until Element Is Enabled  xpath=(//td[contains(text(),'mei')])
        Set Focus To Element  xpath=(//td[contains(text(),'mei')])
        Click Element     xpath=(//td[contains(text(),'mei')])
        Wait Until Element is Enabled   checkboxBoards
        Set Focus to Element    inv
        Click Element   inv
        Click Button    removeBoard
        Element Text Should Be  moderatorDeletedMessage  Boards inv successfully removed from mei
        Click Button  moderator-remove-close-btn

Delete Moderator
        Page Should Contain Element  xpath=(//td[contains(text(),'test')])
        Wait Until Element Is Enabled  xpath=(//td[contains(text(),'test')])
        Set Focus To Element  xpath=(//td[contains(text(),'test')])
        Click Element     xpath=(//td[contains(text(),'test')])
        Wait Until Element is Enabled   deleteModeratorButton
        Set Focus to Element    deleteModeratorButton
        Click Element   deleteModeratorButton
        Element Text Should Be  moderatorDeletedMessage  Successfully deleted user test
        Click Button  moderator-remove-close-btn
        [Teardown]    Close Browser
