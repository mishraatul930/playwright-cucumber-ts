Feature: Add to Cart

Scenario Outline: Add items to Cart
Given User is on the login page
When User enters "<username>" and "<password>"
Then User should be redirected to the dashboard page
And User adds "<item>" to the cart
Then User should see "<item>" in the cart
Examples:
| username     | password    | item               |
| standard_user| secret_sauce|Sauce Labs Backpack |
| standard_user| secret_sauce|Sauce Labs Bike Light|