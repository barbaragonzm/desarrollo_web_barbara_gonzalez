package cl.uchile.dcc.tarea4.controllers;

import cl.uchile.dcc.tarea4.services.ApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class ApiController {

    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/api/buscar")
    public Map<String, Object> buscar(@RequestParam(name = "texto", defaultValue = "") String texto) {
        texto = texto.trim();

        // Si tiene menos de 3 caracteres devolvemos lista vacia
        if (texto.length() < 3) {
            return Map.of("data", new ArrayList<>());
        }

        List<Map<String, Object>> actividades = apiService.buscarActividades(texto);
        return Map.of("data", actividades);
    }

   
    @PostMapping("/api/actividades/{id}/nota")
    public Map<String, Object> evaluar(@PathVariable("id") Integer actividadId,
                                        @RequestBody Map<String, Object> body) {
        // Leer el valor de nota del body JSON
        Object valorRecibido = body.get("nota");
        Integer valorNota = null;

        if (valorRecibido instanceof Number) {
            double numero = ((Number) valorRecibido).doubleValue();
            // Verificamos que sea un numero entero exacto (sin decimales)
            if (numero == Math.floor(numero)) {
                valorNota = (int) numero;
            }
        }

        return apiService.guardarNota(actividadId, valorNota);
    }
}
