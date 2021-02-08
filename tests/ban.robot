*** Settings ***
Documentation       A test suite with a test for Ban and Unban.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary


*** Test Cases ***
Ban
        Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
        Maximize Browser Window
        Set Selenium Speed  1
        Page Should Contain Element  id-login
        Input Text  id-login  admin
        Input Text  password-login    123456789
        Click Button  class:btn
        Element Text Should Be  css:h2  Boards
        Page Should Contain  1000644
        Click Element     xpath=(//td[contains(text(),'1000644')])
        Wait Until Element is Enabled   ban-hammer-btn
        Set Focus to Element    ban-hammer-btn
        Click Element   ban-hammer-btn
        Input Text  ban-remarks     Robot said Not Allowed
        Click Button    banIpButton

Unban
        Page Should Contain     112.211.32.211
        Wait Until Element is Enabled   unban-btn-modal
        Set Focus to Element    unban-btn-modal
        Click Element   unban-btn-modal
        Wait Until Element is Enabled   unban-ip-btn
        Set Focus to Element    unban-ip-btn
        Click Element   unban-ip-btn
        [Teardown]  Close Browser
