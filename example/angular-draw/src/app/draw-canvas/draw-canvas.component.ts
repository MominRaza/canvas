import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DrawCanvasShapes, DrawingMode, DrawingType } from 'draw-canvas-shapes';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-draw-canvas',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './draw-canvas.component.html',
  styleUrl: './draw-canvas.component.scss'
})
export class DrawCanvasComponent implements AfterViewInit {
  selectedDrawingMode: DrawingMode = 'draw';
  selectedDrawingType: DrawingType = 'polygon';
  selectedDrawingColor = '#00000090';
  lineWidth = 20;
  showGrid = false;
  gridSize = '20';
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;

  drawer?: DrawCanvasShapes;

  ngAfterViewInit(): void {
    if (!this.canvas) {
      throw new Error('Canvas element not found');
    }
    this.drawer = new DrawCanvasShapes({
      canvas: this.canvas.nativeElement,
      canvasSize: { width: 960, height: 540 },
      drawingMode: this.selectedDrawingMode,
      drawingType: this.selectedDrawingType,
      drawingColor: this.selectedDrawingColor,
      lineWidth: this.lineWidth,
      showGrid: this.showGrid,
      gridSize: parseInt(this.gridSize),
      drawings: JSON.parse(localStorage.getItem('drawings') || '[]'),
    });
  }

  setDrawingMode(mode: DrawingMode): void {
    if (!this.drawer) throw new Error('Drawer not initialized');
    this.drawer.drawingMode = mode;
  }

  setDrawingType(type: DrawingType): void {
    if (!this.drawer) throw new Error('Drawer not initialized');
    this.drawer.drawingType = type;
  }

  setDrawingColor(color: string): void {
    if (!this.drawer) throw new Error('Drawer not initialized');
    this.drawer.drawingColor = color;
  }

  setLineWidth(width: number): void {
    if (!this.drawer) throw new Error('Drawer not initialized');
    this.drawer.lineWidth = width;
  }

  setShowGrid(show: boolean): void {
    if (!this.drawer) throw new Error('Drawer not initialized');
    this.drawer.showGrid = show;
  }

  setGridSize(size: string): void {
    if (!this.drawer) throw new Error('Drawer not initialized');
    this.drawer.gridSize = parseInt(size);
  }

  cancelDrawing(): void {
    this.drawer?.cancelDrawing();
  }

  clearCanvas(): void {
    this.drawer?.clearCanvas();
  }

  saveCanvas(): void {
    localStorage.setItem('drawings', JSON.stringify(this.drawer?.drawings));
  }
}
