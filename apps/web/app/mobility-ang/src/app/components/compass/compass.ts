import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  NgZone,
  ElementRef,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-compass',
  standalone: true,
  templateUrl: './compass.html',
  styleUrl: './compass.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompassComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly el = inject(ElementRef);

  /** Current heading in degrees (0 = North) */
  heading = signal(0);
  /** Whether we have real device orientation data */
  hasRealCompass = signal(false);

  private orientationHandler: ((e: DeviceOrientationEvent) => void) | null = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initCompass();
  }

  ngOnDestroy(): void {
    if (this.orientationHandler) {
      window.removeEventListener('deviceorientation', this.orientationHandler);
    }
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }

  private async initCompass(): Promise<void> {
    // iOS 13+ requires permission
    const doe = DeviceOrientationEvent as any;
    if (typeof doe.requestPermission === 'function') {
      try {
        const permission = await doe.requestPermission();
        if (permission === 'granted') {
          this.listenOrientation();
        }
      } catch {
        // Permission denied — compass stays at North (0°)
      }
    } else if ('DeviceOrientationEvent' in window) {
      this.listenOrientation();
      // If no real sensor data within 1s, enable mouse tracking
      setTimeout(() => {
        if (!this.hasRealCompass()) {
          this.listenMouse();
        }
      }, 1000);
    } else {
      this.listenMouse();
    }
  }

  private listenOrientation(): void {
    this.orientationHandler = (event: DeviceOrientationEvent) => {
      let alpha: number | null = null;

      // iOS webkitCompassHeading gives magnetic north directly
      if ((event as any).webkitCompassHeading != null) {
        alpha = (event as any).webkitCompassHeading;
      } else if (event.alpha != null) {
        // Android: alpha is the compass heading (degrees from north)
        alpha = 360 - event.alpha;
      }

      if (alpha != null) {
        this.ngZone.run(() => {
          this.heading.set(Math.round(alpha!));
          this.hasRealCompass.set(true);
        });
      }
    };

    window.addEventListener('deviceorientation', this.orientationHandler, true);
  }

  private listenMouse(): void {
    this.mouseMoveHandler = (e: MouseEvent) => {
      const compass = this.el.nativeElement.querySelector('.compass-body') as HTMLElement;
      if (!compass) return;
      const rect = compass.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Only react when mouse is within 100px of compass center
      const radius = Math.max(rect.width, 150);
      if (distance > radius) return;
      const angle = Math.atan2(-dx, dy) * (180 / Math.PI);
      const heading = ((angle % 360) + 360) % 360;
      this.ngZone.run(() => this.heading.set(Math.round(heading)));
    };
    window.addEventListener('mousemove', this.mouseMoveHandler);
  }

  get dialRotation(): string {
    return `rotate(-${this.heading()}, 150, 150)`;
  }
}
