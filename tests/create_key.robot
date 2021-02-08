*** SETTINGS ***
Documentation   A test suite with a test to Create A Moderator Key
Library         SeleniumLibrary

*** TEST CASES ***
Create Moderator Key
      Open Browser  https://uchan-atest.herokuapp.com/xeroxthis  Chrome
      Maximize Browser Window
      Set Selenium Speed  2
      Page Should Contain Element  id-login
      Input Text  id-login  admin
      Input Text  password-login    123456789
      Click Button  class:btn
      Element Text Should Be  css:h2  Boards
      Wait Until Element Is Enabled  generate-moderator-key
      Set Focus To Element  generate-moderator-key
      Click Element  generate-moderator-key
      Click Element  default-board
      Select From List By Value  default-board  inv
      Click Element  generate-modkey-submit-btn
      [Teardown]   Close Browser
