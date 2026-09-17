package com.ehei.gi4.application.Enum;

public enum OffreStatus {
    Encours(0),
    Accepter(1),
    Archiver(2),
    Expirer(3);
    private int value;
    OffreStatus(int value) {
        this.value = value;
    }
}
