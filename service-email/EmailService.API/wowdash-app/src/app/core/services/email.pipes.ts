import { Pipe, PipeTransform } from '@angular/core';

// .NET sérialise les enums en NUMÉRIQUE par défaut :
// EmailType : 0=ConfirmationPostulation, 1=ConfirmationEntretien, 2=Admission
// EmailStatus : 0=EnAttente, 1=Envoye, 2=Echoue

@Pipe({ name: 'emailTypeLabel', standalone: true })
export class EmailTypeLabelPipe implements PipeTransform {
  transform(value: number | string): string {
    const map: Record<string, string> = {
      '0':                          'Postulation',
      '1':                          'Entretien',
      '2':                          'Admission',
      'ConfirmationPostulation':    'Postulation',
      'ConfirmationEntretien':      'Entretien',
      'Admission':                  'Admission'
    };
    return map[String(value)] ?? String(value);
  }
}

@Pipe({ name: 'emailStatusLabel', standalone: true })
export class EmailStatusLabelPipe implements PipeTransform {
  transform(value: number | string): string {
    const map: Record<string, string> = {
      '0':         'En attente',
      '1':         'Envoyé',
      '2':         'Échoué',
      'EnAttente': 'En attente',
      'Envoye':    'Envoyé',
      'Echoue':    'Échoué'
    };
    return map[String(value)] ?? String(value);
  }
}

@Pipe({ name: 'emailStatusBadge', standalone: true })
export class EmailStatusBadgePipe implements PipeTransform {
  transform(value: number | string): string {
    const map: Record<string, string> = {
      '0':         'bg-warning text-dark',
      '1':         'bg-success',
      '2':         'bg-danger',
      'EnAttente': 'bg-warning text-dark',
      'Envoye':    'bg-success',
      'Echoue':    'bg-danger'
    };
    return map[String(value)] ?? 'bg-secondary';
  }
}

@Pipe({ name: 'emailTypeBadge', standalone: true })
export class EmailTypeBadgePipe implements PipeTransform {
  transform(value: number | string): string {
    const map: Record<string, string> = {
      '0':                          'bg-primary',
      '1':                          'bg-warning text-dark',
      '2':                          'bg-success',
      'ConfirmationPostulation':    'bg-primary',
      'ConfirmationEntretien':      'bg-warning text-dark',
      'Admission':                  'bg-success'
    };
    return map[String(value)] ?? 'bg-secondary';
  }
}
