*** Settings ***
Documentation       A test suite with tests for Invalid Registration.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary


*** Test Cases ***
Invalid Moderator Key
    Open Browser    http://uchan-atest.herokuapp.com/xeroxthat  Chrome
    Maximize Browser Window
    Set Selenium Speed	0
    Input Text  key-register    123456
    Input Text  id-register  dlsumod
    Input Text  password-register   helloworld
    Input Text  password-repeat     helloworld
    Click Button    xeroxThatSubmit
    Page Should Contain Element     error
    [Teardown]  Close Browser

Used Username
    Open Browser    http://uchan-atest.herokuapp.com/xeroxthat  Chrome
    Maximize Browser Window
    Set Selenium Speed	0
    Input Text  key-register    MODERATOR KEY
    Input Text  id-register  mei
    Input Text  password-register   helloworld
    Input Text  password-repeat     helloworld
    Click Button    xeroxThatSubmit
    Page Should Contain Element     error
    [Teardown]  Close Browser

Different password
    Open Browser    http://uchan-atest.herokuapp.com/xeroxthat  Chrome
    Maximize Browser Window
    Set Selenium Speed	0
    Input Text  key-register    MODERATOR KEY
    Input Text  id-register  uchanMod
    Input Text  password-register   helloworld
    Input Text  password-repeat     helloworld123
    Click Button    xeroxThatSubmit
    Page Should Contain Element     error
    [Teardown]  Close Browser
