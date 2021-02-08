*** SETTINGS ***
Documentation  A test suite with a test for invalid login of Moderator/Admin
Library  SeleniumLibrary

*** TEST CASES ***
Unuccessful Moderator/Admin Login - Invalid ID
    Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
    Maximize Browser Window
    Set Selenium Speed  0
    Page Should Contain Element  id-login
    Input Text  id-login  invalid_user
    Input Text  password-login    123456789
    Click Button  class:btn
    Page Should Contain Element     error
    [Teardown]  Close Browser

Unuccessful Moderator/Admin Login - Wrong Password
    Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
    Maximize Browser Window
    Set Selenium Speed  0
    Page Should Contain Element  id-login
    Input Text  id-login  admin
    Input Text  password-login    wrong_password
    Click Button  class:btn
    Page Should Contain Element     error
    [Teardown]  Close Browser
