import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-incident-motive-children-list',
    templateUrl: './incident-motive-children-list.component.html'
})
export class IncidentMotiveChildrenListComponent implements OnInit {
    @Input() children;

    constructor() { }

    ngOnInit() { }
}
