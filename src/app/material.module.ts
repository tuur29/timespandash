import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoConflictStyleCompatibilityMode } from '@angular/material';
import { MatExpansionModule, MatTableModule, MatPaginatorModule, MatRippleModule,  MatSelectModule, MatSortModule, MatToolbarModule, MatListModule, MatSnackBarModule, MatDialogModule, MatTooltipModule, MatIconModule, MatButtonModule, MatCardModule, MatAutocompleteModule, MatInputModule, MatProgressSpinnerModule, MatCheckboxModule, MatSliderModule, MatChipsModule
} from '@angular/material';

@NgModule({
  imports: [ MatExpansionModule, MatTableModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatToolbarModule, MatListModule, MatSnackBarModule, MatDialogModule, MatTooltipModule, MatIconModule, MatButtonModule, MatCardModule, MatAutocompleteModule, MatInputModule, MatProgressSpinnerModule, MatCheckboxModule, MatSliderModule, MatChipsModule
  ],
  exports: [
    MatExpansionModule, MatTableModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatToolbarModule, MatListModule, MatSnackBarModule, MatDialogModule, MatTooltipModule, MatIconModule, MatButtonModule, MatCardModule, MatAutocompleteModule, MatInputModule, MatProgressSpinnerModule, MatCheckboxModule, MatSliderModule, MatChipsModule
  ],
})
export class MaterialModule { }
