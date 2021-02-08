*** Settings ***
Documentation       A test suite with a single test for Reply Thread.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary
Library             Dialogs

*** Test Cases ***
Reply Thread
        Open Browser    http://uchan-atest.herokuapp.com/   Chrome
        Maximize Browser Window
        Set Selenium Speed	2
        Page Should Contain Element  ufo
        Wait Until Element Is Enabled  xpath=//div[@id='boards']/div/div/div/div/a[2]
        Set Focus To Element      xpath=//div[@id='boards']/div/div/div/div/a[2]
        Click Element     xpath=//div[@id='boards']/div/div/div/div/a[2]
        Page Should Contain Element  1000598
        Wait until Element is Enabled  1000598
        Set Focus to Element  1000598
        Click Element   1000598
        Click Element   replyToThread
        Input Text  text  Robot Test Reply Yee Haw
        Pause Execution   Enter Captcha
        Click Button      Submit
        [Teardown]      Close Browser
