package com.example.citasapi;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@CrossOrigin(origins = "*") // para Vercel/Netlify
public class ApiController {

    private final List<Appointment> appointments = new CopyOnWriteArrayList<>();
    private final AtomicLong ids = new AtomicLong(1);

    @PostConstruct
    void seed() {
        // dato de ejemplo para que la UI muestre algo al cargar
        appointments.add(new Appointment(ids.getAndIncrement(),
                "Ana López", "2025-08-30T10:00", "Chequeo general"));
    }

    @GetMapping("/health")
    public String health() { return "OK"; }

    @GetMapping("/api/appointments")
    public List<Appointment> all() {
        return appointments;
    }

    @PostMapping("/api/appointments")
    public ResponseEntity<Appointment> create(@RequestBody Appointment in) {
        if (in.getPatient() == null || in.getPatient().isBlank()
                || in.getDate() == null || in.getDate().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        long id = ids.getAndIncrement();
        Appointment saved = new Appointment(id, in.getPatient(), in.getDate(), in.getReason());
        appointments.add(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
