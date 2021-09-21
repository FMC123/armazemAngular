import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
<div class="alert alert-danger">
  Ops! Ocorreu um erro. Tente novamente mais tarde.
</div>
  `
})
export class ErrorComponent implements OnInit{

  constructor(){}

  ngOnInit() {}
}
