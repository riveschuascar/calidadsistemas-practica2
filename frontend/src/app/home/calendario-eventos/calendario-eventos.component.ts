import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendario-eventos',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendario-eventos.component.html',
  styleUrls: ['./calendario-eventos.component.scss']
})
export class CalendarioEventosComponent {
  calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [
      {
        title: 'Reserva Plaza Principal',
        start: '2024-06-15T10:00:00',
        end: '2024-06-15T12:00:00'
      },
      {
        title: 'Cancha Fútbol - Área Deportiva',
        start: '2024-06-16T14:00:00',
        end: '2024-06-16T16:00:00'
      },
      {
        title: 'Evento Cultural - Auditorio',
        start: '2024-06-18T18:00:00',
        end: '2024-06-18T20:00:00'
      }
    ]
  };
}
