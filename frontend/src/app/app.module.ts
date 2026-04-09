import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';  // Ensure ContactComponent is declared
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,  // Declare ContactComponent
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  // Add FormsModule to the imports array
    routes,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
