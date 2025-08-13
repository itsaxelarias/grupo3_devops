package com.example.citasapi;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*") // <-- evita problemas CORS con Vercel
public class HelloController {
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
