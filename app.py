import os
from flask import Flask, jsonify, redirect, render_template, request, url_for
import flask_sqlalchemy
from datetime import datetime
from werkzeug.utils import secure_filename
import html

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/fotos'

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
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

class Miembro(db.Model):
    __tablename__ = 'miembro'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.now)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    tipo = db.Column(db.String(50))

class Actividad(db.Model):
    __tablename__ = 'actividad'
    id = db.Column(db.Integer, primary_key=True)
    miembro_id = db.Column(db.Integer, db.ForeignKey('miembro.id'), nullable=False)
    dia = db.Column(db.Enum('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'), nullable=False)
    hora_inicio = db.Column(db.String(5), nullable=False)
    duracion = db.Column(db.String(5), nullable=False)
    tipo = db.Column(db.Enum('artistica', 'deportiva', 'tecnologica/programacion', 'social/voluntariado', 'recreativa', 'academica', 'bienestar/meditacion', 'otra'), nullable=False)
    nombre = db.Column(db.String(45), nullable=False)
    descripcion = db.Column(db.Text)

class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)

class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = db.Column(db.Integer, primary_key=True)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)
    nombre = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.String(300), nullable=False)
    fecha = db.Column(db.String(50), nullable=False)

# ---Rutas ---

@app.route("/")
def inicio():
    ultimos = Miembro.query.order_by(Miembro.id.desc()).limit(5).all()
    return render_template("index.html", miembros=ultimos)

@app.route("/registrar", methods=["GET", "POST"])
def registrar():
    if request.method == "POST":
        nombre = request.form.get('nombre', '').strip()
        apellido = request.form.get('apellido', '').strip()
        email = request.form.get('email', '').strip()
        telefono = request.form.get('telefono', '').strip()
        tipo = request.form.get('tipo_integrante', '').strip()
        comuna_id = request.form.get('comuna_id', '').strip()

        errores = []
        if len(nombre) < 2:
            errores.append("Nombre inválido (mínimo 2 caracteres)")
        if len(apellido) < 2:
            errores.append("Apellido inválido (mínimo 2 caracteres)")
        import re
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            errores.append("Email inválido")
        if len(telefono) != 9 or telefono[0] != '9' or not telefono.isdigit():
            errores.append("Teléfono inválido (9 dígitos, comenzando con 9)")
        if tipo not in ('funcionario', 'academico', 'estudiante'):
            errores.append("Tipo de integrante inválido")
        try:
            cid = int(comuna_id)
            if not Comuna.query.get(cid):
                errores.append("Comuna inválida")
        except (ValueError, TypeError):
            errores.append("Comuna inválida")

        if errores:
            comunas_db = Comuna.query.order_by(Comuna.nombre.asc()).all()
            ultimos = Miembro.query.order_by(Miembro.id.desc()).limit(5).all()
            return render_template("registro_miembro.html", comunas=comunas_db,
                                   ultimos_miembros=ultimos, errores=errores)

        nuevo_m = Miembro(
            nombre=f"{nombre} {apellido}",
            email=email,
            telefono=telefono,
            tipo=tipo,
            comuna_id=int(comuna_id),
            fecha_registro=datetime.now()
        )
        db.session.add(nuevo_m)
        db.session.commit()
        return redirect(url_for('registrar'))

    comunas_db = Comuna.query.order_by(Comuna.nombre.asc()).all()
    ultimos = Miembro.query.order_by(Miembro.id.desc()).limit(5).all()
    return render_template("registro_miembro.html", comunas=comunas_db,
                           ultimos_miembros=ultimos, errores=[])

@app.route("/actividades", methods=["GET", "POST"])
def actividades():
    if request.method == "POST":
        nombre_act = request.form.get("nombre_actividad", "").strip()
        tipo_act = request.form.get("tipo_actividad", "").strip()
        dia = request.form.get("dia", "").strip()
        hora_inicio = request.form.get("hora_inicio", "").strip()
        duracion = request.form.get("duracion", "").strip()
        descripcion = request.form.get("descripcion", "").strip()
        miembro_id = request.form.get("miembro_id", "").strip()

        tipos_validos = ['artistica', 'deportiva', 'tecnologica/programacion',
                         'social/voluntariado', 'recreativa', 'academica',
                         'bienestar/meditacion', 'otra']
        dias_validos = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

        errores = []
        if not miembro_id:
            errores.append("Debe seleccionar el miembro que realiza la actividad.")
        if len(nombre_act) < 3:
            errores.append("Nombre de actividad inválido (mínimo 3 caracteres)")
        if tipo_act not in tipos_validos:
            errores.append("Tipo de actividad inválido")
        if dia not in dias_validos:
            errores.append("Día inválido")
        if not hora_inicio:
            errores.append("Hora de inicio inválida")
        if not duracion or duracion == "00:00":
            errores.append("La duración debe ser mayor a 0.")
        if len(descripcion) < 5:
            errores.append("Descripción muy corta (mínimo 5 caracteres).")

        if errores:
            lista_miembros = Miembro.query.order_by(Miembro.nombre.asc()).all()
            return render_template("registro_actividades.html",
                                   miembros=lista_miembros, errores=errores)

        nueva_a = Actividad(
            miembro_id=int(miembro_id),
            dia=dia,
            hora_inicio=hora_inicio,
            duracion=duracion,
            tipo=tipo_act,
            nombre=nombre_act,
            descripcion=descripcion
        )
        db.session.add(nueva_a)
        db.session.flush()

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
    return render_template("registro_actividades.html", miembros=lista_miembros, errores=[])

