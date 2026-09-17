import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { OffreSevice } from '../../../../services/offre/offre-service';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreResponse } from '../../../../models/offre/offre';
const salaireComparaison:ValidatorFn=(control:AbstractControl):ValidationErrors|null=>{
  const min = control.get('salaireMin')?.value;
  const max = control.get('salaireMax')?.value;
  return min!== null && max!==null && max<=min ?{salaireIncoherent:true}:null
};

@Component({
  selector: 'app-offre-update',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './offre-update.html',
  styleUrl: './offre-update.css',
})
export class OffreUpdate {
  private offreService = inject(OffreSevice);
  private router = inject(Router);
  private ActivateRoute = inject(ActivatedRoute);

  formGroup = new FormGroup({
      id:new FormControl<number|null>(null),
      titre:new FormControl<string|null>('',[Validators.required]),
      description:new FormControl<string|null>('',[Validators.required]),
      salaireMin: new FormControl<number|null>(0,[Validators.min(0)]),
      salaireMax: new FormControl<number|null>(0,[Validators.min(0)]),
      lieu: new FormControl<string|null>('',[Validators.required]),
      status:new FormControl<string|null>('')
    } ,{validators:salaireComparaison}
  );
  ngOnInit() {
    const id = Number(this.ActivateRoute.snapshot.paramMap.get('id'));
    if (id){
      console.log(id);
      this.recupereOffre(id);
    }

  }
  recupereOffre(id:number){
    this.offreService.getById(id).subscribe(
      {next:(offre)=>{this.formGroup.patchValue(offre,
        );},
      }
    );
  }
  onUpdate(){
    if(this.formGroup.valid){
      const formvalue = this.formGroup.getRawValue();
      const updatedOffre :OffreResponse={
        id:formvalue.id??0,
        titre:formvalue.titre??'',
        description:formvalue.description??'',
        salaireMin:formvalue.salaireMin?? 0,
        salaireMax:formvalue.salaireMax??0,
        lieu:formvalue.lieu??'',
        status:formvalue.status??'',


      };
      if(formvalue.id){
        this.offreService.update(formvalue.id,updatedOffre).subscribe({
          next:(res)=>{
            this.router.navigate(['/offre'])
          }
        })
      }
    }

  }
}
