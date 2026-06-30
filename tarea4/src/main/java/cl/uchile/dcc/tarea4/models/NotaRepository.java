package cl.uchile.dcc.tarea4.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {

    // Calcula el promedio de notas de una actividad
    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.actividad.id = :actividadId")
    Double promedioPorActividad(@Param("actividadId") Integer actividadId);

    // Cuenta cuantas notas tiene una actividad
    @Query("SELECT COUNT(n) FROM Nota n WHERE n.actividad.id = :actividadId")
    Long contarPorActividad(@Param("actividadId") Integer actividadId);
}
