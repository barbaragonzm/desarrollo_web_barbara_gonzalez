#Funcion para insertar los datos de region comuna, para no hacerlo
# manual uno por uno.
import pymysql

config = {
    'host': 'localhost', 'user': 'cc5002', 'password': 'programacionweb',
    'db': 'tarea2', 'charset': 'utf8mb4'
}

try:
    connection = pymysql.connect(**config)
    with connection.cursor() as cursor:
        print("Conectado. Limpiando datos previos...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        cursor.execute("TRUNCATE TABLE comuna;")
        cursor.execute("TRUNCATE TABLE region;")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        
        with open('region-comuna.sql', 'r', encoding='utf-8') as f:
            statements = f.read().split(';')
        
        for i, stmt in enumerate(statements):
            if stmt.strip():
                cursor.execute(stmt)
                if i % 100 == 0: print(f"Cargando línea {i}...")
        
        connection.commit()
        print("\n¡ÉXITO TOTAL! Todas las regiones y comunas están listas.")

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'connection' in locals(): connection.close()