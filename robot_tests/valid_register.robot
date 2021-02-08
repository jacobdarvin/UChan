*** SETTINGS ***
Documentation  A test suite with a single test for valid Moderator Registration
Library  SeleniumLibrary

*** TEST CASES ***
Successful Moderator Login
    Open Browser  https://uchan-atest.herokuapp.com/xeroxthat  Chrome
    Maximize Browser Window
    Set Selenium Speed  0
    Page Should Contain Element  key-register
    Input Text  key-register  601eb5a40c02d252dc520d10
    Input Text  id-register    robotTest2
    Input Text  password-register  123456789
    Input Text  password-repeat  123456789
    Click Button  class:btn
    Element Text Should Be  css:h1  XeroxThis
    [Teardown]  Close Browser
