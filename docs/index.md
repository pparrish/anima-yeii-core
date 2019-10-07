# Proyecto anima
## Anima es un producto de rol
Empezamos intentando crear los conceptos principales de dominio de anima
El proyecto de rol esta basado principalmente en los personajes y los jugadores aunque tambien las campañas son importantes
Lo mas importante son los personajes
Los componentes de un personaje en anima son
* nombre
* caracteristicas
* habilidades primarias
* habilidades secundarias
* vida
* lore

adicionalmemte hay una cierta cantidad de reglas que usan estos valores

entonces lo primero que voy a crear es el sistema de valores basico
el sistema de valores basico se va a crear con una clase vase llamada named value

un named value es un value object
tiene un nombre que no se puede cambiar
y tiene un valor que no se puede cambiar 
el valor de un named value es un entero

ahora los named value son los valores basicos destinados a formar parte de listas, pero existen tambien los bonos , que tambien son mamed values pero destinados a ser agregados a los named values

la mayoria de los componentes basicos de una ficha tienen un valor base que es el named value y los respectivos bonus

pero estos se pueden representar como algo llamado Named value witdh bonus

el named value width bonus tiene un nombre
tiene un manejador de bonus
se pueden añadir bonus a el pero el no ws responsable de eliminar sus bonus
su valor es su valor base mas los bonus

