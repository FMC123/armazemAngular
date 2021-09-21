import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html'
})
export class SubmitButtonComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() btnClass: string = 'btn btn-size btn-success';

  constructor() { }

  ngOnInit() { }
}
