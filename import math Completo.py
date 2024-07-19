import math
def ingresarTipo():
        nombre = ["Salir", "Cilindro", "Cubo"]
        print("Calcular Volumen de: ")
        print()
        print("1. Cilindro")
        print("2. Cubo")
        print("0. Salir")
        tipo = 6
        while tipo < 0 or tipo > 2:
            try:
                tipo = int(input("Ingrese una de las opciones:"))
            except:
                print("Ingrese un numero del menu: ")
        return tipo, nombre[tipo]

"""
Permite ingresar un numero tipo float
"""
def ingreseNumero(msj):
    while True:
        try:
            numero = float(input(msj))
            break
        except:
            print("Error, eso no es un numero!!!")
    return numero



#*****************************************************
while True:          
    tipo, nombreTipo = ingresarTipo()
    print()
    if tipo == 1:
        radio = ingreseNumero("Ingrese el radio del cilindro: ")
        altura = ingreseNumero("Ingrese la altura del cilindro: ")
        valor = math.pi * radio ** 2 * altura
    elif tipo == 2:
        lado = ingreseNumero("Ingrese el lado del cubo: ")
        valor = lado ** 3
    else:
        break
    
    print(f"El volumen de {nombreTipo} es: {valor: .2f}")
        
print()
print("Terminó el programa.")
            
