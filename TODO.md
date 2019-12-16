# Code related TODOS
➖Split todos and of src/character/CharacterCreation.test.js 

➖Create a RuleManager
  * move all rules to a file.
  * maibe do a rule class
  * maibe a rule with child

➖A manage the values and names
 
# Primary and secondary abilities
## Character Creator
* Manage primary abilities
  * manage combat abilities
  * manage atack
  * manage stop
  * manage doge
  * manage ki
  * manage armor tables
  * manage combat abilities
  * manage suit armor
* manage supernatural abilities
  * manage zeon
  * manage magic acumulation
  * manage magic proyection
  * manage domain
  * manage summond
  * manage tie
  * manage unsummond
  * manage magic proyection tables
* manage psychic abilities
  * manage cv
  * manage psychic proyection
  * manage psychic proyection tables
* manage secondary abilities
  * when not spend development points to a ability the base is -30
  * the final secondary abilitie is the base added to all bonus
* manage development points
  * pd shop
  * level 1 have 600 pd
  * pd cost
# archetips and chategories
* manage archetips
* manage cathegories
# power levels
# point distribution
* to invert pd in a ability than not invert any point must invert suficent points to get 5 in that ability
* point distribution limits
  *  limits on ofencive and defencive 
*  mastery

# strategy
✔️ First need to have lv of character 

✔️ based on lv add pd

✔️ a table of levels levels 

✔️ rules for get pd based on level and free pd

✔️add combat abilities 

✔️add expend in combat abilities based on pd

✔️add remainderPd. must be act equal as be a remainderPoints

✔️spend in combat abilities +1 ch = -1pd

✔️add rules to manage base -30, first must reatch 5, and combat abilities limitations

✔️add another primary abilities and their rules

✔️ add secondary abilities and teir rules


#Abilities
✔️ All abilities must have some components.

✔️ The base, is the points to add spending pd, and have two main rules, 

✔️ A rate, is the number of points in base than auments every pd is aded

✔️ the rate * points = base

✔️ the points is a internal value, when you spend pd you adquire a point to thad ability 

✔️ r first if you dont spend any point in the ability the base is -30 insead of 0,

✔️ and the first tlme you expend pd in the ability you must spend pd to get the base of 5. 

✔️ The bonus, the bonus is a value than added to a ability and can be positive or negative and maibe to is a array or map of Bonus instances or rules

✔️ The dependency are the characteristic linked to the ability from here can get the bonus of chatracteriatic, maibe or the bonus of characteristic implies that are the dependency.

✔️ The final value, and this is the value of the add of base and all the bonus.

# Some abilities require a especial trate
lifepoints is based in physique * 10, and the bonus and 20 points more and the points spend * a rate of life points equlvqlent to physique
