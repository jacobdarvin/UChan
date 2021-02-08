*** SETTINGS ***
Documentation  A test suite with a test for Moderator and Admin Delete Replies
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
    Page Should Contain Element  1000636
    Wait until Element is Enabled  1000636
    Set Focus to Element  1000636
    Click Element  1000636
    Click Element  dropdown_icon_1000637
    Page Should Contain Element  d_1000637
    Wait until Element is Enabled  d_1000637
    Set Focus to Element  d_1000637
    Click Element  d_1000637
    Click Element  modDeleteYes
    Page Should Not Contain Element  1000637
    [Teardown]      Close Browser

Successful Admin Delete
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
    Page Should Contain Element  uf
    Wait Until Element Is Enabled  cas
    Set Focus To Element      cas
    Click Element     cas
    Page Should Contain Element  1000636
    Wait until Element is Enabled  1000636
    Set Focus to Element  1000636
    Click Element  1000636
    Click Element  dropdown_icon_1000638
    Page Should Contain Element  d_1000638
    Wait until Element is Enabled  d_1000638
    Set Focus to Element  d_1000638
    Click Element  d_1000638
    Click Element  modDeleteYes
    Page Should Not Contain Element  1000638
    [Teardown]      Close Browser