@app.route("/miembros")
def miembros():
    return render_template("listado.html")

@app.route("/obtener_actividades")
def obtener_actividades():
    nombre_buscado = request.args.get('nombre', '').strip()
    tipos_seleccionados = request.args.getlist('tipos[]')
    actividades_seleccionadas = request.args.getlist('actividades[]')

    query = db.session.query(Actividad, Miembro, Foto)\
        .join(Miembro, Actividad.miembro_id == Miembro.id)\
        .outerjoin(Foto, Actividad.id == Foto.actividad_id)

    if nombre_buscado:
        query = query.filter(Miembro.nombre.like(f"%{nombre_buscado}%"))
    if tipos_seleccionados:
        query = query.filter(Miembro.tipo.in_(tipos_seleccionados))
    if actividades_seleccionadas:
        query = query.filter(Actividad.tipo.in_(actividades_seleccionadas))

    resultados = query.all()
    lista_final = []
    for act, miembro, foto in resultados:
        lista_final.append({
            "id": act.id,
            "nombre": html.escape(miembro.nombre),
            "tipo_persona": html.escape(miembro.tipo or ''),
            "email": html.escape(miembro.email),
            "nombre_act": html.escape(act.nombre),
            "tipo_act": html.escape(act.tipo),
            "dia": act.dia,
            "hora": act.hora_inicio,
            "duracion": act.duracion,
            "descripcion": html.escape(act.descripcion or ''),
            "foto_ruta": url_for('static', filename=foto.ruta_archivo) if foto else None
        })
    return jsonify({"actividades": lista_final})

# ---Estadísticas---

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/api/stats/miembros_por_dia")
def stats_miembros_por_dia():
    """Miembros registrados por día (gráfico de líneas)"""
    from sqlalchemy import func, cast, Date
    resultados = db.session.query(
        cast(Miembro.fecha_registro, Date).label('dia'),
        func.count(Miembro.id).label('cantidad')
    ).group_by(cast(Miembro.fecha_registro, Date))\
     .order_by(cast(Miembro.fecha_registro, Date)).all()

    data = [{"dia": str(r.dia), "cantidad": r.cantidad} for r in resultados]
    return jsonify(data)

@app.route("/api/stats/actividades_por_tipo")
def stats_actividades_por_tipo():
    """Total de actividades por tipo (gráfico de torta)"""
    from sqlalchemy import func
    resultados = db.session.query(
        Actividad.tipo,
        func.count(Actividad.id).label('total')
    ).group_by(Actividad.tipo).all()

    data = [{"tipo": r.tipo, "total": r.total} for r in resultados]
    return jsonify(data)

@app.route("/api/stats/actividades_por_comuna")
def stats_actividades_por_comuna():
    """Total de actividades por comuna del miembro (gráfico de barras)"""
    from sqlalchemy import func
    resultados = db.session.query(
        Comuna.nombre.label('comuna'),
        func.count(Actividad.id).label('total')
    ).join(Miembro, Miembro.comuna_id == Comuna.id)\
     .join(Actividad, Actividad.miembro_id == Miembro.id)\
     .group_by(Comuna.nombre)\
     .order_by(func.count(Actividad.id).desc()).all()

    data = [{"comuna": r.comuna, "total": r.total} for r in resultados]
    return jsonify(data)

# ---Comentarios---

@app.route("/actividad/<int:actividad_id>/comentarios", methods=["GET"])
def obtener_comentarios(actividad_id):
    act = Actividad.query.get(actividad_id)
    if not act:
        return jsonify({"error": "Actividad no encontrada"}), 404

    comentarios = Comentario.query.filter_by(actividad_id=actividad_id)\
                                  .order_by(Comentario.fecha.asc()).all()
    data = [{
        "id": c.id,
        "nombre": html.escape(c.nombre),
        "texto": html.escape(c.texto),
        "fecha": c.fecha if isinstance(c.fecha, str) else str(c.fecha)
    } for c in comentarios]
    return jsonify({"comentarios": data})

@app.route("/actividad/<int:actividad_id>/comentarios", methods=["POST"])
def agregar_comentario(actividad_id):
    act = Actividad.query.get(actividad_id)
    if not act:
        return jsonify({"error": "Actividad no encontrada"}), 404

    data = request.get_json(silent=True) or {}
    nombre = str(data.get('nombre', '')).strip()
    texto  = str(data.get('texto', '')).strip()

    errores = []
    if len(nombre) < 3 or len(nombre) > 80:
        errores.append("El nombre debe tener entre 3 y 80 caracteres.")
    if len(texto) < 5 or len(texto) > 300:
        errores.append("El comentario debe tener entre 5 y 300 caracteres.")

    if errores:
        return jsonify({"errores": errores}), 400

    nuevo = Comentario(
        actividad_id=actividad_id,
        nombre=nombre,
        texto=texto,
        fecha=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    db.session.add(nuevo)
    db.session.commit()

    return jsonify({
        "ok": True,
        "comentario": {
            "id": nuevo.id,
            "nombre": html.escape(nuevo.nombre),
            "texto": html.escape(nuevo.texto),
            "fecha": nuevo.fecha if isinstance(nuevo.fecha, str) else str(nuevo.fecha)
        }
    }), 201



@app.route("/api/miembros")
def api_miembros():
    lista = Miembro.query.order_by(Miembro.nombre.asc()).all()
    return jsonify([{"id": m.id, "nombre": m.nombre} for m in lista])



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
