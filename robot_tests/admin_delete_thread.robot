*** SETTINGS ***
Documentation  A test suite with a test for Moderator and Admin Delete Thread
Library  SeleniumLibrary

*** TEST CASES ***
Successful Moderator Delete
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
    Page Should Contain Element  ufo
    Wait Until Element Is Enabled  cas
    Set Focus To Element      cas
    Click Element     cas
    Page Should Contain Element  1000634
    Wait until Element is Enabled  1000634
    Set Focus to Element  1000634
    Click Element  1000634
    Click Element  dropdown_icon_1000634
    Page Should Contain Element  d_1000634
    Wait until Element is Enabled  d_1000634
    Set Focus to Element  d_1000634
    Click Element  d_1000634
    Page Should Contain Element  1000634modDeleteYes
    Wait until Element is Enabled  1000634modDeleteYes
    Set Focus to Element  1000634modDeleteYes
    Click Element  1000634modDeleteYes
    Page Should Not Contain Element  1000634
    [Teardown]      Close Browser

Successful Admin Delete
    Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
    Maximize Browser Window
    Set Selenium Speed  1
    Page Should Contain Element  id-login
    Input Text  id-login  admin
    Input Text  password-login    123456789
    Click Button  class:btn
    Element Text Should Be  css:h2  Boards
    Set Focus To Element  home
    Click Element  home
    Page Should Contain Element  ufo
    Wait Until Element Is Enabled  cas
    Set Focus To Element      cas
    Click Element     cas
    Page Should Contain Element  1000635
    Wait until Element is Enabled  1000635
    Set Focus to Element  1000635
    Click Element  1000635
    Click Element  dropdown_icon_1000635
    Page Should Contain Element  d_1000635
    Wait until Element is Enabled  d_1000635
    Set Focus to Element  d_1000635
    Click Element  d_1000635
    Page Should Contain Element  1000635modDeleteYes
    Wait until Element is Enabled  1000635modDeleteYes
    Set Focus to Element  1000635modDeleteYes
    Click Element  1000635modDeleteYes
    Page Should Not Contain Element  1000635
    [Teardown]      Close Browser
