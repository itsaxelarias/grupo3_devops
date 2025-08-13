package com.example.citasapi;

public class Appointment {
    private long id;
    private String patient;
    private String date;   // ISO-8601 "2025-08-30T10:00"
    private String reason;

    public Appointment() {}  // Jackson necesita ctor vacío

    public Appointment(long id, String patient, String date, String reason) {
        this.id = id;
        this.patient = patient;
        this.date = date;
        this.reason = reason;
    }

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public String getPatient() { return patient; }
    public void setPatient(String patient) { this.patient = patient; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
