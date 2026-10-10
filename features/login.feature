Feature: Login

    Scenario Outline: Valid Login attempts
        Given User is on the login page
        When User enters "<username>" and "<password>"
        Then User should be redirected to the dashboard page

        Examples:
            | username            | password     |
            | standard_user       | secret_sauce |
            | problem_user        | secret_sauce |
            | performance_glitch_user | secret_sauce |
            | error_user          | secret_sauce |
            | visual_user         | secret_sauce |

    Scenario Outline: Invalid Login attempts
        Given User is on the login page
        When User enters "<username>" and "<password>"
        Then User should see an error message

        Examples:
            | username            | password     |
            | locked_out_user     | secret_sauce |