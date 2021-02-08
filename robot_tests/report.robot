
*** Settings ***
Documentation       A test suite with a test for Reporting a Thread or a Reply.
...
...                 This test has a workflow that is created using keywords
...                 directly from SeleniumLibrary
Library             SeleniumLibrary
Library             Dialogs

***Test Cases***
Report Thread
        Open Browser    http://uchan-atest.herokuapp.com/   Chrome
        Maximize Browser Window
        Set Selenium Speed      2
        Page Should Contain Element  dls
        Wait Until Element Is Enabled  dls
        Set Focus To Element      dls
        Click Element     dls
        Page Should Contain Element  1000647
        Wait until Element Is Enabled  1000647
        Set Focus to Element  1000647
        Click Element  1000647
        Wait Until Element is Enabled  dropdown_icon_1000647
        Set Focus To Element  dropdown_icon_1000647
        Click Element   dropdown_icon_1000647
        Page Should Contain Element  1000647Report
        Wait Until Element is Enabled  1000647Report
        Set Focus to Element  1000647Report
        Click Element   1000647Report
        Page Should Contain Element  report-reason
        Wait until Element is Enabled   report-reason
        Set Focus To Element    report-reason
        Click Element  report-reason
        Select From List By Value  report-reason  SPAM
        Pause Execution  Enter Captcha
        Click Button    report-form-button
        Page Should Contain Element  uchan-report-close
        Wait until Element is Enabled   uchan-report-close
        Set Focus to Element    uchan-report-close
        Click Button    uchan-report-close

Report Reply
        Page Should Contain Element     1000647
        Set Focus To Element  dropdown_icon_1000648
        Click Element   dropdown_icon_1000648
        Page Should Contain Element  1000648Report
        Wait until Element is Enabled  1000648Report
        Set Focus to Element  1000648Report
        Click Element   1000648Report
        Page Should Contain Element  report-reason
        Wait until Element Is Enabled   report-reason
        Set Focus to Element    report-reason
        Click Element  report-reason
        Select From List By Value  report-reason  LAW
        Pause Execution  Enter Captcha
        Click Button    report-form-button
        Page Should Contain Element     uchan-report-close
        Wait until Element Is Enabled   uchan-report-close
        Set Focus to Element    uchan-report-close
        Click Button    uchan-report-close
        [Teardown]        Close Browser
