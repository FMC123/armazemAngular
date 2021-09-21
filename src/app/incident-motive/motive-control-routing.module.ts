import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { IncidentMotiveDetailsComponent } from "./incident-motive-list-details/incident-motive-list-details.component";
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from "app/layout/layout.component";
import { IncidentMotiveDetailsResolve } from './incident-motive-list-details/motive-control-list-details-resolve.service';
import { IncidentMotiveFormComponent } from './incident-motive-form/incident-motive-form.component';
import { IncidentMotiveFormResolve } from './incident-motive-form/incident-motive-form-resolve.service';
import { IncidentMotiveComponent } from './incident-motive-list/incident-motive.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'motive-control',
                component: LayoutComponent,
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path: 'new',
                        component: IncidentMotiveFormComponent,
                        resolve: {
                            incidentMotive: IncidentMotiveFormResolve
                        }
                    },
                    {
                        path: 'edit/:id',
                        component: IncidentMotiveFormComponent,
                        resolve: {
                            incidentMotive: IncidentMotiveFormResolve
                        }
                    },
                    {
                        path: ':id',
                        component: IncidentMotiveDetailsComponent,
                        resolve: {
                            incidentMotive: IncidentMotiveDetailsResolve,
                        }
                    },

                    {
                        path: '',
                        component: IncidentMotiveComponent
                    }
                ]
            }
        ])
    ],
    providers: [
        IncidentMotiveFormResolve,
        IncidentMotiveDetailsResolve,
    ],
    exports: [
        RouterModule
    ]
})
export class IncidentMotiveRoutingModule { }
