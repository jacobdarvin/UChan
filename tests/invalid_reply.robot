
*** Settings ***
Documentation       A test suite with tests for Invalid Replies.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary
Library             Dialogs


*** Test Cases ***
Reply No Comment
    Open Browser    http://uchan-atest.herokuapp.com/vgs   Chrome
    Maximize Browser Window
    Set Selenium Speed	2
    Page Should Contain Element  1000651
    Wait until Element is Enabled  1000651
    Set Focus to Element  1000651
    Click Element   1000651
    Click Element   replyToThread
    Pause Execution   Enter Captcha
    Click Button      Submit
    Page Should Contain Element     error
    [Teardown]      Close Browser

Reply No Captcha2
    Open Browser    http://uchan-atest.herokuapp.com/vgs   Chrome
    Maximize Browser Window
    Set Selenium Speed	2
    Page Should Contain Element  1000651
    Wait until Element is Enabled  1000651
    Set Focus to Element  1000651
    Click Element   1000651
    Click Element   replyToThread
    Input Text  text  Robot Test Reply Haw Yee
    Click Button      Submit
    Page Should Contain Element     error
    [Teardown]      Close Browser
