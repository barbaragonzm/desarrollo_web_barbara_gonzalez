import os
from flask import Flask, jsonify, redirect, render_template, request, url_for
import flask_sqlalchemy
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/fotos'  # carpeta para guardar las fotos

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = flask_sqlalchemy.SQLAlchemy(app)

# ---Modelos de la base de datos---
class Region(db.Model):
    __tablename__ = 'region' 
    id = db.Column(db.Integer, primary_key=True) 
    nombre = db.Column(db.String(200), nullable=False) 

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    # relacionamos con el ID de la tabla Region
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

class Miembro(db.Model):
    __tablename__ = 'miembro'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.now)
    # relacionamos con el ID de la tabla Comuna
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    tipo = db.Column(db.String(50))

class Actividad(db.Model):
    __tablename__ = 'actividad'
    id = db.Column(db.Integer, primary_key=True)
    miembro_id = db.Column(db.Integer, db.ForeignKey('miembro.id'), nullable=False)
    dia = db.Column(db.Enum('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'), nullable=False)
    hora_inicio = db.Column(db.String(5), nullable=False)
    duracion = db.Column(db.String(5), nullable=False)
    tipo = db.Column(db.Enum('artistica', 'deportiva', 'tecnologica/programacion', 'social/voluntariado', 'recreativa','academica','bienestar/meditacion', 'otra'), nullable=False)
    nombre = db.Column(db.String(45), nullable=False)
    descripcion = db.Column(db.Text) # puede ser NULL 

class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    # lo relaciona con una actividad específica
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)



@app.route("/")
def inicio():
    ultimos = Miembro.query.order_by(Miembro.id.desc()).limit(5).all()
    return render_template("index.html", miembros=ultimos)

@app.route("/registrar", methods=[ "GET", "POST"])
def registrar():
    if request.method == "POST":
        nuevo_m = Miembro(
            nombre=f"{request.form.get('nombre')} {request.form.get('apellido')}",
            email=request.form.get("email"),
            telefono=request.form.get("telefono"),
            tipo=request.form.get("tipo_integrante"), # El del select que ya tenías
            comuna_id=request.form.get("comuna_id"),
            fecha_registro=datetime.now()
        )
        db.session.add(nuevo_m)
        db.session.commit()
        return redirect(url_for('registrar')) # Recarga para ver al nuevo en la lista de abajo

    
    comunas_db = Comuna.query.order_by(Comuna.nombre.asc()).all()
    ultimos = Miembro.query.order_by(Miembro.id.desc()).limit(5).all()
    return render_template("registro_miembro.html", comunas=comunas_db, ultimos_miembros=ultimos)

@app.route("/actividades", methods=["GET", "POST"])
def actividades():

    if request.method == "POST":
        nueva_a = Actividad(
            miembro_id=request.form.get("miembro_id"),
            dia=request.form.get("dia"),
            hora_inicio=request.form.get("hora_inicio"),
            duracion=request.form.get("duracion"),
            tipo=request.form.get("tipo_actividad"),
            nombre=request.form.get("nombre_actividad"),
            descripcion=request.form.get("descripcion")
        )
        
        db.session.add(nueva_a)
        db.session.flush() # obtener el ID de la actividad

        # guardar foto
        archivo_foto = request.files.get("foto_actividad")
        if archivo_foto and archivo_foto.filename != '':
            nombre_original = secure_filename(archivo_foto.filename)
            nombre_final = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{nombre_original}"
            
            archivo_foto.save(os.path.join(app.config['UPLOAD_FOLDER'], nombre_final))

            nueva_f = Foto(
                ruta_archivo=f"fotos/{nombre_final}",
                nombre_archivo=nombre_final,
                actividad_id=nueva_a.id 
            )
            db.session.add(nueva_f)

        db.session.commit()
        return redirect(url_for('actividades'))

    
    lista_miembros = Miembro.query.order_by(Miembro.nombre.asc()).all()
    return render_template("registro_actividades.html", miembros=lista_miembros)

# 1. ESTA ES LA QUE ABRE LA PÁGINA
@app.route("/miembros")
def miembros():
    return render_template("listado.html")

@app.route("/obtener_actividades")
def obtener_actividades():
   
    nombre_buscado = request.args.get('nombre', '')
    tipos_seleccionados = request.args.getlist('tipos[]')
    actividades_seleccionadas = request.args.getlist('actividades[]')

    query = db.session.query(Actividad, Miembro, Foto)\
        .join(Miembro, Actividad.miembro_id == Miembro.id)\
        .outerjoin(Foto, Actividad.id == Foto.actividad_id)

    #  aplicamos los filtros solo si el usuario los seleccionó
   
    if nombre_buscado:
        query = query.filter(Miembro.nombre.like(f"%{nombre_buscado}%"))

    if tipos_seleccionados:
        query = query.filter(Miembro.tipo.in_(tipos_seleccionados))
    
    if actividades_seleccionadas:
        query = query.filter(Actividad.tipo.in_(actividades_seleccionadas))

    # ejecutamos la consulta
    resultados = query.all()
    
    # los resultados en una lista de diccionarios (JSON)
    lista_final = []
    for act, miembro, foto in resultados:
        lista_final.append({
            "nombre": miembro.nombre,
            "tipo_persona": miembro.tipo,
            "email": miembro.email,
            "nombre_act": act.nombre,
            "tipo_act": act.tipo,
            "dia": act.dia,
            "hora": act.hora_inicio,
            "duracion": act.duracion,
            "descripcion": act.descripcion,
            # Si hay foto, generamos la URL, si no, None
            "foto_ruta": url_for('static', filename=foto.ruta_archivo) if foto else None
        })

    #respuesta al JavaScript
    return jsonify({"actividades": lista_final})

@app.route("/metricas")
def metricas():
    return render_template("metricas.html")



if __name__ == "__main__":
    with app.app_context():
        db.create_all() 
    app.run(debug=True)