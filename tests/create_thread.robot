*** Settings ***
Documentation       A test suite with a single test to Create A Thread.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary
Library             Dialogs

*** Test Cases ***
Create a Thread
        Open Browser    http://uchan-atest.herokuapp.com/   Chrome
        Maximize Browser Window
        Set Selenium Speed	2
        Page Should Contain Element  ufo
        Wait Until Element Is Enabled  xpath=//div[@id='boards']/div/div/div/div/a[2]
        Set Focus To Element      xpath=//div[@id='boards']/div/div/div/div/a[2]
        Click Element     xpath=//div[@id='boards']/div/div/div/div/a[2]
        Click Element     xpath=(//a[contains(text(),'Start a Thread')])
        Input Text        text    Robot Testing Thread Did It Work
        Pause Execution   Enter Captcha
        Choose File       postImageInput  /Users/liyanadominguez/Desktop/ /Stuffiez/binbun/she dont even.jpeg
        Click Button      Submit
        [Teardown]        Close Browser
