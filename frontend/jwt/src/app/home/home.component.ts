import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitters } from '../emitters/emitter';

interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  message = '';

  imagePreview: string | ArrayBuffer | null = null;
  selectedCoordinates: Coordinates | null = null;

  ngOnInit(): void {
    this.http
      .get('http://localhost:8000/api/user', { withCredentials: true })
      .subscribe(
        (res: any) => {
          this.message = `Hi ${res.name}`;
          Emitters.authEmitter.emit(true);
        },
        (err) => {
          this.message = 'You are not logged in';
          Emitters.authEmitter.emit(false);
        }
      );
  }

  imageSelected: File | null = null;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any): void {
    this.imageSelected = event.target.files[0] as File;
    this.previewImage();

  }

  previewImage(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.imageSelected as Blob);
  }

  onImageMouseMove(event: MouseEvent): void {
    // Calculate the coordinates based on the image dimensions
    const imgElement = event.target as HTMLImageElement;
    const rect = imgElement.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left) / rect.width * 720);
    const y = Math.round((event.clientY - rect.top) / rect.height * 720);

    this.selectedCoordinates = { x, y };
  }

  onImageClick(event: MouseEvent): void {
    if (this.selectedCoordinates) {
      console.log('Selected Coordinates:', this.selectedCoordinates);
      // Include logic to send the selectedCoordinates and image to the server
    }
  }

  onSubmit(): void {
    if (this.imageSelected) {
      const formData = new FormData();
      formData.append('image', this.imageSelected);

       // Include the selected coordinates in the formData
       if (this.selectedCoordinates) {
        formData.append('x', this.selectedCoordinates.x.toString());
        formData.append('y', this.selectedCoordinates.y.toString());
      }

      this.http.post<any>('http://localhost:5000/upload', formData)
        .subscribe(response => {
          console.log('Image uploaded successfully', response);
        }, error => {
          console.error('Error uploading image', error);
        });
    }
  }


}
