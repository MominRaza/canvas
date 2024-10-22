import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DrawCanvasComponent } from "./draw-canvas/draw-canvas.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DrawCanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
