package cl.uchile.dcc.tarea4.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    // Busca actividades cuyo nombre, descripcion o comuna del miembro
    // contengan el texto buscado (sin importar mayusculas/minusculas)
    @Query("SELECT a FROM Actividad a " +
           "JOIN a.miembro m " +
           "JOIN m.comuna c " +
           "WHERE LOWER(a.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Actividad> buscarPorTexto(@Param("texto") String texto);
}
