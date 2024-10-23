import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import { DrawCanvasShapes, DrawingMode, DrawingType } from 'draw-canvas-shapes';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-draw-canvas',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './draw-canvas.component.html',
  styleUrl: './draw-canvas.component.scss'
})
export class DrawCanvasComponent implements AfterViewInit {
  drawingModes = input<{ value: DrawingMode, label: string; }[]>([
    { value: 'draw', label: 'Draw' },
    { value: 'move', label: 'Move' },
    { value: 'resize', label: 'Resize' }
  ]);
  selectedDrawingMode = input<DrawingMode>('draw');
  drawingTypes = input<{ value: DrawingType, label: string; }[]>([
    { value: 'line', label: 'Line' },
    { value: 'rectangle', label: 'Rectangle' },
    { value: 'circle', label: 'Circle' },
    { value: 'triangle', label: 'Triangle' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'freehand', label: 'Freehand' }
  ]);
  selectedDrawingType = input<DrawingType>('polygon');
  _selectedDrawingType?: DrawingType;
  lineWidth = input<number>(10);
  drawingColors = input<{ value: string, label: string; }[]>([
    { value: '#00000090', label: 'Black' },
    { value: '#ff000090', label: 'Red' },
    { value: '#ff800090', label: 'Orange' },
    { value: '#00ff0090', label: 'Green' },
    { value: '#0000ff90', label: 'Blue' },
    { value: '#ffff0090', label: 'Yellow' },
    { value: '#ff00ff90', label: 'Magenta' },
    { value: '#00ffff90', label: 'Cyan' },
    { value: '#ffffff90', label: 'White' }
  ]);
  selectedDrawingColor = input<string>('#00000090');
  gridSizes = input<number[]>([10, 20, 30, 40, 50]);
  showGridOption = input<boolean>(true);
  selectedGridSize = input<number>(20);
  showGrid = input<boolean>(false);
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;

  drawer?: DrawCanvasShapes;

  ngAfterViewInit(): void {
    if (!this.canvas) {
      throw new Error('Canvas element not found');
    }
    this.drawer = new DrawCanvasShapes({
      canvas: this.canvas.nativeElement,
      canvasSize: { width: 960, height: 540 },
      drawingMode: this.selectedDrawingMode(),
      drawingType: this.selectedDrawingType(),
      drawingColor: this.selectedDrawingColor(),
      lineWidth: this.lineWidth(),
      showGrid: this.showGrid(),
      gridSize: this.selectedGridSize(),
      drawings: JSON.parse(localStorage.getItem('drawings') || '[]')
    });
    this._selectedDrawingType = this.selectedDrawingType();
  }

  setDrawingMode(mode: DrawingMode): void {
    if (!this.drawer) throw new Error('Drawer not initialized');
    this.drawer.drawingMode = mode;
  }

  setDrawingType(type: DrawingType): void {
    if (!this.drawer) throw new Error('Drawer not initialized');
    this._selectedDrawingType = type;
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
