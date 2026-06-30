package cl.uchile.dcc.tarea4.services;

import cl.uchile.dcc.tarea4.models.Actividad;
import cl.uchile.dcc.tarea4.models.ActividadRepository;
import cl.uchile.dcc.tarea4.models.Nota;
import cl.uchile.dcc.tarea4.models.NotaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ApiService {

    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public ApiService(ActividadRepository actividadRepository,
                      NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

   
    // Buscador de actividades
    // Recibe el texto buscado y retorna una lista de mapas,
    // donde cada mapa tiene los datos de una actividad mas su nota.
    public List<Map<String, Object>> buscarActividades(String texto) {
        List<Actividad> encontradas = actividadRepository.buscarPorTexto(texto);

        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Actividad a : encontradas) {
            Double promedio = notaRepository.promedioPorActividad(a.getId());
            Long cantidad = notaRepository.contarPorActividad(a.getId());
            if (cantidad == null) {
                cantidad = 0L;
            }

            Map<String, Object> item = new HashMap<>();
            item.put("id", a.getId());
            item.put("nombreMiembro", a.getMiembro().getNombre());
            item.put("dia", a.getDia());
            item.put("tipo", a.getTipo());
            item.put("comuna", a.getMiembro().getComuna().getNombre());
            item.put("nombre", a.getNombre());
            item.put("descripcion", a.getDescripcion());
            item.put("notaPromedio", promedio);   // null si no tiene notas todavia
            item.put("cantidadNotas", cantidad);
            resultado.add(item);
        }

        return resultado;
    }

   
    // Guardar una nueva nota para una actividad
    // Retorna un mapa con el resultado: si salio bien, el nuevo
    // promedio y la cantidad de notas actualizada.
    public Map<String, Object> guardarNota(Integer actividadId, Integer valorNota) {
        Map<String, Object> respuesta = new HashMap<>();

        // Buscar la actividad
        Optional<Actividad> actividadOpt = actividadRepository.findById(actividadId);
        if (actividadOpt.isEmpty()) {
            respuesta.put("ok", false);
            respuesta.put("mensaje", "La actividad no existe.");
            return respuesta;
        }

        // Validar que la nota sea un entero entre 1 y 7
        if (valorNota == null || valorNota < 1 || valorNota > 7) {
            respuesta.put("ok", false);
            respuesta.put("mensaje", "La nota debe ser un numero entero entre 1 y 7.");
            return respuesta;
        }

        // Guardar la nota en la base de datos
        Nota nueva = new Nota(actividadOpt.get(), valorNota);
        notaRepository.save(nueva);

        // Recalcular promedio y cantidad para devolver al cliente
        Double promedio = notaRepository.promedioPorActividad(actividadId);
        Long cantidad = notaRepository.contarPorActividad(actividadId);

        respuesta.put("ok", true);
        respuesta.put("notaPromedio", promedio);
        respuesta.put("cantidadNotas", cantidad);
        respuesta.put("mensaje", "Nota guardada correctamente.");
        return respuesta;
    }
}
