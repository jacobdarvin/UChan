*** Settings ***
Documentation       A test suite with a single test for Sticky Thread.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary

***Test Cases***
Sticky Thread
        Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
        Maximize Browser Window
        Set Selenium Speed  1
        Page Should Contain Element  id-login
        Input Text  id-login  DARVIN_REAL
        Input Text  password-login    123456789
        Click Button  class:btn
        Element Text Should Be  css:h2  Boards
        Set Focus To Element  home
        Click Element  home
        Page Should Contain Element  cas
        Wait Until Element Is Enabled  cas
        Set Focus To Element      cas
        Click Element     cas
        Page Should Contain Element     1000604
        Wait Until Element is Enabled   1000604
        Set Focus to Element    1000604
        Click Element       1000604
        Page Should Contain Element     sticky1000604
        Wait Until Element is Enabled   sticky1000604
        Set Focus to Element    sticky1000604
        Click Element   sticky1000604
        [Teardown]  Close Browser
