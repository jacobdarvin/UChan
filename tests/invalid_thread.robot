*** Settings ***
Documentation       A test suite with a single test to Create an Invalid Thread.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary
Library             Dialogs


*** Test Cases ***
Create a Thread no Comment
        Open Browser    http://uchan-atest.herokuapp.com/   Chrome
        Maximize Browser Window
        Set Selenium Speed	2
        Page Should Contain Element  inv
        Wait Until Element Is Enabled  xpath=//a[@id='inv']
        Set Focus To Element    xpath=//a[@id='inv']
        Click Element     xpath=//a[@id='inv']
        Click Element     xpath=(//a[contains(text(),'Start a Thread')])
        Pause Execution      Enter Captcha
        Choose File     postImageInput	/Users/liyanadominguez/Desktop/ /Stuffiez/binbun/she dont even.jpeg
        Click Button      Submit
        Page Should Contain Element     error
        [Teardown]        Close Browser

Create a Thread no File
        Open Browser    http://uchan-atest.herokuapp.com/   Chrome
        Maximize Browser Window
        Set Selenium Speed	2
        Page Should Contain Element  vgs
        Wait Until Element Is Enabled  xpath=//a[@id='vgs']
        Set Focus To Element      xpath=//a[@id='vgs']
        Click Element     xpath=//a[@id='vgs']
        Click Element     xpath=(//a[contains(text(),'Start a Thread')])
        Input Text        text    Games
        Pause Execution      Enter Captcha
        Click Button      Submit
        Page Should Contain Element     error
        [Teardown]        Close Browser

Create a Thread no Captcha
        Open Browser    http://uchan-atest.herokuapp.com/   Chrome
        Maximize Browser Window
        Set Selenium Speed	2
        Page Should Contain Element  dls
        Wait Until Element Is Enabled  xpath=//a[contains(@href, '/dls')]
        Set Focus To Element      xpath=//a[contains(@href, '/dls')]
        Click Element     xpath=//a[contains(@href, '/dls')]
        Click Element     xpath=(//a[contains(text(),'Start a Thread')])
        Input Text        text    Robot Thread without Captcha
        Choose File       postImageInput    /Users/liyanadominguez/Desktop/ /Stuffiez/binbun/she dont even.jpeg
        Click Button      Submit
        Page Should Contain Element     error
        [Teardown]        Close Browser
