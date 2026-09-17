package com.ehei.gi4.application.Enum;

public enum CandidatureStatus {
    EN_ATTENTE(0),
    ACCEPTEE(1),
    REFUSEE(2);
    private int value;
     CandidatureStatus(int value) {
        this.value = value;
    }
}
