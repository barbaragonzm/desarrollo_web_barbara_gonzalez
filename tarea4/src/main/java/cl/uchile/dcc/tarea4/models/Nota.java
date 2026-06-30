package cl.uchile.dcc.tarea4.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


// Cada fila guarda UNA evaluacion de una actividad.
// Para obtener la nota final se calcula el promedio de todas las notas.
@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "actividad_id", nullable = false)
    private Actividad actividad;

    private Integer nota;

    public Nota() {}

    public Nota(Actividad actividad, Integer nota) {
        this.actividad = actividad;
        this.nota = nota;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Actividad getActividad() { return actividad; }
    public void setActividad(Actividad actividad) { this.actividad = actividad; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
}
