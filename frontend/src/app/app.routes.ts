import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { RegistroDatosComponent } from './registro-datos/registro-datos.component';
import { AdminComponent } from './admin/admin.component'; // Importar AdminComponent
import { ReservasComponent } from './reservas/reservas.component';
import { FormularioComponent } from './reservas/formulario/formulario.component';
import { EspaciosComponent } from './reservas/espacios/espacios.component';
import { CalendarioEventosComponent } from './home/calendario-eventos/calendario-eventos.component';
import { AuthGuard } from './guards/auth.guard';
import { PagoComponent } from './pago/pago.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'registro-datos', component: RegistroDatosComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  { path: 'reservas', component: ReservasComponent},
  { path: 'reservas/:tipo', component: EspaciosComponent },
  { path: 'reservas/formulario/:id', component: FormularioComponent },
  { path: '', redirectTo: '/reservas', pathMatch: 'full' },
  { path: '', component: ReservasComponent },
  { path: 'calendario', component: CalendarioEventosComponent },
  // Reservas
  { path: 'reservas/:tipo', component: ReservasComponent },
  { path: 'formulario', component: FormularioComponent },
  { path: '', redirectTo: '/reservas/plazas', pathMatch: 'full' },
  { path: 'pago', component: PagoComponent}
];


