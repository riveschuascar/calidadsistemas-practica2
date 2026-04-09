import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule here

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],  // Ensure FormsModule is imported for this component
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactData = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit() {
    console.log(this.contactData);
  }
}
