import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Required for <input> inside <mat-form-field>

const routes: Routes = [
  // Define your routes here
];

@NgModule({
  declarations: [
    // ...existing components...
  ],
  imports: [
    // ...existing modules...
    MatFormFieldModule,
    MatInputModule, // Add this if you're using <input> inside <mat-form-field>
  ],
  bootstrap: [/* Your root component */]
})
export class AppRoutingModule {}