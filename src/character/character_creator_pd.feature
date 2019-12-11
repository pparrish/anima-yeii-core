Feature: pd
  Scenario: Category not setted
    Given a creator
    Then when i try to spend pd i have a error

  Scenario: category setted
    Given a creator
    And select the warrior category
    Then when i try to spend pd i dont have errors

  Scenario: enhance ability
    Given a creator with warrior category
    And enhance 10 points the attack ability
    Then i spend 20 pd
    And the base of attack is 10
    And the pd spended in attack is 20

  Scenario: decrease ability
    Given a creator with warrior category
    And enhance 10 points the attack ability
    And decrease 2 points the attack ability
    Then the base of attack is 8
    And the pd spended in attack is 16
    And i spend 16 pd

  Scenario: enhance more than the pd limit
    Given a creator with warrior category
    Then enhance 500 points the attack ability i get a error

  Scenario: decrease a ability
    Given a creator with warrior category
    Then decrease 500 points a ability throw a error

  Scenario: base -30 rule
    Given a creator with warrior category
    Then the base of attack is -30

  Scenario: disable base -30 rule
    Given a creator with warrior category
    And disable base -30 rule
    Then the base of attack is 0

  Scenario: cannot enhance ability bellow 5
    Given a creator with warrior category
    Then i try to enhance by 3 throw a error
    And i try to enhance by 5 not throw
    And disable the ability minimun 5 rule
    Then i try to enhance by 3 not throw error

  Scenario: the limits on the points distribution
    Given a creator with warrior category
    And i can enhance wear armor to 180
    And i cannot enhance wear armor to 1
    And i disable limits rule
    Then i can enhance wear armor to 1

  Scenario: limit of offensive and defensive ability
    Given a creator with warrior category
    And i can enhance attack to 5
    And i can enhance dodge to 5
    And i can enhance stop to 5
    And i can enhance attack to 45
    And i can enhance dodge to 45
    And i can enhance stop to 45
    Then i spend 50 percent of pd
    And i cannot enhance attack to 1

  Scenario: limit of diference betten atack and defense
    Given a creator with warrior category
    And enhance 5 points the dodge ability
    And i can enhance attack to 55
    And i cannot enhance attack to 1
    Then enhance 25 points the dodge ability
    And i can enhance attack to 25
    And i cannot enhance attack to 1
    And disable de rule of diference limits
    And i can enhance attack to 1

  Scenario: only attack or defence limits
    Given a creator with warrior category
    And i can enhance stop to 75
    And i cannot enhance stop to 1
