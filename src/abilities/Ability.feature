Feature: Ability
  Scenario: Create a ability
    Given a atack ability with 20 points
    Then the value is 20
    And the base is 20
    And the bonus value is 0
    And the name is atack
    And the rate is 1
    And the dependency is strength

  Scenario: enhance Ability
    Given a new Ability
    And enhance by 5 points
    Then the value is 5

  Scenario: decrease Ability
    Given a new Ability with 10 points
    And decrease 5 points
    Then the value is 5

  Scenario: add a bonus
    Given a new Ability
    And add a bonus of 5
    Then the value is 5

  Scenario: remove bonus
    Given a Ability with bonus of 5
    And remove a bonus of a ability
    Then the value is 0

  Scenario: negative bonus
    Given a Ability with bonus of -5
    Then the value is -5

  Scenario: equality
    Given a ability atack of 10
    And a second ability atack of 10
    Then the two abilities are equal

  Scenario: inequality
    Given a ability of atack 10
    And a second ability of dodge 15
    Then the two abilities are not equal


  Scenario: add base bonus
    Given a ability of atack 10
    And add a bonus with base bonus of -30
    Then the value is -20
    And the base is -20
    And the bonus is 0
    And the bonuses is empty

  Scenario: remove base bonus
    Given a ability with base bonus of -30
    And remove the bonus
    Then the value is 0
    And the base is 0
