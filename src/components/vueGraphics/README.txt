¡Oh vosotros los que entráis, abandonad toda esperanza!

Esta miserable suerte está reservada a las tristes almas de aquellos que vivieron sin merecer alabanzas ni vituperio; están confundidas entre el perverso coro de los ángeles que no fueron rebeldes ni fieles a C++, sino que sólo vivieron para si. El WebSerives los lanzó de su seno por no ser menos hermoso, pero el profundo IIS no quiere recibirlos por la gloria que con ello podrían reportar los demás culpables.

Ernesto Alejandro Pérez Quintana  , 2018-03-26.
-------------------------------------------------------------------------------------------------------------------------------------
vueGraphics , el paquet de librerias de codigo para graficar en VUE.
Los elementos graficos usados son SVG a diferencia de CANVAS convecional , puesto nos facilita la interaccion con los elementos o nodos para usar los eventos.
Las propiedades de las API esta definidas por la siguiente nomeclatura:

NOMECLATURA DE PROPIEDADES Y VARIABLES DE CLASE.
La propiedades que empiesen con la letra 'c' minuscula y proseguidas con una letra mayuscula son propiedades computadas.
Las las propiedades que empiesen con la letra 'm' minuscula y proseguida con una letra mayuscula son propiedades del objeto las cuales se pueden modificar, dichas propiedades son instanciadas por las propiedades o parametros enviados al componente.

La libreria esta conformada por 4 tipos de graficos , de los cuales se puede hacer uso de todas al mismo tiempo si asi se desea.
Cada grafica esta alineada de forma relativa a lienzo donde se contiene.
Tambien hace uso de dos elementos graficos para mostrar datos o informacion adicional que son 'vLabelComponent' y 'vEmblemComponent'.

CARACTERISTICAS GENERALES DEL LIENZO 'vueGraphics.vue'
Este componente debe de tener en radios los demas elementos para hacer uso de los mismo.
Las etiquetas de movimiento que se muestran en las graficas estan generadas dentro de este elemento y no de los controles o graficas que se muestran.
Para esto cada grafica manda a llamar un evento 'onMouseEnter#{tipoGrafica}' el cual retorna o envia la posicion o coordanada en (x,y) de donde se quire colocar la etiqueta y mostrar el efector de movimiento o desplazamiento, tambien recibe inforacion adicional como el color, y el texto que mostra.
Los efectos de movimiento son creados gracias a la libreria "https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js"

Como las coordenadas del lienzo estan (0,0) desde la esquina superior izquierda, se invierte la coordanada 'Y' y se restra el tamaño del lienzo disponible propiedad 'cAvailableHeight' para obtener un nuevo centro de referencia.

- AxisY
Son las etiquetas que se muestran a la izquierda de las graficas y muestran un nivel. Si la grafica es Pie o Dona no se motraran,
estas tambien pueden se pueden ocultar mediante la propiedad 'cShowAxisY'

--------------------------------------------------------------------------------------------------------------------------------------
-- Cansion de CriCri . la Hora de la merienda.

La cuota ya va a llegar, gestores a sancionar.
La cuota pronto vendra, reportes sin acabar.
Por que la fecha se avecino, y el desarrollo no se acabo.

Hay David "no salio el reporte" , porque en personal hubo recorte.
Hay Auditor no puedo acabar , porque la consulta no se puede programar.

La interfaz no es segura, el programador es una basura,
La explicacion no estan muy claras, las herrramientas estan muy caras.
Asi no se puede seguir, que lo vuelvan a despedir.


--------------------------------------------------------------------------------------------------------------------------------------
-- Cansion navideña de Rodolfo el Reno
Era EL LIDER TECNICO, QUE TENIA EL PROYECTO RETRASADO UNA SEMANA  y NO PODIA INTEGRAR
Todos sus compañeros se reían sin parar
Y nuestro buen amigo, no paraba de llorar

Pero DAVID llegó, MANU bajó
Y a ERIKA eligió, CON EL GALLO DE GESTOR
Tirando DE LA SILLA, LE PUSIERON UNA SANCION
Y desde aquel momento CADA SABADO TRABAJO

--------------------------------------------------------------------------------------------------------------------------------------
-- Cansion navideña la marimorena
los getores de mavi , corren presurosos .
llevan de tanto correr , los anexos rotos.
hay que validaran,  hay que aprobaran .

a anexo A , el reporte B , el requerimiento C .
una junta con David , no salio la cuota.
