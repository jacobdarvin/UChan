*** SETTINGS ***
Documentation  A test suite with a test for valid login of Moderator and Admin
Library  SeleniumLibrary

*** TEST CASES ***
Successful Moderator Login
    Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
    Maximize Browser Window
    Set Selenium Speed  0
    Page Should Contain Element  id-login
    Input Text  id-login  DARVIN_REAL
    Input Text  password-login    123456789
    Click Button  class:btn
    Element Text Should Be  css:h2  Boards
    [Teardown]  Close Browser

Successful Admin login
    Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
    Maximize Browser Window
    Set Selenium Speed  0
    Page Should Contain Element  id-login
    Input Text  id-login  admin
    Input Text  password-login    123456789
    Click Button  class:btn
    Element Text Should Be  css:h2  Boards
    [Teardown]  Close Browser
